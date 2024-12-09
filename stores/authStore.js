import { defineStore } from "pinia";

export const useAuthStore = defineStore({
  id: "storeAuth",
  state: () => {
    return {
      authenticated: false,
      user: {},
      test: false
    }
  },
  persist: true,
  getters: {},
  actions: {
    testAction() {
      this.test = !this.test;
    }
  }
});