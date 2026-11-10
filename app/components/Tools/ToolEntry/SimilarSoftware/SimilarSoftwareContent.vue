<template>
	<div class="similar-software">
		<!-- Loading -->
		<div v-if="loadingSimilar" class="similar-loading" aria-label="Loading similar tools">
			<USkeleton v-for="index in PER_PAGE" :key="index" class="similar-loading__card" />
		</div>

        <!-- Empty -->
		<p v-else-if="!similarTools.length" class="similar-empty">No similar tools found.</p>

        <!-- Carousel: one page (3 cards) visible, slides horizontally -->
		<template v-else>
			<div class="carousel-viewport">
				<div class="carousel-track" :style="{ transform: `translateX(-${(page - 1) * 100}%)` }">
					<div v-for="(chunk, pageIndex) in pages" :key="pageIndex" class="carousel-page">
						<div class="similar-grid">
							<article
								v-for="item in chunk"
								:key="item.tool_id"
								class="similar-card"
								:class="{ 'similar-card--strong': isStrongMatch(item.score) }"
							>
								<div class="similar-card__content">
									<div class="similar-card__heading">
										<NuxtLink
											:to="`/tool/${encodeURIComponent(item.tool_id)}`"
											class="similar-title"
										>
											{{ item.tool_name }}
										</NuxtLink>
										<span
											v-if="isStrongMatch(item.score)"
											class="strong-chip"
											aria-label="Strong match"
										>
											<UIcon name="i-mdi-star" aria-hidden="true" />
											Strong match
										</span>
									</div>

									<!-- eslint-disable vue/no-v-html -->
									<div
										v-if="displayDescription(item)"
										class="similar-description"
										v-html="renderMarkdown(displayDescription(item))"
									/>
									<!-- eslint-enable vue/no-v-html -->

									<div v-if="hasSources(item)" class="similar-sources" aria-label="Tool sources">
										<LinkChipWImage
											v-for="[key, value] in Object.entries(item.sources_labels || {})"
											:key="key"
											:link="value"
											:type="key"
											:text="key"
											minimal
										/>
									</div>

									<div v-if="allTags(item).length" class="similar-tags">
										<LinkChipTopicOperation
											v-for="(tag, tagIndex) in visibleTags(item)"
											:key="tag.uri || `${tag.term}-${tagIndex}`"
											:uri="tag.uri"
											:text="cleanString(tag.term)"
											:icon="tag.icon"
											:attach="false"
										/>
										<button
											v-if="hiddenTagCount(item)"
											type="button"
											class="similar-tags__toggle"
											:aria-expanded="isExpanded(item)"
											@click="expandTags(item)"
										>
											+{{ hiddenTagCount(item) }} more
										</button>
										<button
											v-else-if="isExpanded(item) && isTagsCollapsible(item)"
											type="button"
											class="similar-tags__toggle"
											:aria-expanded="isExpanded(item)"
											@click="collapseTags(item)"
										>
											Show less
										</button>
									</div>
								</div>
							</article>
						</div>
					</div>
				</div>
			</div>

			<div class="carousel-footer">
				<span class="similar-count"> Showing {{ similarTools.length }} most similar tools </span>

				<div v-if="pageCount > 1" class="carousel-controls" aria-label="Similar tools pages">
					<button
						type="button"
						class="carousel-arrow"
						:disabled="page === 1"
						aria-label="Previous page"
						@click="prevPage"
					>
						<UIcon name="i-mdi-chevron-left" aria-hidden="true" />
					</button>

					<button
						v-for="pageNumber in pageCount"
						:key="pageNumber"
						type="button"
						class="page-dot"
						:class="{ 'page-dot--active': pageNumber === page }"
						:aria-label="`Go to page ${pageNumber}`"
						:aria-current="pageNumber === page ? 'page' : undefined"
						@click="page = pageNumber"
					/>

					<button
						type="button"
						class="carousel-arrow"
						:disabled="page === pageCount"
						aria-label="Next page"
						@click="nextPage"
					>
						<UIcon name="i-mdi-chevron-right" aria-hidden="true" />
					</button>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import LinkChipWImage from '@/components/Tools/Search/Card/LinkChipWImage.vue';
import LinkChipTopicOperation from '@/components/Tools/Search/Card/LinkChipTopicOperation.vue';
import { plainDescription } from '@/utils/toolDescription';
import { useToolEntryStore } from '~~/stores/tool_entry';

interface SimilarTagTerm {
	term?: string;
	uri?: string;
	vocabulary?: string;
}

interface SimilarTag {
	term?: string | SimilarTagTerm;
	uri?: string;
	vocabulary?: string;
}

interface SimilarTool {
	tool_id: string;
	tool_name: string;
	score?: number;
	description?: string | Array<string | { term?: string }>;
	sources_labels?: Record<string, string>;
	topics?: SimilarTag[];
	operations?: SimilarTag[];
}

interface ToolDocumentation {
	term?: {
		type?: string;
		content?: string;
	};
}

interface ToolRecord {
	documentation?: ToolDocumentation[];
}

const HIGH_MATCH_THRESHOLD = 0.85;
const MAX_VISIBLE_TAGS = 3;
const PER_PAGE = 3;

const toolEntryStore = useToolEntryStore();
const similarTools = computed(() => toolEntryStore.SimilarTools as SimilarTool[]);
const loadingSimilar = computed(() => toolEntryStore.LoadingSimilar);
const { $observatory } = useNuxtApp();

const page = ref(1);
const fallbackDescriptions = ref<Record<string, string>>({});
const expandedTags = ref<Record<string, boolean>>({});
const pendingDescriptionIds = new Set<string>();

const pageCount = computed(() => Math.ceil(similarTools.value.length / PER_PAGE));

const pages = computed(() => {
	const chunks: SimilarTool[][] = [];
	for (let index = 0; index < similarTools.value.length; index += PER_PAGE) {
		chunks.push(similarTools.value.slice(index, index + PER_PAGE));
	}
	return chunks;
});

watch(
	similarTools,
	() => {
		page.value = 1;
		void fetchMissingDescriptions();
	},
	{ immediate: true }
);

function descriptionText(description: SimilarTool['description']) {
	if (typeof description === 'string') return description;
	if (!Array.isArray(description)) return '';
	return (
		description
			.map((entry) => (typeof entry === 'string' ? entry : entry?.term || ''))
			.find(Boolean) || ''
	);
}

function displayDescription(item: SimilarTool) {
	const text = descriptionText(item.description) || fallbackDescriptions.value[item.tool_id] || '';
	return plainDescription(text)
		.replace(/^\s*(\*\*)?\s*what it does\s*(\*\*)?\s*:?\s*/i, '')
		.trimStart();
}

function renderMarkdown(text: string) {
	return DOMPurify.sanitize(marked.parseInline(text, { async: false }));
}

async function fetchMissingDescriptions() {
	const tools = similarTools.value.filter(
		(item) =>
			item.tool_name &&
			!descriptionText(item.description) &&
			!(item.tool_id in fallbackDescriptions.value) &&
			!pendingDescriptionIds.has(item.tool_id)
	);
	if (!tools.length) return;

	tools.forEach((item) => pendingDescriptionIds.add(item.tool_id));
	await Promise.all(
		tools.map(async (item) => {
			try {
				const response = await $observatory<ToolRecord | ToolRecord[]>(
					`api/tools?name=${encodeURIComponent(item.tool_name)}&documentation_status=true`,
					{ method: 'GET' }
				);
				const tool = Array.isArray(response) ? response[0] : response;
				const help = tool?.documentation?.find(
					(document) => document.term?.type === 'help' && document.term.content
				);
				fallbackDescriptions.value[item.tool_id] = help?.term?.content || '';
			} catch (error) {
				console.error(`Unable to retrieve a fallback description for "${item.tool_name}".`, error);
				fallbackDescriptions.value[item.tool_id] = '';
			} finally {
				pendingDescriptionIds.delete(item.tool_id);
			}
		})
	);
}

function isStrongMatch(score: SimilarTool['score']) {
	return typeof score === 'number' && score >= HIGH_MATCH_THRESHOLD;
}

function hasSources(item: SimilarTool) {
	return Boolean(item.sources_labels && Object.keys(item.sources_labels).length);
}

function normalizeTag(tag: SimilarTag) {
	const nestedTerm = typeof tag.term === 'object' ? tag.term : undefined;
	const term = typeof tag.term === 'string' ? tag.term : nestedTerm?.term || '';
	return {
		term,
		uri: tag.uri || nestedTerm?.uri || '',
		vocabulary: tag.vocabulary || nestedTerm?.vocabulary || '',
		icon: 'i-mdi-label-multiple',
	};
}

function allTags(item: SimilarTool) {
	return [
		...(item.topics || []).map((tag) => ({ ...normalizeTag(tag), icon: 'i-mdi-label-multiple' })),
		...(item.operations || []).map((tag) => ({ ...normalizeTag(tag), icon: 'i-mdi-cog' })),
	].filter((tag) => tag.term);
}

function isExpanded(item: SimilarTool) {
	return Boolean(expandedTags.value[item.tool_id]);
}

function visibleTags(item: SimilarTool) {
	const tags = allTags(item);
	return isExpanded(item) ? tags : tags.slice(0, MAX_VISIBLE_TAGS);
}

function hiddenTagCount(item: SimilarTool) {
	return isExpanded(item) ? 0 : Math.max(allTags(item).length - MAX_VISIBLE_TAGS, 0);
}

function isTagsCollapsible(item: SimilarTool) {
	return allTags(item).length > MAX_VISIBLE_TAGS;
}

function cleanString(value: string) {
	return value.replace(/^"|"$/g, '');
}

function expandTags(item: SimilarTool) {
	expandedTags.value[item.tool_id] = true;
}

function collapseTags(item: SimilarTool) {
	expandedTags.value[item.tool_id] = false;
}

function prevPage() {
	if (page.value > 1) page.value -= 1;
}

function nextPage() {
	if (page.value < pageCount.value) page.value += 1;
}
</script>

<style scoped>
.similar-software {
	padding: 0.25rem 0 0.75rem;
}

.similar-loading,
.similar-grid {
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	gap: 1rem;
}

.similar-loading__card {
	min-height: 12.5rem;
}

.similar-empty {
	margin: 0;
	color: #6c757d;
	font-size: 0.875rem;
}

.carousel-viewport {
	width: 100%;
	overflow: hidden;
	padding: 0.25rem 0 0.75rem;
}

.carousel-track {
	display: flex;
	transition: transform 0.4s ease;
	will-change: transform;
}

.carousel-page {
	flex: 0 0 100%;
	width: 100%;
}

.similar-card {
	display: flex;
	min-width: 0;
	min-height: 12.5rem;
	height: 100%;
	padding: 0.75rem;
	border: 1px solid rgb(0 0 0 / 8%);
	border-radius: 0.375rem;
	transition: box-shadow 0.2s ease;
}

.similar-card:hover {
	box-shadow: 0 0.125rem 0.5rem rgb(0 0 0 / 10%);
}

.similar-card--strong {
	border-left: 3px solid #4caf50;
	background-color: rgb(76 175 80 / 6%);
}

.similar-card__content {
	display: flex;
	width: 100%;
	min-width: 0;
	flex-direction: column;
}

.similar-card__heading {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 0.375rem;
}

.similar-title {
	max-width: 100%;
	overflow: hidden;
	color: rgb(0 0 0 / 87%);
	font-size: 0.92rem;
	font-weight: 600;
	line-height: 1.4;
	text-decoration: none;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.similar-title:hover {
	color: #0b579f;
	text-decoration: underline;
}

.strong-chip {
	display: inline-flex;
	align-items: center;
	gap: 0.2rem;
	padding: 0.15rem 0.4rem;
	border-radius: 999px;
	background-color: #e8f5e9;
	color: #2e7d32;
	font-size: 0.7rem;
	font-weight: 600;
	white-space: nowrap;
}

.similar-description {
	display: -webkit-box;
	margin-top: 0.25rem;
	overflow: hidden;
	color: #6c757d;
	font-size: 0.875rem;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 6;
}

.similar-sources,
.similar-tags {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 0.375rem;
	margin-top: 0.5rem;
}

.similar-sources {
	margin-top: auto;
	padding-top: 0.5rem;
}

.similar-tags__toggle {
	padding: 0.375rem 0.75rem;
	border: 0;
	border-radius: 999px;
	background-color: #f1f3f5;
	color: #343a40;
	font: inherit;
	font-size: 0.875rem;
	cursor: pointer;
}

.similar-tags__toggle:hover {
	background-color: #e2e6ea;
}

.carousel-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem;
	margin-top: 0.375rem;
}

.similar-count {
	margin: 0;
	color: rgb(0 0 0 / 38%);
	font-size: 0.75rem;
	font-style: italic;
	font-weight: 400;
	line-height: 1;
}

.carousel-controls {
	display: flex;
	align-items: center;
	gap: 0.25rem;
}

.carousel-arrow,
.page-dot {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0;
	border: 0;
	background: transparent;
	color: inherit;
	cursor: pointer;
}

.carousel-arrow {
	width: 1.5rem;
	height: 1.5rem;
	border-radius: 50%;
}

.carousel-arrow:disabled {
	color: rgb(0 0 0 / 30%);
	cursor: default;
}

.page-dot {
	width: 0.45rem;
	height: 0.45rem;
	border-radius: 50%;
	background: rgb(0 0 0 / 18%);
	transition:
		background 0.2s,
		transform 0.2s;
}

.page-dot--active {
	transform: scale(1.25);
	background: #0b579f;
}

.page-dot:hover:not(.page-dot--active) {
	background: rgb(0 0 0 / 35%);
}

@media (min-width: 576px) {
	.similar-grid,
	.similar-loading {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (min-width: 960px) {
	.similar-grid,
	.similar-loading {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}

@media (prefers-reduced-motion: reduce) {
	.carousel-track,
	.page-dot {
		transition: none;
	}
}
</style>
