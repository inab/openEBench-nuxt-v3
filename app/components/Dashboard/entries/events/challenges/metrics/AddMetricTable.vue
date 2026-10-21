<template>
	<div class="add-metric-table">
		<div class="add-metric">
			<UTable
				:columns="columns"
				:data="rows"
				:ui="{
					tr: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer',
					th: 'text-left rtl:text-right px-2.5 py-2.5 text-gray-900 dark:text-white font-semibold text-sm',
					td: 'px-3 py-3 text-sm',
				}"
			>
				<template #view-cell="{ row }">
					<div class="action-btn-group">
						<button
							class="btn-custom-badget text-sm text-primaryOeb-950"
							title="View metric"
							@click="viewMetric(row.original)"
						>
							<font-awesome-icon :icon="['far', 'eye']" />
							View
						</button>
					</div>
				</template>
			</UTable>
			<div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
				<UPagination
					v-model:page="page"
					class="pagination"
					:items-per-page="pageCount"
					:total="props.challengeRows.length"
				/>
			</div>
		</div>
		<MetricModal
			:is-modal-open="isModalOpen"
			:modal-title="modalTitle"
			:metric-id="metricIdOpen"
			:is-metric-editable="isMetricEditable"
			:token="token"
			@close-modal="closeModal"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed } from 'vue';
import MetricModal from '@/components/Dashboard/metrics/MetricModal.vue';
import type { Metric } from '~~/types/challenge_metric';

const props = defineProps<{
	challengeRows: any[];
	challengeId: string;
}>();

const { data } = useAuth();
const isModalOpen = ref(false);
const modalTitle = ref('View Metric');
const isMetricEditable = ref(false);
const isSearchingMetric = ref(false);
const metricIdOpen = ref('');
const token = data.value?.accessToken as string;
const page = ref(1);
const pageCount = 5;

const columns = [
	{
		accessorKey: '_id',
		header: 'Challenge ID',
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'view',
		header: 'View',
	},
];

const rows = computed(() => {
	return props.challengeRows.slice((page.value - 1) * pageCount, page.value * pageCount);
});

function viewMetric(metric: Metric) {
	modalTitle.value = 'View metric';
	isMetricEditable.value = false;
	openModal(metric);
}

const closeModal = () => {
	isModalOpen.value = false;
	isSearchingMetric.value = true;
	metricIdOpen.value = '';
};

const openModal = async (row: Metric) => {
	isModalOpen.value = true;
	metricIdOpen.value = row._id;
};
</script>
