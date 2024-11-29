/*
This store is used for the github integration.
In Step 2: import of metadata from a github repository.
*/
import { defineStore } from 'pinia';
import { useAsyncData, useNuxtApp } from 'nuxt/app';

export const useGithub = defineStore('github', {
  state: () => ({
    test: 'test',
    // requested repository to import metadata from (as <owner>/<repo>)
    repository: {
      owner: '',
      repo: '',
    },
    // opens/closes the main dialog for importing metadata from github
    dialogImportMetadata: false,
    // text that appears in the ImportMetadata dialog
    importError: false,
    importProgressText: '',
    // opens/closes the dialog for installing the app in the requester's github account
    dialogAppInstall: false,
    // the installation ID of the app in the requester's github account
    extractorInstallationID: null,
	  updaterInstallationID: null,
	  // socket
    socket: null, 
  }),

  getters: {
    getRepository:(state) => state.repository,
    getDialogImportMetadata:(state) => state.dialogImportMetadata,
    getImportError:(state) => state.importError,
    getImportProgressText:(state) => state.importProgressText,
    getDialogAppInstall:(state) => state.dialogAppInstall,
    getSocket:(state) => state.socket,
    // No tienen que tener el mismo nombre
    getInstallationID:(state) => state.extractorInstallationID,
    getUpdaterInstallationId:(state) => state.updaterInstallationID,
  },

  actions: {

    // Muttations
    setUpdateExtractorInstallationID(installationID) { 
      this.extractorInstallationID = installationID;
    },

    setUpdateImportProgressText(text) { 
      this.importProgressText = text; 
    }, 

    setUpdateUpdaterInstallationID(installationID) { 
      this.updaterInstallationID = installationID; 
    },

    setUpdateImportError(value) { 
      this.importError = value; 
    },

    updateDialogImportMetadata(value) { 
      this.dialogImportMetadata = value; 
    },

    setUpdateDialogAppInstall(value) { 
      this.dialogAppInstall = value; 
    },

    // Esta se usa en GitHubInput
    updateRepository(repository) { 
      this.repository = repository;
    },

    // ------------------------------------------------------------------------
    // Functions to obtain data from the database
    // ------------------------------------------------------------------------

    async getExtractorInstallationID(repository) {
      /*
        This function makes a request to the API to check the installation of Metadata Extractor for FAIRsoft in the repository.
        ID of the repository that the user requested to import metadata from.
        This function is called from the component GitHubInput.vue
        */
      const { $githubapp } = useNuxtApp();
      this.setUpdateImportProgressText('Checking the permissions to read the repository...');
    
      try {
        const URL = '/metadata-extractor-for-fairsoft/installation/id';
        
        // Usa $githubapp directamente con el método GET
        const response = await $githubapp(URL, {
          method: 'GET',
          params: {
            owner: repository.owner,
            repo: repository.repo,
          },
        });

        let installationID = null;
        if (response.status === 200) {
          installationID = response.data.data.id;
        }
    
        console.debug('obtained installation ID:', installationID);
        this.setUpdateExtractorInstallationID(installationID)

      } catch (error) {
        console.error('Error while getting installation ID:', error);
        this.setUpdateExtractorInstallationID(null)
        this.setUpdateImportProgressText("Error while fetching the repository's installation ID for the metadata extractor.");
        this.setUpdateImportError(true);
      }
    },
    
    async getUpdateInstallationID(repository){
      const { $githubapp } = useNuxtApp();
      this.setUpdateImportProgressText('Checking the permissions to read the repository...');

      try {
        const URL = '/metadata-updater-for-fairsoft/installation/id';

        const response = await $githubapp(URL, {
          method: 'GET',
          params: {
            owner: repository.owner,
            repo: repository.repo,
          },
        });

        let installationID = null;
        if (response.status === 200) { 
          installationID = response.data.data.id;
        } 
        console.debug('obtained installation ID: ' + installationID);
        this.setUpdateUpdaterInstallationID(installationID)

      } catch (error) {
        console.error('Error while getting installation ID: ', error);
        this.setUpdateImportProgressText("error while fetching the repositorie's installation ID for app Metadata Updater for FAIRsoft");
        this.setUpdateImportError(true);
      }
    },

    async fetchGitHubMeta() {
      const { $githubapp } = useNuxtApp()
      this.updateDialogImportMetadata(true);
      this.setUpdateImportProgressText('Fetching repository metadata ...')

      const URL = 'metadata';
      const payload = {
        repo: this.repository.repo,
        owner: this.repository.owner,
        installationID: this.extractorInstallationID,
      };

      try {
        const response = await $githubapp(URL, { 
          method: 'POST', 
          body: payload, 
        });

        let result = response.data;

        // Assuming these methods are available and configured
        await this.$dispatch('observatory/evaluation/metadata/prepareMetadata', result); 
        await this.$dispatch('observatory/evaluation/metadata/updateToolsMetadata', result); 
        await this.$dispatch('observatory/evaluation/metadata/updateLoadedMetadata', true); 
        
        this.setUpdateImportProgressText('Importation finished')
        this.updateDialogImportMetadata(false);

      }catch (error) {
        console.debug('Error while fetching metadata: ' + error);
        this.setUpdateImportProgressText('Error while fetching metadata')
        this.setUpdateImportError(true);
      }
    },

    // Esta se usa en DialogImportMetadata
    cancelImport() { 
      this.dialogImportMetadata = false;
      this.setUpdateImportError(false);
      this.dialogAppInstall = false;
      this.setUpdateImportProgressText('')
    },

  },
})
