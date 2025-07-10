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
    featuresControl: {},
    featuresLabels: [],
    coverageSources: reactive({ counts: {}, counts_cummulative: {}, }),
    completeness: {
      cummulative_features: {},
      distribution_features: {},
    },
    completenessControl: {
      cummulative_features: {},
      distribution_features: {},
    },
    types: {},
    typesControl: {},
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
    FeaturesControl: (state) => state.featuresControl,
    FeaturesLabels: (state) => state.featuresLabels,
    CoverageSources: (state) => state.coverageSources,
    Completeness: (state) => state.completeness,
    CompletenessControl: (state) => state.completenessControl,
    Types: (state) => state.types,
    TypesControl: (state) => state.typesControl
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
    
    setFeaturesControl(features) {
      this.featuresControl = features;
    },

    setFeaturesLabels(features) {
      this.featuresLabels = features;
    },

    setCoverageSources(sources) {
      this.coverageSources = sources;
    },

    setCompleteness(result1, result2 ) {
      this.completeness.cummulative_features = result1;
      this.completeness.distribution_features = result2;
    },

    setCompletenessControl(result1, result2 ) {
      this.completenessControl.cummulative_features = result1;
      this.completenessControl.distribution_features = result2;
    },

    setTypes(types) {
      this.types = types;
    },

    setTypesControl(types) {
      this.typesControl = types;
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

      const URLLabels = `${BASE_URL}features_dots`;
      const URLControl = `${BASE_URL}features?collection=tools`;
      try {
        this.setLoaded({ features: true });

        const [result, resultLabels, resultControl] = await Promise.all([
          $observatory(URL, { method: 'GET' }),
          $observatory(URLLabels, { method: 'GET' }),
          $observatory(URLControl, { method: 'GET' }),
        ]);

        // Verifica los datos antes de asignar
        if (!result || !resultLabels || !resultControl) {
          console.warn('Some features data could not be loaded');
        }else{
          this.setFeatures(result.data);
          this.setFeaturesLabels(resultLabels.data);
          this.setFeaturesControl(resultControl.data);

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
      const currentCollection = observatoryStore.getCurrentCollection;

      const URLCummulativeFeatures = `${BASE_URL}features_cummulative?collection=${currentCollection}`;
      const URLDistributionFeatures = `${BASE_URL}distribution_features?collection=${currentCollection}`;
      const URLCummulativeFeaturesControl = `${BASE_URL}features_cummulative?collection=tools`;
      const URLDistributionFeaturesControl = `${BASE_URL}distribution_features?collection=tools`;

      try {
        this.setLoaded({ completeness : true});

        // Realiza todas las llamadas en paralelo
        const [
          resultCummulativeFeatures,
          resultDistributionFeatures,
          resultCummulativeFeaturesControl,
          resultDistributionFeaturesControl
        ] = await Promise.all([
          $observatory(URLCummulativeFeatures, { method: 'GET' }),
          $observatory(URLDistributionFeatures, { method: 'GET' }),
          $observatory(URLCummulativeFeaturesControl, { method: 'GET' }),
          $observatory(URLDistributionFeaturesControl, { method: 'GET' }),
        ]);

        if(resultCummulativeFeatures.data === null && resultDistributionFeatures.data === data) {
          console.log('Completeness no data available');
          this.setLoaded({ completeness : true})
        }else{
          // If not error

          // Setea datos de control
          this.setCompletenessControl(resultCummulativeFeaturesControl.data, resultDistributionFeaturesControl.data);

          // Setea datos principales
          this.setCompleteness(resultCummulativeFeatures.data, resultDistributionFeatures.data);
          this.setLoaded({ completeness : false});
        }

      }catch (error) {
        console.error('Error fetching Completeness: ',error);
        this.setLoaded({ completeness : true});
      }
    },

    async getTypes() {
      const { $observatory } = useNuxtApp();
      const observatoryStore = useObservatory();
      const currentCollection = observatoryStore.getCurrentCollection;

      const URL = `${BASE_URL}types_count?collection=${currentCollection}`;
      const URLControl = `${BASE_URL}types_count?collection=tools`;

      try {
        this.setLoaded({ types : true});

        // Make both requests in parallel
        const [result, resultControl] = await Promise.all([
          $observatory(URL, { method: 'GET' }),
          $observatory(URLControl, { method: 'GET' })
        ]);

        if(result.data === null) {
          console.log('Types no data available');
          this.setLoaded({ types : true})
        }else{
          // If not error
          this.setTypes(result.data);
          this.setTypesControl(resultControl.data);
          this.setLoaded({ types : false});
        }
      } catch (error) {
        console.error('Error fetching Types: ',error);
        this.setLoaded({ types : true});
      }

    },

  },
});
