<template>
	<div id="plot_22" ref="plotContainer"></div>
</template>

<script setup lang="ts">
import { computed, watch, nextTick, ref } from 'vue';
import { useData } from '~~/stores/observatory/data';
import { useObservatory } from '~~/stores/observatory/index.js';
import Plotly from 'plotly.js-dist';
import { activeTabIndex } from '@/components/Common/state.js';
import { getPlotElement, resizePlot } from '~/utils/resizePlot';

// Store
const dataStore = useData();
const observatoryStore = useObservatory();

// Getters
interface CompletenessData {
	cummulative_features: { count_cumm_pct: Plotly.Datum[]; feat_num: Plotly.Datum[] };
	distribution_features: { x: Plotly.Datum[]; y: Plotly.Datum[] };
}

const completeness = computed(() => dataStore.completeness as unknown as CompletenessData);
const completenessControl = computed(
	() => dataStore.completenessControl as unknown as CompletenessData
);
const currentCollection = computed(() => observatoryStore.getCurrentCollection);
const plotContainer = ref<HTMLElement | null>(null);

const layout: Partial<Plotly.Layout> = {
	grid: {
		rows: 2,
		columns: 1,
		roworder: 'bottom to top',
	},
	yaxis: {
		title: { text: 'Percentage of <br> software' },
		tickformat: ',.0%',
	},
	xaxis: {
		ticksuffix: ' features or less',
		tickmode: 'array',
		showticksuffix: 'all',
		showticklabels: false,
	},
	xaxis2: {
		title: { text: 'Number of features' },
		ticksuffix: ' features',
		tickmode: 'array',
		showticksuffix: 'all',
	},
	yaxis2: {
		title: { text: 'Percentage of <br> software' },
		tickformat: ',.0%',
	},
	showlegend: true,
	legend: {
		x: 0.8,
		y: 1.2,
		xanchor: 'center',
		yanchor: 'top',
		orientation: 'h',
	},
	autosize: true,
	height: 340,
	margin: {
		autoexpand: true,
		t: 0,
	},
	hovermode: 'x unified',
};

const config = {
	responsive: true,
	displayModeBar: false,
};

// Methods
function buildTraces() {
	// Trace Line
	const traceLine: Partial<Plotly.PlotData> = {
		y: completeness.value.cummulative_features.count_cumm_pct,
		x: completeness.value.cummulative_features.feat_num,
		type: 'scatter' as const,
		mode: 'lines',
		marker: {
			color: '#3978ed',
		},
		yaxis: 'y2',
		xaxis: 'x',
		legendgroup: currentCollection.value,
		name: currentCollection.value,
		hovertemplate: '%{y} of software<extra></extra>',
	};

	// Trace Line Control
	const traceLineControl: Partial<Plotly.PlotData> = {
		y: completenessControl.value.cummulative_features.count_cumm_pct,
		x: completenessControl.value.cummulative_features.feat_num,
		type: 'scatter' as const,
		mode: 'lines',
		marker: {
			color: 'lightgrey',
		},
		yaxis: 'y2',
		xaxis: 'x',
		name: 'All tools',
		legendgroup: 'All tools',
		hovertemplate: '%{y} of software<extra></extra>',
	};

	// Trace Bar
	const traceBar: Partial<Plotly.PlotData> = {
		y: completeness.value.distribution_features.x,
		x: completeness.value.distribution_features.y,
		type: 'bar' as const,
		xaxis: 'x2',
		name: currentCollection.value,
		legendgroup: currentCollection.value,
		marker: {
			color: '#ff8957',
		},
		hovertemplate: '%{y} of software <extra></extra>',
	};

	// Trace Bar Control
	const traceBarControl: Partial<Plotly.PlotData> = {
		y: completenessControl.value.distribution_features.x,
		x: completenessControl.value.distribution_features.y,
		type: 'bar' as const,
		xaxis: 'x2',
		legendgroup: 'All tools',
		marker: {
			color: 'lightgrey',
		},
		name: 'All tools',
		hovertemplate: '%{y} of software have <br> %{x} features<extra></extra>',
	};

	let data: Partial<Plotly.PlotData>[];

	if (currentCollection.value === 'tools') {
		data = [traceBar, traceLine];
	} else {
		data = [traceBar, traceLine, traceBarControl, traceLineControl];
	}

	return data;
}

async function updatePlot() {
	await nextTick();
	const plotElement = getPlotElement(plotContainer.value);
	if (!plotElement) return;

	const data = buildTraces();

	if (plotElement.classList.contains('js-plotly-plot')) {
		await Plotly.react(plotElement, data, layout, config);
	} else {
		await Plotly.newPlot(plotElement, data, layout, config);
	}
}

watch([completeness, completenessControl, currentCollection], updatePlot, {
	deep: true,
	immediate: true,
	flush: 'post',
});

watch(activeTabIndex, async () => {
	await nextTick();
	await resizePlot(plotContainer.value, Plotly);
});
</script>

<style scoped>
#plot_22 {
	padding: 0%;
	margin: 0%;
	width: 100%;
	min-width: 0;
	min-height: 340px;
	max-width: 100%;
	overflow: hidden;
}

#plot_22 .modebar {
	display: none !important;
}

.js-plotly-plot .plotly .main-svg .infolayer .legend {
	width: 100% !important;
}
</style>
