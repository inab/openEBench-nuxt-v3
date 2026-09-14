import { defineStore } from 'pinia';
import { pickDescription } from '@/utils/toolDescription';

export const useToolStore = defineStore('tool', {
  state: () => ({
    tools: [],
    loading: false,
  }),

  getters: {
    Tools: (state) => state.tools,
    Loading: (state) => state.loading,
  },

  actions: {
    setTools(tools) {
      this.tools = tools;
    },

    setLoading(loading) {
      this.loading = loading;
    },

    async fetchTools() {
      const { $observatory } = useNuxtApp();

      try {
        this.setLoading(true);

        const result = await $observatory('/api/initial-search', {
          method: 'GET',
        });

        const tools = Array.isArray(result) ? result : result.tools || result.data || [];

        this.setTools(tools.map(this.normalizeTool));
      } catch (error) {
        console.error('Error fetching tools:', error);
      } finally {
        this.setLoading(false);
      }
    },

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
