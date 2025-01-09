<template>
  <div class="metric">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">
      <div v-if="status == 'authenticated'">

      </div>
      <div v-else class="">Not authenticated</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Metric } from "@/types/challenge_metric";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";

definePageMeta({
  middleware: "auth",
  auth: {
    authenticatedOnly: true,
    navigateUnauthenticatedTo: "/login-required",
  },
});

const { data, status } = useAuth();
const runtimeConfig = useRuntimeConfig();


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
