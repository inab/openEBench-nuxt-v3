<template>
    <div id="plot_1" :style="{ height: height + 'px', width: '100%' }"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, nextTick } from 'vue';
import Plotly from 'plotly.js-dist';
import { activeTabIndex } from '@/components/Common/state.js';

// Define props
const props = defineProps<{
    labels: string[];
    parents: string[];
    values: number[];
    text: string[];
    title?: string;
    height?: number;
}>();

// Defaults for optional props
const { title = '', height = 280 } = props;

// Define layout and config as reactive objects
const layout = {
    yaxis: { title: '' },
    xaxis: { title: '' },
    height: height,
    autosize: true,
    margin: { b: 30, t: 10, r: 50, l: 90 },
    title: { text: title, x: 0.5, xanchor: 'center', yanchor: 'top' },
    hoverlabel: { bgcolor: '#FFF' },
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
        type: 'sunburst',
        labels: props.labels,
        parents: props.parents,
        values: props.values,
        branchvalues: 'total',
        textinfo: 'label',
        rotation: 152,
        marker: {
            autocolorscale: false,
            colors: ['#ffffff', '#e0e0e0', '#273e6e', '#f5971b', '#faebbe', '#3a5ba1'],
        },
        text: props.text,
        hovertemplate:
            '<b>%{label}</b><br>' +
            '%{value:,d} instances<br>' +
            '%{percentParent:.1%} of %{text}<extra></extra>',
    };
    Plotly.newPlot('plot_1', [trace], layout, config);
}

watch(activeTabIndex, async () => {
    await nextTick(); 
    Plotly.relayout('plot_1', { autosize: true });
});
</script>

<style scoped>

#plot_1 {
    width: 100%;
}
</style>
