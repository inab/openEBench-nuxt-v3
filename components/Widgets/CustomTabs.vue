<template>
  <div class="custom-tabs">
    <div class="custom-tabs__header">
      <div class="custom-tabs__header__wrapper">
        <ul class="custom-tabs__header__wrapper__list">
          <li
            v-for="(item, index) in props.data"
            :key="index"
            class="custom-tabs-item"
          >
            <button
              class="custom-tabs-button"
              :class="{
                'custom-tabs-button--active': item.key == selected.key,
              }"
              @click="selected = item"
            >
              {{ item.label ? item.label : item.name }}
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div class="custom-tabs-content mt-4">
      <div
        v-for="(item, index) in props.data"
        :key="index"
        :class="[item.key == selected.key ? 'visible' : 'no-visible']"
      >
        <div>
          <LoaderChartWidgets :data="item" :metrics="props.metrics" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import LoaderChartWidgets from "@/components/Widgets/LoaderChartWidgets.vue";
import { ref } from "vue";

const props = defineProps<{
  data: any;
  metrics: any[];
}>();

const selected = ref(props.data[0] ? props.data[0] : null);
</script>

<style lang="scss" scoped>
.custom-tabs {
  .no-visible {
    display: none;
  }

  .custom-tabs__header {
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    display: flex;
    border-radius: 8px;
  }

  .custom-tabs__header__wrapper {
    contain: content;
    display: flex;
    flex: 1 1 auto;
    overflow: hidden;
  }
  .custom-tabs__header__wrapper__list {
    white-space: normal;
    flex-wrap: wrap;
    max-width: 100%;
    width: 100%;
    display: flex;
    padding: 0;
    margin-bottom: 0;
  }

  .custom-tabs__header__wrapper__list li {
    margin: 4px;
  }

  .custom-tabs__header__wrapper__list li .custom-tabs-button {
    border-radius: 6px;
    color: theme("colors.gray.500");
    cursor: pointer;
    font-size: 16px;
    font-weight: 400;
    padding: 8px 16px;
    text-align: center;
    text-decoration: none;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    background-color: rgb(241, 245, 249, 0.5);
  }

  .custom-tabs__header__wrapper__list
    li
    .custom-tabs-button.custom-tabs-button--active {
    background-color: theme("colors.secondaryOeb.100");
    color: theme("colors.secondaryOeb.500");
  }
}
</style>
