<template>
  <UCard>
    <template #header>
      <div class="card-title">
        {{ plotName }}
      </div>
    </template>

    <div v-if="typeSelected === 'bar-plot'">
      <PloBar />
    </div>

    <template #footer>
      <Placeholder class="h-8" />
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";

import PloBar from "@/components/Dashboard/metrics/plots/demo/PlotBar.vue";

const props = defineProps<{
  typeSelected: string;
}>();

const plotName = computed(() => {
  if (props.typeSelected === "bar-plot") {
    return "Bar Plot";
  }
  return "Plot";
});
</script>
