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
    unLoaded: {
      licensesSunburst: true,
      licensesOpenSource: true,
      semanticVersioning: true,
      versionControlCount: true,
      versionControlRepositories: true,
      publications: true,
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
  },
});
