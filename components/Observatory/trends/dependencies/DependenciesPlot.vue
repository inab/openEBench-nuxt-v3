<template>
    <div ref="plotContainer" class="w-full h-[700px]"></div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, watch, ref } from 'vue';
  import Plotly from 'plotly.js-dist';
  
  const props = defineProps<{
    data: { name: string; count: number }[];
  }>();
  
  const plotContainer = ref<HTMLElement | null>(null);
  
  const drawPlot = () => {
  
    const names = Object.keys(props.data);    // ["r-base", "methods", "stats", ...]
    const counts = Object.values(props.data); // [3992, 1931, 1642, ...]
  
    const sticks = Object.entries(props.data).map(([name, count]) => ({
      type: 'scatter',
      x: [0, count],
      y: [name, name],
      mode: 'lines',
      line: {
        color: '#c1dec1',
        width: 2,
      },
      hoverinfo: 'none',
      showlegend: false,
    }));
      
    // Dots with labels
    const dots = {
      type: 'scatter',
      x: counts,
      y: names,
      mode: 'markers+text',
      marker: {
        color: '#6FAD6F',
        size: 16,
        line: { color: 'white', width: 2 },
      },
      text: counts.map(String),
      textposition: 'right',
      hovertemplate: '<b>%{y}</b><br>Used by: %{x} projects<extra></extra>',
      name: 'Dependencies',
    };
  
    const layout = {
      title: '',
      xaxis: {
        title: 'Number of Dependent Projects',
        zeroline: false,
      },
      yaxis: {
        autorange: 'reversed',
        automargin: true,
      },
      showlegend: false,
      margin: {
        l: 200,
        r: 50,
        t: 60,
        b: 60,
      },
      height: 700,
    };
  
    Plotly.newPlot(plotContainer.value, [...sticks, dots], layout, { responsive: true });
  };
  
  // Redraw when data changes
  onMounted(drawPlot);
  watch(() => props.data, drawPlot, { deep: true });
  </script>