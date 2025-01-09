<template>
  <div class="add-metrics-box">
    <div class="add-metrics-box__header">
      <h4 class="add-metrics-box__header__title">Visualization</h4>
    </div>
    <div class="add-metrics-box__contents">
      <div class="add-metrics-box__contents__items__item">
        <label>{{ selectedVisualization.name }}</label>
      </div>
      <div class="add-metrics-box__contents__items__item">
        <img heigth="300px" :src="selectedVisualization.image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChartDefault } from "@/types/visualizations";

defineProps<{
  selectedVisualization: ChartDefault;
}>();
</script>

<style lang="scss" scoped>
.add-metrics-box {
  &__header__title {
    font-size: 1.2rem;
    font-weight: 600;
    color: theme("colors.primary.500");
    border-bottom: 1px solid theme("colors.gray.200");
    margin-bottom: 20px;
  }
}
</style>
