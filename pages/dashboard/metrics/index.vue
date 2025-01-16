<template>
  <div class="metrics">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">
      <div v-if="status == 'authenticated'">
        <UAccordion :items="HEADER_ITEM">
          <template #item="{ item }">
            <div class="dashboard__header__title">
              <h2 class="text-primaryOeb-500">{{ item.label }}</h2>
            </div>
          </template>
          <template #default="{ item, open }">
            <UButton
              color="primary"
              variant="ghost"
              class="border-b border-slate-200 dark:border-gray-700 community-collapse-btn"
              :ui="{ rounded: 'rounded-none' }"
            >
              <div class="primary label-btn">
                <h2>{{ item.label }}</h2>
              </div>
              <template #trailing>
                <UIcon
                  name="i-heroicons-chevron-right-20-solid"
                  class="transform transition-transform duration-200"
                  :class="[open && 'rotate-90']"
                />
              </template>
            </UButton>
          </template>
          <template #metrics>
            <div class="accordion_metrics__body">
              <div class="dashboard__description text-gray-500">
                <div class="dashboard__description__image">
                  <img
                    src="assets/images/dashboard/22821946_Na_Dec_02.jpg"
                    alt="metrics"
                    class="metrics__body__img"
                  />
                </div>
                <div class="dashboard__description__text">
                  Communities in OpenEBench define standardized metrics to
                  ensure fair and transparent comparisons during benchmarking
                  events and challenges. These carefully selected metrics
                  quantify specific aspects of software performance, providing
                  objective measures for evaluating tool capabilities and
                  driving innovation across diverse domains.
                </div>
              </div>
            </div>
          </template>
        </UAccordion>
        <div class="metrics__body">
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

const HEADER_ITEM = [
  {
    label: "Metrics",
    defaultOpen: true,
    slot: "metrics",
  },
];

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

    data.sort((a: Metric, b: Metric) => {
      if (a._id < b._id) {
        return -1;
      }
      if (a._id > b._id) {
        return 1;
      }
      return 0;
    });

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

<style lang="scss" scoped>
.dashboard__description {
  display: flex;
  &__image {
    margin-right: 40px;
    img {
      max-height: 400px;
    }
  }
  &__text {
    font-size: 16px;
    line-height: 1.5;
  }
}

.community-collapse-btn {
  padding: 0;
  display: flex;
  justify-content: space-between;
  &:hover {
    background-color: white;
  }
  span {
    font-size: 30px;
  }
}
</style>
