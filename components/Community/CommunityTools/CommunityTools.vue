<template>
  <div>
    <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <UInput v-model="search" placeholder="Search..." />
    </div>
    <UTable
      :columns="columns"
      :rows="filteredRows"
      :ui="{
        tr: {
          base: '',
          selected: 'bg-gray-50 dark:bg-gray-800/50',
          active: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer',
        },
      }"
    >
      <template #name-data="{ row }">
        <NuxtLink
          :to="`/tool/${row.registry_rool_id ? row.registry_tool_id.split(':')[1] : ''}`"
          class="text-blue-600 dark:text-blue-400"
        >
          {{ row.name }}
        </NuxtLink>
      </template>
    </UTable>
    <div
      class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
    >
      <UPagination
        v-model="page"
        :page-count="pageCount"
        :total="tools.length"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  tools: Object;
  communityId: string;
}>();

const page = ref(1);
const pageCount = 15;
const totalPages = ref(0);
const search = ref("");

const columns = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "description",
    label: "Description",
  },
];

const filteredRows = computed(() => {
  if (!search.value) {
    totalPages.value = props.tools.length;
    return props.tools.slice(
      (page.value - 1) * pageCount,
      page.value * pageCount,
    );
  }

  const filteredSearcher = props.tools.filter((challenge: any) => {
    return Object.values(challenge).some((value) => {
      return String(value).toLowerCase().includes(search.value.toLowerCase());
    });
  });
  totalPages.value = filteredSearcher.length;
  return filteredSearcher.slice(
    (page.value - 1) * pageCount,
    page.value * pageCount,
  );
});
</script>
