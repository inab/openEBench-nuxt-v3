<template>
	<div id="plot_23" ref="plotContainer"></div>
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
const types_data = computed(() => dataStore.types);
const types_data_control = computed(() => dataStore.typesControl);
const currentCollection = computed(() => observatoryStore.getCurrentCollection);
const plotContainer = ref<HTMLElement | null>(null);

const layout: Partial<Plotly.Layout> = {
	autosize: true,
	height: 340,
	yaxis: {
		title: { text: '' },
		categoryorder: 'total ascending' as const,
	},
	xaxis: {
		title: { text: 'Percentage of software' },
		tickformat: ',.0%',
	},
	margin: {
		autoexpand: true,
		t: 0,
		l: 130,
	},
	legend: {
		x: 0.8,
		y: 1.1,
		xanchor: 'center',
		yanchor: 'top',
		orientation: 'h',
	},
	hovermode: 'y unified',
};

const config = {
	responsive: true,
	displayModeBar: false,
};

// Methods
function buildData(typesData: any) {
	const typeLabels: Record<string, string> = {
		cmd: 'Command-line tool',
		web: 'Web application',
		lib: 'Library',
		app: 'Application',
		db: 'Database',
		undefined: 'Undefined',
		soap: 'SOAP service',
		rest: 'REST API',
		plugin: 'Plugin',
		suite: 'Software suite',
		script: 'Script',
		workbench: 'Workbench',
		workflow: 'Workflow',
		sparql: 'SPARQL endpoint',
		ontology: 'Ontology',
	};

	const newValues: { values: Plotly.Datum[]; types: string[] } = {
		values: [],
		types: [],
	};

	for (const [key, value] of Object.entries(typesData)) {
		const label = typeLabels[key] || key; // fallback to key if no mapping exists
		newValues.types.push(label + '  ');
		newValues.values.push(value as Plotly.Datum);
	}

	return newValues;
}

async function updatePlot() {
	await nextTick();
	const plotElement = getPlotElement(plotContainer.value);
	if (!plotElement) return;

	const data = buildData(types_data.value);
	const dataControl = buildData(types_data_control.value);

	//
	const trace: Partial<Plotly.PlotData> = {
		x: data.values,
		y: data.types,
		type: 'bar' as const,
		orientation: 'h' as const,
		marker: {
			color: '#6fc765',
		},
		hovertemplate: '"%{x}" of software <extra></extra>',
		name: currentCollection.value,
	};

	//
	const traceControl: Partial<Plotly.PlotData> = {
		x: dataControl.values,
		y: dataControl.types,
		type: 'bar' as const,
		orientation: 'h' as const,
		marker: {
			color: 'lightgrey',
		},
		hovertemplate: '"%{x}" of software <extra></extra>',
		name: 'All tools',
	};

	const traces: Partial<Plotly.PlotData>[] = [];
	if (currentCollection.value !== 'tools') {
		traces.push(traceControl);
	}
	traces.push(trace);

	if (plotElement.classList.contains('js-plotly-plot')) {
		await Plotly.react(plotElement, traces, layout, config);
	} else {
		await Plotly.newPlot(plotElement, traces, layout, config);
	}
}

watch([types_data, types_data_control, currentCollection], updatePlot, {
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
#plot_23 {
	padding: 0%;
	margin: 0%;
	width: 100%;
	min-width: 0;
	min-height: 340px;
	max-width: 100%;
	overflow: hidden;
}

.v-card {
	padding: 4em;
	clear: left;
}

#plot_23 .modebar {
	display: none !important;
}
</style>
