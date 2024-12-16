<template>
  <div class="w-100">
    <div class="challenge-metric-modal text-neutral-500">
      <div class="challenge-metric-modal__form">
        <div class="col-12">
          <div class="w-100 row">
            <div class="col-6">
              <div class="modal_section_title text-primaryOeb-500">
                Search for an existing metric
              </div>
              <UForm class="space-y-4" @submit="onSubmitSearcher">
                <div class="d-flex">
                  <input
                    v-model="searchMetric"
                    placeholder="Search ..."
                    class="input-search-lg"
                  />
                  <button
                    class="btn btn-primary btn-input"
                    type="button"
                    :disabled="searchMetric.length === 0"
                    @click="search"
                  >
                    <UIcon
                      name="i-heroicons-magnifying-glass"
                      class="w-5 h-5"
                    />
                  </button>
                </div>
              </UForm>
            </div>
            <div class="col-6">
              <div class="modal_section_title text-primaryOeb-500">
                Or create new one
                <div class="w-100">
                  <button
                    class="btn btn-primary"
                    type="button"
                    @click="isModalOpened = true"
                  >
                    <UIcon name="i-heroicons-plus" />
                    Create Metric
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="w-100 challenge-metric-modal__search">
            <div class="row flex">
              <div class="stepper-1">
                <div class="stepper-header">
                  <ol
                    class="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base"
                  >
                    <li
                      class="flex md:w-full items-center text-blue-600 dark:text-blue-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700"
                    >
                      <span
                        class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500"
                      >
                        <svg
                          class="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
                          />
                        </svg>
                        Select
                        <span class="hidden sm:inline-flex sm:ms-2">Metrics</span>
                      </span>
                    </li>
                    <li
                      class="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700"
                    >
                      <span
                        class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500"
                      >
                        <span class="me-2">2</span>
                        Select
                        <span class="hidden sm:inline-flex sm:ms-2">Tools</span>
                      </span>
                    </li>
                    <li
                      class="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700"
                    >
                      <span
                        class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500"
                      >
                        <span class="me-2">3</span>
                        Add
                        <span class="hidden sm:inline-flex sm:ms-2">Visualization</span>
                      </span>
                    </li>
                    <li class="flex items-center">
                      <span class="me-2">4</span>
                      Confirmation
                    </li>
                  </ol>
                </div>

                <div class="col-12 flex justify-between">
                  <div
                    v-if="selectedMetrics.length > 0"
                    class="col-12 text-right"
                  >
                    <button
                      class="btn btn-primary"
                      type="button"
                      @click="addSelectedMetrics"
                    >
                      <UIcon name="i-heroicons-plus" />
                      Add selected metrics
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="isShowSearchTable" class="col-12">
                <SearchMetricTable
                  :metric-rows="searchList"
                  :selected-metrics="selectedMetrics"
                  @handle-selected-metrics="handleSelectedMetrics"
                />
              </div>
              <div v-if="selectedMetric" class="col-5">
                <button
                  class="btn btn-primary"
                  type="button"
                  :disabled="!selectedMetric"
                  @click="searchMetricResults"
                >
                  <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5" />
                  Search Associated metrics
                </button>
              </div>
            </div>
          </div>
          <div v-if="showAdvancedSearch" class="w-100">
            <div v-if="isSearchingSelectedMetric" class="">
              <CustomSearcherLoader />
            </div>
            <div v-else class="searching-metric__results">
              <div v-if="Object.keys(metricAssociatedList).length > 0" class="">
                <div class="searching-metric__results__title">
                  We found some associated challengers with this metric
                </div>
                <div class="">
                  <div class="">
                    The metric <b>{{ selectedMetric._id }}</b> is usually found
                    alongside these others:
                  </div>
                  <div class="pt-2">
                    <div
                      v-for="(pm, index) in processedMetrics"
                      :key="index"
                      class=""
                    >
                      <div class="">
                        <input
                          type="checkbox"
                          color="primary form-checkbox"
                          :v-model="selectedMetricResults[index]"
                          @change="handleChangeMetricSelected(index)"
                        />
                        <label class="pl-2">{{ pm }}</label>
                      </div>
                    </div>
                  </div>
                  <div class="pt-2">
                    <button
                      class="btn btn-primary"
                      type="button"
                      :disabled="!selectedMetric"
                      @click="addSelectedMetric"
                    >
                      <font-awesome-icon :icon="['fas', 'plus']" />
                      Add selected metrics
                    </button>
                  </div>
                </div>
                <div class="w-100 pt-4">
                  <div
                    v-for="(challenge, metricId) in metricAssociatedList"
                    :key="metricId"
                    class=""
                  >
                    <div class="">
                      Metric <span class="font-bold">{{ metricId }}</span> is
                      associated with
                      <span class="font-bold">{{ challenge.count }}</span>
                      challenges
                    </div>
                    <div class="">
                      <AddMetricTable
                        :challenge-rows="challenge.challenges"
                        :challenge-id="challengeId"
                      />
                    </div>
                    <CustomBorder />
                  </div>
                </div>
              </div>
              <div v-else class="">
                <div class="searching-metric__results__title">
                  Associated metrics not found. Please try again.
                </div>
              </div>
            </div>
          </div>
        </div>
        <CustomBorder />
        <CustomModal :is-open="isModalOpened" width="800">
          <template #header>
            <div class="modal-header">
              <div class="modal-title">Create new metric</div>
              <button
                class="modal-close"
                aria-label="Close modal"
                @click="isModalOpened = false"
              >
                <UIcon name="i-heroicons-x-mark-16-solid" />
              </button>
            </div>
          </template>
          <template #content>
            <div class="modal-content">
              <CreateMetric />
            </div>
          </template>
        </CustomModal>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Metric } from "@/types/challenge_metric";
import { useMetrics } from "@/stores/metrics.ts";
import metricsSearcher from "@/utils/metricsMatch";
import CustomBorder from "@/components/Common/CustomBorder.vue";
import AddMetricTable from "@/components/Dashboard/entries/events/challenges/metrics/AddMetricTable.vue";
import SearchMetricTable from "@/components/Dashboard/entries/events/challenges/metrics/SearchMetricTable.vue";
import CustomModal from "@/components/Common/CustomModal.vue";
import CreateMetric from "@/components/Dashboard/entries/events/challenges/metrics/CreateMetric.vue";
const props = defineProps<{
  contactsData: string[];
}>();

const { data } = useAuth();
const route = useRoute();
const isLoadingMetrics = ref(true);
const loadingInput = ref(false);
const showAdvancedSearch = ref(false);
const eventId: string = route.params.event_id;
const communityId: string = route.params.community_id;
const challengeId: string = route.params.id;
const metricDataList = ref<Metric[] | never[]>([]);
const metricsStore = useMetrics();
const isSearchingMetrics = ref(false);
const isSearchingSelectedMetric = ref(false);
const searchList = ref<Metric[]>([]);
const selectedMetricResults = ref<boolean[]>([]);
const token: string = data?.value.accessToken;
const processedMetrics = ref(new Set());
const selectedMetric = ref(null);
const selectedMetrics = ref([]);
const isShowSearchTable = ref(false);
const searchMetric = ref<string>("");
const localContacts = ref<string[]>([]);
const dialogElement = ref<{ element: string[]; index: number } | null>(null);
const isModalOpened = ref<boolean>(false);
const metricAssociatedList = ref<{
  [key: string]: { count: number; challenges: any[] };
}>({});

interface BasicChallenge {
  challenge_id: string;
  name: string;
}

const steps = [
  {
    index: 0,
    title: "Search Metric",
    component: "SearchMetricTable",
  },
  {
    index: 1,
    title: "Select visualization",
    component: "AddMetricVisualization",
  },
];

async function searchMetricResults() {
  isSearchingSelectedMetric.value = true;
  showAdvancedSearch.value = true;
  processedMetrics.value.clear();
  metricAssociatedList.value = {};
  try {
    const res = await metricsSearcher(selectedMetric.value._id, token);

    res.forEach((challenge) => {
      if (challenge.metrics_categories) {
        challenge.metrics_categories.forEach((category) => {
          category?.metrics.forEach((m) => {
            if (m.metrics_id !== selectedMetric.value._id) {
              if (!metricAssociatedList.value[m.metrics_id]) {
                metricAssociatedList.value[m.metrics_id] = {
                  count: 0,
                  challenges: [],
                };
              }

              metricAssociatedList.value[m.metrics_id].count += 1;
              metricAssociatedList.value[m.metrics_id].challenges.push(
                challenge,
              );

              processedMetrics.value.add(m.metrics_id);
            }
          });
        });
      }
    });

    selectedMetricResults.value = Array.from(
      { length: processedMetrics.value.size },
      () => false,
    );
  } catch (error) {
    console.error("Error fetching contacts data:", error);
  }

  isSearchingSelectedMetric.value = false;
}

async function search() {
  loadingInput.value = true;
  searchList.value = [];

  const searchFilter = metricDataList.value.filter((metric) => {
    return metric.title
      .toLowerCase()
      .includes(searchMetric.value.toLowerCase());
  });

  loadingInput.value = false;
  isShowSearchTable.value = true;
  searchList.value = searchFilter;
}

await fetchMetrics(token);
async function fetchMetrics(token: string): Promise<Metric[]> {
  isSearchingMetrics.value = true;
  try {
    if (metricsStore.getMetricsData && metricsStore.getMetricsData.length > 0) {
      metricDataList.value = metricsStore.getMetricsData;
      isSearchingMetrics.value = false;
    } else {
      metricDataList.value = await metricsStore.fetchMetricsData(token);
      isSearchingMetrics.value = false;
    }
    isLoadingMetrics.value = false;
    return metricDataList.value as Metric[];
  } catch (error) {
    console.error("Error fetching contacts data:", error);
  }
}

function handleChangeMetricSelected(index: number) {
  selectedMetricResults.value[index] = !selectedMetricResults.value[index];
}

function onSubmitSearcher() {
  search();
}

const goBack = () => {
  route.push({
    name: "dashboard-community-event-community-metric",
    params: {
      community_id: communityId,
      event_id: eventId,
      id: challengeId,
    },
  });
};

function onAddElement(array: string[]) {
  array.push("");
}

function onDeleteElement(index: number, element: string[]) {
  dialogElement.value = null;
  if (element[index] === "") {
    element.splice(index, 1);
    restartElementToDelete();
  } else {
    dialogElement.value = {
      element: element,
      index: index,
    };
    dialogText.value = "Are you sure you want to delete this element?";
    dialogTitle.value = "Delete Element";
    isDialogOpened.value = true;
    elementToDelete.value = {
      index: index,
      element: element,
    };
  }
}

function addSelectedMetrics() {}

function handleSelectedMetrics(selectedMetricsData: Metric[]) {
  selectedMetrics.value = selectedMetricsData;
}

watch(props.contactsData, (newVal: string[]) => {
  localContacts.value = newVal;
});
</script>

<style lang="scss" scoped>
.footer-row {
  padding: 20px 0;
  display: flex;
  .form-footer {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    gap: 20px;
  }
}
.modal_section_title {
  font-size: 1.2rem;
  font-weight: 600;
  padding-top: 20px;
}
.searching-metric__results {
  padding-top: 20px;
  &__title {
    font-size: 1.05rem;
    font-weight: 600;
  }
}

.input-search-lg {
  height: 100%;
  * > input {
    height: 100% !important;
    box-shadow:
      rgb(255, 255, 255) 0px 0px 0px 0px inset,
      rgb(209, 213, 219) 0px 0px 0px 1px inset,
      rgba(0, 0, 0, 0.05) 0px 1px 2px 0px !important;
  }
}
.btn-input {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  border: none;
  padding: 4px !important;
}

.form-group-row {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  .label-text {
    border-bottom: 1px solid #e9ecef;
    width: 90%;
    padding-bottom: 5px;
  }
  .btn-form-add.btn-primary {
    padding: 1px 6px;
    height: 28px;
  }
}
.input-wrapper {
  background-color: theme("colors.primary.50");
  padding: 0.6rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  line-height: 1;
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

.challenge-metric-modal__search {
  padding-top: 65px;
}
</style>
