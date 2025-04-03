<template>
  <div class="add-metrics-box">
    <div class="add-metrics-box__header">
      <h4 class="add-metrics-box__header__title">Tools</h4>
    </div>
    <div class="add-metrics-box__contents">
      <UAccordion :items="items">
        <template #body_custom="{ item }">
          <div class="add-metrics-box__contents__items__item">
            <label class="title-label">ID: </label>
            <label>{{ item.content._id }}</label>
          </div>
          <div class="add-metrics-box__contents__items__item">
            <label class="title-label">Description: </label>
            <label>{{ item.content.description }}</label>
          </div>
          <div class="add-metrics-box__contents__items__item">
            <label class="title-label">Name: </label>
            <label>{{ item.content.name }}</label>
          </div>
          <div class="add-metrics-box__contents__items__item">
            <label class="title-label">Original ID: </label>
            <label>{{ item.content.orig_id }}</label>
          </div>
          <div class="add-metrics-box__contents__items__item">
            <label class="title-label">Registry Tool ID: </label>
            <label>{{ item.content.registry_tool_id }}</label>
          </div>
          <div class="add-metrics-box__contents__items__item">
            <label class="title-label">Community: </label>
            <table class="w-100 table table-fixed">
              <tbody>
                <tr
                  v-for="(community, index) in item.content.community_ids"
                  :key="index"
                  class="w-100"
                >
                  <td>
                    <label class="title-label">{{ community }}</label>
                  </td>
                  <td class="text-center">
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
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </UAccordion>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Tool } from "@/types/challenge_metric";

const props = defineProps<{
  selectedTools: Tool[];
}>();

const items = computed(() => {
  return props.selectedTools.map((item) => {
    return {
      label: "Tool: " + item._id,
      icon: "i-lucide-pocket-knife",
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
