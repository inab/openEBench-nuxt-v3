<template>
    <div id="plot_3"></div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import Plotly from 'plotly.js-dist';

// Define props
const props = defineProps<{
    labels: string[];
    values: number[];
    title?: string;
    height?: number;
}>();

// Set defaults for optional props
const { title = '', height = 300 } = props;

// Define layout and config as reactive objects
const layout = {
    showlegend: true,
    hoverlabel: { bgcolor: '#FFF' },
    height: height,
    autosize: true,
    margin: {
        t: 20,
        l: 0,
        r: 0,
        b: 20,
    },
    title: { text: title, x: 0.5, xanchor: 'center', yanchor: 'top' },

};

const config = {
    responsive: true,
    displayModeBar: false,
};

// Watch for height prop changes and update the layout
watch(() => props.height, (newHeight) => {
    layout.height = newHeight ?? 300;
    plotChart();
});

// Plot the chart when the component is mounted
onMounted(() => {
    plotChart();
});

// Plot the chart
function plotChart() {
    const trace = {
        labels: props.labels,
        values: props.values,
        type: 'pie',
        hole: 0.4,
        direction: 'clockwise',
        sort: false,
        marker: {
            colors: ['#15264a', '#4f71b8', '#bdc6d9'],
        },
        hovertemplate:
            '<b>%{label}</b><br>%{value:,d} instances<br>%{percent:.0%} of all instances<extra></extra>',
    };
    Plotly.newPlot('plot_3', [trace], layout, config);
}

</script>

<style scoped></style>