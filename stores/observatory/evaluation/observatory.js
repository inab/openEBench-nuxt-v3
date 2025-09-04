/*
This is the store for the FAIR4S Evaluator's **step 2** when metadata is
imported from the Software Observatory.
These functions are mainly called from the component `observatoryInput.vue`
(in `components/Observatory/evaluation/Observatory`)
*/
import { defineStore } from "pinia";
import { useMetadataStore } from "@/stores/observatory/evaluation/metadata.js";
import { useNuxtApp } from "nuxt/app";

export const useObservatoryStore = defineStore("observatoryData", {
  state: () => ({
    observatoryToolsNameTypeSources: [],
    loadingAutocomplete: false,
    loading: false,
    importationResult: null,
  }),

  getters: {
    ObservatoryToolsNameTypeSources: (state) =>
      state.observatoryToolsNameTypeSources,
    LoadingAutocomplete: (state) => state.loadingAutocomplete,
    Loading: (state) => state.loading,
  },

  actions: {
    // Fetches observatory tool names and types
    async getObservatoryToolsNameTypeSources(page) {
      try {
        const result = await $observatory("/api/tools/names_type_labels", {
          method: "GET",
          params: { page }, // Include page number in the request
        });
        return result; // Return the tools for the current page
      } catch (err) {
        console.error("Error fetching tools:", err);
        return [];
      }
    },

    async getObservatoryToolsNameTypeSources() {
      const { $observatory } = useNuxtApp();
      this.loadingAutocomplete = true;

      try {
        const result = await $observatory("/api/tools/names_type_labels", {
          method: "GET",
        });
        // console.log("API Response:", result);

        if (result ) {
          this.observatoryToolsNameTypeSources = result; // Ensure result has the data field
          return result; // Return the correct data to the component
        } else {
          console.error("Invalid API response:", result);
          return [];
        }
      } catch (err) {
        console.error("Error fetching tool names/types", err);
        return [];
      } finally {
        this.loadingAutocomplete = false;
      }
    },

    // Fetches tool metadata based on name and type
    async fetchToolMetadata(payload) {
      const { $observatory } = useNuxtApp();
      this.loading = true;

      try {
        const URL = `/api/tools?name=${payload.name}&type=${payload.type}`;
        const result = await $observatory(URL, {
          method: 'GET',
        });

        // console.log("Tool metadata response:", result); // Log metadata response

        // Assuming metadata preparation needs to be done here
        const metadataStore = useMetadataStore();
        const resultPrepare = metadataStore.prepareMetadata(result);

        metadataStore.updateToolsMetadata(resultPrepare);
        metadataStore.updateLoadedMetadata(true);

        this.importationResult = result;

      } catch (error) {
        console.error("Error fetching tool metadata:", error);
      } finally {
        this.loading = false;
      }
    },

    // Optional: Update loading state
    updateLoading(loading) {
      this.loading = loading;
    },
  },
});
