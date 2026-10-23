<template>
	<div>
		<UTable
			v-model:sorting="sorting"
			:data="rows"
			:columns="headers"
			class="w-full mt-4 cursor-auto"
			:ui="{
				tr: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer cursor-auto',
				th: 'text-left py-2.5 text-gray-900 dark:text-white font-medium text-sm',
				td: 'max-w-[0] truncate py-3 text-sm',
			}"
		/>
		<div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
			<UPagination
				v-if="items.length > pageCount"
				v-model:page="page"
				class="pagination"
				:items-per-page="pageCount"
				:total="items.length"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { MetricsTable } from '~~/types/pages-types';

const props = defineProps<{
	metricsTable: MetricsTable;
}>();

const formatName = (text?: string) => {
	if (typeof text === 'string' && text.startsWith('Dataset_participant:3D:2022-12-17_')) {
		return text.replace('Dataset_participant:3D:2022-12-17_', '');
	}
	return text;
};

const sorting = ref([
	{
		id: 'participant_label',
		desc: false,
	},
]);

const headers = props.metricsTable.metrics.map((metric, metricsI: number) => {
	return {
		id: `metricsValues_${metricsI}`,
		accessorKey: `metricsValues_${metricsI}`,
		header: metric.metrics_label,
		enableSorting: false,
	};
});

headers.unshift({
	id: 'participant_label',
	accessorKey: 'participant_label',
	header: 'Participant',
	enableSorting: true,
});
const items = computed(() => {
	return props.metricsTable.participants.map((participant, participantI: number) => {
		const item = {
			_id: participant._id,
			participant_label: formatName(participant.participant_label),
			metricsValues: props.metricsTable.dataMatrix[participantI],
		};

		const values = (item.metricsValues ?? []).reduce(
			(acc: Record<string, unknown>, metric, metricI: number) => {
				acc[`metricsValues_${metricI}`] =
					metric == null || metric.value === null ? '-' : metric.value;

				return acc;
			},
			{}
		);

		const { metricsValues, ...keepAttrs } = item;

		return {
			...keepAttrs,
			...values,
		};
	});
});

const page = ref(1);
const pageCount = ref(10);

const rows = computed(() => {
	const start = (page.value - 1) * pageCount.value;
	const end = page.value * pageCount.value;

	return items.value.slice(start, end);
});

watch(
	() => props.metricsTable,
	() => {
		page.value = 1;
	},
	{ deep: true }
);
</script>
