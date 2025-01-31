// Si tienes errores mira las URL si tiene /api
import { defineStore } from 'pinia';
import { useNuxtApp } from 'nuxt/app';

export const useResultStore = defineStore('result', {
  state: () => ({
    _FAIRIndicatorsTool: null,
	  _FAIRIndicatorsLogs: null,
	  _FAIRIndicatorsControl: null,
	  _LoadingEvaluation: false,
  }),

  getters: {
    getFAIRIndicatorsTool: (state) => state._FAIRIndicatorsTool,
    getFAIRIndicatorsLogs: (state) => state._FAIRIndicatorsLogs,
    getFAIRIndicatorsControl: (state) => state._FAIRIndicatorsControl,
    getLoadingEvaluation: (state) => state._LoadingEvaluation
  },

  actions: {
    setFAIRIndicatorsToolResult(payload){
      const result = payload.result;
      const logs = payload.logs;

      this._FAIRIndicatorsTool = result;
      this._FAIRIndicatorsLogs = logs;
    },
    setFAIRIndicatorsControl(result){
      this._FAIRIndicatorsControl = result;
    },
    setLoading(payload){
      this._LoadingEvaluation = payload.evaluation;
    },

    async GET_URL(URL){
      const { $observatory } = useNuxtApp();
      try {
        const result = await $observatory(URL, {
          method: "GET",
        });
        console.log('results.js: ',result)
        return result;
      } catch (error) {
        console.error('Error fetching data from URL:', error);
        throw error;
      }
    },

    async POST_DATA(payload) {
      const { $observatory } = useNuxtApp(); // Acceso a NuxtApp para obtener $observatory
      try {
        const result = await $observatory(payload.request_url, {
          method: "POST", // Método POST
          body: payload.data,
          headers: {
            "Content-Type": "application/json",
          },
        });
        return result; // Devuelve la respuesta
      } catch (error) {
        console.error("Error in POST_DATA:", error);
        throw error; // Maneja el error de la solicitud
      }
    },

    async POST_EV_ID(payload) {
      const { $observatory } = useNuxtApp(); // Acceso a NuxtApp para obtener $observatory
      try {
        const result = await $observatory(payload.url,{
          method: "POST", // Método POST
          body: payload.data,
          headers: {
            "Content-Type": "application/json",
          },
        });
        return result; // Devuelve la respuesta
      } catch (error) {
        console.error("Error in POST_EV_ID:", error);
        throw error; // Maneja el error de la solicitud
      }
    },

    async evaluateToolById(toolId){
		  const URL = '/api/fair/evaluateId';
      this.setLoading({ evaluation: true })
      
      const data = {id: toolId}

      const result = await this.POST_EV_ID(
        { url: URL, data }
      )

      this.setFAIRIndicatorsToolResult(result.data)
  		console.debug(result);
      this.setLoading({ evaluation: false })
    },

    async evaluateToolByMetadata(toolMetadata){
      const URL = '/api/fair/evaluate';
      this.setLoading({ evaluation: true })

      const payload = {
        request_url: URL,
        data: {
          tool_metadata: toolMetadata,
        },
      };

      const result = await this.POST_DATA(payload);
  		console.debug(result);

      this.setFAIRIndicatorsToolResult(result.data);
      this.setLoading({ evaluation: false })
    },

    async getFAIRIndicatorsControlScores(){
		  const URL = '/api/stats/tools/fair_scores_means';

      const result = await this.GET_URL(URL);
      
      this.setFAIRIndicatorsControl(result)
    },
  }
})