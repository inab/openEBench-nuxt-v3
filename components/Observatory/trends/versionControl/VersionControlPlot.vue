<template>
    <div id="plot_4"></div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import Plotly from 'plotly.js-dist';

// Define props
const props = defineProps<{
    xValues: number[];
    yValues: string[];
    title?: string;
    height?: number;
}>();

// Set defaults for optional props
const { title = '', height = 280 } = props;


// Define labels for y-axis with links
const labels = {
  gitlab: '<a href="https://gitlab.com/gitlab-org/gitlab" target="_blank">GitLab</a>',
  bitbucket: '<a href="https://bitbucket.org/" target="_blank">Bitbucket</a>',
  sourceforge: '<a href="https://sourceforge.net/" target="_blank">SourceForge</a>',
  github: '<a href="https://github.com/" target="_blank">GitHub</a>',
};

// Define layout and config as reactive objects
const layout: Partial<Plotly.Layout> = {
    showlegend: false,
    yaxis: {
        automargin: true,
    },
    xaxis: {
        title: 'Number of instances',
    },
    height: height,
    autosize: true,
    margin: {
        autoexpand: true,
        t: 10,
        b: 50,
    },
    title: { text: title, font: { size: 16 } },
    hoverlabel: { bgcolor: '#FFF' },
};

const config: Partial<Plotly.Config> = {
    responsive: true,
    displayModeBar: false,
};

// Watch for `height` prop changes and update the layout dynamically
watch(
    () => props.height,
    (newHeight) => {
        layout.height = newHeight ?? 280;
        plotChart();
    }
);

// Plot the chart when the component is mounted
onMounted(() => {
    plotChart();
});

// Function to build the trace for the Plotly chart
function buildTrace(x: number[], y: string[]): Partial<Plotly.PlotData> {
    return {
        type: 'bar',
        x,
        y: y.map((value) => labels[value] || value),
        orientation: 'h',
        marker: {
            color: '#4f71b8',
        },
        hoverinfo: 'x',
        hovertemplate: '%{x:,d} instances <extra></extra>',
    };
}

// Plot the chart when the component is mounted
onMounted(() => {
    plotChart();
});

// Function to plot the chart
function plotChart() {
    const trace = buildTrace(props.xValues, props.yValues);
    Plotly.newPlot('plot_4', [trace], layout, config);
}
</script>



<style scoped></style>