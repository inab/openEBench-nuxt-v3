<template>
	<div class="container px-3 pb-4">
		<!-- loading -->
		<div v-if="dataStore.unLoaded.countsPerSource">
			<div class="flex flex-wrap justify-around items-center">
				<div v-for="card in 8" :key="card" class="my-4">
					<div class="source-card pt-3 px-3 rounded-sm">
						<USkeleton class="loading-card rounded-xl" />
					</div>
				</div>
			</div>
		</div>
		<!-- Source -->
		<div v-else>
			<div class="flex flex-wrap justify-around items-center">
				<div v-for="card in cardsC" :key="card.source" class="mt-4">
					<div
						class="source-card-shell py-1 bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
					>
						<SourceCard
							:title="cards_info[card.source]?.title ?? ''"
							:count="card.count"
							:label="cards_info[card.source]?.label ?? ''"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Total -->
		<div class="row mt-5 align-items-center">
			<div class="col-12 col-md-4"></div>
			<div class="col-12 col-md-4 flex items-center justify-center">
				<TotalCard :count="totalC" />
			</div>
			<div class="col-12 col-md-4 flex items-center justify-center pt-3 pt-md-2">
				<p class="card-caption-side" v-html="mainCardCaption"></p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useData } from '~~/stores/observatory/data';
import { useObservatory } from '~~/stores/observatory/index.js';
import SourceCard from '@/components/Observatory/data/CountCards/SourceCard.vue';
import TotalCard from '@/components/Observatory/data/CountCards/TotalCard.vue';

// STORE
const dataStore = useData();
const observatoryStore = useObservatory();

// Call the actions to load the data when mounting the component
dataStore.getTotalCount();
dataStore.getCountsPerSource();

// Computed
const totalC = computed(() => dataStore.totalCount ?? 0);
const cardsC = computed(() => dataStore.countsPerSource);

const currentCollection = computed(() => observatoryStore.getCurrentCollection);

const defaultCaption =
	'Each number represents the amount of metadata from that source included in the final integrated collection ("Total"), after processing through the full pipeline.';
const scopedCaption =
	'Each number shows the contribution of that source to this community’s integrated collection ("Total") after processing through the full pipeline.';

const mainCardCaption = computed(() =>
	currentCollection.value !== 'tools' ? scopedCaption : defaultCaption
);

// Cards Info
const cards_info: Record<string, { title: string; flex: number; label: string }> = reactive({
	biotools: {
		title: 'Bio.tools',
		flex: 3,
		label: 'elixir',
	},
	bioconda: {
		title: 'Bioconda',
		flex: 3,
		label: 'bioconda',
	},
	galaxy: {
		title: 'GalaxyEU',
		flex: 3,
		label: 'galaxy',
	},
	bioconductor: {
		title: 'Bioconductor',
		flex: 3,
		label: 'bioconductor',
	},
	toolshed: {
		title: 'Galaxy Toolshed',
		flex: 3,
		label: 'galaxy',
	},
	sourceforge: {
		title: 'SourceForge',
		flex: 3,
		label: 'sourceforge',
	},
	github: {
		title: 'GitHub',
		flex: 3,
		label: 'github',
	},
	bitbucket: {
		title: 'BitBucket',
		flex: 3,
		label: 'bitbucket',
	},
	opeb_metrics: {
		title: 'OpenEBench',
		flex: 3,
		label: 'OEB',
	},
});
</script>

<style scoped>
.source-card {
	width: 13em;
	height: 4em;
}

.source-card-shell {
	width: 13em;
}

.loading-card {
	height: 2.5em;
	width: 100%;
}

.card-caption-side {
	width: 100%;
	max-width: 24rem;
	text-align: justify;
	color: #334155;
	line-height: 22px;
	font-size: 14px;
}

@media (max-width: 767.98px) {
	.card-caption-side {
		text-align: center;
	}
}

.card-caption-b {
	width: 80%;
	text-align: center;
	margin: auto;
}
</style>
