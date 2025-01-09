<template>
  <div class="add-metrics-box">
    <div class="add-metrics-box__header">
      <h4 class="add-metrics-box__header__title">Metrics</h4>
    </div>
    <div class="add-metrics-box__contents">
      <div
        v-for="(selectedMetric, index) in selectedMetrics"
        :key="index"
        class="add-metrics-box__contents__items"
      >
        <div class="add-metrics-box__contents__items__item">
          <label>ID: </label>
          <label>{{ selectedMetric._id }}</label>
        </div>
        <div class="add-metrics-box__contents__items__item">
          <label>Title: </label>
          <label>{{ selectedMetric.title }}</label>
        </div>
        <div class="add-metrics-box__contents__items__item">
          <label>Description: </label>
          <label>{{ selectedMetric.description }}</label>
        </div>
        <div class="add-metrics-box__contents__items__item">
          <label>Formal definition: </label>
          <label>{{ selectedMetric.formal_definition }}</label>
        </div>
        <div class="add-metrics-box__contents__items__item">
          <label>Original ID: </label>
          <label>{{ selectedMetric.orig_id }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Metric } from "@/types/challenge_metric";

defineProps<{
  selectedMetrics: Metric[];
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
