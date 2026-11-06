<template>
	<div v-if="uniquePublications.length" class="citation-content">
		<div class="publication-section">
			<h3 class="section-label">
				{{
					uniquePublications.length === 1
						? 'Peer-reviewed Publication'
						: 'Peer-reviewed Publications'
				}}
			</h3>

			<article
				v-for="(item, index) in uniquePublications"
				:key="publicationKey(item) || index"
				class="publication-card"
			>
				<span
					class="pub-dot"
					:style="{ backgroundColor: dotColors[index % dotColors.length] }"
					aria-hidden="true"
				/>

				<div class="publication-details">
					<a
						v-if="item.term.doi"
						class="publication-title"
						:href="doiUrl(item.term.doi)"
						target="_blank"
						rel="noopener noreferrer"
					>
						{{ item.term.title }}
					</a>
					<span v-else class="publication-title">{{ item.term.title }}</span>

					<div v-if="item.term.authors" class="publication-authors">
						{{ item.term.authors }}
					</div>

					<div class="publication-metadata">
						<template v-if="isLoadingCitations(item)">
							<span class="citation-chip" aria-live="polite">Loading citation data…</span>
						</template>

						<a
							v-else-if="getCitationCount(item) !== null && item.term.pmid"
							class="citation-chip"
							:href="europePmcUrl(item.term.pmid)"
							target="_blank"
							rel="noopener noreferrer"
						>
							{{ getCitationCount(item)?.toLocaleString() }}
							{{ getCitationCount(item) === 1 ? 'citation' : 'citations' }}
							<span aria-hidden="true">·</span>
							<img src="https://europepmc.org/favicon.ico" alt="" width="14" height="14" />
							Europe PMC
						</a>

						<span v-else class="citation-chip citation-chip--muted">
							<UIcon name="i-mdi-alert-circle-outline" aria-hidden="true" />
							No citation data — not indexed by Europe PMC
						</span>

						<span v-if="item.term.year" class="metadata-chip">{{ item.term.year }}</span>

						<a
							v-if="item.term.journal && item.term.doi"
							class="metadata-chip"
							:href="doiUrl(item.term.doi)"
							target="_blank"
							rel="noopener noreferrer"
						>
							{{ item.term.journal }}
						</a>
						<span v-else-if="item.term.journal" class="metadata-chip">
							{{ item.term.journal }}
						</span>
					</div>
				</div>
			</article>
		</div>

		<div class="plot-section">
			<USkeleton v-if="isLoadingAnyCitation" class="h-72 w-full" />
			<CitationPlot
				v-else-if="citationPlotData.length"
				:data-traces="citationPlotData"
				:colors="citationPlotColors"
				:message="plotMessage"
			/>
		</div>
	</div>
	<p v-else class="text-secondary small">No publications available.</p>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import CitationPlot from './CitationPlot.vue';
import { useToolEntryStore } from '~~/stores/tool_entry';

interface Publication {
	term?: {
		doi?: string;
		pmid?: string;
		title?: string;
		authors?: string;
		year?: string | number;
		journal?: string;
		error?: unknown;
	};
}

interface CitationYear {
	year: number;
	citations: number;
}

interface CitationSource {
	source?: string;
	count?: {
		total?: number;
		[key: string]: number | undefined;
	};
}

interface CitationResponse {
	item?: CitationSource[];
}

interface CitationTrace {
	id: string;
	label: string;
	title: string;
	year?: string | number;
	url: string | null;
	data: CitationYear[];
	color: string;
}

interface ToolWithPublications {
	publication?: Publication[];
}

// Store
const toolEntryStore = useToolEntryStore();
const tool = computed(() => toolEntryStore.Tool as ToolWithPublications);
const citations = computed(
	() => toolEntryStore.Citations as Record<string, CitationResponse | null>
);

console.log(citations);

const loadingCitations = computed(() => toolEntryStore.LoadingCitations as Record<string, boolean>);

const dotColors = [
	'#4caf50',
	'#ff9800',
	'#2196f3',
	'#9467bd',
	'#795548',
	'#009688',
	'#f44336',
	'#ffc107',
	'#8bc34a',
	'#607d8b',
	'#3f51b5',
	'#e91e63',
];

const uniquePublications = computed(() => {
	const seen = new Set<string>();

	return (tool.value?.publication || []).filter((publication) => {
		const term = publication?.term;
		if (!term?.doi || term.error || !term.title || !term.authors || seen.has(term.doi)) {
			return false;
		}

		seen.add(term.doi);
		return true;
	}) as Required<Pick<Publication, 'term'>>[];
});

function publicationKey(publication: Publication) {
	return publication.term?.doi || publication.term?.pmid || publication.term?.title;
}

function citationKey(publication: Publication) {
	const term = publication.term;
	return term?.doi || term?.pmid || term?.title || '';
}

function doiUrl(doi: string) {
	return `https://doi.org/${encodeURIComponent(doi)}`;
}

function europePmcUrl(pmid: string) {
	return `https://europepmc.org/article/MED/${encodeURIComponent(pmid)}`;
}

function getEuropePmcData(publication: Publication) {

	const response = citations.value[citationKey(publication)];
	return response?.item?.find((source) => source.source === 'Europe PMC');
}

function getCitationCount(publication: Publication) {
	const count = getEuropePmcData(publication)?.count?.total;
	return typeof count === 'number' ? count : null;
}

function isLoadingCitations(publication: Publication) {
	return Boolean(loadingCitations.value[citationKey(publication)]);
}

const citationPlotData = computed<CitationTrace[]>(() =>
	uniquePublications.value.flatMap((publication, index) => {
		const term = publication.term;
		const counts = getEuropePmcData(publication)?.count;
		if (!term || !counts) return [];

		const data = Object.entries(counts)
			.filter(([year, count]) => /^\d{4}$/.test(year) && typeof count === 'number')
			.map(([year, citations]) => ({ year: Number(year), citations: citations as number }))
			.sort((first, second) => first.year - second.year);

		if (!data.length) return [];

		return [
			{
				id: term.doi || term.pmid || `publication-${index}`,
				label: term.title || '',
				title: term.title || '',
				year: term.year,
				url: term.doi ? doiUrl(term.doi) : null,
				data,
				color: dotColors[index % dotColors.length],
			},
		];
	})
);

const citationPlotColors = computed(() => citationPlotData.value.map((trace) => trace.color));

const plotMessage = computed(() => {
	const total = uniquePublications.value.length;
	const shown = citationPlotData.value.length;
	if (!shown || shown === total) return null;

	return `Showing ${shown} of ${total} publications — only those with per-year data`;
});

const isLoadingAnyCitation = computed(() =>
	uniquePublications.value.some((publication) => isLoadingCitations(publication))
);

watch(
	uniquePublications,
	(publications) => {
		publications.forEach((publication) => {
			const term = publication.term;
			void toolEntryStore.fetchCitations({
				doi: term.doi,
				pmid: term.pmid,
				title: term.title,
			});
		});
	},
	{ immediate: true }
);
</script>

<style scoped>
.citation-content {
	min-width: 0;
}

.publication-section {
	padding: 0.5rem 1rem 1rem;
}

.section-label {
	margin: 0 0 0.5rem;
	color: rgba(0, 0, 0, 50%);
	font-size: 1.2rem;
	font-weight: 500;
}

.publication-card {
	display: flex;
	align-items: flex-start;
	gap: 0.75rem;
	padding: 0.75rem 0;
	border-bottom: 1px solid rgba(0, 0, 0, 7%);
}

.publication-card:last-child {
	border-bottom: 0;
}

.pub-dot {
	width: 12px;
	height: 12px;
	margin-top: 0.35rem;
	border-radius: 50%;
	flex: 0 0 12px;
}

.publication-details {
	min-width: 0;
	flex: 1;
}

.publication-title {
	color: rgba(0, 0, 0, 87%);
	font-size: 0.95rem;
	font-weight: 600;
	line-height: 1.4;
	text-decoration: none;
}

a.publication-title:hover {
	color: #0b579f;
	text-decoration: underline;
}

.publication-authors {
	margin-top: 0.25rem;
	color: #6c757d;
	font-size: 0.875rem;
}

.publication-metadata {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-top: 0.6rem;
}

.citation-chip,
.metadata-chip {
	display: inline-flex;
	align-items: center;
	gap: 0.35rem;
	min-height: 1.8rem;
	padding: 0.2rem 0.65rem;
	border: 1px solid #dee2e6;
	border-radius: 999px;
	color: #343a40;
	font-size: 0.78rem;
	text-decoration: none;
}

a.citation-chip:hover,
a.metadata-chip:hover {
	border-color: #0b579f;
	color: #0b579f;
}

.citation-chip img {
	display: inline-block;
}

.citation-chip--muted {
	color: #6c757d;
}

.plot-section {
	margin: 0 1rem;
	padding-top: 0.75rem;
	border-top: 1px solid rgba(0, 0, 0, 8%);
}
</style>
