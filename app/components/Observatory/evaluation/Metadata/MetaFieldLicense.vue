<template>
	<div>
		<div class="d-flex">
			<HeaderAvatar :field="field" :field_name="title" :disabled_tooltip="true" />
			<span class="text-body title" style="color: #0b579f !important">{{ title }}</span>
			<UButton color="neutral" variant="ghost" class="p-1.5 mx-2 rounded-full" @click="addEntry">
				<UIcon name="i-heroicons-plus-circle-20-solid" class="text-gray-500" />
			</UButton>
		</div>
		<!--  -->
		<CategoryAndTextFieldLicense
			v-for="(item, index) in value"
			:id="item.id"
			:key="item.id"
			:item="item.term"
			:index="index"
			:field="field"
			@remove="removeEntry(index)"
		/>
	</div>
</template>
<script setup lang="ts">
import HeaderAvatar from '@/components/Observatory/evaluation/Metadata/HeaderAvatar.vue';
import CategoryAndTextFieldLicense from './CategoryAndTextFieldLicense.vue';
import { useMetadataStore } from '~~/stores/observatory/evaluation/metadata';

const metadataStore = useMetadataStore();

// PROPS
const props = defineProps<{
	title: string;
	field: string;
	value: any[];
	increasable: boolean;
}>();

// Methods
const removeEntry = (index) => {
	const payload = {
		field: props.field,
		index,
	};
	metadataStore.removeEntry(payload);
};
const addEntry = () => {
	// do you want to add the empty value or do you want to add the new value?
	const payload = {
		field: props.field,
		value: '',
	};
	metadataStore.addEntry(payload);
};
</script>
<style scoped>
.title {
	font-size: 1rem !important;
	color: #0b579f !important;
}
</style>
