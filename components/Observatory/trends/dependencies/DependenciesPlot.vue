<template>
  <div id="plot_dependencies"></div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, watch, nextTick } from "vue";
import Plotly from "plotly.js-dist";
import { activeTabIndex } from "@/components/Common/state.js";

const props = defineProps<{
  data: Record<string, number> | { name: string; count: number }[];
}>();

const config: Partial<Plotly.Config> = {
  responsive: true,
  displayModeBar: false,
};

const normalizeData = () => {
  if (Array.isArray(props.data)) {
    return {
      names: props.data.map((d) => d.name),
      counts: props.data.map((d) => d.count),
    };
  }

  return {
    names: Object.keys(props.data ?? {}),
    counts: Object.values(props.data ?? {}),
  };
};

const plotChart = () => {
  const { names, counts } = normalizeData();

  const sticks: Partial<Plotly.PlotData>[] = names.map((name, index) => ({
    type: "scatter",
    x: [0, counts[index]],
    y: [name, name],
    mode: "lines",
    line: {
      color: "#ABC8F5",
      width: 2,
    },
    hoverinfo: "none",
    showlegend: false,
  }));

  const dots: Partial<Plotly.PlotData> = {
    type: "scatter",
    x: counts,
    y: names,
    mode: "markers+text",
    marker: {
      color: "#6696DE",
      size: 16,
      line: {
        color: "white",
        width: 2,
      },
    },
    text: counts.map(String),
    textposition: "right",
    hovertemplate:
      "<b>%{y}</b><br>Used by: %{x} projects<extra></extra>",
    name: "Dependencies",
    showlegend: false,
  };

  const layout: Partial<Plotly.Layout> = {
    xaxis: {
      title: "Number of Dependent Projects",
      zeroline: false,
    },

    yaxis: {
      autorange: "reversed",
      automargin: true,
      ticksuffix: "  ",
    },

    showlegend: false,

    margin: {
      l: 200,
      r: 50,
      t: 20,
      b: 60,
    },

    height: 700,

    hoverlabel: {
      bgcolor: "#FFF",
    },
  };

  Plotly.newPlot(
    "plot_dependencies",
    [...sticks, dots],
    layout,
    config
  );
};

onMounted(() => {
  plotChart();
});

watch(
  () => props.data,
  async () => {
    await nextTick();
    plotChart();
  },
  { deep: true }
);

watch(activeTabIndex, async () => {
  await nextTick();

  Plotly.relayout("plot_dependencies", {
    autosize: true,
  });
});
</script>