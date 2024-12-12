/*
  _VocabulariesItems are of the form:
  { <vocabulary name> : {
      'format':[
          term1,
          term2,
          ...
      ],
      'datatype':[
          term1,
          term2,
          ...
          ...
      ],
      'topic':[
          term1,
          term2,
          ...
          ...
      ],
      'operaion':[
          term1,
          term2,
          ...
          ...
      ],
      }
  }
*/


import { defineStore } from 'pinia';
import { useNuxtApp } from 'nuxt/app';

export const useMetadataStore = defineStore('metadata', {
  state: () => ({
    test: 'test',
    toolMetadata: {},
    toolMetadataJSONLD: {},
    toolMetadataCFF: {},
    loadedMetadata: false,
    SPDXLicenses: [],
    vocabulariesItems: {
      EDAM: {
        format: [],
        datatype: [],
        topic: [],
        operation: [],
      },
    },
  }),

  getters: {
    getToolName: (state) => state.toolMetadata.name,
    getVocabulariesItems: (state) => state.vocabulariesItems,
    getLoadedMetadata: (state) => state.loadedMetadata,
    getToolMetadata: (state) => state.toolMetadata,
    getSPDXLicenses: (state) => state.SPDXLicenses,
    getToolMetadataJSONLD: (state) => state.toolMetadataJSONLD,
    getToolMetadataCFF: (state) => state.toolMetadataCFF,
  },

  actions: {

    setSPDXLicenses(SPDXLicenses) {
      this.SPDXLicenses = SPDXLicenses;
    },

    setVocabulariesItems(payload) {
      this.vocabulariesItems[payload.key] = payload.items;
    },

    async GET_URL(URL) {
      const { $observatory } = useNuxtApp();
      try {
        const result = await $observatory(URL, { method: "GET" });
        return result;
      } catch (error) {
        console.error('Error fetching data from URL:', error);
        throw error;
      }
    },

    async POST_URL (payload){
      const { $observatory } = useNuxtApp();
      try {
        const result = await $observatory(payload.url, {
          method: "POST", // Método POST
          body: payload.data,
          headers: {
            "Content-Type": "application/json",
          },
        });

        return result // Devuelve el resultado
      } catch (error) {
        console.error("Error in POST_URL:", error);
        throw error; // Lanza el error para manejarlo donde se llame la acción
      }
    },

    async fetchSPDXLicenses() {
      const URL = '/api/spdx/SPDXLicenses';

      try {
        const SPDXLicenses = await this.GET_URL(URL);
        this.setSPDXLicenses(SPDXLicenses);
      } catch (error) {
        console.error('Error while fetching SPDX licenses:', error);
      }
    },

    async fetchVocabulariesItems() {
      const URL = '/api/edam/EDAMTerms';

      try {
        const EDAMTerms = await this.GET_URL(URL);
        const payload = {
          key: 'EDAM', // type of term
          items: EDAMTerms, // list of terms
        };
        this.setVocabulariesItems(payload);
      } catch (error) {
        console.error('Error while fetching vocabularies items:', error);
      }
    },

    async transformToJSONLD(){
      // Transform the metadata to JSON-LD
      const payload = {
        data: this.toolMetadata,
        url: '/api/tools/jsonld',
      };
      const result = await this.POST_URL(payload);

      this.updateToolMetadataJSONLD(result)
    },

    async transformToCFF(){
      // Transform the metadata to CFF
      const payload = {
        data: this.toolMetadata,
        url: '/api/tools/cff',
      };

      const result = await this.POST_URL(payload);

      console.debug(result);
      this.updateToolMetadataCFF(result)
    },

    // ----------------------------------------------------------------
    // Other Functions
    // ----------------------------------------------------------------

    test(result){
      console.log('test ',result);
    },
    prepareMetadata(result){
      /* ---Modifications to the metadata are needed to make it compatible with the UI ---- */
      result.source.push('observatory') // add observatory as source

      // Contribution policy and test data as arrays of strings
      result.contribPolicy = [];
      result.test = []; // Here we are missing the tests that were equal to true

      // New field registration as boolean
		  result.registration_not_mandatory = false; // Here we are missing the registrations that were equal to true

      // New field registries as array of strings (starting with sources)
      const sourcesLabels = {
        biotools: 'bio.tools',
        bioconda: 'Bioconda',
        bioconductor: 'Bioconductor',
        sourceforge: 'SourceForge',
        toolshed: 'ToolShed',
      };

      // Add result.source to registries as their value in sourcesLabels.
		  // If source not in sourcesLabels, do not add it

      result.registries = result.source.map((source) => {
        if (source in sourcesLabels){
          return sourcesLabels[source];
        } else {
          return null;
        }
      });
      // remove undefined values
      result.registries = result.registries.filter(function (el) {
        return el != null;
      });

      // version as one string
      result.other_versions = result.version.filter((val) => val != null);
      result.version = result.version[0];

      // New filed e_infrastructures as array of strings
      const eInfrastructures = {
        galaxy: 'usegalaxy',
      };

      result.e_infrastructures = result.source.map((source) => {
        if (source in eInfrastructures) {
          return eInfrastructures[source];
        } else {
          return null;
        }
      });
      /// / remove undefined values
      result.e_infrastructures = result.e_infrastructures.filter(function (el) {
        return el != null;
      });
  
      /* ---------------------------------------------------------------------------------- */
  
      return result;
    },

    updateToolMetadataJSONLD(payload) {
      this.toolMetadataJSONLD = payload;
    },

    updateToolMetadataCFF(payload) {
      this.toolMetadataCFF = payload;
    },

    changeBooleanEntry(payload) {
      this.toolMetadata.rerender = [];
      this.toolMetadata[payload.field] = !this.toolMetadata[payload.field];
      delete this.toolMetadata.rerender;
    },

    changeEntry(payload) {
      // remove item to force update of reactive properties depending on it
      // this.toolMetadata[payload.field].splice(payload.index, 1);
      // add the new value
  
      this.toolMetadata[payload.field][payload.index] = payload.value;
    },

    addEntry(payload) {
      const field = payload.field;
      const value = payload.value;

      // the id is needed for v_for loops to keep proper track of items
      if (this.toolMetadata[field].length > 0) {
        const lastIndex = this.toolMetadata[field].length - 1;
        id = this.toolMetadata[field][lastIndex].id + 1;
      }
      const newItem = {
        term: value,
        id,
      };
      this.toolMetadata[field].push(newItem);
    },

    removeEntry(payload) {
		  // remove item to force update of reactive properties depending on it
      this.toolMetadata[payload.field].splice(payload.index, 1);
    },

    updateLoadedMetadata(payload) {
      this.loadedMetadata = payload;
    },

    updateToolsMetadata(result){
      this.toolMetadata = {};
      this.toolMetadata = result;
    },

    updateSelectorEntry(payload) {
      // changeSelectorEntry
      this.toolMetadata[payload.field] = [];
      this.toolMetadata[payload.field] = payload.value;
    },

    submitVersionControl(versionControl) {
      // setVersionControl
      this.toolMetadata.version_control = versionControl
    },

  },
});
