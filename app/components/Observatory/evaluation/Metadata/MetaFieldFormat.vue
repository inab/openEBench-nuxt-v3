<template>
	<div :class="nCols">
		<div class="d-flex mb-2">
			<HeaderAvatar :field="field" :field-name="title" :disabled-tooltip="true" />
			<span id="title" class="text-body" style="color: #0b579f !important">
				{{ title }}
			</span>

			<UButton
				v-if="increasable"
				color="neutral"
				variant="ghost"
				class="p-1.5 mx-2 rounded-full"
				@click="addEntry"
			>
				<UIcon name="i-heroicons-plus-circle-20-solid" class="text-gray-500" />
			</UButton>
		</div>

		<!--  -->
		<div v-for="(item, index) in value" :key="item.id">
			<CategoryAndTextFieldFormat
				:id="item.id"
				:item="item.term"
				:field="field"
				:index="index"
				:accepted-vocabularies="acceptedVocabularies"
				class="mt-2 ml-3"
				@remove="removeEntry(index)"
			/>
		</div>
	</div>
</template>
<script setup lang="ts">
import HeaderAvatar from '@/components/Observatory/evaluation/Metadata/HeaderAvatar.vue';
import CategoryAndTextFieldFormat from './CategoryAndTextFieldFormat.vue';

import { useMetadataStore } from '~~/stores/observatory/evaluation/metadata';
const metadataStore = useMetadataStore();

// PROPS
const props = withDefaults(
	defineProps<{
		title: string;
		field: string;
		value: { id: number; term: { vocabulary: string; term: string; uri: string } }[];
		nCols: string;
		increasable?: boolean;
		acceptedVocabularies?: string[];
	}>(),
	{
		increasable: true,
		acceptedVocabularies: () => ['EDAM'],
	}
);

// Methods
const addEntry = () => {
	const payload = {
		field: props.field,
		value: { term: '', uri: '', vocabulary: 'EDAM' },
	};
	metadataStore.addEntry(payload);
};

const removeEntry = (index: number) => {
	const payload = {
		field: props.field,
		index,
	};
	metadataStore.removeEntry(payload);
};
</script>
