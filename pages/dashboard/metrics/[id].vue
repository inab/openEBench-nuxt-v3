<template>
  <div class="metric">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">
      <div v-if="status == 'authenticated'">
        <MetricEdit
          v-if="metricsData"
          :metric="metricsData"
          :is-searching-metric="isSearchingMetric"
        />
      </div>
      <div v-else class="">Not authenticated</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Metric } from "@/types/challenge_metric";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import MetricEdit from "@/components/Dashboard/metrics/MetricEdit.vue";

definePageMeta({
  middleware: "auth",
  auth: {
    authenticatedOnly: true,
    navigateUnauthenticatedTo: "/login-required",
  },
});

const { data, status } = useAuth();
const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const metricId: string = route.params.id;
const token: string = data?.value.accessToken;

const isSearchingMetric = ref<boolean>(false);
const metricsData = ref<Metric>() || "";

await fetchMetrics(token);
async function fetchMetrics(token: string): Promise<Metric[]> {
  isSearchingMetric.value = true;
  try {
    const response = await fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Metrics/${metricId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );
    const data = await response.json();
    metricsData.value = data;
    isSearchingMetric.value = false;
    return data;
  } catch (error) {
    isSearchingMetric.value = false;
    return [];
  }
}

const routeArray: Array = [
  { label: "Dashboard", isActualRoute: false, route: "/dashboard" },
  { label: "Metrics", isActualRoute: true },
];
</script>
