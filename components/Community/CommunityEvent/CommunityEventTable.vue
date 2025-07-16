<template>
  <div class="community-event-table">
    <div
      class="community-event-table__border py-3.5 relative not-prose bg-white overflow-hidden"
    >
      <div class="justify-content-end flex py-3.5">
        <UInput
          v-model="search"
          color="white"
          variant="outline"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search ..."
          class="input-search"
        />
      </div>

      <!-- Checkbox in header to select/deselect all visible elements on the current page -->
      <input
        type="checkbox"
        class="allChecks"
        :checked="isAllSelected"
        @change="toggleSelectAll"
      />
      <UTable
        v-model:selected="selected"
        :rows="filteredRows"
        :columns="columns"
        :ui="{
          tr: {
            base: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer',
          },
          th: {
            base: 'text-left rtl:text-right',
            padding: 'py-2.5',
            color: 'text-gray-900 dark:text-white',
            font: 'font-semibold',
            size: 'text-sm',
          },
          td: {
            base: 'whitespace-nowrap',
            padding: 'py-3',
            font: '',
            size: 'text-sm',
          },
        }"
      >
        <template #checkbox-data="{ row }">
          <input
            type="checkbox"
            :checked="isSelected(row)"
            @change="select(row)"
          />
        </template>

        <template #name-data="{ row }">
          <span
            :class="[
              isSelected(row) && 'text-primaryOeb-500 dark:text-primary-400',
            ]"
          >
            {{ row.name }}
          </span>
        </template>
        <template #_id-data="{ row }">
          <NuxtLink
            class="text-primary-500 dark:text-primary-400"
            title="Go to challenge"
            :to="`/benchmarking/${community}/${row._id}`"
          >
            {{ row.acronym }}
          </NuxtLink>
        </template>
        <template #participant-data="{ row }">
          <NuxtLink
            v-if="!loadingRows.includes(row._id)"
            class="text-primary-500 dark:text-primary-400"
            title="Go to participant"
            :to="`/benchmarking/${community}/${row._id}/participants`"
            @click="handleClick(row._id)"
          >
            Participant
          </NuxtLink>
          <span v-else>
            Loading...
          </span>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = defineProps<{
  eventChallenges: Array<any>;
  communityId: string;
  filterArray: Array<any>;
}>();

const emit = defineEmits(["handleChangeChallengers"]);

const community = computed(() => props.communityId);
const page = ref<number>(1);
const pageCount = ref<number>(10);
const search = ref<string>("");
const pageFrom = computed(
  () => (Number(page.value) - 1) * Number(pageCount.value) + 1,
);
const pageTo = computed(() =>
  Math.min(
    Number(page.value) * Number(pageCount.value),
    Number(totalPages.value),
  ),
);
const selected = ref<any[]>([]);
const _total = ref(0);

const columns = [
  {
    key: "checkbox",
    label: "",
  },
  {
    key: "_id",
    label: "Acronym",
  },
  {
    key: "participant",
    label: "Participant",
  },
  {
    key: "name",
    label: "Name",
  },
];

// Keeps all rows (without pagination) to refer to the complete data
const allRows = ref(props.eventChallenges);

// Computed for rows filtered by search and pagination
const filteredRows = computed(() => {
  const filteredData = search.value
    ? allRows.value.filter((challenge: any) => {
        return Object.values(challenge).some((value) => {
          return String(value)
            .toLowerCase()
            .includes(search.value.toLowerCase());
        });
      })
    : allRows.value;

  _total.value = filteredData.length;

  return filteredData.slice(
    (Number(page.value) - 1) * Number(pageCount.value),
    Number(page.value) * Number(pageCount.value),
  );
});

const totalPages = computed(() => {
  return Math.ceil(Number(_total.value) / Number(pageCount.value));
});

// Function for selecting/deselecting a single element
function select(row: any) {
  const index = selected.value.findIndex((item: any) => item._id === row._id);
  if (index === -1) {
    selected.value.push(row);
  } else {
    selected.value.splice(index, 1);
  }
}

function isSelected(row: any) {
  return selected.value.some((item: any) => item._id === row._id);
}

// Function to select/deselect all elements of the current page
function toggleSelectAll() {
  const currentPageRows = filteredRows.value;

  if (isAllSelected.value) {
    // If all items on the current page are selected, deselect all of them
    selected.value = selected.value.filter(
      (row) =>
        !currentPageRows.some((currentRow) => currentRow._id === row._id),
    );
  } else {
    // If not all are selected, select all items on the current page.
    const newSelections = currentPageRows.filter(
      (row) =>
        !selected.value.some((selectedRow) => selectedRow._id === row._id),
    );
    selected.value.push(...newSelections);
  }
}

// Computed to check if all items on the current page are selected
const isAllSelected = computed(() => {
  return filteredRows.value.every((row) =>
    selected.value.some((selectedRow) => selectedRow._id === row._id),
  );
});

// Participants loading
const loadingRows = ref<string[]>([]);
function handleClick(rowId: string) {
  // Si ya está cargando, no hacer nada
  if (!loadingRows.value.includes(rowId)) {
    loadingRows.value.push(rowId);
  }
}

// Observe the changes in the selected array to issue the change to the parent component.
watch(
  selected,
  (newSelected) => {
    emit("handleChangeChallengers", newSelected);
  },
  { deep: true },
);
</script>

<style scoped lang="scss">
.community-event-table {
  border: none;
  .input-search {
    input {
      box-shadow: none !important;
      :focus {
        border: 1px solid theme("colors.primary.500");
      }
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
}
.form-checkbox:checked,
.form-checkbox:indeterminate {
  background-color: currentColor !important;
}

.allChecks {
  position: absolute;
  margin-top: 12px;
  margin-left: 24px;
  z-index: 100;
}
</style>
