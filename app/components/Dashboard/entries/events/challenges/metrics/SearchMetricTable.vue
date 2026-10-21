<template>
	<div class="add-metric-table">
		<div class="add-metric">
			<UTable
				v-model:row-selection="rowSelection"
				:get-row-id="(row: any) => row._id"
				:columns="columns"
				:data="rows"
				:ui="{
					tr: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer',
					th: 'text-left rtl:text-right px-2.5 py-2.5 text-gray-900 dark:text-white font-semibold text-sm',
					td: 'px-3 py-3 text-sm',
				}"
				@select="(_e: Event, row: any) => row.toggleSelected()"
			>
				<template #select-cell="{ row }">
					<UCheckbox
						:model-value="row.getIsSelected()"
						aria-label="Select row"
						@click.stop
						@update:model-value="(v: boolean | 'indeterminate') => row.toggleSelected(!!v)"
					/>
				</template>
				<template #view-cell="{ row }">
					<div class="action-btn-group">
						<button
							class="btn-custom-badget text-sm text-primaryOeb-950"
							title="View metric"
							@click.stop="viewMetric(row.original)"
						>
							<font-awesome-icon :icon="['far', 'eye']" />
							View
						</button>
					</div>
				</template>
			</UTable>
			<div class="flex flex-wrap justify-between items-center pt-2">
				<div>
					<span class="text-sm leading-5">
						Showing
						<span class="font-medium">{{ pageFrom }}</span>
						to
						<span class="font-medium">{{ pageTo }}</span>
						of
						<span class="font-medium">{{ _total }}</span>
						results
					</span>
				</div>
				<UPagination
					v-model:page="page"
					class="pagination"
					:items-per-page="pageCount"
					:total="props.metricRows.length"
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
import { ref, defineProps, computed, defineEmits } from 'vue';
import type { Metric } from '~~/types/challenge_metric';
import MetricModal from '@/components/Dashboard/metrics/MetricModal.vue';

const props = defineProps<{
	metricRows: any[];
	selectedMetrics: any[];
}>();

const emits = defineEmits(['handleSelectedMetrics']);

const { data } = useAuth();
const isModalOpen = ref(false);
const isSearchingMetric = ref(false);
const modalTitle = ref('View Metric');
const isMetricEditable = ref(false);
const token = data.value?.accessToken as string;
const metricIdOpen = ref('');

const rowSelection = computed<Record<string, boolean>>({
	get: () => Object.fromEntries(props.selectedMetrics.map((m) => [m._id, true])),
	set: (value) => {
		const ids = Object.keys(value).filter((id) => value[id]);
		const known = new Map<string, any>(
			[...props.selectedMetrics, ...props.metricRows].map((m) => [m._id, m])
		);
		emits(
			'handleSelectedMetrics',
			ids.map((id) => known.get(id)).filter(Boolean)
		);
	},
});

const columns = [
	{
		id: 'select',
		header: '',
	},
	{
		accessorKey: 'title',
		header: 'Title',
	},
	{
		accessorKey: 'description',
		header: 'Description',
	},
	{
		accessorKey: 'view',
		header: 'View',
	},
];

const page = ref(1);
const pageCount = ref(5);
const _total = ref(props.metricRows.length);

const pageFrom = computed(() => (Number(page.value) - 1) * Number(pageCount.value) + 1);

const pageTo = computed(() =>
	Math.min(Number(page.value) * Number(pageCount.value), Number(totalPages.value))
);

const rows = computed(() => {
	return props.metricRows.slice((page.value - 1) * pageCount.value, page.value * pageCount.value);
});

const totalPages = computed(() => {
	return Math.ceil(Number(_total.value) / Number(pageCount.value));
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

<style lang="scss" scoped></style>
