<template>
	<div
		ref="plotElement"
		class="uptime-plot"
		role="img"
		aria-label="Website availability over time"
	/>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import Plotly from 'plotly.js-dist';
import { resizePlot } from '~/utils/resizePlot';

interface AvailabilityItem {
	access_time: number | null;
	date: string | number;
	code: number | null;
}

interface DaySlot {
	center: number;
	width: number;
}

const ERROR_CODES = [400, 403, 404, 408, 500, 502, 503, 504];
const DAY = 86_400_000;

const props = withDefaults(
	defineProps<{
		dataItems?: AvailabilityItem[];
		dtick?: number | string;
		width?: number | null;
		height?: number;
	}>(),
	{
		dataItems: () => [],
		dtick: DAY,
		width: null,
		height: 350,
	}
);

const plotElement = ref<HTMLDivElement | null>(null);

function isErrorCode(code: number | null) {
	return ERROR_CODES.includes(Number(code));
}

function dayCenter(date: string | number) {
	const day = new Date(date);
	day.setUTCHours(0, 0, 0, 0);
	return day.getTime() + DAY / 2;
}

function getOnlineGroups() {
	const groups: AvailabilityItem[][] = [];
	let currentGroup: AvailabilityItem[] = [];

	for (const item of props.dataItems) {
		if (item.access_time !== null && !isErrorCode(item.code)) {
			currentGroup.push(item);
		} else if (currentGroup.length) {
			groups.push(currentGroup);
			currentGroup = [];
		}
	}

	if (currentGroup.length) groups.push(currentGroup);
	return groups;
}

function getOfflineAndUnknownSlots() {
	const offline: DaySlot[] = [];
	const unknown: DaySlot[] = [];

	for (const item of props.dataItems) {
		const slot = { center: dayCenter(item.date), width: DAY };
		if (item.code === null) unknown.push(slot);
		else if (isErrorCode(item.code)) offline.push(slot);
	}

	return { offline, unknown };
}

function buildOnlineTraces(): Partial<Plotly.PlotData>[] {
	const groups = getOnlineGroups();
	const onlineItems = groups.flat();
	const traces: Partial<Plotly.PlotData>[] = groups.map((group, index) => ({
		x: group.map((item) => dayCenter(item.date)),
		y: group.map((item) => item.access_time as number),
		name: 'Online',
		legendgroup: 'online',
		showlegend: index === 0,
		mode: 'markers+lines',
		type: 'scatter',
		fill: 'tozeroy',
		fillcolor: 'rgba(111,176,129,0.2)',
		connectgaps: false,
		line: { color: 'rgba(111,176,129,0.8)', width: 1.5 },
		marker: { size: 5 },
		hovertemplate: '<b>Online</b><br>%{x|%d %b %Y}<br>%{y} ms <extra></extra>',
		hoveron: 'points+fills',
	}));

	if (onlineItems.length) {
		const average =
			onlineItems.reduce((sum, item) => sum + (item.access_time as number), 0) / onlineItems.length;
		const firstDate = new Date(props.dataItems[0].date);
		const lastDate = new Date(props.dataItems[props.dataItems.length - 1].date);
		firstDate.setDate(firstDate.getDate() - 1);
		lastDate.setDate(lastDate.getDate() + 1);

		traces.push({
			x: [firstDate, lastDate],
			y: [average, average],
			name: 'Average access time',
			showlegend: true,
			mode: 'lines',
			type: 'scatter',
			line: { color: 'rgba(111,176,129,0.6)', width: 1.5, dash: 'dash' },
			hovertemplate: '<b>Average access time</b><br>%{y:.2f} ms <extra></extra>',
		});
	}

	return traces;
}

function buildStatusBarTraces(
	slots: DaySlot[],
	color: string,
	label: string,
	legendgroup: string,
	maxAccessTime: number
): Partial<Plotly.PlotData>[] {
	if (!slots.length) return [];

	const totalHeight = 2 + maxAccessTime * 1.1;
	const baseHeight = totalHeight * 0.03;
	const x = slots.map((slot) => slot.center);
	const width = slots.map((slot) => slot.width);

	return [
		{
			x,
			y: Array(slots.length).fill(baseHeight),
			width,
			type: 'bar',
			marker: { color: `rgba(${color},0.8)` },
			name: label,
			legendgroup,
			showlegend: false,
			hoverinfo: 'skip',
		},
		{
			x,
			y: Array(slots.length).fill(totalHeight - baseHeight),
			width,
			type: 'bar',
			marker: { color: `rgba(${color},0.2)` },
			name: label,
			legendgroup,
			showlegend: true,
			hovertemplate: `<b>${label}</b><br>%{x|%d %b %Y}<extra></extra>`,
		},
	];
}

function buildStatusTraces(): Partial<Plotly.PlotData>[] {
	const times = props.dataItems
		.map((item) => item.access_time)
		.filter((time): time is number => typeof time === 'number' && Number.isFinite(time));
	const maxAccessTime = times.length ? Math.max(...times) : 100;
	const { offline, unknown } = getOfflineAndUnknownSlots();

	return [
		...buildStatusBarTraces(offline, '255,153,145', 'Offline', 'offline', maxAccessTime),
		...buildStatusBarTraces(
			unknown,
			'204,204,204',
			'No information available',
			'unknown',
			maxAccessTime
		),
	];
}

async function renderPlot() {
	await nextTick();
	const element = plotElement.value;
	if (!element?.isConnected) return;

	const traces = [...buildOnlineTraces(), ...buildStatusTraces()];
	const layout: Partial<Plotly.Layout> = {
		bargap: 0,
		barmode: 'stack',
		showlegend: true,
		autosize: props.width === null,
		height: props.height,
		...(props.width === null ? {} : { width: props.width }),
		margin: { l: 50, r: 50, b: 50, t: 20, pad: 4 },
		xaxis: {
			type: 'date',
			title: { text: 'Date' },
			dtick: Number(props.dtick),
			tickformat: '%d %b',
			tickangle: 45,
			showgrid: false,
		},
		yaxis: {
			title: { text: 'Access time (ms)' },
		},
		template: 'plotly_white',
		legend: {
			orientation: 'h',
			yanchor: 'bottom',
			y: -0.5,
			xanchor: 'left',
			x: 0.05,
			font: { size: 8 },
		},
		hoverlabel: { bgcolor: '#fff' },
		hovermode: 'closest',
	};
	const config: Partial<Plotly.Config> = {
		displaylogo: false,
		responsive: true,
		displayModeBar: false,
		modeBarButtonsToRemove: ['lasso'],
	};

	if (element.classList.contains('js-plotly-plot')) {
		await Plotly.react(element, traces, layout, config);
	} else {
		await Plotly.newPlot(element, traces, layout, config);
	}
	await resizePlot(element, Plotly);
}

onMounted(renderPlot);
watch(() => [props.dataItems, props.dtick, props.width, props.height], renderPlot, { deep: true });

onBeforeUnmount(() => {
	if (plotElement.value?.classList.contains('js-plotly-plot')) {
		Plotly.purge(plotElement.value);
	}
});
</script>

<style scoped>
.uptime-plot {
	display: block;
	width: 100%;
	min-width: 0;
}
</style>
