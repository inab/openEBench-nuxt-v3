<template>
  <div ref="plotContainer"></div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, watch, nextTick } from "vue";
import Plotly from "plotly.js-dist";
import { activeTabIndex } from "@/components/Common/state.js";

const props = defineProps<{
  data: Record<string, number>;
  color?: string;
}>();

const plotContainer = ref<HTMLElement | null>(null);

const config: Partial<Plotly.Config> = {
  responsive: true,
  displayModeBar: false,
};

const plotChart = () => {
  if (!props.data || Object.keys(props.data).length === 0) {
    console.warn("No data to plot.");
    return;
  }

  // Sort descending
  const sorted = Object.entries(props.data).sort(
    ([, a], [, b]) => b - a
  );

  // Top 15 (reversed so the largest appears at the top)
  const top15 = sorted.slice(0, 15).reverse();

  const labels = top15.map(([label]) => label);
  const counts = top15.map(([, count]) => count);

  const trace: Partial<Plotly.PlotData> = {
    x: counts,
    y: labels,
    type: "bar",
    orientation: "h",
    marker: {
      color: props.color ?? "cornflowerblue",
    },
    width: 0.6,
    hovertemplate: "<b>%{y}</b><br>Count: %{x}<extra></extra>",
    showlegend: false,
  };

  const layout: Partial<Plotly.Layout> = {
    xaxis: {
      title: "Count",
      showticklabels: false,
    },

    yaxis: {
      automargin: true,
      ticksuffix: "  ",
    },

    margin: {
      l: 100,
      r: 20,
      t: 30,
      b: 20,
    },

    height: 50 + labels.length * 40,

    hoverlabel: {
      bgcolor: "#FFF",
    },
  };

  if (!plotContainer.value) return;

  Plotly.newPlot(
    plotContainer.value,
    [trace],
    layout,
    config
  );
};

onMounted(() => {
  plotChart();
});

watch(activeTabIndex, async () => {
  await nextTick();

  if (plotContainer.value) {
    Plotly.relayout(plotContainer.value, {
      autosize: true,
    });
  }
});

</script>