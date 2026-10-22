<template>
	<div :class="n_cols">
		<div class="d-flex mb-2">
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

		<div v-for="(item, index) in value as any[]" :key="item.id" class="row">
			<div class="col-11">
				<PublicationField
					:id="item.id"
					:item="item.term"
					:index="index"
					:field="field"
					class="mt-2 ml-3"
				/>
			</div>
			<div class="col-1">
				<UButton
					color="neutral"
					variant="ghost"
					class="p-1.5 top-0.5 rounded-full"
					@click="removeEntry(index)"
				>
					<UIcon name="i-heroicons-x-circle-20-solid" class="text-gray-500" />
				</UButton>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import HeaderAvatar from '@/components/Observatory/evaluation/Metadata/HeaderAvatar.vue';
import PublicationField from './PublicationField.vue';

import { useMetadataStore } from '~~/stores/observatory/evaluation/metadata';
const metadataStore = useMetadataStore();

// PROPS
const props = withDefaults(
	defineProps<{
		title: string;
		field: string;
		n_cols: string;
		value: any;
		increasable?: boolean;
	}>(),
	{
		increasable: true,
	}
);

// Methods
const addEntry = () => {
	const payload = {
		field: props.field,
		value: '',
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
	color: #0b579f;
}
</style>
