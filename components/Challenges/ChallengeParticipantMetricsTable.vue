<template>
  <div>
    <UTable
      :rows="rows"
      :columns="headers"
      :sort="sort"
      class="w-full mt-4 cursor-auto"
      sort-asc-icon="i-heroicons-arrow-up-20-solid"
      sort-desc-icon="i-heroicons-arrow-down-20-solid"
      :ui="{
        tr: {
          base: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer cursor-auto',
        },
        th: {
            base: 'text-left',
            padding: 'py-2.5',
            color: 'text-gray-900 dark:text-white',
            font: 'font-medium',
            size: 'text-sm',
          },
        td: {
            base: 'max-w-[0] truncate',
            padding: 'py-3',
            font: '',
            size: 'text-sm',
          },
      }"
    >
    </UTable>
    <div
      class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
    >
      <UPagination
        v-model="page"
        :page-count="pageCount"
        :total="items.length"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  metricsTable: any;
}>();

const formatName = (text: string) => {
  if (typeof text === 'string' && text.startsWith('Dataset_participant:3D:2022-12-17_')) {
    return text.replace('Dataset_participant:3D:2022-12-17_', '');
  }
  return text;
};

const sort = ref({
  column: "participant_label",
  direction: "asc",
});

const headers = props.metricsTable.metrics.map(
  (metric: Object, metricsI: number) => {
    return {
      label: metric.metrics_label,
      key: `metricsValues_${metricsI}`,
    };
  },
);

headers.unshift({
  label: "Participant",
  key: "participant_label",
  sortable: true,
});

let items = props.metricsTable.participants.map(
  (participant: Object, participantI: number) => {
    return {
      _id: participant._id,
      participant_label: formatName(participant.participant_label),
      metricsValues: props.metricsTable.dataMatrix[participantI],
    };
  },
);
items = items.map((item: Object) => {
  return {
    ...item,
    ...item.metricsValues.reduce(
      (acc: Object, metric: Object, metricI: number) => {
        if (metric === null || metric.value === null) {
          // Assign a default value
          return {
            ...acc,
            [`metricsValues_${metricI}`]: '-',
          };
        }

        return {
          ...acc,
          [`metricsValues_${metricI}`]: metric.value,
        };
      },
      {},
    ),
  };
});


items = items.map(({ metricsValues, ...keepAttrs }) => keepAttrs);

const page = ref(1);
const pageCount = 10;

const rows = computed(() => {
  return items.slice((page.value - 1) * pageCount, page.value * pageCount);
});
</script>
