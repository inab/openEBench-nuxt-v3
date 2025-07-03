<template>
	<div id="plot_22"></div>
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

const completeness = computed(() => dataStore.completeness);
const completenessControl = computed(() => dataStore.completenessControl);

const currentCollection = computed(() => observatoryStore.getCurrentCollection);

const layout = {
  grid: {
    rows: 2,
    columns: 1,
    roworder: 'bottom to top',
  },
  yaxis: {
    title: 'Percentage of <br> software',
		tickformat: ',.0%',
  },
  xaxis: {
    tickformat: '%{x}',
    ticksuffix: ' features or less',
    tickmode: 'array',
    showticksuffix: false,
    showticklabels: false,
  },
  xaxis2: {
    title: 'Number of features',
    tickformat: '%{x} ',
    ticksuffix: ' features',
    tickmode: 'array',
    showticksuffix: false,
  },
  yaxis2: {
    title: 'Percentage of <br> software',
    tickformat: ',.0%',
  },
  showlegend: true,
  legend: {
    x: 0.8,
    y: 1.2,
    xanchor: 'center',
    yanchor: 'top',
    orientation: 'h',
  },
  autosize: true,
  margin: {
    autoexpand: true,
    t: 0,
  },
  hovermode: 'x unified',
};

const config = {
  responsive: true,
  displayModeBar: false,
};

// Methods
function buildTraces() {
  // Trace Line
  const traceLine = {
    y: completeness.value.cummulative_features.count_cumm_pct,
    x: completeness.value.cummulative_features.feat_num,
    type: 'scatter',
    mode: 'lines',
    marker: {
      color: '#3978ed',
    },
    yaxis: 'y2',
    xaxis: 'x',
    legendgroup: currentCollection.value,
    name: currentCollection.value,
    hovertemplate: '%{y} of software<extra></extra>',
  };

  // Trace Line Control
  const traceLineControl = {
    y: completenessControl.value.cummulative_features.count_cumm_pct,
    x: completenessControl.value.cummulative_features.feat_num,
    type: 'scatter',
    mode: 'lines',
    marker: {
      color: 'lightgrey',
    },
    yaxis: 'y2',
    xaxis: 'x',
    name: 'All tools',
    legendgroup: 'All tools',
    hovertemplate: '%{y} of software<extra></extra>',
  };

  // Trace Bar
  const traceBar = {
    y: completeness.value.distribution_features.x,
    x: completeness.value.distribution_features.y,
    type: 'bar',
    xaxis: 'x2',
    name: currentCollection.value,
    legendgroup: currentCollection.value,
    marker: {
      color: '#ff8957',
    },
    hovertemplate: '%{y} of software <extra></extra>',
		
  };

  // Trace Bar Control
  const traceBarControl = {
    y: completenessControl.value.distribution_features.x,
    x: completenessControl.value.distribution_features.y,
    type: 'bar',
    xaxis: 'x2',
    legendgroup: 'All tools',
    marker: {
      color: 'lightgrey',
    },
    name: 'All tools',
    hovertemplate: '%{y} of software have <br> %{x} features<extra></extra>',
  };

  let data;

  if (currentCollection.value === 'tools') {
    data = [traceBar, traceLine];
  } else {
    data = [traceBar, traceLine, traceBarControl, traceLineControl];
  }

  return data;
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
