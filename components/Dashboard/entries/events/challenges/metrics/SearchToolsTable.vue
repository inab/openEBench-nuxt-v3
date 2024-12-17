<template>
  <div class="add-tool-table">
    <div class="add-tool">
      <UTable
        v-model="selectedToolsTmp"
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
      <div
        class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
      >
        <UPagination
          v-model="page"
          :page-count="pageCount"
          :total="rowTool.length"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed, defineEmits, watch } from "vue";


const props = defineProps<{
  toolsRows: [];
  selectedTools: [];
  selectedMetrics: [];
}>();

const emits = defineEmits(["handleSelectedTools"]);
const runtimeConfig = useRuntimeConfig();
const { data } = useAuth();
const token: string = data?.value.accessToken;
const selectedToolsTmp = ref([]);
const page = ref(1);
const pageCount = 5;
const rowTool = ref([]);

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

const rows = computed(() => {
  return rowTool.value.slice(
    (page.value - 1) * pageCount,
    page.value * pageCount,
  );
});

function select(row) {
  console.log("select!!");
  const index = selectedToolsTmp.value.findIndex((item) => item.id === row.id);
  if (index === -1) {
    selectedToolsTmp.value.push(row);
  } else {
    selectedToolsTmp.value.splice(index, 1);
  }
}

await fetchTools(token);
async function fetchTools(token: string): Promise<Metric[]> {
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

  const data = await response.json();
  if (!data) {
    [];
  }

  rowTool.value = data;

  console.log(data);
  return data;
}

watch(selectedToolsTmp, (value) => {
  emits("handleSelectedTools", value);
});
</script>
