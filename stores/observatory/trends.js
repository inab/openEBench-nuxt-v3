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
    dependencies: [],
    unLoaded: {
      licensesSunburst: true,
      licensesOpenSource: true,
      semanticVersioning: true,
      versionControlCount: true,
      versionControlRepositories: true,
      publications: true,
      dependencies: true,
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
        console.log(`Fetching data for ${key} from ${URL}`);
        const result = await useAsyncData(key, () =>
          $observatory(URL, { method: "GET" })
        );
        //console.log(`Result for ${key}:`, result.data);

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
    async getDependencies() {
      // Mock data
      const names = [
        "numpy", "pandas", "requests", "matplotlib", "scikit-learn",
        "flask", "tensorflow", "beautifulsoup4", "scipy", "django",
        "seaborn", "sqlalchemy", "pytest", "jupyter", "torch"
      ];
    
      const counts = [
        240, 200, 185, 160, 150, 140, 130, 120,
        110, 100, 95, 90, 85, 80, 75
      ];
    
      const mockedDependencies = names.map((name, index) => ({
        name,
        count: counts[index] || 0
      }));
    
      // Store data and mark as loaded
      this.setData("dependencies", mockedDependencies);
    }
  },
});
