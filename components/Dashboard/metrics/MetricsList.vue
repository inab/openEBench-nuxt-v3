<template>
<div class="metrics-table">
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
        base: '',
        padding: 'px-3 py-3',
        font: '',
        size: 'text-sm',
      },
    }"
  >
    <template #view-data="{ row }">
      <button class="btn-custom-badget text-sm text-primaryOeb-950"
        @click="openModal(row)">
        View <font-awesome-icon :icon="['fas', 'pencil']" />
      </button>
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
    <CustomModal :is-open="isModalOpen" width="700" @modal-close="closeModal">
      <template #header>
        <h2>View Metric</h2>
        <UButton
          color="bg-slate-300"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class=""
          @click="isModalOpen = false"
        />
      </template>
      <template #content>
        <div class="w-100">
          <div v-if="isSearchingMetric" class="flex justify-content-center items-center">
            <div class="space-y-2 pt-4">
              <USkeleton class="h-8 w-[400px]" />
              <USkeleton class="h-8 w-[400px]" />
              <USkeleton class="h-20 w-[400px]" />
            </div>
          </div>
          <div v-else>
            <div v-if="metricObj?._id" class="flex flex-col gap-3 metric__modal pt-3">
              <div class="flex gap-3">
                <UFormGroup label="Metric ID">
                  <UInput disabled  placeholder="Metric ID" class="w-100"
                    v-model=" metricObj._id" />
                </UFormGroup>
                <UFormGroup label="Original ID">
                  <UInput disabled  placeholder="Original ID"
                    v-model=" metricObj.orig_id" />
                </UFormGroup>

                <UFormGroup label="Formal definition">
                  <UInput disabled  placeholder="Formal definition"
                    v-model=" metricObj.formal_definition" />
                </UFormGroup>
              </div>
              <div class="flex gap-3 w-100">
                <UFormGroup label="Title" class="w-100">
                  <UInput disabled  placeholder="Title"
                    v-model=" metricObj.title" />
                </UFormGroup>
              </div>
              <div class="row">
                <UFormGroup label="References" class="col-6">
                  <UInput disabled  placeholder="References" v-for="(reference, index) in metricObj.references" 
                    :key="index"
                    v-model="metricObj.references[index]" />
                </UFormGroup>
                <UFormGroup label="Contacts" class="col-6">
                  <UInput disabled  placeholder="Contacts" v-for="(metrics_contact_ids, index) in metricObj.metrics_contact_ids" 
                    :key="index"
                    v-model="metricObj.metrics_contact_ids[index]" />
                </UFormGroup>
              </div>
              <div class="flex gap-3">
                <UFormGroup label="Description" class="w-100">
                  <UTextarea disabled placeholder="Description..." v-model="metricObj.description" />
                </UFormGroup>
              </div>
            </div>
            <div v-else class="flex justify-content-center items-center">
              <div class="text-red-500">No data found</div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-content-end pt-4">
          <UButton
            class="mr-2"
            @click="isModalOpen = false"
          >
            Cancel
          </UButton>
        </div>
      </template>
    </CustomModal>
</div>
</template>

<script setup lang="ts">
import { Metric } from "@/types/challenge_metric";
import { ref, computed } from "vue";
import CustomModal from "@/components/Common/CustomModal.vue";

const props = defineProps<{
  metricRows: Metric[];
  isSearching: boolean;
  token: string;
}>();
const runtimeConfig = useRuntimeConfig();
const isModalOpen = ref(false);
const isSearchingMetric = ref(false);
const metricObj = ref<Metric | null>(null);
const search = ref("");
const _total = ref(0);
const page = ref<number>(1);
const pageCount = ref<number>(10);
  const pageFrom = computed(
  () => (Number(page.value) - 1) * Number(pageCount.value) + 1,
);
const pageTo = computed(() =>
  Math.min(
    Number(page.value) * Number(pageCount.value),
    Number(totalPages.value),
  ),
);
const columns = [
  {
    key: "_id",
    label: "Metric ID",
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

const cleanContacts = (contacts: any) => {
  return contacts.map((contact: any) => {
    return contact.replaceAll(".", " ");
  });
};

const filteredRows = computed(() => {
  console.log("search.value", search.value);
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

  console.log("filteredSearcher", filteredSearcher);

  _total.value = filteredSearcher.length;

  
  return filteredSearcher.slice(
    (Number(page.value) - 1) * Number(pageCount.value),
    Number(page.value) * Number(pageCount.value),
  );
});

const totalPages = computed(() => {
  return Math.ceil(Number(_total.value) / Number(pageCount.value));
});

const openModal = async (row: Metric) => {
  isModalOpen.value = true;
  metricObj.value = await fetchMetric(row._id);
  if (metricObj.value) {
    metricObj.value.metrics_contact_ids = cleanContacts(metricObj.value.metrics_contact_ids);
  }
};

const closeModal = () => {
  isModalOpen.value = false;
  metricObj.value = null;
  isSearchingMetric.value = true;
};

async function fetchMetric(id: string): Promise<Metric | null> {
  isSearchingMetric.value = true;
  try {
    const response = await fetch(`${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Metrics/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${props.token}`,
        Accept: "application/json",
      },
    });
    const data = await response.json();
    isSearchingMetric.value = false;
    return data._id ? data : null;
  } catch (error) {
    isSearchingMetric.value = false;
    return null;
  }
}
</script>

<style scoped>
.metric__modal input {
  width: 100%;
}
</style>