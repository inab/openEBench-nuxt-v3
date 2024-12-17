<template>
  <div class="w-100">
    <div class="challenge-metric-modal text-neutral-500">
      <div class="challenge-metric-modal__form">
        <div class="col-12">
          <div class="w-100 row">
            <div class="col-12">
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
                  <div class="w-100 pl-4">
                    <button
                      class="btn btn-primary"
                      type="button"
                      @click="isModalOpened = true"
                    >
                      <UIcon name="i-heroicons-plus" />
                      Create New Metric
                    </button>
                  </div>
                </div>
              </UForm>
            </div>
          </div>
          <div
            v-if="searchList.length > 0"
            class="w-100 challenge-metric-modal__search"
          >
            <div class="row flex">
              <div class="steppers">
                <div class="stepper-header">
                  <ul
                    class="stepper-header__controller flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base"
                  >
                    <li
                      class="stepper-header__item"
                      :class="[stepperIndex == 1 ? 'current' : '', stepperIndex > 1 ? 'complete' : '']"
                      @click="(stepperIndex >= 1) ? handleStepperClick(1) : null"
                      >
                      <div class="stepper-header__item__content">
                        <div class="">
                          <span
                            class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500"
                          >
                            <span class="me-2">1.</span>
                            Select
                            <span class="hidden sm:inline-flex sm:ms-2"
                              >Metrics</span
                            >
                          </span>
                        </div>
                        <div
                          v-if="selectedMetrics.length > 0"
                          class="stepper-header__item__subtitle"
                        >
                          {{ selectedMetrics.length }} added
                        </div>
                      </div>
                    </li>
                    <li class="stepper-header__item"
                      :class="[stepperIndex == 2 ? 'current' : '']"
                      @click="(stepperIndex >= 2) ? handleStepperClick(2) : null">
                      <div class="stepper-header__item__content">
                        <div class="">
                          <span
                            class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500"
                          >
                            <span class="me-2">2.</span>
                            Select
                            <span class="hidden sm:inline-flex sm:ms-2"
                              >Tools</span
                            >
                          </span>
                        </div>
                        <div class="stepper-header__item__subtitle"></div>
                      </div>
                    </li>
                    <li class="stepper-header__item">
                      <div class="stepper-header__item__content">
                        <div class="">
                          <span
                            class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500"
                          >
                            <span class="me-2">3.</span>
                            Add
                            <span class="hidden sm:inline-flex sm:ms-2"
                              >Visualization</span
                            >
                          </span>
                        </div>
                        <div class="stepper-header__item__subtitle"></div>
                      </div>
                    </li>
                    <li class="stepper-header__item flex items-center">
                      <div class="stepper-header__item__content">
                        <div class="">
                          <span
                            class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500"
                          >
                            <span class="me-2">4.</span>
                            Confirmation
                            <span class="hidden sm:inline-flex sm:ms-2"></span>
                          </span>
                        </div>
                        <div class="stepper-header__item__subtitle"></div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div v-if="isShowSearchTable" class="col-12">
                  <div class="w-100 stepper-title">Metrics</div>
                  <div class="col-12 flex justify-between">
                    <div
                      v-if="selectedMetrics.length > 0"
                      class="col-12 text-right"
                    >
                      <button
                        class="btn btn-primary"
                        type="button"
                        @click="addSelectedMetrics(2)"
                      >
                        Next
                        <span>
                          <UIcon name="i-heroicons-arrow-right-16-solid" />
                        </span>
                      </button>
                    </div>
                  </div>
                  <SearchMetricTable
                    :metric-rows="searchList"
                    :selected-metrics="selectedMetrics"
                    @handle-selected-metrics="handleSelectedMetrics"
                  />
                </div>
                <div v-if="isShowToolsTable" class="row flex">
                  <div class="w-100 stepper-title">Tools</div>
                  <div class="row-flex">
                    <SearchToolsTable
                      :tool-rows="searchList"
                      :selected-tools="selectedTools"
                      :selected-metrics="selectedMetrics"
                      @handle-selected-metrics="handleSelectedMetrics"
                    />
                  </div>
                </div>
              </div>

              <!-- <div v-if="selectedMetric" class="col-5">
                <button
                  class="btn btn-primary"
                  type="button"
                  :disabled="!selectedMetric"
                  @click="searchMetricResults"
                >
                  <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5" />
                  Search Associated metrics
                </button>
              </div> -->
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
import type { Challenge } from "@/types/challenge";
import { useMetrics } from "@/stores/metrics.ts";
import metricsSearcher from "@/utils/metricsMatch";
import CustomBorder from "@/components/Common/CustomBorder.vue";
import AddMetricTable from "@/components/Dashboard/entries/events/challenges/metrics/AddMetricTable.vue";
import SearchMetricTable from "@/components/Dashboard/entries/events/challenges/metrics/SearchMetricTable.vue";
import SearchToolsTable from "@/components/Dashboard/entries/events/challenges/metrics/SearchToolsTable.vue";
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
const stepperIndex = ref(1);

const selectedTools = ref([]);
const isShowToolsTable = ref(false);

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

async function  fetchChallenges(token: string): Promise<Challenge[]> {

}

function handleChangeMetricSelected(index: number) {
  selectedMetricResults.value[index] = !selectedMetricResults.value[index];
}

function handleStepperClick(index: number) {
  console.log(index)
  if (index === 1) {
    isShowSearchTable.value = true;
    isShowToolsTable.value = false;
  } else if(index === 2) {
    isShowSearchTable.value = false;
    isShowToolsTable.value = true;
  }
  stepperIndex.value = index;
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

function addSelectedMetrics(index: number) {
  isShowSearchTable.value = false;
  isShowToolsTable.value = true;
  console.log("index", index);
  stepperIndex.value = index;
}

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
  width: 50px;
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
.stepper-title {
  font-size: 1.2rem;
  font-weight: 600;
  padding-top: 20px;
}
.stepper-header {
  padding: 5px;
  &__controller {
    display: flex;
    width: 100%;
    list-style: none;
    position: relative;
    gap: 10px;
    padding-left: 0;
    &::before {
      background: white;
    }
  }
  &__item {
    flex: 100%;
    flex: 1;
    padding: 5px 15px 5px 0px;
    margin: 0 0 0 -19px;
    height: 60px;
    background: repeating-linear-gradient(
      -65deg,
      theme("colors.primary.50"),
      theme("colors.primary.50") 20px,
      theme("colors.primary.50") 20px,
      theme("colors.primary.50") 40px
    );
    background-color: theme("colors.primary.50");
    -webkit-clip-path: polygon(
      20px 50%,
      0% 0%,
      calc(100% - 20px) 0%,
      100% 50%,
      calc(100% - 20px) 100%,
      0% 100%
    );

    &.current {
      background: theme("colors.secondaryOeb.500");
      font-weight: bold;
      color: white;
      cursor: pointer;
      &_subtitle {
        color: white;
      }
    }

    &.complete {
      background: repeating-linear-gradient(
        -65deg,
        #fcfcfc,
        #fcfcfc 20px,
        #f4faf7 20px,
        #f4faf7 40px
      );
      font-weight: bold;
      color: v-bind("text-zinc-800");
      cursor: pointer;
      .stepper-header__item__subtitle {
        color: v-bind("text-zinc-800");
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-weight: 500;
      text-align: center;
      height: 100%;
      width: 100%;
    }

    &__subtitle {
      text-align: left;
      font-size: 14px;
      color: white;
      font-weight: bold;
      font-style: italic;
    }

    &:first-child {
      -webkit-clip-path: polygon(
        0% 0%,
        calc(100% - 20px) 0%,
        100% 50%,
        calc(100% - 20px) 100%,
        0% 100%
      );
      margin: 0;
    }

    &:last-child {
      -webkit-clip-path: polygon(20px 50%, 0% 0%, 100% 0%, 100% 100%, 0% 100%);
    }
  }
}
</style>
