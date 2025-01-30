<template>
	<div id="plot_23"></div>
</template>
<script setup lang="ts">
import { computed, onMounted, watch, nextTick } from 'vue';
import Plotly from 'plotly.js-dist';
import { activeTabIndex } from '@/components/Common/state.js';

// Datos reactivos
const data_types = {
  cmd: 17170,
  script: 716,
  lib: 8191,
  db: 1951,
  unknown: 3087,
  web: 6040,
  workflow: 403,
  app: 1779,
  rest: 301,
  plugin: 212,
  soap: 565,
  undefined: 2971,
  ontology: 35,
  suite: 332,
  workbench: 223,
  sparql: 11,
};

const layout = {
  yaxis: {
    title: '',
    categoryorder: 'total ascending',
  },
  xaxis: {
    title: 'Number of instances',
  },
  showlegend: false,
  margin: {
    autoexpand: true,
    t: 0,
  },
};

const config = {
  responsive: true,
  displayModeBar: false,
};

// Methods
function buildData() {
  const newValues = {
    values: [],
    types: [],
  };
  for (const [key, value] of Object.entries(data_types)) {
    newValues.types.push(key);
    newValues.values.push(value);
  }
  return newValues;
}

function updatePlot() {
  const data = buildData();

  const labels = data.types;
  const newLabels = labels.map((lab) => lab + '   ');

  const trace = {
    x: data.values,
    y: newLabels,
    type: 'bar',
    orientation: 'h',
    marker: {
      color: '#ebd471',
    },
    hovertemplate: '%{y} <br> %{x:,d} instances <extra></extra>',
  };

  const plotElement = document.getElementById('plot_23');
  if (plotElement) {
    Plotly.newPlot(plotElement, [trace], layout, config);
  } else {
    console.error('No DOM element with id "plot_23" exists on the page.');
  }
}

onMounted(() => {
  updatePlot();
});

watch(activeTabIndex, async () => {
    await nextTick(); 
    Plotly.relayout('plot_23', { autosize: true });
});
</script>

<style scoped>
#plot_23 {
  padding: 0%;
  margin: 0%;
}

.v-card {
  padding: 4em;
  clear: left;
}

#plot_23 .modebar {
  display: none !important;
}
</style>
