<template>
    <div id="plot_3"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, nextTick } from 'vue';
import Plotly from 'plotly.js-dist';
import { activeTabIndex } from '@/components/Common/state.js';

// Define props
const props = defineProps<{
    labels: string[];
    values: number[];
    title?: string;
    height?: number;
}>();

// Set defaults for optional props
const { title = '', height = 250 } = props;

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
    layout.height = newHeight ?? 280;
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
            colors: ['#41388c', '#a29cd6', '#c9c5e3'],
        },
        hovertemplate:
            '<b>%{label}</b><br>%{value:,d} software<br>%{percent:.0%} of all software<extra></extra>',
    };
    Plotly.newPlot('plot_3', [trace], layout, config);
}

watch(activeTabIndex, async () => {
    await nextTick(); 
    Plotly.relayout('plot_3', { autosize: true });
});

</script>
