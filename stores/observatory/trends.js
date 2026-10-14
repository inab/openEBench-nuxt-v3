import { defineStore } from "pinia";
import { useObservatory } from "~~/stores/observatory/index.js";

const BASE_URL = "/api/stats/tools/";

export const useTrends = defineStore("trends", {
  state: () => ({
    licensesSunburst: [],
    licensesOpenSource: {
      licenses_copyleft: [],
      counts_copyleft: [],
      licenses_permissive: [],
      counts_permissive: [],
      licenses_data: [],
      counts_data: [],
    },
    semanticVersioning: [],
    versionControlCount: [],
    versionControlRepositories: [],
    publications: [],

    dependencies: [],
	  dependenciesCount: {},
	  documentation: [],
	  documentationCount: {},
	  inputFormats: {},
	  outputFormats: {},
	  formatsCount: {},

    unLoaded: {
      licensesSunburst: true,
      licensesOpenSource: true,
      semanticVersioning: true,
      versionControlCount: true,
      versionControlRepositories: true,
      publications: true,

      dependencies: true,
      dependenciesCount: true,
      documentation: true,
      documentationCount: true,
      inputFormats: true,
      outputFormats: true,
      formatsCount: true,

      FAIRscores: true,
    },
  }),

  getters: {
    LicensesSunburst: (state) => state.licensesSunburst,
    LicensesOpenSource: (state) => state.licensesOpenSource,
    SemanticVersioning: (state) => state.semanticVersioning,
    VersionControlCount: (state) => state.versionControlCount,
    VersionControlRepositories: (state) => state.versionControlRepositories,
    Publications: (state) => state.publications,

    Dependencies: (state) => state.dependencies,
    DependenciesCount: (state) => state.dependenciesCount,
    Documentation: (state) => state.documentation,
    DocumentationCount: (state) => state.documentationCount,
    InputFormats: (state) => state.inputFormats,
    OutputFormats: (state) => state.outputFormats,
    FormatsCount: (state) => state.formatsCount,

    Loaded: (state) => state.unLoaded,
  },

  actions: {
    setLoaded(key, value) {
      this.unLoaded[key] = value;
    },

    setData(key, value) {
      this[key] = value;
      this.setLoaded(key, false);
    },

    async fetchData(key, endpoint) {
      const { $observatory } = useNuxtApp();
      const observatoryStore = useObservatory();
      const collectionId = observatoryStore.currentCollection;
      const URL = `${BASE_URL}${endpoint}?collection=${collectionId}`;

      try {
        this.setLoaded(key, true);

        const result = await $observatory(URL, { method: "GET" });
        if (observatoryStore.currentCollection !== collectionId) return;

        if (result === null || result === undefined) {
          this.setLoaded(key, false);
        } else {
          this.setData(key, result);
        }
      } catch (error) {
        if (observatoryStore.currentCollection !== collectionId) return;
        console.error(`Error fetching ${key}:`, error);
        this.setLoaded(key, false);
      }
    },

    // Using the generic `fetchData` method
    getLicensesSunburst() {
      return this.fetchData("licensesSunburst", "licenses_summary_sunburst");
    },
    getLicensesOpenSource() {
      return this.fetchData("licensesOpenSource", "licenses_open_source");
    },
    getSemanticVersioning() {
      return this.fetchData("semanticVersioning", "semantic_versioning");
    },
    getVersionControlCount() {
      return this.fetchData("versionControlCount", "version_control_count");
    },
    getVersionControlRepositories() {
      return this.fetchData(
        "versionControlRepositories",
        "version_control_repositories"
      );
    },
    getPublications() {
      return this.fetchData("publications", "publications_journals_IF");
    },
    getDependencies() {
      return this.fetchData("dependencies", "dependencies_count");
    },
    getDependenciesCount() {
      return this.fetchData("dependenciesCount", "dependencies_coverage");
    },
    getDocumentation() {
      return this.fetchData("documentation", "documentation");
    },
    getDocumentationCount() {
      return this.fetchData("documentationCount", "documentation_coverage");
    },
    getInputFormats() {
      return this.fetchData("inputFormats", "input_formats");
    },
    getOutputFormats() {
      return this.fetchData("outputFormats", "output_formats");
    },
    getFormatsCount() {
      return this.fetchData("formatsCount", "formats_coverage");
    },
  },
});
