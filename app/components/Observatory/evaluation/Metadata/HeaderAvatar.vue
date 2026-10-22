<template>
	<UTooltip
		:text="field_name"
		:disabled="disabled_tooltip"
		class="inline-flex shrink-0 items-center"
		:ui="{ content: 'bg-black/80 text-white' }"
	>
		<UIcon
			:name="metaState ? 'i-heroicons-check-circle-20-solid' : 'i-heroicons-minus-circle-20-solid'"
			class="size-5 shrink-0 bg-gray-400 mx-1"
			:class="[metaState ? 'bg-green-500' : 'bg-gray-400']"
		/>
	</UTooltip>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useMetadataStore } from '~~/stores/observatory/evaluation/metadata';
const metadataStore = useMetadataStore();

// PROPS
const props = withDefaults(
	defineProps<{
		field: string;
		field_name: string;
		disabled_tooltip?: boolean;
	}>(),
	{
		disabled_tooltip: false,
	}
);

// Computed
const toolMetadata = computed(() => metadataStore.getToolMetadata);
const metaState = computed(() => getMetadataState(props.field));

// Methods
const getMetadataState = (field: any) => {
	let state: boolean | string = false;
	switch (typeof toolMetadata.value[field]) {
		case 'boolean': {
			state = toolMetadata.value[field];
			break;
		}

		case 'string': {
			state = toolMetadata.value[field];
			break;
		}

		case 'object': {
			const array = Array.isArray(toolMetadata.value[field]);
			if (array) {
				if (toolMetadata.value[field].length > 0) {
					state = !!toolMetadata.value[field][0];
				} else {
					state = false;
				}
			} else {
				console.log(
					'Unknown type of field',
					field,
					typeof toolMetadata.value[field],
					toolMetadata.value[field]
				);
			}
			break;
		}

		default:
			console.log(
				'Unknown type of field',
				field,
				typeof toolMetadata.value[field],
				toolMetadata.value[field]
			);
	}
	return state;
};
</script>
<style scoped></style>
