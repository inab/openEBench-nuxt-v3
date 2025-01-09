<template>
  <div class="add-metrics-box">
    <div class="add-metrics-box__header">
      <h4 class="add-metrics-box__header__title">Tools</h4>
    </div>
    <div class="add-metrics-box__contents">
      <div
        v-for="(selectedTool, index) in selectedTools"
        :key="index"
        class="add-metrics-box__contents__items"
      >
        <div class="add-metrics-box__contents__items__item">
          <label>ID: </label>
          <label>{{ selectedTool._id }}</label>
        </div>
        <div class="add-metrics-box__contents__items__item">
          <label>Description: </label>
          <label>{{ selectedTool.description }}</label>
        </div>
        <div class="add-metrics-box__contents__items__item">
          <label>Name: </label>
          <label>{{ selectedTool.name }}</label>
        </div>
        <div class="add-metrics-box__contents__items__item">
          <label>Community: </label>

          <div
            v-for="(community, index) in selectedTool.community_ids"
            :key="index"
            class="w-100"
          >
            <label>{{ community }}</label>
            <button class="btn-custom-badget text-sm">
              <NuxtLink
                target="_blank"
                :to="`/benchmarking/${community}`"
                class="text-primaryOeb-950"
              >
                <font-awesome-icon :icon="['far', 'eye']" />
                Visit
              </NuxtLink>
            </button>
          </div>
        </div>
        <div class="add-metrics-box__contents__items__item">
          <label>Original ID: </label>
          <label>{{ selectedTool.orig_id }}</label>
        </div>
        <div class="add-metrics-box__contents__items__item">
          <label>Registry Tool ID: </label>
          <label>{{ selectedTool.registry_tool_id }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tool } from "@/types/challenge_metric";

defineProps<{
  selectedTools: Tool[];
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
