<template>
  <div class="challenge-metrics">
    <CustomSubtitle text="Challenge Metric" />
    <div class="challenge-metrics-categories">
      <div
        v-for="(metric, index) in metrics_by_categories"
        :key="index"
        class="challenge-metrics-categories__category"
      >
        <UCard
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
              <UButton
                icon="i-heroicons-plus-solid"
                class=""
                label="Add Metric"
                @click="isMetricOpen = true"
              >
              </UButton>
            </div>
          </template>
          <div class="challenge-metrics-categories__category__description">
            {{ metric[0].description }}
          </div>

          <div class="challenge-metrics-categories__category__metrics">
            <div
              v-for="(m, i) in metric[0].metrics"
              :key="i"
              class="challenge-metrics-categories__category__metric"
            >
              <CommunityMetric :metric="m" :is-loading-data="isLoadingData" />
            </div>
          </div>
        </UCard>
      </div>
    </div>
    <UModal v-model="isMetricOpen" prevent-close>
      <UCard
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
            padding: 'p-4 sm:p-6',
          },
          header: {
            base: '',
            background: '',
            padding: 'px-4 py-2 sm:p-6',
          },
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div
              class="text-primaryOeb-500 text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Add new metric to challenge
            </div>
            <UButton
              color="bg-slate-300"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class=""
              @click="isOpen = false"
            />
          </div>
          <div class="challenge-metric-modal text-neutral-500">
            <div class="challenge-metric-modal-form">
              <div class="challenge-metric-modal-form__input">
                <UInput
                  label="Metric Name"
                  placeholder="Enter metric name"
                  v-model="metricName"
                />
              </div>
            </div>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref } from "vue";
import CommunityMetric from "@/components/Dashboard/entries/events/challenges/ChallengeMetric.vue";
import CustomSubtitle from "@/components/Common/CustomSubtitle.vue";

const props = defineProps<{
  metricData: [];
  isLoadingData: boolean;
}>();

const isMetricOpen = ref(false);

const metrics_by_categories = computed(() => {
  return props.metricData.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
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
</style>
