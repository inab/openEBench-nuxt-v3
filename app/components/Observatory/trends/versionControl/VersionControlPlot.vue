<template>
	<div ref="plotElement"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, nextTick, ref } from 'vue';
import Plotly from 'plotly.js-dist';
import { activeTabIndex } from '@/components/Common/state.js';
import { resizePlot } from '~/utils/resizePlot';

const plotElement = ref<HTMLDivElement | null>(null);

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
const labels: Record<string, string> = {
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
		title: { text: 'Number of software' },
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

// Function to plot the chart
async function plotChart() {
	await nextTick();
	const element = plotElement.value;
	if (!element?.isConnected) {
		return;
	}

	// Define the data array directly
	const data: Partial<Plotly.PlotData>[] = [
		{
			type: 'bar',
			x: props.xValues,
			y: props.yValues.map((value) => labels[value] as string),
			orientation: 'h',
			marker: {
				color: '#6fad6f',
			},
			hoverinfo: 'x',
			hovertemplate: '%{x:,d} software <extra></extra>',
		},
	];

	// Pass the data and layout directly to Plotly
	if (element.classList.contains('js-plotly-plot')) {
		await Plotly.react(element, data, layout, config);
	} else {
		await Plotly.newPlot(element, data, layout, config);
	}
}

watch(activeTabIndex, async () => {
	await nextTick();
	await resizePlot(plotElement.value, Plotly);
});
</script>

<style scoped></style>
