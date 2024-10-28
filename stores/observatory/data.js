// stores/data.js
import { defineStore } from 'pinia';
import { useObservatory } from '@/stores/observatory/index.js';

const BASE_URL = '/stats/tools/';

export const useData = defineStore('data', {
  state: () => ({
    countsPerSource: {},
    totalCount: null,
    features: {},
    coverageSources: {
      counts: {},
      counts_cummulative: {},
    },
    completeness: {
      cummulative_features: {},
      distribution_features: {},
    },
    types: {},
    unLoaded: {
      countsPerSource: true,
      totalCount: true,
      features: true,
      coverageSources: true,
      completeness: true,
      types: true,
    },
  }),

  getters: {
    CountsPerSource: (state) => state.countsPerSource,
    TotalCount: (state) => state.totalCount,
    Features: (state) => state.features,
    CoverageSources: (state) => state.coverageSources,
    Completeness: (state) => state.completeness,
    Types: (state) => state.types,
  },

  actions: {

    // Muttations
    setLoaded(loading) {
      this.unLoaded[Object.keys(loading)[0]] = loading[Object.keys(loading)[0]];
    },

    setCountsPerSource(counts) {
      this.countsPerSource = counts;
    },

    setTotalCount(count) {
      console.log('adding counts', count, 'to state');
      this.totalCount = count;
    },

    setFeatures(features) {
      this.features = features;
    },

    setCoverageSources(sources) {
      this.coverageSources = sources;
    },

    setCompleteness(completeness) {
      this.completeness = completeness;
    },

    setTypes(types) {
      this.types = types;
    },

    // ------------------------------------------------------------------------
    async getCountsPerSource() {
      const { $observatory } = useNuxtApp();
      const observatoryStore = useObservatory();
      const URL = `${BASE_URL}counts_per_source?collection=${observatoryStore.currentCollection}`;
      
      try {
        this.setLoaded({ countsPerSource: true });
        const result = await $observatory(URL);

        // Verifica la estructura de result
        if (result && result.length > 0) {
          this.setCountsPerSource(result[0].data);
        }
    
        this.setLoaded({ countsPerSource: false });

      } catch {
        console.error('Error fetching total count:', error);
        this.setLoaded({ countsPerSource: false });
      }
    },

    async getTotalCount() {
      const observatoryStore = useObservatory();
      const { $observatory } = useNuxtApp();
      const URL = `/stats/tools/count_total?collection=${observatoryStore.currentCollection}`;
    
      try {
        this.setLoaded({ totalCount: true });
        const result = await $observatory(URL);
    
        // Verifica la estructura de result
        if (result && result.length > 0) {
          this.setTotalCount(result[0].data);
        }
    
        this.setLoaded({ totalCount: false });
    
      } catch (error) {
        console.error('Error fetching total count:', error);
        this.setLoaded({ totalCount: false });
      }
    },
    
    

  },
});
