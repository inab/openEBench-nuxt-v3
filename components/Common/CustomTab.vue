<template>
  <div class="common-tab">
    <div class="tab-header  rounded-lg items-center">
      <div
        v-for="item in itemsTab"
        :key="item.id"
        class="tab-item ease-out duration-200 transition-colors"
        :class="{ selected: selectTab == item.index }"
        @click="emit('change-selected', item.index)"
      >
        <span>
          <UIcon :name="item.icon" />
        </span>
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from "vue";

const props = defineProps<{
  items: Array;
  selected: string;
}>();

const selectTab = computed(() => props.selected);
const itemsTab = computed(() => props.items);
const emit = defineEmits(["change-selected"]);

if (props.selected) {
  selectTab.value = props.selected;
}

if (props.items) {
  itemsTab.value = props.items;
}

watchEffect(() => {
  selectTab.value = props.selected;
  itemsTab.value = props.items;
});
</script>

<style scoped lang="scss">
.common-tab {
  .tab-header {
    display: flex;
    justify-content: space-around;
    gap: 1rem;
    padding: 0.25rem;
    color: theme("colors.gray.500");
    border-radius: 0.5rem;
    font-size: 14px;
    /* border: 1px solid theme("colors.gray.200"); */
    background-color: theme("colors.gray.200");
    .tab-item {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
      height: 32px;
      span {
        font-size: 16px;
      }
    }
  }
  .tab-content {
    padding: 1rem 0;
  }
  .selected {
    color: white;
    background-color: theme("colors.secondaryOeb.400");
    border-radius: 0.5rem;
    span {
      color: white;
    }
  }
}
</style>
