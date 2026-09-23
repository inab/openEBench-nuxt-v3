<template>
    <div class="ml-8" id="plot_5"></div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, watch, nextTick } from 'vue';
import Plotly from 'plotly.js-dist';
import { activeTabIndex } from '@/components/Common/state.js';

// Define props with TypeScript types
const props = defineProps<{
  tools: object;
  publications: object;
  citations: object;
  title?: string;
  height?: number;
}>();

// Set default values for optional props

// Define layout and configuration objects
const layout: Partial<Plotly.Layout> = {
    grid: {
        rows: 2,
        columns: 1,
        roworder: 'top to bottom',
    },
    yaxis: {
        title: 'Number of publications',
    },
    yaxis2: {
        title: 'Citations (last 3 years)',
        side: 'left',
        showgrid: false,
        range: [0, props.citations.y[0] * 1.2],
    },
    xaxis: {
        title: 'journal',
    },
    autosize: true,
    margin: {
        autoexpand: true,
        t: 10,
        l: 90
    },
    hoverlabel: {
        bgcolor: '#FFF',
    },
    height: props.height ?? 500,
    title: {
        text: props.title || '',
        font: {
            size: 16,
        },
    },
};

const config: Partial<Plotly.Config> = {
    responsive: true,
    displayModeBar: false,
};

// Function to initialize the plot
const plotChart = () => {

    const tracePublications : Partial<Plotly.PlotData> = {
        x: props.publications.x,
        y: props.publications.y,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Publications',
        marker: {
            color: '#0e3487',
            size: 6,
        },
        line: {
            color: '#0e3487',
            width: 1,
            dash: 'dash',
        },
        hovertemplate: '%{y} publications<extra></extra>',
        xaxis: 'x',
        yaxis: 'y',
        showlegend: false,
    }

    const traceCitations : Partial<Plotly.PlotData> = {
        x: props.citations.x,
        y: props.citations.y,
        name: 'Citation',
        marker: {
            color: '#ff213f',
            size: 6,
        },
        line: {
            color: '#ff213f',
            width: 1,
        },
        hovertemplate: '%{y} citations in the last 3 years <extra></extra>',
        xaxis: 'x',
        yaxis: 'y2',
        showlegend: false,
    }
    
    const data: Partial<Plotly.PlotData>[] = [tracePublications, traceCitations];

    Plotly.newPlot('plot_5', data, layout, config);
};

// Mount the chart when the component is mounted
onMounted(() => {
    plotChart();
});

watch(activeTabIndex, async () => {
    await nextTick();
    Plotly.relayout('plot_5', { autosize: true });
});
</script>