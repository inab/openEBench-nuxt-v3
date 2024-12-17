<template>
  <div class="metrics">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">
      <div v-if="status == 'authenticated'">
        <h2>Metrics</h2>
        <div class="metrics__body">
          <div class="dashboard__description text-gray-500">
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The
            point of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here,
            content here', making it look like readable English.
          </div>
          <div class="dashboard-tabs">
            <MetricsList 
              :metric-rows="metricsList"
              :is-searching="isSearchingMetrics"
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
import { ref, onMounted, computed } from "vue";
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
const isSearchingMetrics = ref(false);
const runtimeConfig = useRuntimeConfig();
const metricsList = ref<Metric[]>([]);
const token: string = data?.value.accessToken;

await fetchMetrics(token);
async function fetchMetrics(token: string): Promise<Metric[]> {
  isSearchingMetrics.value = true;
  try {
    const response = await fetch(`${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Metrics`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const data = await response.json();
    metricsList.value = data;
    isSearchingMetrics.value = false;
    return data;
  } catch (error) {
    isSearchingMetrics.value = false;
    return [];
  }
}

const routeArray: Array = [
  { label: "Dashboard", isActualRoute: false, route: "/dashboard" },
  { label: "Metrics", isActualRoute: true },
];
</script>
