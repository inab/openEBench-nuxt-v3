<template>
	<div id="plot_21" ref="plotContainer"></div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted } from 'vue';
import { useData } from '~~/stores/observatory/data';
import Plotly from 'plotly.js-dist';
import { activeTabIndex } from '@/components/Common/state.js';
import { getPlotElement, resizePlot } from '~/utils/resizePlot';

// Store
const dataStore = useData();
const coverageSources = computed(() => dataStore.coverageSources);
type CoverageSourceData = {
	counts?: Record<string, number[]>;
	counts_cummulative?: Record<string, number>;
};
const coverageData = computed<CoverageSourceData>(() => {
	const source: unknown = coverageSources.value;
	if (!source || typeof source !== 'object') return {};

	const nestedData = (source as Record<string, unknown>).data;
	if (nestedData && typeof nestedData === 'object') {
		return nestedData as CoverageSourceData;
	}

	return source as CoverageSourceData;
});
const plotContainer = ref<HTMLElement | null>(null);

const props = defineProps<{
	small: boolean;
}>();

const colors_primary = [
	'#404040',
	'#606060',
	'#808080',
	'#A0A0A0',
	'#C0C0C0',
	'#DADADA',
	'#F0F0F0',
];
const titles: Record<string, string> = {
	github: 'GitHub',
	galaxy: 'Galaxy Europe',
	bioconda: 'Bioconda',
	toolshed: 'Galaxy Toolshed',
	biotools: 'bio.tools',
	bioconductor: 'Bioconductor',
	sourceforge: 'SourceForge',
	opeb_metrics: 'OpenEBench',
};

// Layout y configuración
const layout_base: Partial<Plotly.Layout> = {
	barmode: 'stack',
	xaxis: {
		title: { text: 'Number of sources' },
	},
	yaxis: {
		title: { text: 'Number of software' },
	},
	autosize: true,
	height: 390,
	margin: {
		autoexpand: true,
		t: 10,
		b: 110,
	},
	legend: {
		orientation: 'h',
		y: -0.35,
		x: 0.5,
		xanchor: 'center',
	},
};

const config = {
	responsive: true,
	displayModeBar: false,
};

const layout = computed(() => {
	const l = { ...layout_base };
	if (props.small) {
		l.height = 420;
		l.margin = { ...layout_base.margin, b: 140 };
		if (l.legend) l.legend.y = -0.4;
	}
	return l;
});

// Function to construct bar traces
function build_bar_traces(colors: Record<string, string | undefined>) {
	const traces: Partial<Plotly.PlotData>[] = [];
	if (coverageData.value?.counts) {
		for (const [key] of Object.entries(coverageData.value.counts)) {
			const counts = coverageData.value.counts[key] ?? [];
			const sourceTitle = titles[key] ?? key;
			const trace = {
				x: counts.map((_, index) => index + 1),
				y: counts,
				name: sourceTitle,
				marker: {
					color: colors[key] ?? colors_primary[0],
				},
				type: 'bar' as const,
				meta: sourceTitle,
				hovertemplate:
					'Of instances found in %{x} sources: <br>' +
					'%{y:,d} are found in %{meta} <extra></extra>',
			};
			traces.push(trace);
		}
	}
	return traces;
}

// Function to construct the line trace
function build_line_trace(n: number): number {
	return coverageData.value?.counts_cummulative
		? (coverageData.value.counts_cummulative[n] as number)
		: 0;
}

async function updatePlot() {
	const colors = {
		github: colors_primary[0],
		galaxy: colors_primary[1],
		bioconda: colors_primary[2],
		toolshed: colors_primary[3],
		bioconductor: colors_primary[4],
		sourceforge: colors_primary[5],
		biotools: colors_primary[6],
	};

	const data = build_bar_traces(colors);
	const cumulative = coverageData.value?.counts_cummulative ?? {};
	const cumulativeSourceCount = Object.keys(cumulative)
		.map(Number)
		.filter(Number.isFinite)
		.sort((a, b) => a - b);

	const lineData: Partial<Plotly.PlotData> = {
		x: cumulativeSourceCount,
		y: cumulativeSourceCount.map(build_line_trace),
		type: 'scatter' as const,
		mode: 'lines+markers' as const,
		marker: {
			color: '#FFD700',
		},
		name: 'Instances',
		hovertemplate: '%{x} sources or less: %{y:,d} instances <extra></extra>',
	};

	data.push(lineData);

	const plotElement = getPlotElement(plotContainer.value);
	if (!plotElement) return;

	try {
		if (plotElement.classList.contains('js-plotly-plot')) {
			await Plotly.react(plotElement, data, layout.value, config);
		} else {
			await Plotly.newPlot(plotElement, data, layout.value, config);
		}
	} catch (error) {
		console.error('Error rendering Observatory coverage plot:', error);
	}
}

onMounted(updatePlot);

watch([coverageSources, () => props.small], updatePlot, {
	deep: true,
	flush: 'post',
});

watch(activeTabIndex, async () => {
	await nextTick();
	await resizePlot(plotContainer.value, Plotly);
});
</script>

<style scoped>
#plot_21 {
	padding: 0%;
	margin: 0%;
	width: 100%;
	min-width: 0;
	min-height: 390px;
	max-width: 100%;
}

#plot_21 .modebar {
	display: none !important;
}

.js-plotly-plot .plotly .main-svg .infolayer .legend {
	width: 100% !important;
}
</style>
