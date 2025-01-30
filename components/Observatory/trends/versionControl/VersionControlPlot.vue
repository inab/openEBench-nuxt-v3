<template>
    <div id="plot_4"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, nextTick } from 'vue';
import Plotly from 'plotly.js-dist';
import { activeTabIndex } from '@/components/Common/state.js';

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
        standoff: 20,
        tickvals: props.yValues.map((_, index) => index),
        ticktext: props.yValues.map(
            (value) => (labels[value] || value) + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' //  Adding manual space to separete from the axis, standoff not working
        ),
        showLine: true,

    },
    xaxis: {
        title: 'Number of instances',
    },
    height: height,
    autosize: true,
    margin: {
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

// Function to plot the chart
function plotChart() {
    // Define the data array directly
    const data: Partial<Plotly.PlotData>[] = [
        {
            type: 'bar',
            x: props.xValues,
            y: props.yValues.map((value) => labels[value] || value),
            orientation: 'h',
            marker: {
                color: '#4f71b8',
            },
            hoverinfo: 'x',
            hovertemplate: '%{x:,d} instances <extra></extra>',
        },
    ];

    // Pass the data and layout directly to Plotly
    Plotly.newPlot('plot_4', data, layout, config);
}

watch(activeTabIndex, async () => {
    await nextTick();
    Plotly.relayout('plot_4', { autosize: true });
});
</script>

<style scoped></style>
