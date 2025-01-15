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
          :total="props.metricRows.length"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed, defineEmits, watch } from "vue";

const props = defineProps<{
  metricRows: [];
  selectedMetrics: [];
}>();

const emits = defineEmits(["handleSelectedMetrics"]);

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

function select(row) {
  const index = selectedMetric.value.findIndex((item) => item.id === row.id);
  if (index === -1) {
    selectedMetric.value.push(row);
  } else {
    selectedMetric.value.splice(index, 1);
  }
}

watch(selectedMetric, (value) => {
  emits("handleSelectedMetrics", value);
});
</script>

<style lang="scss" scoped></style>
