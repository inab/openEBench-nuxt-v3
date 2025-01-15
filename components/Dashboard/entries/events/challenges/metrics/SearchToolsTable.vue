<template>
  <div class="add-tool-table">
    <div class="add-tool">
      <UTable
        v-model="selectedToolsTmp"
        :columns="columns"
        :loading="isTableLoading"
        :rows="rows"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No items.',
        }"
        :ui="{
          tr: {
            base: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer',
          },
          th: {
            base: 'text-left rtl:text-right',
            padding: 'px-2.5 py-2.5',
            color: 'text-gray-900 dark:text-white',
            font: 'font-semibold',
            size: 'text-sm',
          },
          td: {
            base: '',
            padding: 'px-3 py-3',
            font: '',
            size: 'text-sm',
          },
        }"
        @select="select"
      >
        <template #view-data="{ row }">
          <button class="btn-custom-badget text-sm">
            <NuxtLink :to="`${to}/metrics/add`" class="text-primaryOeb-950">
              View <font-awesome-icon :icon="['fas', 'eye']" />
            </NuxtLink>
          </button>
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
          v-model="page"
          class="pagination"
          :page-count="pageCount"
          :total="rowTool.length"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed, defineEmits, onMounted } from "vue";
import { useMetrics } from "@/stores/metrics.ts";
import type { Challenge } from "@/types/challenge";
import type {
  Tool,
  Metric,
  ChallengeCommonMetric,
} from "@/types/challenge_metric";

const props = defineProps<{
  selectedTools: Tool[];
  selectedMetrics: Metric[];
}>();

const emits = defineEmits(["handleSelectedTools"]);
const runtimeConfig = useRuntimeConfig();
const { data } = useAuth();
const token: string = data?.value.accessToken;

const selectedToolsTmp = computed({
  get: () => [...props.selectedTools],
  set: (value) => emits("handleSelectedTools", value),
});

const page = ref(1);
const pageCount = ref(5);

const rowTool = ref<Tool[]>([]);
const _total = computed(() => rowTool.value.length);
const isTableLoading = ref(false);
const metricsStore = useMetrics();
const challengeDataList = ref<Challenge[]>([]);

challengeDataList.value = metricsStore.getChallengesData;

const columns = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "orig_id",
    label: "Original ID",
  },
  {
    key: "view",
    label: "View",
  },
];

const pageFrom = computed(
  () => (Number(page.value) - 1) * Number(pageCount.value) + 1,
);

const pageTo = computed(() =>
  Math.min(
    Number(page.value) * Number(pageCount.value),
    Number(totalPages.value),
  ),
);

const rows = computed(() => {
  return rowTool.value.slice(
    (page.value - 1) * pageCount.value,
    page.value * pageCount.value,
  );
});

const totalPages = computed(() => {
  return Math.ceil(Number(_total.value) / Number(pageCount.value));
});

function select(row) {
  const index = selectedToolsTmp.value.findIndex(
    (item) => item._id === row._id,
  );
  const newSelected = [...selectedToolsTmp.value];
  if (index === -1) {
    newSelected.push(row);
  } else {
    newSelected.splice(index, 1);
  }
  selectedToolsTmp.value = newSelected;
}

async function fetchTools(token: string): Promise<Metric[]> {
  isTableLoading.value = true;
  const response = await fetch(
    `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Tool`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      method: "GET",
    },
  );

  const toolsData = await response.json();
  if (!toolsData || !Array.isArray(toolsData)) {
    return [];
  }

  const preSelectedTools = await filterMetricsByChallenge(
    challengeDataList.value,
    props.selectedMetrics,
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

  selectedToolsTmp.value = toolsToSelect;

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
  selectedMetrics: Metric[],
): Promise<string[]> {
  const toolIds = new Set<string>();

  challengeDataList.forEach((challenge) => {
    const aggregationMetrics =
      challenge.metrics_categories && challenge.metrics_categories[1]
        ? challenge.metrics_categories[1].metrics
        : [];

    if (aggregationMetrics.length > 0) {
      selectedMetrics.forEach((metric: Metric) => {
        aggregationMetrics.forEach(
          (aggregationMetric: ChallengeCommonMetric) => {
            if (metric._id === aggregationMetric.metrics_id) {
              toolIds.add(aggregationMetric.tool_id);
            }
          },
        );
      });
    }
  });

  return Array.from(toolIds);
}

onMounted(() => {
  fetchTools(token);
});
</script>
