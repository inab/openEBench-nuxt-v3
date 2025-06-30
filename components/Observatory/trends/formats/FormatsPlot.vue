<template>
    <div id="plot_formats" class="w-full"></div>
</template>
  
<script setup>
  import { onMounted, watch } from 'vue'
  import Plotly from 'plotly.js-dist'
  
  const props = defineProps({
    inputData: { type: Object, required: true },
    outputData: { type: Object, required: true },
    sameDifferentData: { type: Object, required: true }
  })
  
  const layout = {
    title: '',
    autosize: true,
    height: 600,
    margin: {
      autoexpand: true,
      t: 20,
      l: 160,
      r: 10,
    },
  }
  
  const config = {
    responsive: true,
    displayModeBar: false,
  }
  
  const drawPlot = () => {
    const inputDim = {
      label: 'Input formats',
      values: props.inputData.values.slice(0, 500),
    }
  
    const outputDim = {
      label: 'Output formats',
      values: props.outputData.values.slice(0, 500),
    }
  
    const sameDifferentDim = {
      label: 'Input and output formats',
      values: props.sameDifferentData.values.slice(0, 500),
      categoryarray: [0, 1],
      ticktext: ['same', 'different'],
    }
  
    const color = sameDifferentDim.values
    const colorscale = [
      [0, '#81a2db'],
      [1, '#7da876'],
    ]
  
    const trace1 = {
      type: 'parcats',
      dimensions: [inputDim, outputDim, sameDifferentDim],
      line: {
        color,
        hoveron: 'color',
        colorscale,
        hoverinfo: 'count+probability',
        labelfont: { size: 14 },
        arrangement: 'freeform',
        cmin: 0,
        cmax: 1,
        shape: 'hspline',
      },
    }
  
    Plotly.newPlot('plot_formats', [trace1], layout, config)
  }
  
  onMounted(drawPlot)
  watch(() => [props.inputData, props.outputData, props.sameDifferentData], drawPlot, { deep: true })
</script>

<script>
export default {
  name: 'FormatsPlot'
};
</script>

