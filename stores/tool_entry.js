import { defineStore } from 'pinia';
import { useAsyncData } from 'nuxt/app';
import { faL } from '@fortawesome/free-solid-svg-icons';

// 
function availabilityItems(payload) {
	const items =
		payload?.data ||
		payload?.results ||
		payload?.items ||
		payload?.availability ||
		payload;

	return Array.isArray(items) ? items : [];
}

// 

export const useToolEntryStore = defineStore('tool_entry',  {
  state: () => ({
    tool: {},
    loading: true,
    edamDialog: false,
    webAvailabilityRequestKey: '',
    webAvailabilityUrl: '',
    webAvailability: {
        week: [],
        month: [],
        sixMonths: [],
    },
    webAvailabilityLoading: false,
    webAvailabilityError: null,
    webAvailabilityNoData: false,
    citations: {},
    loadingCitations: {},
    similarTools: [],
    loadingSimilar: false,
  }),

  getters: {
    Tool: (state) => state.tool,
    Loading: (state) => state.loading,
    EdamDialog: (state) => state.edamDialog,
    WebAvailabilityRequestKey: (state) => state.webAvailabilityRequestKey,
    WebAvailabilityUrl: (state) => state.webAvailabilityUrl,
    WebAvailability: (state) => state.webAvailability,
    WebAvailabilityLoading: (state) => state.webAvailabilityLoading,
    WebAvailabilityError: (state) => state.webAvailabilityError,
    WebAvailabilityNoData: (state) => state.webAvailabilityNoData,
    Citations: (state) => state.citations,
    LoadingCitations: (state) => state.loadingCitations,
    SimilarTools: (state) => state.similarTools,
    LoadingSimilar: (state) => state.loadingSimilar

  },

  actions: {

    async retrieveTool(payload){
      const { $observatory } = useNuxtApp();

      // Loading
      this.loading = true
      this.resetWebAvailability()
      this.updateSimilarTools([])

      try {
        // Prefer fetching by id if available, fall back to name
        const query = payload.id 
          ? `/tools?id=${payload.id}` 
          : `/tools?name=${payload.name}`;
        
        const {data} = await $observatory(query, {
          method: 'GET',
        })

        // Treat an empty array / missing payload / object lacking a label
        // (the field the entry page relies on) as "tool not found".
        const tool = Array.isArray(data) ? data[0] : data;ç
        if (!tool || !tool.label){
          this.updateTool({})
          return false;
        }
        this.updateTool(data)
        return true;

      }catch (error) {
        this.updateTool({})
        if (error?.response?.status === 404) {
          return false;
        }
        // Surface genuine (non-404) errors instead of swallowing them.
        throw error;
      } finally {
        this.loading = false
      }
    },

    async resolveToolId(_ctx, { name, source = 'biotools' }){
      try {
        const {data} = await $observatory(`/tool/id?name=${encodeURIComponent(name)}&source=${source}`, {
          method: 'GET',
        });

        return data?.id || null;

      }catch (e) {
				// Not found / network error → caller falls back to 404.
        return null;
      }

    },

    async retrieveSimilarTools(toolId){
      if (!toolId) {
        this.updateSimilarTools([])
        return;
      }
      this.loadingSimilar = true;

      try {
        const {data} = await $observatory(`/similarity?tool_id=${toolId}`, {
          method: 'GET',
        })
        this.updateSimilarTools(data.similar || [])

      } catch (e) {
        this.updateSimilarTools([])
      } finally {
				this.loadingSimilar = false;
			}
    },

    async retrieveWebAvailability(webpages){
      const webpageList = (
				Array.isArray(webpages) ? webpages : [webpages]
			).filter(Boolean);

      if (!webpageList.length) {
        this.resetWebAvailability()
        return;
      }

      const requestKey = webpageList.join('|');
      const ranges = [
				{ key: 'week', endpoint: '/web-availability/week' },
				{ key: 'month', endpoint: '/web-availability/month' },
				{ key: 'sixMonths', endpoint: '/web-availability/6months' },
			];

      this.resetWebAvailability();
      this.updateWebAvailabilityRequestKey(requestKey);
      this.webAvailabilityLoading = true;

      try {
        // Nivel externo: una entrada por webpage
        const resultsByWebpage = await Promise.all(
          webpageList.map(async (webpage) => {
            // Nivel interno: una entrada por rango (week/month/sixMonths)
            const results = await Promise.all(
              ranges.map(async ({ key, endpoint }) => {
                try {
                  const { data } = await $observatory(endpoint, {
                    method: 'POST',
                    body: { url: webpage },
                  });
                  return { key, data, error: null };
                } catch (error) {
                  const is404 = error?.response?.status === 404;
                  // 404 = no está monitorizada = sin datos, no es un error real
                  return { key, data: [], error: is404 ? null : error };
                }
              })
            );
            return { webpage, results };
          })
        );

        // Petición obsoleta (el usuario cambió de tool mientras esperábamos)
        if (this.webAvailabilityRequestKey !== requestKey) {
          return;
        }

        // Buscamos la primera webpage que sí tenga datos en algún rango
        const selected = resultsByWebpage.find(({ results }) => {
          return results.some(({ data }) => availabilityItems(data).length > 0);
        });

        if (selected) {
          this.updateWebAvailabilityUrl(selected.webpage);
          selected.results.forEach(({ key, data }) => {
            this.updateWebAvailabilityRange(key, data);
          });
          return;
        }

        const allFailed = resultsByWebpage.every(({ results }) => {
          return results.every(({ error }) => error);
        });

        this.webAvailabilityNoData = true;
        
        if (allFailed) {
          this.webAvailabilityError = new Error('Unable to retrieve uptime data');
        }

      } catch (error) {
        this.webAvailabilityError = error;
      } finally {
        if (this.webAvailabilityRequestKey === requestKey) {
          this.webAvailabilityLoading = false;
        }
      }
    },

    async fetchCitations({ doi, pmid, title }){
      const key = doi || pmid || title;
			if (!key) return;
			if (key in this.citations) return;

      this.updateLoadingCitations({ doi: key, value: true });

      const attempts = [
				doi ? { doi } : null,
				pmid ? { pmid } : null,
				title ? { title } : null,
			].filter(Boolean);
      
			let data = null;
      for (const body of attempts) {
        try {
          const response = await $observatory('/publication/citations', {
            method: 'POST',
            body: body
          });
          data = response.data;
          break; // éxito, no seguir intentando
        }catch (error) {
          // este identificador falló, probar el siguiente
        }
      }

      this.updateCitations({ doi: key, data })
      this.updateLoadingCitations({ doi: key, value: false });
    },

    // Reset
    resetWebAvailability() {
			this.webAvailabilityRequestKey = '';
			this.webAvailabilityUrl = '';
			this.webAvailability = {
				week: [],
				month: [],
				sixMonths: [],
			};
			this.webAvailabilityLoading = false;
			this.webAvailabilityError = null;
			this.webAvailabilityNoData = false;
		},
    updateSimilarTools(payload) {
      this.similarTools = payload
    },
    updateTool(payload){
      this.tool = payload;
    },
    updateWebAvailabilityRequestKey(payload) {
			this.webAvailabilityRequestKey = payload;
		},
    updateWebAvailabilityUrl(payload) {
			this.webAvailabilityUrl = payload;
		},
    updateWebAvailabilityRange({ key, data }) {
			this.webAvailability[key] = data;
		},
    updateLoadingCitations({ doi, value }){
      this.loadingCitations = { ...this.loadingCitations, [doi]: value };
    },
    updateCitations({ doi, data }) {
			this.citations = { ...this.citations, [doi]: data };
		},



  }
})
