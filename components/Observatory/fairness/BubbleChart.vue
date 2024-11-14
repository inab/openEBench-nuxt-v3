<template>
  <div>
    <div :id="props.div_id"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Plotly from 'plotly.js-dist';

const props = defineProps<{
  div_id: string;
  collection: string;
  collection_scores: Array<any>;
  indicators_labels: { [key: string]: string };
  control_scores: Array<any>;
  collection_colors: Array<string>;
  collection_colors_lines: Array<string>;
  title?: string;
  height?: number;
}>();

const config = {
  responsive: true,
  displayModeBar: false,
};

const buildControlColors = () => {
  return Array(Object.keys(props.indicators_labels).length).fill('#bfbfbf');
};

const controlColors = buildControlColors();
const controlColorsLines = buildControlColors();

const build_trace = (
  scores: Array<any>,
  labels: { [key: string]: string },
  collectionTitle: string,
  colors: Array<string>,
  colorsLines: Array<string>,
  mode: string
) => {
  const traces = [];
  let item;

  for (let i = 0, len = scores.length; i < len; i++) {
    item = scores[i];
    const trace = {
      y: Array(item.scores.length).fill(labels[item.indicator]),
      x: item.scores,
      name: collectionTitle + ' - ' + item.indicator,
      customdata: item.count,
      text: item.percent,
      textposition: 'inside',
      texttemplate: '%{text:,.1%}',
      hovertemplate: 'Score: %{x:.2f}<br>Tools: %{customdata:,}<br>Percentage: %{text:,.1%}',
      mode, // 'markers+text' shows text inside
      textfont: {
        size: 14,
      },
      marker: {
        size: item.percent,
        sizeref: 0.0003, // scaling factor
        sizemode: 'area',
        color: Array(item.scores.length).fill(colors[i]),
        line: {
          width: 1.5,
          color: Array(item.scores.length).fill(colorsLines[i]),
        },
      },
    };
    traces.push(trace);
  }
  return traces;
};

const build_control_collection_traces = () => {
  let controlCollectionTraces:any[] = [];

  // control scores
  if (props.collection !== 'tools') {

    const traceControl = build_trace(
      props.control_scores,
      props.indicators_labels,
      'All tools',
      Array(props.control_scores.length).fill('#bfbfbf'),
      Array(props.control_scores.length).fill('#bfbfbf'),
      'markers'
    );
    controlCollectionTraces = controlCollectionTraces.concat(traceControl);
  }

  // collection scores
  const collectionTitle = props.collection === 'tools' ? 'All tools' : props.collection;
  const traceCollection = build_trace(
    props.collection_scores,
    props.indicators_labels,
    collectionTitle,
    props.collection_colors,
    props.collection_colors_lines,
    'markers+text'
  );
  controlCollectionTraces = controlCollectionTraces.concat(traceCollection);

  return controlCollectionTraces;
};

onMounted(() => {
  const traces = build_control_collection_traces();
  const layout = {
    yaxis: {
      title: 'Indicator',
      showline: false,
    },
    xaxis: {
      title: 'Score',
      zeroline: false,
      showline: true,
    },
    showlegend: true,
    height: props.height || 350,
    hovermode: 'closest',
    hoverlabel: { bgcolor: '#FFF' },
    autosize: true,
    margin: {
      autoexpand: true,
      t: 20,
      l: 150,
    },
    title: props.title || '',
  };

  Plotly.newPlot(props.div_id, {
    data: traces,
    layout,
    config,
  });
});
</script>
