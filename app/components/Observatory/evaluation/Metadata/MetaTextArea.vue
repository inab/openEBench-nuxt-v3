<template>
	<div :class="n_cols">
		<div class="d-flex">
			<HeaderAvatar :field="field" :field_name="title" :disabled_tooltip="true" />
			<span class="text-body title" style="color: #0b579f !important">{{ title }}</span>
			<UButton
				color="gray"
				variant="solid"
				:ui="{ rounded: 'rounded-full' }"
				class="p-1.5 mx-2"
				@click="addEntry"
			>
				<UIcon name="i-heroicons-plus-circle-20-solid" class="bg-gray-400" />
			</UButton>
		</div>
		<div class="relative mt-2 ms-1">
			<UTextarea
				v-for="(item, index) in description"
				:key="item.id"
				:value="item.term"
				variant="none"
				:ui="{
					root: 'mb-2 w-full rounded-md border border-gray-300 p-1 focus-within:border-primaryOeb-500 focus-within:ring-1 focus-within:ring-primaryOeb-500',
					base: 'w-full resize-none border-0 bg-transparent shadow-none focus:outline-none focus:ring-0',
				}"
			>
				<!-- clear description -->
				<button v-if="value" class="absolute right-2 top-2" @click="clearLink">
					<UIcon name="i-heroicons-x-circle-20-solid" class="size-4" />
				</button>

				<!-- Close Entry -->
				<UButton
					color="gray"
					variant="solid"
					:ui="{ rounded: 'rounded-full' }"
					class="p-1.5 mx-3 absolute right-[-55px] top-0.5"
					@click="closeEntry(index)"
				>
					<UIcon name="i-heroicons-x-circle-20-solid" class="bg-gray-400" />
				</UButton>
			</UTextarea>
		</div>
	</div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import HeaderAvatar from '@/components/Observatory/evaluation/Metadata/HeaderAvatar.vue';
import { useMetadataStore } from '~~/stores/observatory/evaluation/metadata';

const metadataStore = useMetadataStore();

// PROPS
const props = defineProps<{
	title: string;
	field: string;
	value: any[];
	n_cols: string;
}>();

const description = ref(props.value);

// Methods
const clearLink = () => {
	description.value = [{}];
};

const closeEntry = (index) => {
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
