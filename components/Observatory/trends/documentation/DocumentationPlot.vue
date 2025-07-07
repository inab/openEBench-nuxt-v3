<template>
  <div ref="plotContainer" class="w-full"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue';
// @ts-ignore
import Plotly from 'plotly.js-dist';

type DocFormat = 'web' | 'downloadable' | 'github' | 'gitlab' | 'total';

const props = defineProps<{
  data: Record<string, {
    web?: number;
    downloadable?: number;
    github?: number;
    gitlab?: number;
    total?: number;
  }>;
}>();

const plotContainer = ref<HTMLElement | null>(null);

const colorMap: Record<DocFormat, string> = {
  web: '#c7e9c0',
  downloadable: '#74c476',
  github: '#41AB5D',
  gitlab: '#238B45',
  total: 'lightgrey',
};

const formats: DocFormat[] = ['web', 'downloadable', 'github', 'gitlab', 'total'];

const drawPlot = () => {
  if (!props.data || Object.keys(props.data).length === 0) {
    console.warn("No data to plot.");
    return;
  }

  if (!plotContainer.value) {
    console.warn("Plot container is not mounted.");
    return;
  }

  const y = Object.keys(props.data);
  const x = y.map(type => props.data[type]);

  const traces = formats.map(fmt => ({
    y,
    x: x.map(d => d?.[fmt] ?? 0),  // prevent crash if d is undefined
    name: fmt,
    type: 'bar',
    orientation: 'h',
    marker: { color: colorMap[fmt] },
    hovertemplate: `<b>%{y}</b><br>Format: ${fmt}<br>Count: %{x}<extra></extra>`
  }));

  const layout = {
    title: 'Documentation Formats by Type (Horizontal Grouped Bar)',
    barmode: 'group',
    yaxis: {
      title: 'Documentation Type',
      automargin: true
    },
    xaxis: {
      title: 'Number of Documentation Links'
    },
    margin: {
      l: 250,
      r: 40,
      t: 60,
      b: 100
    },
    height: 50 + y.length * 40 // dynamic height if needed
  };

  Plotly.newPlot(plotContainer.value, traces, layout, { responsive: true });
};

onMounted(drawPlot);
watch(() => props.data, drawPlot, { deep: true });
</script>

