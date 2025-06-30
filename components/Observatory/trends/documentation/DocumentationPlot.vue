<template>
  <div ref="plotContainer" class="w-full h-[700px]"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue';
// @ts-ignore
import Plotly from 'plotly.js-dist';

type DocFormat = 'web' | 'downloadable' | 'github' | 'gitlab' | 'total';

const props = defineProps<{
  data: Array<{
    type: string;
    web: number;
    downloadable: number;
    github: number;
    gitlab: number;
    total: number;
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
  if (!plotContainer.value || !props.data.length) return;

  const docTypes = props.data.map(d => d.type);
  const traces = formats.map(fmt => ({
    y: docTypes,
    x: props.data.map(d => d[fmt]),
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
      b: 60
    },
    height: 700
  };

  Plotly.newPlot(plotContainer.value, traces, layout, { responsive: true });
};

onMounted(drawPlot);
watch(() => props.data, drawPlot, { deep: true });
</script>

