<template>
	<div
		class="card-hover h-full min-h-64 rounded-lg border border-gray-100 bg-white p-5 shadow-md flex flex-col"
	>
		<div class="flex h-full flex-col items-center text-center">
			<div
				class="my-4 relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-400 rounded-full dark:bg-gray-600"
			>
				<UIcon :name="icon" class="text-white text-2xl" />
			</div>
			<div class="font-medium text-base">
				{{ title }}
			</div>
			<div class="flex-1">
				<!-- eslint-disable-next-line vue/no-v-html -- content sanitized with DOMPurify -->
				<p class="mt-3 text-sm" v-html="sanitizeHtml(description)"></p>
			</div>
			<div class="mt-auto pt-4">
				<UButton class="bg-primaryOeb-500" variant="solid" size="md" @click="selectSource">
					Select
				</UButton>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useStepperStore } from '~~/stores/observatory/evaluation/index';

// PROPS
const props = defineProps<{
	title: string;
	description: string;
	source: string;
	icon: string;
}>();

const stepperStore = useStepperStore();

function selectSource() {
	stepperStore.handleSourceSelected(props.source);
}
</script>
