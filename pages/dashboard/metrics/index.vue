<template>
  <div class="metrics">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">
      <div v-if="status == 'authenticated'">
        <div class="dashboard__header__title">
          <h2 class="text-primaryOeb-500">Metrics</h2>
        </div>
        <div class="metrics__body">
          <div class="dashboard__description text-gray-500">
            Communities in OpenEBench define standardized metrics to ensure fair
            and transparent comparisons during benchmarking events and
            challenges. These carefully selected metrics quantify specific
            aspects of software performance, providing objective measures for
            evaluating tool capabilities and driving innovation across diverse
            domains.
          </div>
          <div class="dashboard-tabs pt-4">
            <MetricsList
              :metric-rows="metricsList"
              :is-loading="isLoadingMetrics"
              :token="token"
            />
          </div>
        </div>
      </div>
      <div v-else class="">Not authenticated</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Metric } from "@/types/challenge_metric";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import MetricsList from "@/components/Dashboard/metrics/MetricsList.vue";

definePageMeta({
  middleware: "auth",
  auth: {
    authenticatedOnly: true,
    navigateUnauthenticatedTo: "/login-required",
  },
});

const userStore = useUser();
const { data, status } = useAuth();
const isLoadingMetrics = ref(false);
const runtimeConfig = useRuntimeConfig();
const metricsList = ref<Metric[]>([]);
const token: string = data?.value.accessToken;

await fetchMetrics(token);
async function fetchMetrics(token: string): Promise<Metric[]> {
  isLoadingMetrics.value = true;
  try {
    const response = await fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Metrics`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );
    const data = await response.json();
    metricsList.value = data;

    return data;
  } catch (error) {
    return [];
  } finally {
    isLoadingMetrics.value = false;
  }
}

const routeArray: Array = [
  { label: "Dashboard", isActualRoute: false, route: "/dashboard" },
  { label: "Metrics", isActualRoute: true },
];
</script>
