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
    <CustomModal :is-open="isModalOpen" width="700" @modal-close="closeModal">
      <template #header>
        <div class="modal-title">{{ modalTitle }}</div>
        <button
          class="modal-close"
          aria-label="Close modal"
          @click="isModalOpen = false"
        >
          <UIcon name="i-heroicons-x-mark-16-solid" />
        </button>
      </template>
      <template #content>
        <div class="w-100">
          <div
            v-if="isSearchingMetric"
            class="flex justify-content-center items-center"
          >
            <div class="space-y-2 pt-4">
              <USkeleton class="h-8 w-[400px]" />
              <USkeleton class="h-8 w-[400px]" />
              <USkeleton class="h-20 w-[400px]" />
            </div>
          </div>
          <div v-else>
            <div
              v-if="metricObj?._id"
              class="flex flex-col gap-3 metric__modal pt-3"
            >
              <UForm
                :schema="schema"
                :state="state"
                class="space-y-4"
                @submit="onSubmitNewMetric"
              >
                <div class="form-card__row__box row">
                  <div class="col-6">
                    <label for="metric_id">
                      Metric ID
                      <span class="text-red-400 required">*</span>
                    </label>
                    <div class="w-100">
                      <input
                        id="metric_id"
                        v-model="metricObj._id"
                        type="text"
                        class="form-control custom-entry-input"
                        :disabled="!isMetricEditable"
                      />
                    </div>
                  </div>
                  <div class="col-6">
                    <label for="orig_id">
                      Original ID
                      <span class="text-red-400 required">*</span>
                    </label>
                    <div class="w-100">
                      <input
                        id="orig_id"
                        v-model="metricObj.orig_id"
                        type="text"
                        class="form-control custom-entry-input"
                        :disabled="!isMetricEditable"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-card__row__box row">
                  <div class="col-6">
                    <label for="formal_definition">
                      Formal definition
                      <span class="text-red-400 required">*</span>
                    </label>
                    <div class="w-100">
                      <input
                        id="formal_definition"
                        v-model="metricObj.formal_definition"
                        type="text"
                        class="form-control custom-entry-input"
                        :disabled="!isMetricEditable"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-card__row__box row">
                  <div class="col-12">
                    <label for="title">
                      Title
                      <span class="text-red-400 required">*</span>
                    </label>
                    <div class="w-100">
                      <input
                        id="title"
                        v-model="metricObj.title"
                        type="text"
                        class="form-control custom-entry-input"
                        :disabled="!isMetricEditable"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-card__row__box row">
                  <div class="col-12">
                    <label for="description">
                      Description
                      <span class="text-red-400 required">*</span>
                    </label>
                    <div class="w-100">
                      <textarea
                        v-model="metricObj.description"
                        class="form-control custom-entry-input"
                        placeholder="Description..."
                        :disabled="!isMetricEditable"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div class="form-card__row__box row">
                  <div class="col-12">
                    <label for="title">References</label>
                    <div
                      v-if="
                        metricObj.references && metricObj.references.length > 0
                      "
                      class="w-100"
                    >
                      <div class="row">
                        <div
                          v-for="(reference, index) in metricObj.references"
                          :key="index"
                          class="col-6 pt-0 pb-1"
                        >
                          <div class="input-wrapper big d-flex">
                            <span>{{ index + 1 }}.</span>
                            <input
                              v-model="metricObj.references[index]"
                              type="text"
                              class="form-control"
                              :disabled="!isMetricEditable"
                            />
                            <button
                              class="btn-delete-input"
                              type="button"
                              @click="
                                onDeleteElement(index, metricObj.references)
                              "
                            >
                              <font-awesome-icon :icon="['far', 'trash-can']" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-card__row__box row">
                  <div class="col-12">
                    <label for="title">Contacts</label>
                    <div
                      v-if="
                        metricObj.metrics_contact_ids &&
                        metricObj.metrics_contact_ids.length > 0
                      "
                      class="w-100"
                    >
                      <div class="row">
                        <div
                          v-for="(
                            contacts, index
                          ) in metricObj.metrics_contact_ids"
                          :key="index"
                          class="col-6 pt-0 pb-1"
                        >
                          <div class="input-wrapper big d-flex">
                            <span>{{ index + 1 }}.</span>
                            <input
                              v-model="metricObj.metrics_contact_ids[index]"
                              type="text"
                              class="form-control"
                              :disabled="!isMetricEditable"
                            />
                            <button
                              class="btn-delete-input"
                              type="button"
                              @click="
                                onDeleteElement(
                                  index,
                                  metricObj.metrics_contact_ids,
                                )
                              "
                            >
                              <font-awesome-icon :icon="['far', 'trash-can']" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="metricObj.representation_hints" class="w-100">
                  <UFormGroup label="Representation hints">
                    <div class="form-text">
                      <div
                        v-if="metricObj.representation_hints.visualization"
                        class="d-flex"
                      >
                        Usually found in:
                        <span class="pl-2"><b>Bar plots</b></span>
                        <NuxtLink
                          to="/dashboard/plots?type=box"
                          class="btn custom-btn btn-primary mb-2 small ml-5"
                        >
                          View Box Plot
                        </NuxtLink>
                      </div>
                      <div
                        v-else-if="metricObj.representation_hints.optimization"
                        class="d-flex"
                      >
                        Usually found in:
                        <span class="pl-2"><b>Scatter plots</b></span>
                        <NuxtLink
                          to="/dashboard/plots?type=scatter"
                          class="btn custom-btn btn-primary mb-2 small ml-5"
                        >
                          View Scatter Plot
                        </NuxtLink>
                      </div>
                    </div>
                  </UFormGroup>
                </div>
              </UForm>
            </div>
            <div v-else class="flex justify-content-center items-center">
              <div class="text-red-500">No data found</div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="form-footer">
          <UButton
            type="button"
            variant="secondary"
            @click="isModalOpen = false"
          >
            Cancel
          </UButton>
          <UButton type="submit"> Submit </UButton>
        </div>
      </template>
    </CustomModal>
  </div>
</template>

<script setup lang="ts">
import type { Metric } from "@/types/challenge_metric";
import { ref, computed } from "vue";
import CustomModal from "@/components/Common/CustomModal.vue";

const props = defineProps<{
  metricRows: Metric[];
  isLoading: boolean;
  token: string;
}>();

const runtimeConfig = useRuntimeConfig();
const isModalOpen = ref(false);
const isSearchingMetric = ref(false);
const metricObj = ref<Metric | null>(null);
const modalTitle = ref("");
const isMetricEditable = ref(false);
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
    metricObj.value.metrics_contact_ids = cleanContacts(
      metricObj.value.metrics_contact_ids,
    );
  }
};

const closeModal = () => {
  isModalOpen.value = false;
  metricObj.value = null;
  isSearchingMetric.value = true;
};

function cloneMetric(metric: Metric) {
  console.log("Clone metric", metric);
  modalTitle.value = "Clone & create new metric";
  isMetricEditable.value = true;
  openModal(metric);
}

function viewMetric(metric: Metric) {
  modalTitle.value = "View metric";
  isMetricEditable.value = false;
  openModal(metric);
}

function onDeleteElement(index: number, list: any[]) {
  list.splice(index, 1);
}

async function fetchMetric(id: string): Promise<Metric | null> {
  isSearchingMetric.value = true;
  try {
    const response = await fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Metrics/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${props.token}`,
          Accept: "application/json",
        },
      },
    );
    const data = await response.json();
    isSearchingMetric.value = false;
    return data._id ? data : null;
  } catch (error) {
    isSearchingMetric.value = false;
    return null;
  }
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

.input-wrapper {
  background-color: theme("colors.primary.50");
  padding: 0.6rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  line-height: 1;
  padding-bottom: 10px;
  display: flex;
  gap: 10px;
  justify-content: start;
  align-items: baseline;
  input {
    border: none;
    background-color: rgba(255, 255, 255, 0.8);
    width: 100%;
  }
  &.big {
    margin-bottom: 5px;
    width: 100%;
  }
}

.input-wrapper input:disabled {
  background-color: #e9ecef !important;
  opacity: 1;
}
</style>
