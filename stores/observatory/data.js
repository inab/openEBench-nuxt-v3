import { defineStore } from "pinia";
import { useObservatory } from './index'; // Importa la store de observatory correctamente

const BASE_URL = '/stats/tools/';

export const useData = defineStore("data", {
  state: () => ({
    _countsPerSource: {},
    _totalCount: null,
    _features: {},
    _coverageSources: {
      counts: {},
      counts_cummulative: {},
    },
    _completeness: {
      cummulative_features: {},
      distribution_features: {},
    },
    _types: {},
    _unLoaded: {
      countsPerSource: true,
      totalCount: true,
      features: true,
      coverageSources: true,
      completeness: true,
      types: true,
    },
  }),

  // Getters
  getters: {
    countsPerSource: (state) => state._countsPerSource,
    totalCount: (state) => state._totalCount,
    features: (state) => state._features,
    coverageSources: (state) => state._coverageSources,
    completeness: (state) => state._completeness,
    types: (state) => state._types,
  },

  // Actions
  actions: {
    async getCountsPerSource() {
      const observatoryStore = useObservatory(); // Usa la store useObservatory correctamente
      const URL = BASE_URL + 'count_per_source?collection=' + observatoryStore._currentCollection;

      this.setLoaded({ countsPerSource: true });

      const result = await this.GET_URL(URL);
      const nonZeroSources = result.filter((element) => element.count > 0);

      this.setCountsPerSource(nonZeroSources);
      this.setLoaded({ countsPerSource: false });
    },

    async getTotalCount() {
      const observatoryStore = useObservatory();
      const URL = BASE_URL + 'count_total?collection=' + observatoryStore._currentCollection;

      this.setLoaded({ totalCount: true });

      const result = await this.GET_URL(URL);
      this.setTotalCount(result[0].data);
      this.setLoaded({ totalCount: false });
    },

    async getFeatures() {
      const observatoryStore = useObservatory();
      const URL = BASE_URL + 'features?collection=' + observatoryStore._currentCollection;

      this.setLoaded({ features: true });

      const result = await this.GET_URL(URL);

      this.setFeatures(result);
      this.setLoaded({ features: false });
    },

    async getCoverageSources() {
      const observatoryStore = useObservatory();
      const URL = BASE_URL + 'coverage_sources?collection=' + observatoryStore._currentCollection;

      this.setLoaded({ coverageSources: true });

      const result = await this.GET_URL(URL);

      this.setCoverageSources(result);
      this.setLoaded({ coverageSources: false });
    },

    async getCompleteness() {
      const URLCummulativeFeatures = BASE_URL + 'features_cummulative';
      const URLDistributionFeatures = BASE_URL + 'distribution_features';

      this.setLoaded({ completeness: true });

      const resultCummulativeFeatures = await this.GET_URL(URLCummulativeFeatures);
      const resultDistributionFeatures = await this.GET_URL(URLDistributionFeatures);

      this.setCompleteness({
        cummulative_features: resultCummulativeFeatures,
        distribution_features: resultDistributionFeatures,
      });

      this.setLoaded({ completeness: false });
    },

    async getTypes() {
      const observatoryStore = useObservatory();
      const URL = BASE_URL + 'types_count?collection=' + observatoryStore._currentCollection;

      this.setLoaded({ types: true });

      const result = await this.GET_URL(URL);

      this.setTypes(result);
      this.setLoaded({ types: false });
    },

    async GET_URL(URL) {
      const result = await this.$observatory.get(URL); // Asegúrate de que $observatory esté correctamente configurado
      return result.data.data;
    },

    // Métodos para modificar el estado
    setLoaded(loading) {
      this._unLoaded[Object.keys(loading)[0]] = loading[Object.keys(loading)[0]];
    },

    setCountsPerSource(counts) {
      this._countsPerSource = counts;
    },

    setTotalCount(count) {
      this._totalCount = count;
    },

    setFeatures(features) {
      this._features = features;
    },

    setCoverageSources(sources) {
      this._coverageSources = sources;
    },

    setCompleteness(completeness) {
      this._completeness = completeness;
    },

    setTypes(types) {
      this._types = types;
    },
  },
});
