<template>
  <div class="challenge-metric">
    Challenge Metric

    {{ metricData}}
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  metricData: [],
  isLoadingData: boolean
}>();
</script>
