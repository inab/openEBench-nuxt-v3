<template>
      <div ref="plotContainer" class="w-full h-[700px]">
      </div> 
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref } from 'vue';
  // @ts-ignore
  import Plotly from 'plotly.js-dist';

  const props = defineProps<{
  data: Record<string, any>;
}>();
  
  const plotContainer = ref<HTMLElement | null>(null);
  

  const createHorizontalBarPlot = (
    container: HTMLElement,
    data: Record<string, number>,
  ) => {
    // Sort data by value (ascending)
    console.log(data)
    const sorted = Object.entries(data).sort(([, a], [, b]) => b - a) // descending

    const top15 = sorted.slice(0, 15).reverse(); 

    const labels = top15.map(([label]) => label)
    const counts = top15.map(([, count]) => count)
      
    const trace = {
      x: counts,
      y: labels,
      type: 'bar',
      orientation: 'h',
      marker: {
        color: '#60a5fa'
      },
      hovertemplate: '<b>%{y}</b><br>Count: %{x}<extra></extra>'
    };
  
    const layout = {
      title:'',
      xaxis: {
        title: 'Count',
      },
      yaxis: {
        automargin: true
      },
      margin: {
        l: 100,
        r: 20,
        t: 50,
        b: 0
      },
      height: 50 + labels.length * 40
    };
  
    Plotly.newPlot(container, [trace], layout, { responsive: true });
  };
  
  onMounted(() => {
    if (plotContainer.value) {
      createHorizontalBarPlot( plotContainer.value, props.data);
    }

  });
  </script>