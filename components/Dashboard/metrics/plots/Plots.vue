<template>
  <UCard
    class="custom-card-box"
    :ui="{
      body: {
        base: '',
        background: '',
        padding: 'p-4 sm:p-6',
      },
      header: {
        base: '',
        background: '',
        padding: 'px-4 py-2 sm:p-6',
      },
    }"
  >
    <template #header>
      <div class="card-title card-header">
        {{ plotName }}
      </div>
    </template>
    <div v-if="typeSelected === 'bar-plot'">
      <PlotBar />
    </div>
    <div v-if="typeSelected === '2D-plot'">
      <PlotScatter />
    </div>
    <div v-if="typeSelected === 'box-plot'">
      <PlotBox />
    </div>
    <div v-if="typeSelected === 'radar-plot'">
      <PlotRadar />
    </div>
    <div v-if="typeSelected === 'line-plot'">
      <PlotLine />
    </div>

    <template #footer>
      <Placeholder class="h-8" />
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";

import PlotBar from "@/components/Dashboard/metrics/plots/demo/PlotBar.vue";
import PlotScatter from "@/components/Dashboard/metrics/plots/demo/PlotScatter.vue";
import PlotBox from "@/components/Dashboard/metrics/plots/demo/PlotBox.vue";
import PlotRadar from "@/components/Dashboard/metrics/plots/demo/PlotRadar.vue";
import PlotLine from "@/components/Dashboard/metrics/plots/demo/PlotLine.vue";

const props = defineProps<{
  typeSelected: string;
}>();

const plotName = computed(() => {
  if (props.typeSelected === "bar-plot") {
    return "Bar Plot";
  } else if (props.typeSelected === "2D-plot") {
    return "Scatter Plot";
  } else if (props.typeSelected === "box-plot") {
    return "Box Plot";
  } else if (props.typeSelected === "radar-plot") {
    return "Radar Plot";
  } else if (props.typeSelected === "line-plot") {
    return "Line Plot";
  }
  return "Plot";
});
</script>

<style lang="scss">
.card-header {
  font-size: 20px;
  font-weight: 600;
  color: theme("colors.primary.500");
}
.custom-card-box {
  box-shadow:
    rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px !important;
}
</style>
