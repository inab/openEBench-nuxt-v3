<template>
  <div class="challenge-metric">
    <UAccordion color="primary" variant="soft" size="sm" :items="item">
      <template #header="{ item }">
        <div class="flex flex-col">
          <span class="font-bold">Metric: {{ item.metrics_id }}</span>
          <span class="text-sm">Tool: {{ item.tool_id }}</span>
        </div>
      </template>
      <template #content="{ item }">
        <ChallengeMetricContent
          :is-loading-data="isLoadingData"
          :metric-id="metricData.metrics_id || ''"
          :metric-tool="metricData.tool_id || ''"
        />
      </template>
    </UAccordion>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import type { ChallengeCommonMetric } from "@/types/challenge_metric";
import ChallengeMetricContent from "@/components/Dashboard/entries/events/challenges/ChallengeMetricContent.vue";

const props = defineProps<{
  isLoadingData: boolean;
  metric: ChallengeCommonMetric;
}>();

const metricData = computed(() => {
  return props.metric;
});

const item = ref([
  {
    label: `Metric:${metricData.value.metrics_id} | Tool:${metricData.value.tool_id}`,
    content: "Metric",
    icon: "i-heroicons-information-circle",
    defaultOpen: false,
    slot: "content",
    metrics_id: metricData.value.metrics_id,
    tool_id: metricData.value.tool_id,
  },
]);
</script>
