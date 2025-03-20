import { defineStore } from "pinia";
import type { Metric } from "@/types/challenge_metric";
import type { Challenge } from "@/types/challenge";

const runtimeConfig = useRuntimeConfig();

export const useMetrics = defineStore("metrics", {
  state: () => ({
    metricsData: [] as Metric[],
    challengesData: [] as Challenge[],
  }),

  getters: {
    getMetricsData: (state) => state.metricsData,
    getChallengesData: (state) => state.challengesData,
  },

  actions: {
    setMetricsData(data: Metric[]) {
      this.metricsData = data;
    },

    setChallengesData(data: Challenge[]) {
      this.challengesData = data;
    },

    async fetchMetricsData(token: string) {
      const response = await fetch(
        `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Metrics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          method: "GET",
        },
      );

      const data = await response.json();
      if (!data) {
        [];
      }

      const dataFiltered = data.filter((metric: Metric) => {
        return metric.representation_hints;
      });

      dataFiltered.forEach((metric: Metric) => {
        metric.title = metric._id + " - " + metric.name;
      });

      this.setMetricsData(dataFiltered);
      this.fetchChallengesData(token);

      return data;
    },

    async fetchChallengesData(token: string) {
      const response = await fetch(
        `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Challenge`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          method: "GET",
        },
      );

      const data = await response.json();
      if (!data) {
        [];
      }

      data.forEach((challenge: Challenge) => {
        challenge.name = challenge._id + " - " + challenge.name;
      });

      this.setChallengesData(data);

      return data;
    }
  },
});
