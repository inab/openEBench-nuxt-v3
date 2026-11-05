<template>
	<div class="container documentation-content">
		<div v-if="documents.length" class="documentation-row">
			<h3 class="documentation-row__label">Documents</h3>
			<div class="documentation-row__items">
				<a
					v-for="item in visibleDocuments"
					:key="item.url"
					class="documentation-chip"
					:href="item.url"
					target="_blank"
					rel="noopener noreferrer"
				>
					{{ item.label }}
				</a>
				<button
					v-if="documents.length > MAX_CHIPS"
					type="button"
					class="documentation-chip documentation-chip--action"
					:aria-expanded="documentsExpanded"
					@click="documentsExpanded = !documentsExpanded"
				>
					{{ documentsExpanded ? 'show less' : `+${documents.length - MAX_CHIPS} more` }}
				</button>
			</div>
		</div>

		<div v-if="topics.length" class="documentation-row">
			<h3 class="documentation-row__label">Related topics</h3>
			<div class="documentation-row__items">
				<ItemChipMenu
					v-for="(item, index) in topics"
					:key="item.id ?? index"
					:text="item.term.term"
					:edam-id="item.term.uri"
					:vocabulary="item.term.vocabulary"
				/>
			</div>
		</div>

		<div v-if="operations.length" class="documentation-row">
			<h3 class="documentation-row__label">Function</h3>
			<div class="documentation-row__items">
				<ItemChipMenu
					v-for="(item, index) in operations"
					:key="item.id ?? index"
					:text="item.term.term"
					:edam-id="item.term.uri"
					:vocabulary="item.term.vocabulary"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import ItemChipMenu from './ItemChipMenu.vue';
import { buildDocumentationChips } from '~/static/dictionaries/documentationTypes';
import { useToolEntryStore } from '~~/stores/tool_entry';

interface VocabularyEntry {
	id?: string | number;
	term?: {
		term?: string;
		uri?: string;
		vocabulary?: string;
	};
}

interface DocumentationTool {
	documentation?: object[];
	topics?: VocabularyEntry[];
	operations?: VocabularyEntry[];
}

const toolEntryStore = useToolEntryStore();
const tool = computed(() => toolEntryStore.Tool as DocumentationTool);

const MAX_CHIPS = 6;
const documentsExpanded = ref(false);

const documents = computed(() => buildDocumentationChips(tool.value?.documentation));

const visibleDocuments = computed(() =>
	documentsExpanded.value ? documents.value : documents.value.slice(0, MAX_CHIPS)
);

watch(
	() => tool.value?.documentation,
	() => {
		documentsExpanded.value = false;
	}
);

function validVocabularyEntries(entries: VocabularyEntry[]) {
	return entries.flatMap((entry) => {
		const term = entry?.term?.term?.trim();
		if (!term) return [];

		return [
			{
				id: entry.id,
				term: {
					term,
					uri: entry.term?.uri || '',
					vocabulary: entry.term?.vocabulary?.trim() || '',
				},
			},
		];
	});
}

const topics = computed(() => validVocabularyEntries(tool.value?.topics || []));
const operations = computed(() => validVocabularyEntries(tool.value?.operations || []));
</script>

<style scoped>
.documentation-content {
	display: flex;
	flex-direction: column;
}

.documentation-row {
	display: grid;
	grid-template-columns: minmax(130px, 1fr) minmax(0, 3fr);
	align-items: center;
	gap: 1rem;
	padding: 0.875rem 0;
}

.documentation-row + .documentation-row {
	border-top: 1px solid #dee2e6;
}

.documentation-row__label {
	margin: 0;
	font-size: 1rem;
	font-weight: 400;
}

.documentation-row__items {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.75rem;
}

.documentation-chip {
	display: inline-flex;
	align-items: center;
	padding: 0.375rem 0.75rem;
	border-radius: 999px;
	background-color: #f1f3f5;
	color: #343a40;
	font-size: 0.875rem;
	font-weight: 500;
	text-decoration: none;
}

.documentation-chip:hover {
	background-color: #e2e6ea;
	color: #212529;
}

.documentation-chip--action {
	border: 0;
	cursor: pointer;
	font: inherit;
}

@media (max-width: 575.98px) {
	.documentation-row {
		grid-template-columns: 1fr;
		gap: 0.5rem;
	}
}
</style>
