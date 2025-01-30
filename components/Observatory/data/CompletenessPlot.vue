<template>
	<div id="plot_22"></div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch, nextTick } from 'vue';
import { useData } from '@/stores/observatory/data';
import Plotly from 'plotly.js-dist';
import { activeTabIndex } from '@/components/Common/state.js';

// Store
const dataStore = useData();
const completeness = computed(() => dataStore.completeness);

const layout = {
  grid: {
    rows: 2,
    columns: 1,
    roworder: 'bottom to top',
  },
  yaxis: {
    title: 'Number of <br> instances',
  },
  xaxis: {
    title: 'Number of features',
  },
  yaxis2: {
    title: 'Number of <br> instances',
  },
  showlegend: false,
  autosize: true,
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
function buildTraces() {
  const traceLine = {
    y: completeness.value.cummulative_features.data.count_cumm,
    x: completeness.value.cummulative_features.data.feat_cumm,
    type: 'scatter',
    mode: 'lines',
    marker: {
      color: '#446fbd',
    },
    yaxis: 'y2',
    hovertemplate:
      '%{y:,d} instances have <br> %{x} features or less<extra></extra>',
  };

  const traceBar = {
    y: completeness.value.distribution_features.data.x,
    x: completeness.value.distribution_features.data.y,
    type: 'bar',
    marker: {
      color: '#ad3d32',
    },
    hovertemplate: '%{y:,d} instances have <br> %{x} features<extra></extra>',
  };

  return [traceBar, traceLine];
}

function updatePlot() {
  const data = buildTraces();
  const plotElement = document.getElementById('plot_22');

  if (plotElement) {
    Plotly.newPlot(plotElement, data, layout, config);
  } else {
    console.error('No DOM element with id "plot_22" exists on the page.');
  }
}

// OnMounted
onMounted(() => {
  updatePlot();
});

watch(activeTabIndex, async () => {
    await nextTick(); 
    Plotly.relayout('plot_22', { autosize: true });
});

</script>

<style scoped>
#plot_22 {
  padding: 0%;
  margin: 0%;
}

#plot_22 .modebar {
  display: none !important;
}

.js-plotly-plot .plotly .main-svg .infolayer .legend {
  width: 100% !important;
}
</style>
