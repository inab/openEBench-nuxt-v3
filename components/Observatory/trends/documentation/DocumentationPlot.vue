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

  // Convert object to array of [key, value] pairs and sort by total descending
  const sortedEntries = Object.entries(props.data)
  .sort(([, a], [, b]) => (a.total ?? 0) - (b.total ?? 0));

  // Extract the sorted keys (category names)
  const docTypes = sortedEntries.map(([key]) => key);

  // Rebuild the data in the new order
  const sortedData = sortedEntries.map(([, value]) => value);

  const backgroundShapes = docTypes.map((label, index) => {
    if (index % 2 === 0) {
      return {
        type: 'rect',
        xref: 'paper',
        yref: 'y',
        x0: 0,
        x1: 1,
        y0: label,
        y1: label,
        fillcolor: '#f5f5f5',
        opacity: 0.4,
        layer: 'below',
        line: { width: 0 }
      };
    }
    return null;
  }).filter(Boolean);
  //const y = Object.keys(props.data);
  //const x = y.map(type => props.data[type]);

  const traces = formats.map(fmt => ({
    y: docTypes,
    x: sortedData.map(d => d?.[fmt] ?? 0),  // prevent crash if d is undefined
    name: fmt,
    type: 'bar',
    orientation: 'h',
    marker: { color: colorMap[fmt] },
    hovertemplate: `<b>%{y}</b><br>Format: ${fmt}<br>Count: %{x}<extra></extra>`
  }));

  const layout = {
    title: '',
    barmode: 'group',
    yaxis: {
      title: 'Documentation Type',
      automargin: true
    },
    xaxis: {
      title: 'Number of Documentation Links'
    },
    shapes: docTypes.map((_, i) => {
      if (i % 2 !== 0) {
        return {
          type: 'rect',
          xref: 'paper',
          yref: 'y',
          x0: 0,
          x1: 1,
          y0: i - 0.5,
          y1: i + 0.5,
          fillcolor: '#a1d4a1',
          opacity: 0.1,
          layer: 'below',
          line: { width: 0 }
        };
      }
      return null;
    }).filter(Boolean),
    margin: {
      l: 250,
      r: 40,
      t: 60,
      b: 100
    },
    height: 50 + docTypes.length * 40 // dynamic height if needed
  };

  Plotly.newPlot(plotContainer.value, traces, layout, { responsive: true });
};

onMounted(drawPlot);
watch(() => props.data, drawPlot, { deep: true });
</script>

