<template>
  <div class="community-dataset">
    <div>
      <span class="community-dataset__title">
        Find the datasets available for this community
      </span>
    </div>
    <div
      v-if="filteredRows.length > 0"
      class="flex justify-content-end py-2.5 border-b border-gray-200 dark:border-gray-700"
    >
      <UInput
        v-model="search"
        color="white"
        variant="outline"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search ..."
        class="input-search"
      />
    </div>
    <UTable
      :columns="columns"
      :rows="filteredRows"
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
          base: 'whitespace-nowrap',
          padding: 'px-3 py-3',
          font: '',
          size: 'text-sm',
        },
      }"
    >
      <template #name-data="{ row }">
        <span>{{ row.name }}</span>
      </template>
      <template #type-data="{ row }">
        <span>{{ row.type }}</span>
      </template>
      <template #download-data="{ row }">
        <a v-if="row.datalink && row.datalink.uri" :href="row.datalink.uri" target="_blank"
          >Download
        </a>
        <span v-else>Not available</span>
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
          <span class="font-medium">{{ totalPages }}</span>
          results
        </span>
      </div>
      <UPagination
        v-model="page"
        class="pagination"
        :page-count="pageCount"
        :total="datasets.length"
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  datasets: object[];
  communityId: string;
}>();

const page = ref(1);
const pageCount = ref(10);
const search = ref("");
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed(() =>
  Math.min(page.value * pageCount.value, totalPages.value),
);
let _total = 0;

const columns = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "type",
    label: "Type",
  },
  {
    key: "download",
    label: "Download",
  },
];

const datasets = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return props.datasets.map((dataset: any) => {
    return {
      name: dataset.name,
      type: dataset.type,
      download: dataset.datalink ? dataset.datalink.uri : null,
    };
  });
});

const filteredRows = computed(() => {
  if (!search.value) {
    _total = props.datasets.length;
    return props.datasets.slice(
      (page.value - 1) * pageCount.value,
      page.value * pageCount.value,
    );
  }

  const filteredSearcher = props.datasets.filter((challenge: any) => {
    return Object.values(challenge).some((value) => {
      return String(value).toLowerCase().includes(search.value.toLowerCase());
    });
  });
  _total = filteredSearcher.length;
  return filteredSearcher.slice(
    (page.value - 1) * pageCount.value,
    page.value * pageCount.value,
  );
});

const totalPages = computed(() => {
  return _total;
});
</script>
<style scoped lang="scss">
.community-dataset {
  &__title {
    display: flex;
    align-items: center;
    color: #0b579f;
    font-size: 18px;
    font-weight: 600;
  }
}
table {
  a {
    color: theme("colors.primary.500");
    text-decoration: none;
    &:hover {
      color: theme("colors.primary.400");
    }
  }
}
</style>
