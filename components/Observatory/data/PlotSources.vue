<template>
  <div id="plot2"></div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue';
import { useData } from '@/stores/observatory/data';
import Plotly from 'plotly.js-dist';

// Store
const dataStore = useData();
const coverageSources = computed(() => dataStore.coverageSources);

const small = false;  // Puedes ajustar esto según sea necesario

// Datos reactivos
const nums = ['1', '2', '3', '4', '5'];
const colors_primary = [
  '#1d4421',
  '#3d643f',
  '#5d865e',
  '#80aa80',
  '#a3cfa3',
  '#c9f5c8',
];
const colors_secondary = ['#b72f1e', '#f88b69', '#f9d3c6', '#3669a3'];
const titles = {
  github: 'GitHub',
  galaxy: 'Galaxy Europe',
  bioconda: 'Bioconda',
  toolshed: 'Galaxy Toolshed',
  biotools: 'bio.tools',
  bioconductor: 'Bioconductor',
  sourceforge: 'SourceForge',
  bitbucket: 'Bitbucket',
  opeb_metrics: 'OpenEBench',
};

// Layout y configuración
const layout_base = {
  barmode: 'stack',
  xaxis: {
    title: 'Number of sources',
  },
  yaxis: {
    title: 'Number of instances',
  },
  autosize: true,
  height: 300,
  margin: {
    autoexpand: true,
    t: 0,
    b: 40,
  },
};

const config = {
  responsive: true,
  displayModeBar: false,
};

const layout = computed(() => {
  const l = { ...layout_base };
  if (small) {
    l.legend = { orientation: 'h', y: 5, x: -0.2, size: 15 };
  } else {
    l.legend = {};
  }
  return l;
});

// Function to construct bar traces
function build_bar_traces(colors) {
  const traces = [];
  if (coverageSources.value.data && coverageSources.value.data.counts) {
    for (const [key] of Object.entries(coverageSources.value.data.counts)) {
      const trace = {
        x: nums,
        y: coverageSources.value.data.counts[key],
        name: titles[key],
        marker: {
          color: colors[key],
        },
        type: 'bar',
        meta: titles[key],
        hovertemplate:
          'Of instances found in %{x} sources: <br>' +
          '%{y:,d} are found in %{meta} <extra></extra>',
      };
      traces.push(trace);
    }
  }
  return traces;
}

// Function to construct the line trace
function build_line_trace(n) {
  return coverageSources.value.data && coverageSources.value.data.counts_cummulative 
    ? coverageSources.value.data.counts_cummulative[n] 
    : 0;
}

function updatePlot() {
  const colors = {
    github: colors_secondary[0],
    galaxy: colors_primary[1],
    bioconda: colors_primary[3],
    toolshed: colors_primary[2],
    biotools: colors_primary[0],
    bioconductor: colors_primary[4],
    sourceforge: colors_primary[5],
    bitbucket: colors_secondary[1],
    opeb_metrics: colors_secondary[3],
  };

  const data = build_bar_traces(colors);

  const lineData = {
    x: nums,
    y: nums.map(build_line_trace),
    marker: {
      color: '#FFD700',
    },
    name: 'Instances',
    hovertemplate: '%{x} sources or less: %{y:,d} instances <extra></extra>',
    type: 'line',
  };

  data.push(lineData);

  const plotElement = document.getElementById('plot2');
  if (plotElement) {
    Plotly.newPlot(plotElement, data, layout.value, config);
  } else {
    console.error('No DOM element with id "plot2" exists on the page.');
  }
}

// Use watch to make sure coverageSources updates the chart.
watch(() => coverageSources.value.data, (newVal) => {
  if (newVal && Object.keys(newVal.counts).length > 0) {
    updatePlot();
  }
}, { deep: true });

onMounted(() => {
  updatePlot();
});
</script>
  
<style scoped>
#plot2 {
  padding: 0%;
  margin: 0%;
}

#plot2 .modebar {
  display: none !important;
}

.js-plotly-plot .plotly .main-svg .infolayer .legend {
  width: 100% !important;
}
</style>
  