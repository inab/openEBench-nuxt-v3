// Si tienes errores mira las URL si tiene /api
import { defineStore } from 'pinia';
import { useNuxtApp } from 'nuxt/app';

export const useResultStore = defineStore('result', {
  state: () => ({
    fAIRIndicatorsTool: null,
	  fAIRIndicatorsLogs: null,
	  fAIRIndicatorsControl: null,
	  loadingEvaluation: false,
  }),

  getters: {
    getFAIRIndicatorsTool: (state) => state.fAIRIndicatorsTool,
    getFAIRIndicatorsLogs: (state) => state.fAIRIndicatorsLogs,
    getFAIRIndicatorsControl: (state) => state.fAIRIndicatorsControl,
    getLoadingEvaluation: (state) => state.loadingEvaluation
  },

  actions: {
    setFAIRIndicatorsToolResult(payload){
      const result = payload.result;
      const logs = payload.logs;

      this.fAIRIndicatorsTool = result;
      this.fAIRIndicatorsLogs = logs;
    },
    setFAIRIndicatorsControl(result){
      this.fAIRIndicatorsControl = result;
    },
    setLoading(payload){
      this.loadingEvaluation = payload.evaluation;
    },

    async GET_URL(URL){
      const { $observatory } = useNuxtApp();
      try {
        const result = await $observatory(URL, {
          method: "GET",
        });
        // console.log('results.js: ',result)
        return result;
      } catch (error) {
        console.error('Error fetching data from URL:', error);
        throw error;
      }
    },

    async POST_DATA(payload) {
      const { $observatory } = useNuxtApp(); // Acceso a NuxtApp para obtener $observatory
      try {
        
        // Utilidad para limpiar input/output si uri está vacío
        const cleanEmptyUriTerms = (fieldName) => {
          const field = payload.data.tool_metadata[fieldName];
          if (Array.isArray(field)) {
            payload.data.tool_metadata[fieldName] = field.map((item) => {
              if (item.term && (!item.term.uri || item.term.uri.trim() === '')) {
                const { uri, ...rest } = item.term;
                return {
                  ...item,
                  term: { ...rest } // uri excluida
                };
              }
              return item; // no se modifica si uri tiene contenido
            });
          }
        };
        

        cleanEmptyUriTerms('input');
        cleanEmptyUriTerms('output');
        
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

      console.log(result)
      console.log(result.data)

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

      console.log(toolMetadata)
      console.log(payload)

      const result = await this.POST_DATA(payload);

      console.log(result)
  		console.debug(result);

      this.setFAIRIndicatorsToolResult(result);
      this.setLoading({ evaluation: false })
    },

    async getFAIRIndicatorsControlScores(){
		  const URL = '/api/stats/tools/fair_scores_means';

      const result = await this.GET_URL(URL);
      
      this.setFAIRIndicatorsControl(result)
    },
  }
})