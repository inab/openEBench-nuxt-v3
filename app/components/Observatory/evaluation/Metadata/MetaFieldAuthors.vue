<template>
	<div class="col-12">
		<div class="d-flex">
			<HeaderAvatar :field="field" :field_name="title" :disabled_tooltip="true" />
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

		<div v-for="(item, index) in value as any[]" :key="item.id" class="mt-4">
			<TextFieldsAuthors
				:id="item.id"
				:item="item.term"
				:index="index"
				:field="field"
				class="mt-2 ml-3"
				@remove="removeEntry(index)"
			/>
		</div>
	</div>
</template>
<script setup lang="ts">
import HeaderAvatar from '@/components/Observatory/evaluation/Metadata/HeaderAvatar.vue';
import TextFieldsAuthors from './TextFieldsAuthors.vue';
import { useMetadataStore } from '~~/stores/observatory/evaluation/metadata';
const metadataStore = useMetadataStore();

// PROPS
const props = withDefaults(
	defineProps<{
		title: string;
		field: string;
		value?: Record<string, unknown>[];
		increasable?: boolean;
	}>(),
	{
		increasable: true,
		value: () => [],
	}
);

// Methods
const addEntry = () => {
	const payload = {
		field: props.field,
		value: {
			name: '',
			email: '',
			type: 'person',
			mantaier: false,
		},
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
<style scoped>
#title {
	font-size: 1rem;
	color: #0b579f;
}
</style>
