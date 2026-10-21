<template>
	<div class="challenge-metrics-list">
		<div class="w-100 pt-5">
			<CustomSubtitle text="List of current challenge metrics" size="17px" />
		</div>
		<UTable
			:columns="columns"
			:loading="loadingMetrics"
			:rows="rows"
			:empty-state="{
				icon: 'i-heroicons-circle-stack-20-solid',
				label: 'No items.',
			}"
			:ui="{
				tr: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer',
				th: 'text-left rtl:text-right px-2.5 py-2.5 text-gray-900 dark:text-white font-semibold text-sm',
				td: 'px-3 py-3 text-sm',
			}"
		>
			<template #category-data="{ row }">
				<div class="d-flex category-col">
					<span v-if="row.category === 'assessment'">
						<UIcon name="i-heroicons-document-magnifying-glass" class="w-4 h-4"></UIcon>
					</span>
					<span v-else>
						<UIcon name="i-heroicons-document-plus" class="w-4 h-4"></UIcon>
					</span>
					{{ row.category }}
				</div>
			</template>
		</UTable>
	</div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';
import type { ChallengeMetricCategory } from '~~/types/challenge_metric';
import CustomSubtitle from '@/components/Common/CustomSubtitle.vue';

const props = defineProps<{
	metricsList: ChallengeMetricCategory[];
	loadingMetrics: boolean;
}>();

const page = ref(1);
const pageCount = 5;
const columns = [
	{
		key: 'category',
		label: 'Category',
	},
	{
		key: 'metrics_id',
		label: 'Metric ID',
	},
	{
		key: 'description',
		label: 'Description',
	},
	{
		key: 'tool_id',
		label: 'Tool ID',
	},
];

const rows = computed(() => {
	const newMetricsList = props.metricsList.flatMap((metricGroup) =>
		metricGroup.metrics.map((metric) => ({
			metrics_id: metric.metrics_id,
			tool_id: metric.tool_id,
			category: metricGroup.category,
			description: metricGroup.description,
		}))
	);
	return newMetricsList.slice((page.value - 1) * pageCount, page.value * pageCount);
});
</script>

<style lang="scss" scoped>
.category-col {
	display: flex;
	align-items: center;
	gap: 5px;
	text-transform: capitalize;
}
</style>
