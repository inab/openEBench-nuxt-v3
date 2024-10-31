import { defineStore } from "pinia";
import type { Metric } from "@/types/challenge_metric";

const runtimeConfig = useRuntimeConfig();

export const useMetrics = defineStore("metrics", {
  state: () => ({
    metricsData: [] as Metric[],
  }),

  getters: {
    getMetricsData: (state) => state.metricsData,
  },

  actions: {
    setMetricsData(data: Metric[]) {
      this.metricsData = data;
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

      data.forEach((metric: Metric) => {
        metric.title = metric._id + " - " + metric.title;
      });

      this.setMetricsData(data);

      return data;
    },
  },
});
