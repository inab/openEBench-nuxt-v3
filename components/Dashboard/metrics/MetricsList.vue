<template>
  <div class="metrics-table">
    <div
      v-if="filteredRows.length > 0"
      class="flex justify-content-end py-2.5 dark:border-gray-700"
    >
      <UInput
        v-model="search"
        color="white"
        variant="outline"
        icon="i-heroicons-magnifying-glass-20-solid"
        placeholder="Search ..."
        class="input-search"
      />
    </div>
    <UTable
      :columns="columns"
      :loading="isLoading"
      :rows="filteredRows"
      :sort="sort"
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
          padding: 'px-2.5 py-2.5',
          font: '',
          size: 'text-sm',
        },
      }"
      @update:sort="handleUpdateSort"
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
          <button
            class="btn-custom-badget btn-clone text-sm text-primaryOeb-950"
            title="Clone metric"
            @click="cloneMetric(row)"
          >
            <font-awesome-icon :icon="['fas', 'clone']" />
            Clone
          </button>
        </div>
      </template>
    </UTable>
    <div
      v-if="filteredRows.length > 0"
      class="flex flex-wrap justify-between items-center pt-2"
    >
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
        :total="_total"
        :ui="{
          wrapper: 'flex items-center',
          default: {
            activeButton: {
              base: 'bg-primary-500 dark:bg-primary-400',
              color: 'text-white',
            },
          },
        }"
      />
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
import type { Metric } from "@/types/challenge_metric";
import { ref, computed } from "vue";
import MetricModal from "@/components/Dashboard/metrics/MetricModal.vue";

const props = defineProps<{
  metricRows: Metric[];
  isLoading: boolean;
  token: string;
}>();

const runtimeConfig = useRuntimeConfig();
const isModalOpen = ref(false);
const isSearchingMetric = ref(false);
const modalTitle = ref("");
const isMetricEditable = ref(false);
const search = ref("");
const _total = ref(0);
const page = ref<number>(1);
const pageCount = ref<number>(10);
const metricIdOpen = ref("");

const pageFrom = computed(
  () => (Number(page.value) - 1) * Number(pageCount.value) + 1,
);

const pageTo = computed(() =>
  Math.min(Number(page.value) * Number(pageCount.value), Number(_total.value)),
);

const columns = [
  {
    key: "_id",
    label: "METRIC ID",
    sortable: true,
  },
  {
    key: "title",
    label: "TITLE",
    sortable: true,
  },
  {
    key: "description",
    label: "DESCRIPTION",
    sortable: true,
  },
  {
    key: "view",
    label: "ACTIONS",
  },
];

const sort = ref({
  column: "_id",
  direction: "asc",
});

const cleanContacts = (contacts: any) => {
  return contacts.map((contact: any) => {
    return contact.replaceAll(".", " ");
  });
};

const filteredRows = computed(() => {
  if (!search.value) {
    _total.value = props.metricRows.length;
    return props.metricRows.slice(
      (page.value - 1) * pageCount.value,
      page.value * pageCount.value,
    );
  }

  const filteredSearcher = props.metricRows.filter((metric: any) => {
    return Object.values(metric).some((value) => {
      return String(value).toLowerCase().includes(search.value.toLowerCase());
    });
  });

  _total.value = props.metricRows.length;

  return filteredSearcher.slice(
    (Number(page.value) - 1) * Number(pageCount.value),
    Number(page.value) * Number(pageCount.value),
  );
});

const totalPages = computed(() => {
  return Math.ceil(Number(_total.value) / Number(pageCount.value));
});

const closeModal = () => {
  isModalOpen.value = false;
  isSearchingMetric.value = true;
  metricIdOpen.value = "";
};

function cloneMetric(metric: Metric) {
  modalTitle.value = "Clone & create new metric";
  isMetricEditable.value = true;
  openModal(metric);
}

function viewMetric(metric: Metric) {
  modalTitle.value = "View metric";
  isMetricEditable.value = false;
  openModal(metric);
}

const openModal = async (row: Metric) => {
  isModalOpen.value = true;
  metricIdOpen.value = row._id;
};

function onDeleteElement(index: number, list: any[]) {
  list.splice(index, 1);
}

function handleUpdateSort({
  column,
  direction,
}: {
  column: string;
  direction: string;
}) {
  sort.value.column = column;
  sort.value.direction = direction;

  const sortedRows = props.metricRows.sort((a, b) => {
    if (direction === "asc") {
      return a[column as keyof Metric] > b[column as keyof Metric] ? 1 : -1;
    } else {
      return a[column as keyof Metric] < b[column as keyof Metric] ? 1 : -1;
    }
  });

  return sortedRows;
}
</script>

<style lang="scss" scoped>
.metric__modal input {
  width: 100%;
}
.action-btn-group {
  display: flex;
  gap: 10px;
}

.btn-clone {
  &:hover {
    background-color: #00caa4;
    border: 1px solid #00caa4;
    color: white;
  }
}
</style>
