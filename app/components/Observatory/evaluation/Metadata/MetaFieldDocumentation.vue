<template>
	<div :class="n_cols">
		<div class="d-flex mb-4">
			<HeaderAvatar :field="field" :field_name="title" :disabled_tooltip="true" />
			<span id="title" class="text-body" style="color: #0b579f !important">
				{{ title }}
			</span>

			<UButton color="neutral" variant="ghost" class="p-1.5 mx-2 rounded-full" @click="addEntry">
				<UIcon name="i-heroicons-plus-circle-20-solid" class="text-gray-500" />
			</UButton>
		</div>
		<div v-for="(item, index) in value" :key="item.id">
			<CategoryAndTextFieldDocumentation
				:id="item.id"
				:item="item.term"
				:index="index"
				:field="field"
				vocabulary-label="Type"
				type-label=""
				text-label="URL"
				class="my-2"
				@remove="removeEntry(index)"
			/>
		</div>
	</div>
</template>
<script setup lang="ts">
import HeaderAvatar from '@/components/Observatory/evaluation/Metadata/HeaderAvatar.vue';
import CategoryAndTextFieldDocumentation from './CategoryAndTextFieldDocumentation.vue';
import { useMetadataStore } from '~~/stores/observatory/evaluation/metadata';

const metadataStore = useMetadataStore();

// PROPS
const props = defineProps<{
	title: string;
	n_cols: string;
	field: string;
	value: any[];
	increasable?: boolean;
}>();

// Methods
const addEntry = () => {
	const payload = {
		field: props.field,
		value: { type: '', url: '' },
	};

	metadataStore.addEntry(payload);
};

const removeEntry = (index: any) => {
	const payload = {
		field: props.field,
		index,
	};
	metadataStore.removeEntry(payload);
};
</script>
<style scoped>
#title {
	font-size: 1rem;
	color: #0b579f !important;
}
</style>
