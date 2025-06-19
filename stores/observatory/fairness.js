// stores/fairness.js
import { defineStore } from "pinia";
import { useObservatory } from '@/stores/observatory/index.js';
import { useAsyncData } from 'nuxt/app';
import { reactive } from 'vue';

const BASE_URL = '/api/stats/tools/';
const labels = {
	F: {
		F1: 'F1. Identity <br> uniqueness',
		F2: 'F2. Existence <br> of metadata',
		F3: 'F3. Discoverability',
	},
	A: {
		A1: 'A1. Availability of<br>working version',
		A3: 'A3. Unrestricted Access',
	},
	I: {
		I1: 'I1. Data format <br> standards and<br>practices',
		I2: 'I2. Software <br> integration',
		I3: 'I3. Dependencies <br> availability',
	},
	R: {
		R1: 'R1. Usage <br> documentation',
		R2: 'R2. License',
		R3: 'R3. Recognition <br> and governance',
		R4: 'R4. Versioning and<br>  historical traceability',
	},
};
export const useFairness = defineStore("fairness", {
  state: () => ({
    fairScores: {
      F: { fair_scores: [], id: 'F', labels: [] },
      A: { fair_scores: [], id: 'A', labels: [] },
      I: { fair_scores: [], id: 'I', labels: [] },
      R: { fair_scores: [], id: 'R', labels: [] },
    },
    controlFAIRscores: {
      F: { fair_scores: [], id: 'F', labels: [] },
      A: { fair_scores: [], id: 'A', labels: [] },
      I: { fair_scores: [], id: 'I', labels: [] },
      R: { fair_scores: [], id: 'R', labels: [] },
    },
    currentCollection: 'tools',
    unLoaded: {
      FAIRscores: true,
      controlFAIRscores: true,
    },
  }),

  getters: {
    FAIRscores: (state) => state.fairScores,
    ControlFAIRscores: (state) => state.controlFAIRscores,
    getCurrentCollection: (state) => state.currentCollection,
  },

  actions: {
    setLoaded(loading) {
      this.unLoaded[Object.keys(loading)[0]] = loading[Object.keys(loading)[0]];
    },

    setFAIRscores(fairscores) {
      this.fairScores = fairscores
    },

    changeCurrentCollection(collectionId) {
      this.currentCollection = collectionId;
    },

    setControlFAIRscores(controlFAIRscores) {
      this.controlFAIRscores = controlFAIRscores
    },

    async getFAIRscores() {
      const { $observatory } = useNuxtApp();
      const observatoryStore = useObservatory();
      const URL = `${BASE_URL}fair_scores_summary?collection=${observatoryStore.currentCollection}`;

      try {
        this.setLoaded({ FAIRscores: true });
        const { data: FAIRscoresData } = await useAsyncData('FAIRscores', () => 
          $observatory(URL, { method: "GET" })
        );

        if (!FAIRscoresData || !FAIRscoresData.value) {
          console.log('FAIRscores no data available');
          this.setLoaded({ FAIRscores: true });
          return;
        }

    		console.log('FAIRscores')
    		console.log(FAIRscoresData.value.data)


        const results = {
          F: { fair_scores: FAIRscoresData.value.data.F, labels: labels.F, id: 'F' },
          A: { fair_scores: FAIRscoresData.value.data.A, labels: labels.A, id: 'A' },
          I: { fair_scores: FAIRscoresData.value.data.I, labels: labels.I, id: 'I' },
          R: { fair_scores: FAIRscoresData.value.data.R, labels: labels.R, id: 'R' },
        };

        this.setFAIRscores(results);
        this.setLoaded({ FAIRscores: false });

      } catch (error) {
        console.error('Error fetching FAIRscores: ', error);
        this.setLoaded({ FAIRscores: true });
      }
    },

    async getControlFAIRscores() {
      const { $observatory } = useNuxtApp();
      const URL = `${BASE_URL}fair_scores_summary?collection=tools`;

      try {
        this.setLoaded({ controlFAIRscores: true });
        const { data: controlFAIRscoresData } = await useAsyncData('controlFAIRscores', () => 
          $observatory(URL, { method: "GET" })
        );

        if (!controlFAIRscoresData || !controlFAIRscoresData.value) {
          console.log('Control FAIRscores no data available');
          this.setLoaded({ controlFAIRscores: true });
          return;
        }

        const results = {
          F: { fair_scores: controlFAIRscoresData.value.data.F, labels: labels.F, id: 'F' },
          A: { fair_scores: controlFAIRscoresData.value.data.A, labels: labels.A, id: 'A' },
          I: { fair_scores: controlFAIRscoresData.value.data.I, labels: labels.I, id: 'I' },
          R: { fair_scores: controlFAIRscoresData.value.data.R, labels: labels.R, id: 'R' },
        };

        this.setControlFAIRscores(results);
        this.setLoaded({ controlFAIRscores: false });

      } catch (error) {
        console.error('Error fetching controlFAIRscores: ', error);
        this.setLoaded({ controlFAIRscores: true });
      }
    }
  }
});
