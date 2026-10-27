<template>
	<div ref="plotElement" :style="{ height: height + 'px', width: '100%' }"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, nextTick, ref } from 'vue';
import Plotly from 'plotly.js-dist';
import { activeTabIndex } from '@/components/Common/state.js';
import { resizePlot } from '~/utils/resizePlot';

const plotElement = ref<HTMLDivElement | null>(null);

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
const { title = '', height = 300 } = props;

// Define layout and config as reactive objects
const layout: Partial<Plotly.Layout> = {
	yaxis: { title: { text: '' } },
	xaxis: { title: { text: '' } },
	height: height,
	autosize: true,
	margin: { b: 40, t: 0, r: 0, l: 0 },
	title: { text: title, x: 0.5, xanchor: 'center' as const, yanchor: 'top' as const },
	hoverlabel: { bgcolor: '#FFF' },
};

const config = {
	responsive: true,
	displayModeBar: false,
};

// Watch for height prop changes and update the layout
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

// Plot the chart
async function plotChart() {
	await nextTick();
	const element = plotElement.value;
	if (!element?.isConnected) {
		return;
	}

	const trace: Partial<Plotly.PlotData> = {
		type: 'sunburst',
		labels: props.labels,
		parents: props.parents,
		values: props.values,
		branchvalues: 'total',
		textinfo: 'label',
		rotation: 152,
		marker: {
			autocolorscale: false,
			colors: ['#ffffff', '#e0e0e0', '#649e64', '#f5971b', '#faebbe', '#87c787'],
		},
		text: props.text,
		hovertemplate:
			'<b>%{label}</b><br>' +
			'%{value:,d} software<br>' +
			'%{percentParent:.1%} of %{text}<extra></extra>',
	};
	if (element.classList.contains('js-plotly-plot')) {
		await Plotly.react(element, [trace], layout, config);
	} else {
		await Plotly.newPlot(element, [trace], layout, config);
	}
	await resizePlot(element, Plotly);
}

watch(() => [props.labels, props.parents, props.values, props.text], plotChart, { deep: true });

watch(activeTabIndex, async () => {
	await nextTick();
	await resizePlot(plotElement.value, Plotly);
});
</script>
