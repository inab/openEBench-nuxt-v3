<template>
	<div class="add-tool-table">
		<div class="add-tool">
			<UTable
				v-model:row-selection="rowSelection"
				:get-row-id="(row: any) => row._id"
				:columns="columns"
				:loading="isTableLoading"
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
					<button class="btn-custom-badget text-sm">
						<NuxtLink :to="`/tool/${row.original._id}`" class="text-primaryOeb-950" @click.stop>
							View <font-awesome-icon :icon="['fas', 'eye']" />
						</NuxtLink>
					</button>
				</template>
			</UTable>
			<div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
				<UPagination v-model:page="page" :items-per-page="pageCount" :total="rowTool.length" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed, defineEmits, onMounted } from 'vue';
import { useMetrics } from '~~/stores/metrics.ts';
import type { Challenge } from '~~/types/challenge';
import type {
	Tool,
	Metric,
	ChallengeCommonMetric,
	ChallengeMetricCategory,
} from '~~/types/challenge_metric';

const props = defineProps<{
	selectedTools: Tool[];
	selectedMetrics: Metric[];
}>();

const emits = defineEmits(['handleSelectedTools']);
const runtimeConfig = useRuntimeConfig();
const { data } = useAuth();
const token = data.value?.accessToken as string;

const rowSelection = computed<Record<string, boolean>>({
	get: () => Object.fromEntries(props.selectedTools.map((t) => [t._id, true])),
	set: (value) => {
		const ids = Object.keys(value).filter((id) => value[id]);
		const known = new Map<string, Tool>(
			[...props.selectedTools, ...rowTool.value].map((t) => [t._id, t])
		);
		emits('handleSelectedTools', ids.map((id) => known.get(id)).filter(Boolean));
	},
});

const page = ref(1);
const pageCount = 10;
const rowTool = ref<Tool[]>([]);
const isTableLoading = ref(false);
const metricsStore = useMetrics();
const challengeDataList = ref<Challenge[]>([]);

challengeDataList.value = metricsStore.getChallengesData;

const columns = [
	{
		id: 'select',
		header: '',
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'description',
		header: 'Description',
	},
	{
		accessorKey: 'orig_id',
		header: 'Original ID',
	},
	{
		accessorKey: 'view',
		header: 'View',
	},
];

const rows = computed(() => {
	return rowTool.value.slice((page.value - 1) * pageCount, page.value * pageCount);
});

async function fetchTools(token: string): Promise<Metric[]> {
	isTableLoading.value = true;
	const response = await fetch(`${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Tool`, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/json',
		},
		method: 'GET',
	});

	const toolsData = await response.json();
	if (!toolsData || !Array.isArray(toolsData)) {
		return [];
	}

	const preSelectedTools = await filterMetricsByChallenge(
		challengeDataList.value,
		props.selectedMetrics
	);

	const toolsToSelect: Tool[] = [];

	if (props.selectedTools.length > 0) {
		props.selectedTools.forEach((selected) => {
			const foundTool = toolsData.find((t: Tool) => t._id === selected._id);
			if (foundTool) {
				toolsToSelect.push(foundTool);
				if (!preSelectedTools.includes(selected._id)) {
					preSelectedTools.push(selected._id);
				}
			}
		});
	}

	if (preSelectedTools.length > 0) {
		preSelectedTools.forEach((toolId) => {
			const foundTool = toolsData.find((t: Tool) => t._id === toolId);
			if (foundTool && !toolsToSelect.find((t) => t._id === foundTool._id)) {
				toolsToSelect.push(foundTool);
			}
		});
	}

	emits('handleSelectedTools', toolsToSelect);

	// Mark selected tools
	toolsData.sort((a: Tool, b: Tool) => {
		const aSelected = preSelectedTools.includes(a._id);
		const bSelected = preSelectedTools.includes(b._id);
		if (aSelected && !bSelected) return -1;
		if (!aSelected && bSelected) return 1;
		return 0;
	});

	toolsData.forEach((tool: Tool) => {
		tool.name = `${tool._id} - ${tool.name}`;
	});

	rowTool.value = toolsData;
	isTableLoading.value = false;

	return toolsData;
}

async function filterMetricsByChallenge(
	challengeDataList: Challenge[],
	selectedMetrics: Metric[]
): Promise<string[]> {
	const toolIds = new Set<string>();

	challengeDataList.forEach((challenge) => {
		const metricsCategories = challenge.metrics_categories as unknown as
			ChallengeMetricCategory[] | undefined;
		const aggregationMetrics = metricsCategories?.[1] ? metricsCategories[1].metrics : [];

		if (aggregationMetrics.length > 0) {
			selectedMetrics.forEach((metric: Metric) => {
				aggregationMetrics.forEach((aggregationMetric: ChallengeCommonMetric) => {
					if (metric._id === aggregationMetric.metrics_id && aggregationMetric.tool_id) {
						toolIds.add(aggregationMetric.tool_id);
					}
				});
			});
		}
	});

	return Array.from(toolIds);
}

onMounted(() => {
	fetchTools(token);
});
</script>
