<template>
	<div>
		<div :id="props.divId"></div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, watch, nextTick } from 'vue';
import Plotly from 'plotly.js-dist';
import { activeTabIndex } from '@/components/Common/state.js';
import { resizePlot } from '~/utils/resizePlot';

interface BubbleScore {
	indicator: string;
	scores: number[];
	count: number[];
	percent: number[];
}

const props = defineProps<{
	divId: string;
	collection: string;
	collectionScores: BubbleScore[];
	indicatorsLabels: { [key: string]: string };
	controlScores: BubbleScore[];
	collectionColors: Array<string>;
	collectionColorsLines: Array<string>;
	title?: string;
	height?: number;
}>();

const config = {
	responsive: true,
	displayModeBar: false,
};

const buildControlColors = () => {
	return Array(Object.keys(props.indicatorsLabels).length).fill('#bfbfbf');
};

buildControlColors();
buildControlColors();

const build_trace = (
	scores: BubbleScore[],
	labels: { [key: string]: string },
	collectionTitle: string,
	colors: Array<string>,
	colorsLines: Array<string>,
	mode: string
) => {
	const traces = [];

	for (let i = 0, len = scores.length; i < len; i++) {
		const item = scores[i];
		if (!item) continue;
		const trace = {
			y: Array(item.scores.length).fill(labels[item.indicator]),
			x: item.scores,
			name: collectionTitle + ' - ' + item.indicator,
			customdata: item.count,
			text: item.percent,
			textposition: 'inside',
			texttemplate: '%{text:,.1%}',
			hovertemplate: 'Score: %{x:.2f}<br>Tools: %{customdata:,}<br>Percentage: %{text:,.1%}',
			mode, // 'markers+text' shows text inside
			textfont: {
				size: 14,
			},
			marker: {
				size: item.percent,
				sizeref: 0.0003, // scaling factor
				sizemode: 'area',
				color: Array(item.scores.length).fill(colors[i]),
				line: {
					width: 1.5,
					color: Array(item.scores.length).fill(colorsLines[i]),
				},
			},
		};
		traces.push(trace);
	}
	return traces;
};

const build_control_collection_traces = () => {
	let controlCollectionTraces: ReturnType<typeof build_trace> = [];

	// control scores
	if (props.collection !== 'tools') {
		const traceControl = build_trace(
			props.controlScores,
			props.indicatorsLabels,
			'All tools',
			Array(props.controlScores.length).fill('#bfbfbf'),
			Array(props.controlScores.length).fill('#bfbfbf'),
			'markers'
		);

		controlCollectionTraces = controlCollectionTraces.concat(traceControl);
	}

	// collection scores
	const collectionTitle = props.collection === 'tools' ? 'All tools' : props.collection;
	const traceCollection = build_trace(
		props.collectionScores,
		props.indicatorsLabels,
		collectionTitle,
		props.collectionColors,
		props.collectionColorsLines,
		'markers+text'
	);
	controlCollectionTraces = controlCollectionTraces.concat(traceCollection);

	return controlCollectionTraces;
};

onMounted(() => {
	const traces = build_control_collection_traces();
	const reversedLabels = Object.values(props.indicatorsLabels).reverse();
	const layout: Partial<Plotly.Layout> = {
		yaxis: {
			title: { text: '' },
			showline: false,
			categoryorder: 'array',
			categoryarray: reversedLabels,
		},
		xaxis: {
			title: { text: 'Score' },
			zeroline: false,
			showline: true,
		},
		showlegend: true,
		height: props.height || 350,
		hovermode: 'closest',
		hoverlabel: { bgcolor: '#FFF' },
		autosize: true,
		margin: {
			autoexpand: true,
			t: 20,
			l: 150,
		},
		title: { text: props.title || '' },
	};

	Plotly.newPlot(props.divId, traces, layout, config);

	watch(activeTabIndex, async () => {
		await nextTick();
		await resizePlot(props.divId, Plotly);
	});
});
</script>
