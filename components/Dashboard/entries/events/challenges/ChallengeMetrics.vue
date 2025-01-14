<template>
  <div class="challenge-metrics">
    <CustomSubtitle text="Challenge Metric" />
    <div class="d-flex justify-end pt-2">
      <NuxtLink class="btn-primary hover_effect" :to="`${to}/metrics/add`">
        <UIcon name="i-heroicons-plus" />
        Add aggregation metric
      </NuxtLink>
    </div>
    <div class="challenge-metrics-categories">
      <div
        v-for="(metric, index) in metrics_by_categories"
        :key="index"
        class="challenge-metrics-categories__category"
      >
        <UCard
          class="shadowless-card"
          :ui="{
            base: '',
            background: 'bg-white dark:bg-gray-900',
            divide: 'divide-y divide-gray-200 dark:divide-gray-800',
            ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
            rounded: 'rounded-lg',
            shadow: 'shadow',
            body: {
              base: '',
              background: '',
              padding: 'px-4 py-2 sm:p-6',
            },
            header: {
              base: '',
              background: '',
              padding: 'px-4 py-2 sm:p-6',
            },
          }"
        >
          <template #header>
            <div
              class="challenge-metrics-categories__category__name flex justify-between"
            >
              <div
                class="challenge-metrics-categories__category__name__title flex items-end text-primaryOeb-500"
              >
                Metric Type: {{ index }}
              </div>
            </div>
          </template>
          <div class="challenge-metrics-categories__category__description">
            {{ metric[0].description }}
          </div>
          <div class="challenge-metrics-categories__category__metrics row">
            <div
              v-for="(m, i) in metric[0].metrics"
              :key="i"
              class="col-4 challenge-metrics-categories__category__metric"
            >
              <ChallengeMetric :metric="m" :is-loading-data="isLoadingData" />
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref } from "vue";
import ChallengeMetric from "@/components/Dashboard/entries/events/challenges/ChallengeMetric.vue";
import CustomSubtitle from "@/components/Common/CustomSubtitle.vue";
import CustomBorder from "@/components/Common/CustomBorder.vue";
import CustomSearcherLoader from "@/components/Common/CustomSearcherLoader.vue";
import { useMetrics } from "@/stores/metrics.ts";
import type { Metric } from "@/types/challenge_metric";
import metricsSearcher from "@/utils/metricsMatch";

const props = defineProps<{
  metricData: [];
  isLoadingData: boolean;
  challengeId: string;
}>();

const columnsMetricsSearcher = [
  {
    key: "challenge",
    label: "Name",
  },
  {
    key: "view",
    label: "View",
  },
  {
    key: "title",
    label: "Title",
  },
];

const { data } = useAuth();
const metricsStore = useMetrics();
const isSearchingMetrics = ref(false);
const isMetricOpen = ref(false);
const token: string = data?.value.accessToken;
const selected = ref(null);
const isSearchingSelectedMetric = ref(false);
const selectedMetricResults = ref([]);
const loadingInput = ref(false);
const showAdvancedSearch = ref(false);
const to = props.challengeId;

const metrics_by_categories = computed(() => {
  return props.metricData.reduce((acc, metric) => {
    if (metric.category === "aggregation") {
      if (!acc[metric.category]) {
        acc[metric.category] = [];
      }
      acc[metric.category].push(metric);
    }
    return acc;
  }, {});
});
</script>

<style scoped lang="scss">
.challenge-metrics-categories {
  padding-bottom: 25px;
  & > :first-child {
    margin-top: 20px;
  }
  &__category {
    margin-bottom: 25px;
    &__description {
      font-size: 15px;
      margin-bottom: 10px;
      text-transform: capitalize;
    }
    &__metrics {
      &__metric {
        margin-bottom: 10px;
      }
    }
    &__name {
      font-size: 15px;
      span {
        font-weight: bold;
      }
      &__title {
        font-size: 15px;
      }
      margin-bottom: 10px;
    }
  }
}
.input-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  .input-group__prepend {
    flex: 6;
  }
  .input-group-append {
    flex: 1;
    display: flex;
    justify-content: end;
  }
  button {
    padding: 0.2rem 1rem;
  }
}
.challenge-metric-modal {
  min-width: 600px;
  min-height: 300px;
  display: flex;
  align-items: center;
  &__form {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
}
</style>
<style>
.modal-challenge-wrapper {
  max-width: 700px;
  min-height: 350px;
}
.hover_effect {
  padding: 5px 10px;
  font-size: 14px;
  text-decoration: none;
  margin-bottom: 5px;
}
.shadowless-card {
  box-shadow:
    rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px !important;
  display: flex;
  flex-direction: column;
}
</style>
