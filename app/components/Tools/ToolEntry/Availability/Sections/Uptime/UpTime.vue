<template>
	<div v-if="hasAllowedType && filteredWebpageTerms.length" class="uptime-section mb-8">
		<p class="urls-label">Monitored URLs</p>

		<div class="chip-row" aria-label="Monitored URLs">
			<button
				v-for="url in sortedWebpageTerms"
				:key="url"
				type="button"
				class="url-chip"
				:class="{ 'url-chip--active': selectedUrl === url }"
				:aria-pressed="selectedUrl === url"
				@click="selectUrl(url)"
			>
				<span class="dot" :class="dotClass(url)" aria-hidden="true" />
				{{ shortUrl(url) }}
			</button>
		</div>

		<div class="uptime-panel">
			<div v-if="statusesLoading || webAvailabilityLoading" class="loading-state">
				<USkeleton class="mb-3 h-16 w-full" />
				<USkeleton class="mb-2 h-8 w-1/2" />
				<USkeleton class="h-[350px] w-full" />
			</div>

			<div v-else-if="webAvailabilityError" class="no-data-notice notice-error" role="alert">
				<UIcon name="i-mdi-alert-circle-outline" aria-hidden="true" />
				<span>Could not reach the uptime service for this URL.</span>
			</div>

			<div v-else-if="webAvailabilityNoData" class="no-data-notice notice-nodata">
				<UIcon name="i-mdi-chart-timeline-variant-shimmer" aria-hidden="true" />
				<span>No uptime data recorded for this URL yet.</span>
				<a :href="selectedUrl" target="_blank" rel="noopener noreferrer" class="nodata-link">
					Visit site
					<UIcon name="i-mdi-open-in-new" aria-hidden="true" />
				</a>
			</div>

			<template v-else>
				<UpTimeStatus :status="status" :time="statusDays" :url="selectedUrl" />

				<UTabs
					v-if="availableRanges.length"
					v-model="activeRangeKey"
					:items="availableRanges"
					:ui="rangeTabsUi"
					class="range-tabs mt-2"
					value-key="key"
					variant="link"
					aria-label="Uptime history range"
				>
					<template #content="{ item }">
						<UptimePlot
							class="uptime-plot"
							:data-items="plotItems(item.key)"
							:dtick="rangeDtick(item.key)"
						/>
					</template>
				</UTabs>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import UptimePlot from './UptimePlot.vue';
import UpTimeStatus from './upTimeStatus.vue';
import { useToolEntryStore } from '~~/stores/tool_entry';

type AvailabilityStatus = 'UP' | 'DOWN' | 'NODATA' | 'ERROR' | 'UNKNOWN';
type RangeKey = 'week' | 'month' | 'sixMonths';

interface ToolTerm {
	term?: string;
}

interface UptimeTool {
	type?: Array<string | ToolTerm> | string | ToolTerm;
	webpage?: Array<{ term?: string }>;
}

interface AvailabilityItem {
	date?: string;
	code?: number | string;
}

interface AvailabilityRange {
	key: RangeKey;
	label: string;
}

const EXCLUDED_DOMAINS = ['github.com', 'gitlab.com'];
const ALLOWED_TYPES = ['web', 'rest', 'sparql', 'soap', 'workbench', 'suite'];
const RANGES: AvailabilityRange[] = [
	{ key: 'week', label: 'Week' },
	{ key: 'month', label: 'Month' },
	{ key: 'sixMonths', label: '6 months' },
];
const rangeTabsUi = {
	list: 'w-full flex-wrap gap-1 border-b border-[#dee2e6] p-0',
	trigger:
		'flex-1 rounded-none border-b-2 border-transparent px-3 py-2 text-[#495057] data-[state=active]:border-[#0b579f] data-[state=active]:font-semibold data-[state=active]:text-[#0b579f] hover:text-[#0b579f] focus-visible:outline-2 focus-visible:outline-[#0b579f] focus-visible:outline-offset-[-2px]',
	indicator: 'hidden',
	label: 'block w-full text-center',
	content: 'w-full min-w-0 pt-3',
};

const toolEntryStore = useToolEntryStore();
const tool = computed(() => toolEntryStore.Tool as UptimeTool);
const webAvailability = computed(() => toolEntryStore.WebAvailability);
const webAvailabilityLoading = computed(() => toolEntryStore.WebAvailabilityLoading);
const webAvailabilityError = computed(() => toolEntryStore.WebAvailabilityError);
const webAvailabilityNoData = computed(() => toolEntryStore.WebAvailabilityNoData);
const selectedUrl = ref('');
const urlStatuses = ref<Record<string, AvailabilityStatus>>({});
const statusesLoading = ref(false);
const activeRangeKey = ref<RangeKey | ''>('');

function getTerm(value: string | ToolTerm): string {
	return typeof value === 'string' ? value : value?.term || '';
}

const hasAllowedType = computed(() => {
	const values = Array.isArray(tool.value?.type)
		? tool.value.type
		: tool.value?.type
			? [tool.value.type]
			: [];

	return values.map(getTerm).some((type) => ALLOWED_TYPES.includes(type));
});

function isExcludedUrl(url: string) {
	try {
		const hostname = new URL(url).hostname.toLowerCase();
		return EXCLUDED_DOMAINS.some(
			(domain) => hostname === domain || hostname.endsWith(`.${domain}`)
		);
	} catch {
		return true;
	}
}

const filteredWebpageTerms = computed(() =>
	(tool.value?.webpage || [])
		.map((webpage) => webpage?.term?.trim() || '')
		.filter((url) => {
			try {
				const parsedUrl = new URL(url);
				return (
					(parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:') &&
					!isExcludedUrl(parsedUrl.href)
				);
			} catch {
				return false;
			}
		})
);

const sortedWebpageTerms = computed(() => {
	const rank: Record<AvailabilityStatus, number> = {
		UP: 0,
		DOWN: 1,
		NODATA: 2,
		ERROR: 3,
		UNKNOWN: 4,
	};

	return filteredWebpageTerms.value
		.map((url, index) => ({ url, index }))
		.sort(
			(a, b) =>
				rank[urlStatuses.value[a.url] || 'UNKNOWN'] - rank[urlStatuses.value[b.url] || 'UNKNOWN'] ||
				a.index - b.index
		)
		.map(({ url }) => url);
});

watch(
	() => (hasAllowedType.value ? filteredWebpageTerms.value : []),
	async (urls, _previousUrls, onCleanup) => {
		let cancelled = false;
		onCleanup(() => {
			cancelled = true;
		});

		selectedUrl.value = '';
		urlStatuses.value = {};
		activeRangeKey.value = '';

		if (!urls.length) {
			statusesLoading.value = false;
			toolEntryStore.resetWebAvailability();
			return;
		}

		statusesLoading.value = true;
		toolEntryStore.resetWebAvailability();

		try {
			const statuses = await toolEntryStore.retrieveWebAvailabilityStatuses(urls);
			if (cancelled) return;

			urlStatuses.value = statuses;
			selectedUrl.value = sortedWebpageTerms.value[0] || '';
			if (selectedUrl.value) {
				await toolEntryStore.retrieveWebAvailability([selectedUrl.value]);
			}
		} catch (error) {
			if (cancelled) return;
			console.error('Unable to retrieve uptime statuses:', error);
			urlStatuses.value = Object.fromEntries(urls.map((url) => [url, 'ERROR']));
			selectedUrl.value = urls[0] || '';
			if (selectedUrl.value) {
				await toolEntryStore.retrieveWebAvailability([selectedUrl.value]);
			}
		} finally {
			if (!cancelled) statusesLoading.value = false;
		}
	},
	{ immediate: true }
);

const availableRanges = computed(() =>
	RANGES.filter(({ key }) => availabilityItemsByRange(key).length > 0)
);

watch(
	availableRanges,
	(ranges) => {
		if (!ranges.some((range) => range.key === activeRangeKey.value)) {
			activeRangeKey.value = ranges[0]?.key || '';
		}
	},
	{ immediate: true }
);

const activeAvailabilityItems = computed(() =>
	availabilityItemsByRange(activeRangeKey.value)
		.slice()
		.sort((a, b) => {
			const firstDate = Date.parse(a?.date || '');
			const secondDate = Date.parse(b?.date || '');
			if (Number.isNaN(firstDate) || Number.isNaN(secondDate)) return 0;
			return firstDate - secondDate;
		})
);

function statusForItem(item?: AvailabilityItem): AvailabilityStatus {
	const code = Number(item?.code);
	if (!Number.isFinite(code)) return 'UNKNOWN';
	return code >= 200 && code < 400 ? 'UP' : 'DOWN';
}

const latestAvailabilityItem = computed(
	() => activeAvailabilityItems.value[activeAvailabilityItems.value.length - 1]
);
const status = computed(() => statusForItem(latestAvailabilityItem.value));
const statusDays = computed(() => {
	if (!latestAvailabilityItem.value) return 0;

	let days = 0;
	for (let index = activeAvailabilityItems.value.length - 1; index >= 0; index -= 1) {
		if (statusForItem(activeAvailabilityItems.value[index]) !== status.value) break;
		days += 1;
	}
	return days;
});

function shortUrl(url: string) {
	return url.replace(/^https?:\/\//, '');
}

function selectUrl(url: string) {
	if (selectedUrl.value === url) return;
	selectedUrl.value = url;
	activeRangeKey.value = '';
	toolEntryStore.resetWebAvailability();
	void toolEntryStore.retrieveWebAvailability([url]);
}

function dotClass(url: string) {
	let currentStatus = urlStatuses.value[url] || 'UNKNOWN';
	if (selectedUrl.value === url) {
		if (webAvailabilityLoading.value) currentStatus = 'UNKNOWN';
		else if (webAvailabilityError.value) currentStatus = 'ERROR';
		else if (webAvailabilityNoData.value) currentStatus = 'NODATA';
		else if (latestAvailabilityItem.value) currentStatus = status.value;
	}

	return {
		'dot-up': currentStatus === 'UP',
		'dot-down': currentStatus === 'DOWN',
		'dot-error': currentStatus === 'ERROR',
		'dot-nodata': currentStatus === 'NODATA',
		'dot-loading':
			(selectedUrl.value === url && webAvailabilityLoading.value) ||
			(statusesLoading.value && currentStatus === 'UNKNOWN'),
		'dot-unknown': currentStatus === 'UNKNOWN' && !statusesLoading.value,
	};
}

function availabilityItemsByRange(range: RangeKey | ''): AvailabilityItem[] {
	if (!range) return [];
	const payload = webAvailability.value?.[range] as
		| {
				data?: AvailabilityItem[];
				results?: AvailabilityItem[];
				items?: AvailabilityItem[];
				availability?: AvailabilityItem[];
		  }
		| AvailabilityItem[]
		| undefined;
	if (!payload) return [];

	if (Array.isArray(payload)) return payload;
	const items = payload.data || payload.results || payload.items || payload.availability;
	return Array.isArray(items) ? items : [];
}

function plotItems(range: RangeKey): AvailabilityItem[] {
	return availabilityItemsByRange(range).map((item) => {
		if (!item?.date) return item;
		const parsedDate = new Date(item.date);
		return {
			...item,
			date: Number.isNaN(parsedDate.getTime()) ? item.date : parsedDate.toISOString(),
		};
	});
}

function rangeDtick(range: RangeKey) {
	const day = 86_400_000;
	if (range === 'sixMonths') return day * 15;
	if (range === 'month') return day * 7;
	return day;
}
</script>

<style scoped>
.uptime-section {
	width: 100%;
}

.urls-label {
	margin-bottom: 8px;
	color: rgba(0, 0, 0, 50%);
	font-size: 1.2rem;
	font-weight: 500;
}

.chip-row {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-bottom: 16px;
}

.url-chip {
	display: inline-flex;
	align-items: center;
	gap: 7px;
	max-width: 100%;
	padding: 5px 13px;
	border: 1px solid transparent;
	border-radius: 999px;
	background: #f5f5f5;
	color: #555;
	cursor: pointer;
	font-size: 13px;
	font-weight: 500;
	transition:
		background-color 0.15s ease,
		color 0.15s ease,
		border-color 0.15s ease;
}

.url-chip:hover {
	color: #222;
}

.url-chip--active {
	border-color: rgba(11, 87, 159, 15%);
	background: #e0eaf3;
	color: #0b579f;
}

.url-chip:focus-visible {
	outline: 2px solid #0b579f;
	outline-offset: 2px;
}

.dot {
	width: 7px;
	height: 7px;
	flex: 0 0 auto;
	border-radius: 50%;
}

.dot-up {
	background: #558b2f;
}

.dot-down,
.dot-error {
	background: #c62828;
}

.dot-nodata {
	background: #ef6c00;
}

.dot-unknown,
.dot-loading {
	background: #9e9e9e;
}

.dot-loading {
	animation: pulse 1s infinite;
}

.uptime-panel {
	min-width: 0;
	padding: 16px 20px;
	border: 1px solid rgba(0, 0, 0, 10%);
	border-radius: 12px;
}

.loading-state {
	width: 100%;
}

.no-data-notice {
	display: flex;
	align-items: center;
	gap: 8px;
	min-height: 92px;
	padding: 24px 0;
	font-size: 13px;
	font-weight: 500;
}

.notice-error {
	color: #c62828;
}

.notice-nodata {
	flex-wrap: wrap;
	color: #ef6c00;
}

.nodata-link {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	color: #0b579f;
	text-decoration: none;
}

.nodata-link:hover {
	text-decoration: underline;
}

.range-tabs {
	min-width: 0;
}

@keyframes pulse {
	50% {
		opacity: 0.3;
	}
}

@media (max-width: 575.98px) {
	.uptime-panel {
		padding: 12px;
	}
}

@media (prefers-reduced-motion: reduce) {
	.url-chip {
		transition: none;
	}
}
</style>
