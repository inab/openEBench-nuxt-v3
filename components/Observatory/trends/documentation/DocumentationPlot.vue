<template>
    <div id="plot_documentation"></div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, onMounted, watch, nextTick } from "vue";
  import Plotly from "plotly.js-dist";
  import { activeTabIndex } from "@/components/Common/state.js";
  
  const props = defineProps<{
    data: Record<string, any>;
  }>();
  
  const colorMap: Record<string, string> = {
    web: "#226f54",
    downloadable: "#87c38f",
    github: "#f4f0bb",
    gitlab: "#d3d3d3",
    total: "#2c423f",
  };
  
  const formats = [
    "web",
    "downloadable",
    "github",
    "gitlab",
    "total",
  ];
  
  const config: Partial<Plotly.Config> = {
    responsive: true,
    displayModeBar: false,
  };
  
  const plotChart = () => {
    if (!props.data || Object.keys(props.data).length === 0) {
      return;
    }
  
    const sortedEntries = Object.entries(props.data).sort(
      ([, a]: any, [, b]: any) => (a?.total ?? 0) - (b?.total ?? 0)
    );
  
    const docTypes = sortedEntries.map(([key]) => key);
    const sortedData = sortedEntries.map(([, value]) => value || {});
  
    const traces: Partial<Plotly.PlotData>[] = formats.map((format) => ({
      y: docTypes,
      x: sortedData.map((d: any) => d?.[format] ?? 0),
      name: format,
      type: "bar",
      orientation: "h",
      marker: {
        color: colorMap[format],
      },
      hovertemplate:
        `<b>%{y}</b><br>Format: ${format}<br>Count: %{x}<extra></extra>`,
    }));
  
    const layout: Partial<Plotly.Layout> = {
      barmode: "group",
  
      yaxis: {
        title: {
          text: "Documentation Type",
          standoff: 20,
        },
        automargin: true,
        ticksuffix: "  ",
      },
  
      xaxis: {
        title: "Number of Documentation Links",
      },
  
      shapes: docTypes
        .map((_, index) => {
          if (index % 2 !== 0) {
            return {
              type: "rect",
              xref: "paper",
              yref: "y",
              x0: 0,
              x1: 1,
              y0: index - 0.5,
              y1: index + 0.5,
              fillcolor: "#ffc971",
              opacity: 0,
              layer: "below",
              line: {
                width: 0,
              },
            };
          }
  
          return null;
        })
        .filter(Boolean),
  
      margin: {
        l: 250,
        r: 40,
        t: 20,
        b: 60,
      },
  
      height: 90 + docTypes.length * 50,
  
      hoverlabel: {
        bgcolor: "#FFF",
      },
    };
  
    Plotly.newPlot("plot_documentation", traces, layout, config);
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
    Plotly.relayout("plot_documentation", {
      autosize: true,
    });
  });
</script>