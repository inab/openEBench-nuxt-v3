<template>
	<div id="plot_23"></div>
</template>
<script setup lang="ts">
import { computed, onMounted, watch, nextTick } from 'vue';
import { useData } from '@/stores/observatory/data';
import { useObservatory } from '@/stores/observatory/index.js';
import Plotly from 'plotly.js-dist';
import { activeTabIndex } from '@/components/Common/state.js';

// Store
const dataStore = useData();
const observatoryStore = useObservatory();

// Getters
const types_data = computed(() => dataStore.types);
const types_data_control = computed(() => dataStore.typesControl);
const currentCollection = computed(() => observatoryStore.getCurrentCollection);

const layout = {
  yaxis: {
    title: '',
    categoryorder: 'total ascending',
  },
  xaxis: {
    title: 'Percentage of software',
    tickformat: ',.0%',
  },
  margin: {
    autoexpand: true,
    t: 0,
    l: 130,
  },
  legend: {
    x: 0.8,
    y: 1.1,
    xanchor: 'center',
    yanchor: 'top',
    orientation: 'h',
  },
  hovermode: 'y unified',
};

const config = {
  responsive: true,
  displayModeBar: false,
};

// Methods
function buildData(typesData) {

  const typeLabels = {
    cmd: 'Command-line tool',
    web: 'Web application',
    lib: 'Library',
    app: 'Application',
    db: 'Database',
    undefined: 'Undefined',
    soap: 'SOAP service',
    rest: 'REST API',
    plugin: 'Plugin',
    suite: 'Software suite',
    script: 'Script',
    workbench: 'Workbench',
    workflow: 'Workflow',
    sparql: 'SPARQL endpoint',
    ontology: 'Ontology',
  };

  const newValues = {
    values: [],
    types: [],
  };

  for (const [key, value] of Object.entries(typesData)) {
    const label = typeLabels[key] || key; // fallback to key if no mapping exists
    newValues.types.push(label + '  ');
    newValues.values.push(value);
  }

  return newValues;
}

function updatePlot() {
  const data = buildData(types_data.value);
  const dataControl = buildData(types_data_control.value);

  // 
  const trace = {
    x: data.values,
    y: data.types,
    type: 'bar',
    orientation: 'h',
    marker: {
      color: '#6fc765',
    },
    hovertemplate: '"%{x}" of software <extra></extra>',
		name: currentCollection.value,
  };

  // 
  const traceControl = {
    x: dataControl.values,
    y: dataControl.types,
    type: 'bar',
    orientation: 'h',
    marker: {
      color: 'lightgrey',
    },
    hovertemplate: '"%{x}" of software <extra></extra>',
    name: 'All tools',
  };

  const traces = [];
  if (currentCollection.value !== 'tools') {
    traces.push(traceControl);
  }
  traces.push(trace)

  const plotElement = document.getElementById('plot_23');
  if (plotElement) {
    Plotly.newPlot(plotElement, traces, layout, config);
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
