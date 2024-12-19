<template>
  <div class="add-visualization-table">
    <div class="add-visualization-table__body">
      <div class="add-visualization-table__body__title">
        Currently we have 4 visualizations available for you to use.
      </div>
      <div class="add-visualization-table__body__content">

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  selectedMetrics: Metric[];
}>();

console.log(props.selectedMetrics); 

const recomendedVisualization = computed(() => {
  
})
</script>