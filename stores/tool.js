
import { defineStore } from 'pinia';
import { useAsyncData } from 'nuxt/app';
import { pickDescription } from '@/utils/toolDescription';

// const BASE_URL = '/api/stats/tools/';
const API_HEADERS = {
	headers: { 'ngrok-skip-browser-warning': '69420' },
};

export const useToolStore = defineStore('tool', {
  state: () => ({
    tools: [],
    loading: {
      initialSearch: false,
      search: false,
      loadMore: false,
    },
    searchedTerm: '',
    query: '',
    page: 0,
    toolsDisplayCards: false,
    referrerFilters: {},
    counts: {},
    visibleCategories: ['name', 'description', 'topics', 'operations'],
    searchOptionsOpen: false,
    EDAMTerms: [],
    filters: {
      source: [],
      type: [],
      topics: [],
      operations: [],
      license: [],
      tags: [],
      inputFormat: [],
      outputFormat: [],
    },
    stats: {},
    totalTools: 0,
    totalToolsGlobal: 0,
  }),

  getters: {
    Tools: (state) => state.tools,
    Loading: (state) => state.loading,
    // 
    SearchedTerm: (state) => state.searchedTerm,
		ToolsDisplayCards: (state) => state.toolsDisplayCards,
    Stats: (state) => state.stats,
		Page: (state) => state.page,
		Counts: (state) => state.counts,
		TotalTools: (state) => state.totalTools,
		TotalToolsGlobal: (state) => state.totalToolsGlobal,
		Filters: (state) => state.filters,
		VisibleCategories: (state) => state.visibleCategories,
		SearchOptionsOpen: (state) => state.searchOptionsOpen,
		EDAMFormats: (state) => state.EDAMTerms.format,
		EDAMOperations: (state) => state.EDAMTerms.operation,
		EDAMTopics: (state) => state.EDAMTerms.topic,
		EDAMTypes: (state) => state.EDAMTerms.datatype,
  },

  actions: {

    updateToolsDisplayCards(toolsDisplayCards) {
      this.toolsDisplayCards = toolsDisplayCards
    },
    updateSearchedTerm(searchedTerm) {
      this.searchedTerm = searchedTerm
    },
    updateLoadingSearch(loadingSearch){
      this.loading.search = loadingSearch
    },
    updateLoadingInitialSearch(initialSearch){
      this.loading.initialSearch = initialSearch
    },
    updateLoadingLoadMore(loadMore) {
      this.loading.loadMore = loadMore
    },
    updateFilters(payload){
      this.filters = payload
    },
    updateReferrerFilters(filters) {
      this.referrerFilters = filters
    },
    restoreFilters(){
      this.filters = 
        filters = {
          source: [],
          type: [],
          topics: [],
          operations: [],
          license: [],
          tags: [],
          inputFormat: [],
          outputFormat: [],
        };
    },


    // Generic cached GET — vuex-cache keys on the URL, so repeating the same
		// request (same q + filters + page) returns the cached response instead
		// of re-fetching. Mirrors the pattern in store/observatory/*.
    async GET_URL(_ctx, url) {
      const { $observatory } = useNuxtApp();
			return await this.$observatory.$get(url, API_HEADERS);
		},

    // ------------------------------------------------------------------------

    async initialSearch(q) {
      const { $observatory } = useNuxtApp();

      // Loading
      this.updateLoadingInitialSearch(true)
      // this.tools = []
      // this.page = 0

      try {
        let result;

        if(!q) {
          result = await $observatory('/api/initial-search', {
            method: 'GET',
          })
        } else {
          // Honor the selected search scope (and any active filters)
					// on the first search, same as subsequent searches.
          const query = this.buildQuery();
          result = await $observatory('tool/GET_URL',
						`/search?page=0&q=${q}${query}`, {
            method: 'GET',
          })
        }

				// ✅ normalize regardless of which branch was taken
        const tools = Array.isArray(result)
          ? result
          : result.tools || result.data || [];

        this.$patch({
          tools: tools.map(tool => this.normalizeTool(tool))
        });

        if (result.counts) { this.counts = result.counts; }
        if (result.stats) { this.stats = result.stats; }

        const total = result.totalTools || result.total_tools;
        if (total) { this.totalTools = total; }

      } catch (error) {
        console.error('❌ initialSearch error:', error);
      } finally {
        this.updateLoadingInitialSearch(false);
      }
    },

    async searchTools() {
      const { $observatory } = useNuxtApp();
    
      // Loading
      this.updateLoadingInitialSearch(true);
    
      try {
        const query = this.buildQuery();
        this.query = query;
    
        const result = await $observatory(
          'tool/GET_URL',
          `/search?page=0&q=${this.searchedTerm}${query}`,
          {
            method: 'GET',
          }
        );
    
        const normalized = (result.tools || []).map(
          tool => this.normalizeTool(tool)
        );
    
        this.tools = normalized;
        this.counts = result.counts;
        this.stats = result.stats;
        this.totalTools = result.total_tools;
    
      } catch (error) {
        console.error('❌ searchTools error:', error);
      } finally {
        this.updateLoadingSearch(false);
      }
    },

    updateVisibleCategories(value) {
      this.visibleCategories = value
    },

    updateSearchOptionsOpen(value) {
      this.searchOptionsOpen = value
    },

    async loadMoreTools(page) {

      if (this.loading.loadMore) return;
    
      this.updateLoadingLoadMore(true);
    
      const nextPage = page || this.page + 1;
    
      try {
        const url = this.searchedTerm
          ? `/search?page=${nextPage}&q=${this.searchedTerm}${this.query}`
          : `/initial-search?page=${nextPage}`;
    
        const result = await this.$observatory('tool/GET_URL', url, {
          method: 'GET',
        });
    
        const tools = result.tools || result.data || [];
    
        const normalized = tools.map(
          tool => this.normalizeTool(tool)
        );
    
        this.tools = this.tools.concat(normalized);
        this.totalTools = result.total_tools || result.totalTools;
        this.page = nextPage;
    
      } catch (error) {
        console.error('❌ loadMoreTools error:', error);
      } finally {
        this.updateLoadingLoadMore(false);
      }
    },

    async getEDAMTerms() {
      const { $observatory } = useNuxtApp();
    
      try {
        const response = await $observatory(
          'tool/GET_URL',
          'edam/EDAMTerms'
        );
    
        this.EDAMTerms = response;
    
      } catch (error) {
        console.error('❌ getEDAMTerms error:', error);
      }
    },

    // Build query
    buildQuery(state) {
      let query = '';
    
      if (state.visibleCategories.length > 0) {
        query += '&searchIn=' + state.visibleCategories.join(',');
      }
      if (state.filters.source.length > 0 && state.filters.source.length < 8) {
        query += '&source=' + state.filters.source.join(',');
      }
      if (state.filters.type.length > 0 && state.filters.type.length < 9) {
        query += '&type=' + state.filters.type.join(',');
      }
      if (state.filters.license.length > 0) {
        query += '&license=' + state.filters.license.join(',');
      }
      if (state.filters.tags.length > 0) {
        query += '&tags=' + state.filters.tags.join(',');
      }
      if (state.filters.topics.length > 0) {
        query += '&topic=' + state.filters.topics.join(',');
      }
      if (state.filters.operations.length > 0) {
        query += '&operation=' + state.filters.operations.join(',');
      }
      if (state.filters.inputFormat.length > 0) {
        query += '&input_format=' + state.filters.inputFormat.join(',');
      }
      if (state.filters.outputFormat.length > 0) {
        query += '&output_format=' + state.filters.outputFormat.join(',');
      }
    
      return query;
    },
    // Function for normalize Tool
    normalizeTool(tool) {
      const pick = (value) => {
        const v = Array.isArray(value) ? value[0] : value;
        return v != null ? v : '';
      };

      const fairsoft = tool.fairsoft || {};

      const score = (value) => {
        const n = parseFloat(value);
        return isNaN(n) ? 0 : n;
      };

      return {
        id: tool.id || '',
        name: pick(tool.name),
        subname: pick(tool.name),
        label: pick(tool.label) || pick(tool.name),
        type: tool.type || [],
        description: pickDescription(tool.description),
        topics: tool.topics || [],
        operations: tool.operations || [],
        sourcesLabels: tool.sources_labels || {},
        publications: tool.publication || [],
        license: tool.license || [],
        webpage: pick(tool.webpage) || pick(tool.homepage),
        documentation: tool.documentation || [],
        findability: score(fairsoft.F),
        accessibility: score(fairsoft.A),
        interoperability: score(fairsoft.I),
        reusability: score(fairsoft.R),
      };
    },
  },
});
