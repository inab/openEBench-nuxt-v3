import { defineStore } from 'pinia';
import { useNuxtApp } from 'nuxt/app';
import { value } from 'valibot';

export const useExport = defineStore('export', {
  state: () => ({
    dialogPR: false,
    dialogAppInstall: false,
    dialogPRok: false,
	  dialogPRfail: false,
	  failMessage: '',
	  okURL: '',
  }),

  // Getters
  getters: {
    getDialogPR: (state) => state.dialogPR,
    getDialogAppInstall: (state) => state.dialogAppInstall,
    getDialogPRok: (state) => state.dialogPRok,
    getDialogPRfail: (state) => state.dialogPRfail,
    getFailMessage: (state) => state.failMessage,
    getOkURL: (state) => state.okURL,
  },

  // Actions
  actions: {
    
    updateDialogPR (value) {
      this.setDialogPR(value)
    },

    updateDialogAppInstall (value) {
      this.setDialogAppInstall(value)
    },

    updateDialogPRok(value) {
      this.setDialogPRok(value)
    },

    updateDialogPRfail() {
      this.setDialogPRfail(value)
    },

    cancelRequest() {
      this.setDialogPR(false)
      this.setDialogAppInstall(false)
    },

    async makePullRequest(payload) {
      const { $githubapp } = useNuxtApp();

      const URL = '/metadata/pull';
      console.log('taget_brach: ', payload.branch);
      const parameters = {
        repo: payload.repo,
        owner: payload.owner,
        branch: payload.branch,
        filename: payload.filename,
        installationID: payload.installationID,
        metadata: payload.content,
        title: payload.title,
        message: payload.message,
      };

      const response = await $githubapp(URL, {
        method: 'POST',
        body: parameters
      });
      console.debug(response)

      if (response.code === 200){
        this.setOkURL(response.url)
        this.setDialogPRok(true)
        this.setDialogPR(false)
        this.setDialogAppInstall(false)
      }else{
        this.setOkURL(response.message)
        this.setDialogPRok(true)
        this.setDialogPR(false)
        this.setDialogAppInstall(false)
      }
    },

    
    // Mutatios
    setDialogPR(value) {
      this.dialogPR = value
    },
    setDialogAppInstall(value) {
      this.dialogAppInstall = value
    },
    setDialogPRok(value) {
      this.dialogPRok = value;
    },
    setDialogPRfail(value) {
      this.dialogPRfail = value;
    },
    setFailMessage(value) {
      this.failMessage = value;
    },
    setOkURL(value) {
      this.okURL = value;
    },
    
  }



})