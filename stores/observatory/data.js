// stores/data.js
import { defineStore } from 'pinia';
import { useObservatory } from '@/stores/observatory/index.js';

const BASE_URL = '/api/stats/tools/';

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

    async GET_URL(URL) {
      const result =
        await useAsyncData("GET_URL", () =>
          $observatory(URL, {
            method: "GET",
          }),
        );

      console.log(result);
      return result.data.data;
    },

    async getCountsPerSource() {
      const { $observatory } = useNuxtApp();
      const observatoryStore = useObservatory();
      const URL = `${BASE_URL}count_per_source?collection=${observatoryStore.currentCollection}`;
      
      try {
        this.setLoaded({ countsPerSource: true });
        const { data } = await useAsyncData("countsPerSource", () =>
          $observatory(URL, {
            method: "GET", // Cambiar a POST si el endpoint lo requiere
          })
        );

        // Accede a data.value.data, que es el array que contiene los resultados
        const result = data.value?.data;
        if (Array.isArray(result)) {
          const nonZeroSources = result.filter((element) => element.count > 0);
          this.setCountsPerSource(nonZeroSources);
        } else {
          console.error('Data returned is not an array:', result);
        }

        this.setLoaded({ countsPerSource: false });

      } catch (error) {
        console.error('Error fetching counts per source:', error);
        this.setLoaded({ countsPerSource: false });
      }
    },

    async getTotalCount() {
      const { $observatory } = useNuxtApp();
      const observatoryStore = useObservatory();
      const URL = `${BASE_URL}count_total?collection=${observatoryStore.currentCollection}`;
      
      try {
        this.setLoaded({ totalCount: true });
        const resources =
          await useAsyncData("resources", () =>
            $observatory(URL, {
              method: "GET",
            }),
        );
        // Verifica la estructura de result
        if (resources && resources.data._value.length > 0) {
          this.setTotalCount(resources.data._value[0].data)
        }
        this.setLoaded({ totalCount: false });
    
      } catch (error) {
        console.error('Error fetching total count:', error);
        this.setLoaded({ totalCount: false });
      }
    },
    
    

  },
});
