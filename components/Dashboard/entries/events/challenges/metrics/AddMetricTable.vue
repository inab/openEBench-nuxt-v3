<template>
  <div class="add-metric-table">
    <div class="add-metric">
      <UTable
        :columns="columns"
        :rows="rows"
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
      >
        <template #view-data="{ row }">
          <button class="btn-custom-badget text-sm">
            <NuxtLink :to="`${to}/metrics/add`" class="text-primaryOeb-950">
              <font-awesome-icon :icon="['far', 'calendar-check']" />
              View <font-awesome-icon :icon="['fas', 'pencil']" />
            </NuxtLink>
          </button>
        </template>
      </UTable>
      <div
        class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
      >
        <UPagination
          v-model="page"
          :page-count="pageCount"
          :total="props.challengeRows.length"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed } from "vue";

const props = defineProps<{
  challengeRows: [];
  challengeId: string;
}>();

const page = ref(1);
const pageCount = 5;

const columns = [
  {
    key: "_id",
    label: "Challenge ID",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "view",
    label: "View",
  },
];

const rows = computed(() => {
  return props.challengeRows.slice(
    (page.value - 1) * pageCount,
    page.value * pageCount,
  );
});
</script>
