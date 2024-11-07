// stores/data.js
import { defineStore } from 'pinia';
import { useObservatory } from '@/stores/observatory/index.js';
import { useAsyncData } from 'nuxt/app';
import { reactive } from 'vue';

const BASE_URL = '/api/stats/tools/';

export const useData = defineStore('data', {
  state: () => ({
    countsPerSource: {},
    totalCount: null,
    features: {},
    coverageSources: reactive({ counts: {}, counts_cummulative: {}, }),
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
      this.totalCount = count;
    },

    setFeatures(features) {
      this.features = features;
    },

    setCoverageSources(sources) {
      this.coverageSources = sources;
    },

    setCompleteness(result1, result2 ) {
      this.completeness.cummulative_features = result1;
      this.completeness.distribution_features = result2;
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
        const nonZeroSources = result.filter((element) => element.count > 0);
        this.setCountsPerSource(nonZeroSources);

        // If no errors
        this.setLoaded({ countsPerSource: false });

      } catch (error) {
        console.error('Error fetching Counts Per Source:', error);
        this.setLoaded({ countsPerSource: true });
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

        // If no errors
        this.setLoaded({ totalCount: false });
    
      } catch (error) {
        console.error('Error fetching Total Count:', error);
        this.setLoaded({ totalCount: false });
      }
    },

    async getFeatures() {
      const { $observatory } = useNuxtApp();
      const observatoryStore = useObservatory();
      const URL = `${BASE_URL}features?collection=${observatoryStore.currentCollection}`;

      try {
        this.setLoaded({ features: true });
        const result = 
          await useAsyncData('Features', () => 
            $observatory(URL, {
            method: "GET",
          })
        );

        if(result.data === null) {
          console.log('Features no data available');
          this.setLoaded({ features: true });
        }else{
          this.setFeatures(result.data);
          // If no errors
          this.setLoaded({ features: false });
        }
      } catch (error) {
        console.error('Error fetching Features:', error);
        this.setLoaded({ features: true });
      }
    },

    async getCoverageSources () {
      const { $observatory } = useNuxtApp();
      const observatoryStore = useObservatory();
      const URL = `${BASE_URL}coverage_sources?collection=${observatoryStore.currentCollection}`;
      
      try {
        this.setLoaded({ coverageSources : true});
        const result =
          await useAsyncData('CoverageSources', () =>
            $observatory(URL, {
              method: "GET",
          })
        );

        if(result.data === null) {
          console.log('CoverageSources no data available');
          this.setLoaded({ coverageSources : true})
        }else{
          // If not error
          this.setCoverageSources(result.data);
          this.setLoaded({ coverageSources : false});
        }
      } catch (error) {
        console.error('Error fetching Coverage Source: ',error);
        this.setLoaded({ coverageSources : true});
      }
    },

    async getCompleteness () {
		// This plot uses two serires of data, one for the histogram and one for the line (cummulative distribution)
      const { $observatory } = useNuxtApp();
      const observatoryStore = useObservatory();
      const URLCummulativeFeatures = BASE_URL + 'features_cummulative';
  		const URLDistributionFeatures = BASE_URL + 'distribution_features';

      try {
        this.setLoaded({ completeness : true});
        const resultCummulativeFeatures =
          await useAsyncData('completeness Cummulative', () =>
            $observatory(URLCummulativeFeatures, {
              method: "GET",
          })
        );

        const resultDistributionFeatures =
          await useAsyncData('completeness Distribution', () =>
            $observatory(URLDistributionFeatures, {
              method: "GET",
          })
        );

        if(resultCummulativeFeatures.data === null && resultDistributionFeatures.data === data) {
          console.log('Completeness no data available');
          this.setLoaded({ completeness : true})
        }else{
          // If not error
          this.setCompleteness(resultCummulativeFeatures.data, resultDistributionFeatures.data);
          this.setLoaded({ completeness : false});
        }

      }catch (error) {
        console.error('Error fetching Completeness: ',error);
        this.setLoaded({ completeness : true});
      }
    }    

  },
});
