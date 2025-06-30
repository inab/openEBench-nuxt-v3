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
    documentation: [],
    unLoaded: {
      licensesSunburst: true,
      licensesOpenSource: true,
      semanticVersioning: true,
      versionControlCount: true,
      versionControlRepositories: true,
      publications: true,
      dependencies: true,
      documentation: true,
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
    Documentation: (state) => state.documentation,
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
    },
    async getDocumentation() {
      // Mock data based on user example
      const doc_types = [
        "general", "readme", "installation instructions",
        "API specification", "manual", "FAQ", "tutorial"
      ];
      const doc_format_counts = {
        "general":        {"web": 10, "downloadable": 5, "github": 8, "gitlab": 2, "total": 15},
        "readme":         {"web": 3, "downloadable": 0, "github": 40, "gitlab": 2, "total": 42},
        "installation instructions": {"web": 6, "downloadable": 4, "github": 10, "gitlab": 5, "total": 17},
        "API specification": {"web": 5, "downloadable": 2, "github": 3, "gitlab": 1, "total": 7},
        "manual":         {"web": 4, "downloadable": 10, "github": 0, "gitlab": 0, "total": 11},
        "FAQ":            {"web": 6, "downloadable": 1, "github": 0, "gitlab": 0, "total": 6},
        "tutorial":       {"web": 2, "downloadable": 3, "github": 0, "gitlab": 4, "total": 6}
      };
      // Transform to array of objects for easier plotting
      const documentation = doc_types.map(type => ({
        type,
        ...doc_format_counts[type]
      }));
      this.setData("documentation", documentation);
    },
  },
});
