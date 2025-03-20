<template>
  <div class="add-metrics-box">
    <div class="add-metrics-box__header">
      <h4 class="add-metrics-box__header__title">Metrics</h4>
    </div>
    <div class="add-metrics-box__contents">
      <UAccordion :items="items">
        <template #body_custom="{ item }">
          <div class="add-metrics-box__contents__items__item">
            <label class="title-label">ID: </label>
            <label>{{ item.content._id }}</label>
          </div>
          <div class="add-metrics-box__contents__items__item">
            <label class="title-label">Title: </label>
            <label>{{ item.content.title }}</label>
          </div>
          <div class="add-metrics-box__contents__items__item">
            <label class="title-label">Description: </label>
            <label>{{ item.content.description }}</label>
          </div>
          <div class="add-metrics-box__contents__items__item">
            <label class="title-label">Formal definition: </label>
            <label>{{ item.content.formal_definition }}</label>
          </div>
          <div class="add-metrics-box__contents__items__item">
            <label class="title-label">Original ID: </label>
            <label>{{ item.content.orig_id }}</label>
          </div>
        </template>
      </UAccordion>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Metric } from "@/types/challenge_metric";

const props = defineProps<{
  selectedMetrics: Metric[];
}>();

const items = computed(() => {
  return props.selectedMetrics.map((item) => {
    return {
      label: "Metric: " + item._id,
      icon: "i-lucide-box",
      slot: "body_custom",
      content: item,
    };
  });
});
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
  &__contents__items {
    &:not(:last-child) {
      border-bottom: 1px solid theme("colors.gray.200");
    }
    &:not(:first-child) {
      padding-top: 10px;
    }
    &__item {
      padding-bottom: 20px;
    }
  }
}
.title-label {
  font-weight: bold;
  padding-right: 5px;
}
</style>
