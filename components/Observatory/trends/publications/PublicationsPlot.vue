<template>
    <div class="ml-8" id="plot_5"></div>
</template>

<script setup lang="ts">
import { defineProps, onMounted } from 'vue';
import Plotly from 'plotly.js-dist';

// Define props with TypeScript types
const props = defineProps<{
    xValues: string[];
    yPercentageValues: number[];
    yIFValues: number[];
    textPercentageTools: number[];
    textPercentageJournals: number[];
    title?: string;
    height?: number;
}>();

// Set default values for optional props
const { title = '', height = 500 } = props;

// Define layout and configuration objects
const layout: Partial<Plotly.Layout> = {
    grid: {
        rows: 2,
        columns: 1,
        roworder: 'top to bottom',
    },
    yaxis: {
        title: {text: 'Percentage', standoff: 15},
        tickformat: '.2%',
    },
    xaxis: {
        title: '',
    },
    yaxis2: {
        title: 'Impact Factor (five years)',
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
    height,
    title: {
        text: title,
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
    const tracePercentage: Partial<Plotly.PlotData> = {
        x: props.xValues,
        y: props.yPercentageValues,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Percentage of publications',
        marker: {
            color: '#15264a',
            size: 6,
        },
        line: {
            color: '#15264a',
            width: 1,
        },
        hovertemplate:
            '%{text} publications about tools out of %{customdata} total publications <extra></extra>',
        text: props.textPercentageTools,
        customdata: props.textPercentageJournals,
        textposition: [
            'center right',
            'bottom left',
            'bottom left',
            'bottom center',
            'top center',
            'bottom center',
            'top center',
            'bottom center',
            'top center',
            'top center',
        ],
        xaxis: 'x',
        yaxis: 'y1',
        showlegend: false,
    };

    const traceIFTools: Partial<Plotly.PlotData> = {
        x: props.xValues,
        y: props.yIFValues,
        name: 'Tools publications',
        marker: {
            color: '#eb9b34',
            size: 6,
        },
        line: {
            color: '#eb9b34',
            width: 1,
        },
        hovertemplate:
            'Tool publications in %{x} <br> Impact factor: %{y:.2f} <extra></extra>',
        xaxis: 'x',
        yaxis: 'y2',
        showlegend: false,
    };

    const data: Partial<Plotly.PlotData>[] = [tracePercentage, traceIFTools];

    Plotly.newPlot('plot_5', data, layout, config);
};

// Mount the chart when the component is mounted
onMounted(() => {
    plotChart();
});
</script>