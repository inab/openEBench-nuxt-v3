import { defineStore } from "pinia";
import { useObservatory } from "@/stores/observatory/index.js";
import { useAsyncData } from "nuxt/app";

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
    publicationsCount: [],
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
      publicationsCount: true,
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
    PublicationsCount: (state) => state.publicationsCount,
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
      const URL = `${BASE_URL}${endpoint}?collection=${observatoryStore.currentCollection}`;

      try {
        this.setLoaded(key, true);

        const result = await useAsyncData(key, () =>
          $observatory(URL, { method: "GET" })
        );

        if (result.data === null) {
          console.log(`${key} -> no data available`);
          this.setLoaded(key, true);
        } else {
          this.setData(key, result.data);
          console.log(`${key} data loaded successfully`);
        }
      } catch (error) {
        console.error(`Error fetching ${key}:`, error);
        this.setLoaded(key, true);
      }
    },

    // Using the generic `fetchData` method
    getLicensesSunburst() {
      this.fetchData("licensesSunburst", "licenses_summary_sunburst");
    },
    getLicensesOpenSource() {
      this.fetchData("licensesOpenSource", "licenses_open_source");
    },
    getSemanticVersioning() {
      this.fetchData("semanticVersioning", "semantic_versioning");
    },
    getVersionControlCount() {
      this.fetchData("versionControlCount", "version_control_count");
    },
    getVersionControlRepositories() {
      this.fetchData(
        "versionControlRepositories",
        "version_control_repositories"
      );
    },
    getPublications() {
      this.fetchData("publications", "publications_journals_IF");
    },
    getPublicationsCount() {
      this.fetchData("publicationsCount", "publications_coverage");
    },
    getDependencies() {
      this.fetchData("dependencies", "dependencies_count")
    },
    getDependenciesCount() {
      this.fetchData("dependenciesCount", "dependencies_coverage")
    },
    getDocumentation() {
      this.fetchData("documentation", "documentation")
    },
    getDocumentationCount(){
      this.fetchData("documentationCount", "documentation_coverage")
    },
    async getInputFormats(){
      await this.fetchData("inputFormats", "input_formats")
    },
    async getOutputFormats(){
      await this.fetchData("outputFormats", "output_formats")
    },
    getFormatsCount(){
      this.fetchData("formatsCount", "formats_coverage")
    }
  },
});
