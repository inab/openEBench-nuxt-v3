<template>
  <div class="challenge-metrics">
    <CustomSubtitle text="Challenge Metric" />
    <div class="challenge-metrics-categories">
      <div
        v-for="(metric, index) in metrics_by_categories"
        :key="index"
        class="challenge-metrics-categories__category"
      >
        <UCard
          :ui="{
            base: '',
            background: 'bg-white dark:bg-gray-900',
            divide: 'divide-y divide-gray-200 dark:divide-gray-800',
            ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
            rounded: 'rounded-lg',
            shadow: 'shadow',
            body: {
              base: '',
              background: '',
              padding: 'px-4 py-2 sm:p-6',
            },
            header: {
              base: '',
              background: '',
              padding: 'px-4 py-2 sm:p-6',
            },
          }"
        >
          <template #header>
            <div
              class="challenge-metrics-categories__category__name flex justify-between"
            >
              <div
                class="challenge-metrics-categories__category__name__title flex items-end text-primaryOeb-500"
              >
                Metric Type: {{ index }}
              </div>
              <UButton
                icon="i-heroicons-plus-solid"
                class=""
                label="Add Metric to challenge"
                @click="openMetricModal"
              >
              </UButton>
            </div>
          </template>
          <div class="challenge-metrics-categories__category__description">
            {{ metric[0].description }}
          </div>

          <div class="challenge-metrics-categories__category__metrics row">
            <div
              v-for="(m, i) in metric[0].metrics"
              :key="i"
              class="col-6 challenge-metrics-categories__category__metric"
            >
              <CommunityMetric :metric="m" :is-loading-data="isLoadingData" />
            </div>
          </div>
        </UCard>
      </div>
    </div>
    <UModal
      v-model="isMetricOpen"
      prevent-close
      :ui="{
        width: 'modal-challenge-wrapper',
      }"
    >
      <UCard
        class="r"
        :ui="{
          base: '',
          background: 'bg-white dark:bg-gray-900',
          divide: 'divide-y divide-gray-200 dark:divide-gray-800',
          ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
          rounded: 'rounded-lg',
          shadow: 'shadow',
          body: {
            base: '',
            background: '',
            padding: 'p-4 sm:p-6',
          },
          header: {
            base: '',
            background: '',
            padding: 'px-4 py-2 sm:p-6',
          },
          width: '',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div
              class="text-primaryOeb-500 text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Add new metric to challenge
            </div>
            <UButton
              color="bg-slate-300"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class=""
              @click="isMetricOpen = false"
            />
          </div>
          <div class="challenge-metric-modal text-neutral-500">
            <div class="challenge-metric-modal__form">
              <div
                v-if="isShowSearch"
                class="challenge-metric-modal__form__search pt-4 row"
              >
                <div class="col-6 justify-content-between">
                  <div class="modal_section_title">
                    Create a new metric that will be added to this challengec
                  </div>
                  <UButton
                    icon="i-heroicons-plus-solid"
                    class=""
                    label="Add Metric"
                    @click="onAddNewMetric"
                  >
                  </UButton>
                </div>
                <div class="col-6">
                  <div class="w-100">
                    <div class="modal_section_title">
                      Or search for an existing one
                    </div>
                    <div class="d-block">
                      <div class="input-group mb-3">
                        <div class="input-group__prepend">
                          <USelectMenu
                            v-model="selected"
                            searchable
                            searchable-placeholder="Search for a metic..."
                            :search="search"
                            :options="metricDataList"
                            :loading="loadingInput"
                            :search-attributes="['title']"
                            placeholder="Search for a metic..."
                            trailing
                            option-attribute="title"
                            by="title"
                          />
                        </div>
                      </div>
                      <div class="w-100">
                        <button
                          class="btn btn-primary"
                          type="button"
                          @click="searchMetricResults"
                        >
                          <UIcon
                            name="i-heroicons-magnifying-glass"
                            class="w-5 h-5"
                          />
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
                      <div v-if="selectedMetricResults.length > 0" class="">
                        <div class="searching-metric__results__title">
                          We found some associated challengers with this metric
                        </div>
                        <div class="w-100">
                          <div
                            v-for="challenge in selectedMetricResults"
                            :key="challenge.id"
                            class=""
                          >
                            <div class="searching-metric__results__list">
                              <div class="">Name: {{ challenge.name }}</div>
                              <div class="">
                                <button type="button">View challenge</button>
                              </div>
                              <div
                                v-for="m in challenge.metrics_categories[0]
                                  .metrics"
                                :key="m.id"
                                class=""
                              >
                                <div
                                  v-if="m.metrics_id !== selected._id"
                                  class=""
                                >
                                  - Metric: {{ m.metrics_id }}
                                </div>
                              </div>
                            </div>
                            <CustomBorder />
                          </div>
                        </div>
                      </div>
                      <div v-else class="">
                        <div class="modal_section_title">
                          No metrics found. Please try again.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-else-if="isShowNewMetric"
                class="challenge-metric-modal-form__new"
              >
                <div class="w-100">
                  <div class="modal_section_title">Create a new metric</div>
                  <div class="w-100">
                    <div class="input-group mb-3">
                      <div class="w-100">
                        <UInput
                          v-model="metricOrigId"
                          placeholder="Metric Domanin ID Name"
                        />
                      </div>
                      <div class="input-group__prepend">
                        <UInput
                          v-model="metricTitle"
                          placeholder="Metric Title"
                        />
                      </div>
                      <div class="w-100">
                        <textarea
                          class="form-control"
                          placeholder="Metric Description"
                          rows="3"
                        ></textarea>
                      </div>
                      <div class="w-100">
                        <UInput
                          v-model="metricFormalDefinition"
                          placeholder="Metric Formal Definition"
                        />
                      </div>
                      <div class="w-100">
                        <UInput
                          v-model="metricSchema"
                          placeholder="Metric Schema"
                        />
                      </div>
                    </div>
                    <div class="w-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref } from "vue";
import CommunityMetric from "@/components/Dashboard/entries/events/challenges/ChallengeMetric.vue";
import CustomSubtitle from "@/components/Common/CustomSubtitle.vue";
import CustomBorder from "@/components/Common/CustomBorder.vue";
import CustomSearcherLoader from "@/components/Common/CustomSearcherLoader.vue";
import { useMetrics } from "@/stores/metrics.ts";
import type { Metric } from "@/types/challenge_metric";
import metricsSearcher from "@/utils/metricsMatch";

const props = defineProps<{
  metricData: [];
  isLoadingData: boolean;
}>();

const columnsMetricsSearcher = [
  {
    key: "challenge",
    label: "Name",
  },
  {
    key: "view",
    label: "View",
  },
  {
    key: "title",
    label: "Title",
  },
];

const { data } = useAuth();
const metricsStore = useMetrics();
const isSearchingMetrics = ref(false);
const isMetricOpen = ref(false);
const metricName = ref("");
const metricDataList = ref<Metric[] | never[]>([]);
const token: string = data?.value.accessToken;
const loading = ref(false);
const selected = ref(null);
const isShowSearch = ref(true);
const isSearchingSelectedMetric = ref(false);
const selectedMetricResults = ref([]);
const loadingInput = ref(false);
const showAdvancedSearch = ref(false);
const isShowNewMetric = ref(false);

const metrics_by_categories = computed(() => {
  return props.metricData.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {});
});

async function searchMetricResults() {
  isSearchingSelectedMetric.value = true;
  showAdvancedSearch.value = true;

  await metricsSearcher(selected.value._id, token).then((res) => {
    console.log(res);
    selectedMetricResults.value = res;
  });
  isSearchingSelectedMetric.value = false;
}

async function openMetricModal() {
  isMetricOpen.value = true;
  await fetchMetrics(token);
}

async function search(q: string) {
  loadingInput.value = true;

  if (q.length < 3) {
    loadingInput.value = false;
    return metricDataList.value;
  }

  const searchFilter = metricDataList.value.filter((metric) => {
    return metric.title.toLowerCase().includes(q.toLowerCase());
  });
  loadingInput.value = false;

  return searchFilter;
}

function onAddNewMetric() {
  isShowNewMetric.value = true;
  isShowSearch.value = false;
}

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
    return metricDataList.value as Metric[];
  } catch (error) {
    console.error("Error fetching contacts data:", error);
  }
}
</script>

<style scoped lang="scss">
.challenge-metrics-categories {
  padding-bottom: 25px;
  & > :first-child {
    margin-top: 20px;
  }
  &__category {
    margin-bottom: 25px;
    &__description {
      font-size: 15px;
      margin-bottom: 10px;
      text-transform: capitalize;
    }
    &__metrics {
      &__metric {
        margin-bottom: 10px;
      }
    }
    &__name {
      font-size: 15px;
      span {
        font-weight: bold;
      }
      &__title {
        font-size: 15px;
      }
      margin-bottom: 10px;
    }
  }
}
.input-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  .input-group__prepend {
    flex: 6;
  }
  .input-group-append {
    flex: 1;
    display: flex;
    justify-content: end;
  }
  button {
    padding: 0.2rem 1rem;
  }
}
.challenge-metric-modal {
  min-width: 600px;
  min-height: 300px;
  display: flex;
  align-items: center;
  &__form {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
}
</style>
<style>
.modal-challenge-wrapper {
  max-width: 700px;
  min-height: 350px;
}
</style>
