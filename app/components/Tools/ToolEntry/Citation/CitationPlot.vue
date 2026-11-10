<template>
	<div class="citation-plot">
		<div class="plot-controls">
			<div class="plot-buttons">
				<UTooltip
					v-if="showCumulativeButton"
					:text="cumulativeTooltip()"
					:content="{ side: 'bottom', sideOffset: 6, align: 'start' }"
					:delay-duration="8"
					:ui="{
						content: 'bg-gradient-to-b from-black/50 to-black/70 text-white ring-black/20',
					}"
				>
					<UButton
						type="button"
						class="plot-button"
						:class="{ 'plot-button--active': cumulativeActive }"
						color="neutral"
						:variant="cumulativeActive ? 'solid' : 'soft'"
						:aria-pressed="cumulativeActive"
						@click="cumulativeActive = !cumulativeActive"
					>
						<UIcon
							:name="cumulativeActive ? 'i-mdi-radiobox-marked' : 'i-mdi-radiobox-blank'"
							aria-hidden="true"
						/>
						Cumulative
					</UButton>
				</UTooltip>

				<UTooltip
					v-if="dataTraces.length > 1"
					:text="mergeTooltip()"
					:content="{ side: 'bottom', sideOffset: 6, align: 'start' }"
					:delay-duration="8"
					:ui="{
						content: 'bg-gradient-to-b from-black/50 to-black/70 text-white ring-black/20',
					}"
				>
					<UButton
						type="button"
						class="plot-button"
						:class="{ 'plot-button--active': mergeActive }"
						color="neutral"
						:variant="mergeActive ? 'solid' : 'soft'"
						:aria-pressed="mergeActive"
						@click="mergeActive = !mergeActive"
					>
						<UIcon
							:name="mergeActive ? 'i-mdi-radiobox-marked' : 'i-mdi-radiobox-blank'"
							aria-hidden="true"
						/>
						Merge all publication counts
					</UButton>
				</UTooltip>
			</div>

			<p v-if="message" class="plot-message">
				<UIcon name="i-mdi-information-outline" aria-hidden="true" />
				{{ message }}
			</p>
		</div>

		<div
			ref="plotElement"
			class="citation-plot__chart"
			role="img"
			aria-label="Publication citations by year"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import Plotly from 'plotly.js-dist';
import { resizePlot } from '~/utils/resizePlot';

interface CitationYear {
	year: number;
	citations: number;
}

interface CitationTrace {
	id: string;
	label?: string;
	title?: string;
	data: CitationYear[];
}

const props = withDefaults(
	defineProps<{
		dataTraces: CitationTrace[];
		colors?: string[];
		showlegend?: boolean;
		message?: string | null;
	}>(),
	{
		colors: () => [],
		showlegend: false,
		message: null,
	}
);

const plotElement = ref<HTMLDivElement | null>(null);
const cumulativeActive = ref(false);
const mergeActive = ref(false);

const showCumulativeButton = computed(
	() => props.dataTraces.length !== 1 || (props.dataTraces[0]?.data.length ?? 0) !== 1
);

const cumulativeTooltip = () => {
	if (cumulativeActive.value) {
		return mergeActive.value
			? 'Show combined total, not accumulated'
			: 'Show yearly values, not accumulated';
	}

	return mergeActive.value ? 'Accumulate the combined total' : 'Accumulate each series over time';
};

const mergeTooltip = () => {
	if (mergeActive.value) {
		return cumulativeActive.value
			? 'Split into separate accumulated series'
			: 'Split into separate series';
	}

	return cumulativeActive.value
		? 'Combine into one cumulative line'
		: 'Combine all series into one line';
};

function buildCumulative(traces: CitationTrace[]) {
	return traces.map((trace) => {
		let total = 0;
		return {
			...trace,
			data: trace.data.map(({ year, citations }) => {
				total += citations;
				return { year, citations: total };
			}),
		};
	});
}

function buildMerge(): CitationTrace[] {
	const byYear = new Map<number, number>();

	props.dataTraces.forEach((trace) => {
		trace.data.forEach(({ year, citations }) => {
			byYear.set(year, (byYear.get(year) || 0) + citations);
		});
	});

	return [
		{
			id: 'merged',
			label: 'All publications',
			title: 'All publications',
			data: Array.from(byYear, ([year, citations]) => ({ year, citations })).sort(
				(first, second) => first.year - second.year
			),
		},
	];
}

function escapePlotText(value: string) {
	return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

async function renderPlot() {
	await nextTick();
	const element = plotElement.value;
	if (!element?.isConnected) return;

	const merged = mergeActive.value;
	const traces = (mergeActive.value ? buildMerge() : props.dataTraces).map((trace) => ({
		...trace,
		data: cumulativeActive.value ? buildCumulative([trace])[0]?.data || [] : trace.data,
	}));
	const lineDash = merged ? 'dot' : 'solid';
	const plotData: Partial<Plotly.PlotData>[] = traces.map((trace, index) => {
		const color = merged ? '#37474F' : props.colors[index] || '#0b579f';
		const label = escapePlotText(trace.label || trace.title || trace.id);

		return {
			x: trace.data.map(({ year }) => year),
			y: trace.data.map(({ citations }) => citations),
			type: 'scatter',
			mode: 'lines+markers',
			name: label,
			...(merged ? {} : { legendgroup: trace.id }),
			line: { color, dash: lineDash, width: merged ? 2 : 1.8 },
			marker: { color, size: 6 },
			hovertemplate: `<b>${label}</b><br>Year: %{x}<br>Citations: %{y:,d}<extra></extra>`,
		};
	});

	const layout: Partial<Plotly.Layout> = {
		autosize: true,
		height: 360,
		margin: { l: 60, r: 24, b: 55, t: 12, pad: 4 },
		template: 'plotly_white',
		showlegend: merged ? false : props.showlegend,
		xaxis: {
			title: { text: 'Year' },
			tickformat: 'd',
			dtick: 1,
			automargin: true,
		},
		yaxis: {
			title: { text: 'Citations' },
			rangemode: 'tozero',
			automargin: true,
		},
		hoverlabel: { bgcolor: '#fff' },
		hovermode: 'closest',
	};
	const config: Partial<Plotly.Config> = {
		displaylogo: false,
		displayModeBar: false,
		responsive: true,
	};

	if (element.classList.contains('js-plotly-plot')) {
		await Plotly.react(element, plotData, layout, config);
	} else {
		await Plotly.newPlot(element, plotData, layout, config);
	}

	await resizePlot(element, Plotly);
}

onMounted(renderPlot);

watch(
	() => [
		props.dataTraces,
		props.colors,
		props.showlegend,
		cumulativeActive.value,
		mergeActive.value,
	],
	renderPlot,
	{ deep: true }
);

onBeforeUnmount(() => {
	if (plotElement.value?.classList.contains('js-plotly-plot')) {
		Plotly.purge(plotElement.value);
	}
});
</script>

<style scoped>
.citation-plot {
	min-width: 0;
}

.plot-controls {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	margin: 1.25rem 0 0.5rem;
}

.plot-buttons {
	display: flex;
	flex-wrap: wrap;
	gap: 1.25rem;
}

.plot-button {
	border: 0 !important;
	border-radius: 999px;
	background: #f3f4f6 !important;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
}

.plot-button:not(.plot-button--active):hover {
	background: #e9ecef !important;
}

.plot-button--active {
	background: #0b579f !important;
	color: #ffffff !important;
}

.plot-button.plot-button--active:hover {
	background: #1e64a7 !important;
}

.plot-button:focus-visible {
	outline: 2px solid #0b579f;
	outline-offset: 2px;
}

.plot-message {
	display: inline-flex;
	align-items: center;
	gap: 0.35rem;
	margin: 0;
	color: rgba(0, 0, 0, 55%);
	font-size: 0.85rem;
}

.citation-plot__chart {
	width: 100%;
	min-width: 0;
}

@media (max-width: 700px) {
	.plot-controls {
		align-items: flex-start;
		flex-direction: column;
	}
}
</style>
