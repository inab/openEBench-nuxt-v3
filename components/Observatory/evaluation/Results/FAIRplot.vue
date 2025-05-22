<template>
  <div :id="label" class="w-full"></div>
</template>

<script setup lang="ts">
import Plotly from 'plotly.js-dist';
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useResultStore } from '@/stores/observatory/evaluation/results';

const resultStore = useResultStore();

const dataTool = computed(() => resultStore.getFAIRIndicatorsTool);
const dataControl = computed(() => resultStore.getFAIRIndicatorsControl);

// PROPS
const props = defineProps<{
  label: string,
  height: number,
  colorFill: string,
  toolName: string,
  indicatorsLabel: Array<any>
}>();

// Layout
const layout = ref({
  height: props.height,
  polar: {
    radialaxis: {
      visible: true,
      range: [0, 1],
    },
  },
  showlegend: true,
  legend: {
    y: 0.9,
  },
  margin: {
    t: 4,
    b: 6,
    r: 1,
    l: 1,
  },
});

// Plotly settings to make the menu smaller
const config = {
  modeBarButtonsToRemove: [
    "pan2d",
    "select2d",
    "lasso2d",
    "zoomIn2d",
    "zoomOut2d",
    "autoScale2d",
    "resetScale2d",
  ],
};

// Render the chart
const renderPlot = async () => {
  await nextTick(); // Asegura que el DOM esté actualizado antes de renderizar
  Plotly.newPlot(props.label, buildTraces(), layout.value, config);
};

// Look at the changes in the data
watch([dataTool, dataControl], () => {
  renderPlot();
}, { deep: true, immediate: true });


// Assemble the graphic
onMounted(() => {
  renderPlot();
});


// Construction of data for the chart
const buildTraces = () => {
  const traces = [];

  // Verifica si dataControl.value.data es un objeto vacío
  const data =
    Object.keys(dataControl.value?.data || {}).length === 0
      ? [dataTool.value]
      : [dataControl.value.data, dataTool.value];

  const names =
    Object.keys(dataControl.value?.data || {}).length === 0
      ? [props.toolName]
      : ["Average of all tools", props.toolName];

  const colors =
    Object.keys(dataControl.value?.data || {}).length === 0
      ? [props.colorFill]
      : ["#b8b8b8", props.colorFill];

  for (let i = 0; i < data.length; i++) {
    const theta = props.indicatorsLabel;
    const r = [];

    for (let j = 0; j < theta.length; j++) {
      r.push(data[i][theta[j]]);
    }

    traces.push({
      type: "scatterpolar",
      r,
      theta,
      fill: "toself",
      name: names[i],
      line: {
        color: colors[i],
      },
    });
  }

  return traces;
};

</script>