<template>
  <div>
    <FormatsPlot :inputData="formats.inputData" :outputData="formats.outputData" :sameDifferentData="formats.sameDifferentData" />
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useTrends } from '../../../../stores/observatory/trends.js'
import FormatsPlot from './FormatsPlot.vue'

const trends = useTrends()

onMounted(() => {
  trends.getFormats()
})

const formats = computed(() => trends.Formats)
</script>

<script>
export default {
  name: 'FormatsMain'
};
</script>