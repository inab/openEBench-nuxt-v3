<template>
  <div>
    <div id="plot"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch, nextTick, toRaw } from 'vue';
import { useData } from '@/stores/observatory/data.js';
import { useObservatory } from '@/stores/observatory/index.js';

import Plotly from 'plotly.js-dist';
import { activeTabIndex } from '@/components/Common/state.js';

// Store
const dataStore = useData();
const observatoryStore = useObservatory();

const features = computed(() => dataStore.Features);
const sources = computed(() => dataStore.FeaturesLabels);
const featuresControl = computed(() => dataStore.FeaturesControl);

const currentCollection = computed(() => observatoryStore.getCurrentCollection);

// Reactive constants
const features_names: string[] = [
  'name',
  'description',
  'version',
  'type',
  'webpage',
  'publication',
  'download',
  'source_code',
  'operating_system',
  'input',
  'output',
  'dependencies',
  'test',
  'documentation',
  'license',
  'authors',
  'repository',
  'topics',
];

const feat_labels = {
  name: 'Name',
  description: 'Description',
  version: 'Version',
  type: 'Type',
  webpage: 'Webpage',
  publication: 'Publication',
  download: 'Download',
  source_code: 'Source code',
  operating_system: 'Operating system',
  input: 'Input format',
  output: 'Output format',
  dependencies: 'Dependencies',
  test: 'Testing',
  documentation: 'Documentation',
  license: 'License',
  authors: 'Authors',
  repository: 'Repository',
  topics: 'Topics',
};

const fps = {
  sources: [
    'Bioconda',
    'Bioconductor',
    'bio.tools',
    'Galaxy Toolshed',
    'Galaxy Europe',
    'SourceForge',
    'GitHub',
  ],
};

const colors = [
  '#fab370',
  '#fab370',
  '#fab370',
  '#fab370',
  '#fab370',
  '#fab370',
  '#fab370',
];

const colors_l = [
  '#ed8828',
  '#ed8828',
  '#ed8828',
  '#ed8828',
  '#ed8828',
  '#ed8828',
  '#ed8828',
];

// FUNCTIONS
function map_feat_names(featureKey){ 
  return sources.value.map((src) => src.features[featureKey] || 0);
}

// Build scatter traces
function build_scatter_traces(scatterData) { 
  const scatterPlot = []; 

  for (let index: number = 0; index < scatterData.values.length; ++index) { 
    const arr = scatterData.values[index];
    const newX = []; 
    const newY = []; 
    const newColL = []; 
    const newCol = []; 
    const labels = [];

    for (let i = 0; i < arr.length; ++i) { 
      if (arr[i] !== 0) { 
        newX.push(feat_labels[features_names[index]]);
        newY.push(scatterData.source[i]);
        newCol.push(colors[i % colors.length]);
        newColL.push(colors_l[i % colors_l.length]);
        labels.push(feat_labels[features_names[index]]);
      } 
    }
    const trace = { 
      x: newX, 
      y: newY, 
      name: getTraceName(index),
      xaxis: 'x', 
      yaxis: 'y2', 
      type: 'scatter', 
      mode: 'markers', 
      marker: { 
        size: 8, 
        color: newCol, 
        line: { 
          width: 2, 
          color: newColL,
        }, 
      }, 
      hovertemplate: '%{text} <extra></extra>',
      text: labels,
      showlegend: false,
    }; 
    
    // CHECK
    if (newX.length > 0) {
      scatterPlot.push(trace);
    }

  } 
  return scatterPlot; 
}

function getTraceName(index) {
  if (index === 17) return 'All tools';
  return '';
}

// Restructure the Barplot data
function bar_plot_data_restruct(features) { 
  const newValues = [];
  for (const [key, value] of Object.entries(features)) { 
    newValues.push([key, value]);
  } 
  return newValues;
}

// Plot Mounted
onMounted(() => { 
  const scatterData = { 
    source: fps.sources, 
    values: features_names.map(map_feat_names),
    xaxis: 'x2',
  };

  // Add scatter Plot trace
  const data = build_scatter_traces(scatterData);
  const barsData = bar_plot_data_restruct(structuredClone(toRaw(features.value)));

  const barsPlot = { 
    x: barsData.map(item => item[0]), 
    y: barsData.map(item => item[1]), 
    xaxis: 'x1', 
    yaxis: 'y1', 
    type: 'bar', 
    marker: { 
        color: '#77A7D4', 
        opacity: 1,
    },
    hovertemplate: '"%{x}" information available <br> for %{y} software<extra></extra>',
    name:currentCollection.value === 'tools' ? 'All tools' : currentCollection.value,
    showlegend: currentCollection.value !== 'tools',
  };

  // Add Bar Plot trace
  data.push(barsPlot);

  // Data Control
  const barsDataControl = bar_plot_data_restruct(toRaw(featuresControl.value));
  const barsPlotControl = {
    x: barsDataControl.map(item => item[0]),
    y: barsDataControl.map(item => item[1]),
    xaxis: 'x1',
    yaxis: 'y1',
    type: 'bar',
    marker: {
      color: '#E4E4E4',
      opacity: 1,
    },
    hovertemplate:
      '"%{x}" information available <br> for %{y} software<extra></extra>',
    name: 'All tools',
    showlegend: true,
  }

  if (currentCollection.value !== 'tools') {
    data.push(barsPlotControl);
  }

  // Config
  const config = { responsive: true, displayModeBar: false, }; 
  // Layout
  const layout = { 
    grid: { 
      rows: 2, 
      columns: 1, 
      roworder: 'bottom to top', 
    }, 
    xaxis: {
      title: 'Feature',
      tickangle: -45,
      automargin: true,
    },
    yaxis: {
      title: 'Software',
      automargin: true,
      tickformat: ',.0%',
    },
    yaxis2: { 
      automargin: true, 
    }, 
    xaxis2: { 
      showticklabels: false, 
      automargin: true,
			match: 'x', 
    }, 
    autosize: true, 
    margin: { 
      autoexpand: true, t: 0, r: 20, l: 0, 
    }, 
    height: 550, 
    showlegend: true,
    legend: {
      x: 0.1,
      y: -0.4,
      xanchor: 'center',
      yanchor: 'bottom',
      orientation: 'h',
    },
    font_size: 12, 
    font_color: 'black', 
    font_family: 'Balto, sans-serif', 
    bargap: 0.1, 
    bargroupgap: 0.0, 
    hoverdistance: 1,
  };

  const filteredData = data.filter(trace => trace !== undefined && trace !== null);
  Plotly.newPlot('plot', filteredData, layout, config);
});

watch(activeTabIndex, async () => {
    await nextTick(); 
    Plotly.relayout('plot', { autosize: true });
});

</script>

<style scoped>
#plot {
	padding: 0%;
	margin: 0%;
}

#plot .modebar {
	display: none !important;
}
</style>