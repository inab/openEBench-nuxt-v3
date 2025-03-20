<template>
  <div class="add-metric-table">
    <div class="add-metric">
      <UTable
        v-model="selectedMetric"
        :columns="columns"
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
          <div class="action-btn-group">
            <button
              class="btn-custom-badget text-sm text-primaryOeb-950"
              title="View metric"
              @click="viewMetric(row)"
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
          v-model="page"
          class="pagination"
          :page-count="pageCount"
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
import { ref, defineProps, computed, defineEmits, watch } from "vue";
import type { Metric } from "@/types/challenge_metric";
import MetricModal from "@/components/Dashboard/metrics/MetricModal.vue";

const props = defineProps<{
  metricRows: [];
  selectedMetrics: [];
}>();

const emits = defineEmits(["handleSelectedMetrics"]);

const { data } = useAuth();
const isModalOpen = ref(false);
const isSearchingMetric = ref(false);
const modalTitle = ref("View Metric");
const isMetricEditable = ref(false);
const token: string = data?.value.accessToken;
const metricIdOpen = ref("");

const selectedMetric = computed({
  get: () => props.selectedMetrics,
  set: (value) => emits("handleSelectedMetrics", value),
});

const columns = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "view",
    label: "View",
  },
];

const page = ref(1);
const pageCount = ref(5);
const _total = ref(props.metricRows.length);

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
  return props.metricRows.slice(
    (page.value - 1) * pageCount.value,
    page.value * pageCount.value,
  );
});

const totalPages = computed(() => {
  return Math.ceil(Number(_total.value) / Number(pageCount.value));
});

function viewMetric(metric: Metric) {
  modalTitle.value = "View metric";
  isMetricEditable.value = false;
  openModal(metric);
}

const closeModal = () => {
  isModalOpen.value = false;
  isSearchingMetric.value = true;
  metricIdOpen.value = "";
};

const openModal = async (row: Metric) => {
  isModalOpen.value = true;
  metricIdOpen.value = row._id;
};

watch(
  selectedMetric,
  (value) => {
    emits("handleSelectedMetrics", value);
  },
  { deep: true, flush: "post" },
);
</script>

<style lang="scss" scoped></style>
