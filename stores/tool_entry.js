import { defineStore } from 'pinia';
import { pickDescription } from '@/utils/toolDescription';

//
function availabilityItems(payload) {
  const items =
    payload?.data || payload?.results || payload?.items || payload?.availability || payload;

  return Array.isArray(items) ? items : [];
}

function pickFirst(value) {
  if (Array.isArray(value)) {
    return pickFirst(value[0]);
  }
  if (value && typeof value === 'object' && 'term' in value) {
    return value.term || '';
  }
  return value != null ? value : '';
}

function normalizeStringArray(value) {
  const values = Array.isArray(value) ? value : [value];
  return values
    .map((item) => pickFirst(item))
    .filter((item) => item != null && String(item).trim() !== '')
    .map((item) => String(item));
}

function normalizeToolEntry(tool) {
  if (!tool) {
    return {};
  }

  const webpage = pickFirst(tool.webpage) || pickFirst(tool.homepage);

  return {
    ...tool,
    id: tool.id || tool._id || '',
    name: pickFirst(tool.name),
    label: pickFirst(tool.label) || pickFirst(tool.name),
    description: Array.isArray(tool.description)
      ? pickDescription(tool.description)
      : pickFirst(tool.description),
    type: normalizeStringArray(tool.type),
    version: normalizeStringArray(tool.version || tool.other_versions),
    webpage: webpage ? String(webpage) : '',
    sourcesLabels: tool.sourcesLabels || tool.sources_labels || {},
    publications: tool.publications || tool.publication || [],
  };
}

export const useToolEntryStore = defineStore('tool_entry', {
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
    LoadingSimilar: (state) => state.loadingSimilar,
  },

  actions: {
    async retrieveTool(payload) {
      const { $observatory } = useNuxtApp();

      // Loading
      this.loading = true;
      this.resetWebAvailability();
      this.updateSimilarTools([]);

      try {
        // Prefer fetching by id if available, fall back to name
        const query = payload.id ? `api/tools?id=${payload.id}` : `api/tools?name=${payload.name}`;

        const data = await $observatory(query, { method: 'GET' });

        // Treat an empty array / missing payload / object lacking a label
        // (the field the entry page relies on) as "tool not found".
        const tool = normalizeToolEntry(Array.isArray(data) ? data[0] : data);
        if (!tool?.label) {
          this.updateTool({});
          return false;
        }
        this.updateTool(tool);
        return true;
      } catch (error) {
        this.updateTool({});
        if (error?.response?.status === 404) {
          return false;
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async resolveToolId({ name, source = 'biotools' }) {
      const { $observatory } = useNuxtApp();

      try {
        const { data } = await $observatory(
          `api/tool/id?name=${encodeURIComponent(name)}&source=${source}`,
          {
            method: 'GET',
          }
        );
        return data?.id || null;
      } catch (e) {
        return null;
      }
    },

    async retrieveSimilarTools(toolId) {
      const { $observatory } = useNuxtApp();

      if (!toolId) {
        this.updateSimilarTools([]);
        return;
      }
      this.loadingSimilar = true;

      try {
        const { data } = await $observatory(`/similarity?tool_id=${toolId}`, {
          method: 'GET',
        });
        this.updateSimilarTools(data.similar || []);
      } catch (e) {
        this.updateSimilarTools([]);
      } finally {
        this.loadingSimilar = false;
      }
    },

    async retrieveWebAvailability(webpages) {
      const { $observatory } = useNuxtApp();

      const webpageList = (Array.isArray(webpages) ? webpages : [webpages]).filter(Boolean);

      if (!webpageList.length) {
        this.resetWebAvailability();
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

    async fetchCitations({ doi, pmid, title } = {}) {
      const { $observatory } = useNuxtApp();

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
            body: body,
          });
          data = response.data;
          break; // éxito, no seguir intentando
        } catch (error) {
          // este identificador falló, probar el siguiente
        }
      }

      this.updateCitations({ doi: key, data });
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
      this.similarTools = payload;
    },
    updateTool(payload) {
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
    updateLoadingCitations({ doi, value }) {
      this.loadingCitations = { ...this.loadingCitations, [doi]: value };
    },
    updateCitations({ doi, data }) {
      this.citations = { ...this.citations, [doi]: data };
    },
  },
});
