<template>
  <div class="w-100">
    <div class="challenge-metric-modal text-neutral-500">
      <div class="challenge-metric-modal__form">
        <div class="col-12 justify-content-between">
          <div class="modal_section_title text-primaryOeb-500 pt-4">
            Create a new metric that will be added to this challengec
          </div>
        </div>
        <div class="col-12 challenge-metric-modal-form__new">
          <div class="w-100 pt-2">
            <div class="w-100 row">
              <div class="col-4 pt-2">
                <div class="form-group">
                  <label for="orig_id">Metric ID</label>
                  <div class="w-100">
                    <input
                      id="metricFormalDefinition"
                      v-model="metricOrigId"
                      type="text"
                      class="form-control custom-entry-input"
                      placeholder="Metric ID"
                    />
                  </div>
                </div>
              </div>
              <div class="col-8 pt-2">
                <div class="form-group">
                  <label for="orig_id"> Metric Title</label>
                  <div class="w-100">
                    <input
                      id="metricFormalDefinition"
                      v-model="metricTitle"
                      type="text"
                      class="form-control custom-entry-input"
                      placeholder="Metric Title"
                    />
                  </div>
                </div>
              </div>
              <div class="col-6 pt-2">
                <div class="form-group">
                  <label for="orig_id"> Metric Formal Definition</label>
                  <div class="w-100">
                    <input
                      id="metricFormalDefinition"
                      v-model="metricFormalDefinition"
                      type="text"
                      class="form-control custom-entry-input"
                      placeholder="Metric Formal Definition"
                    />
                  </div>
                </div>
              </div>
              
              <div class="col-6 pt-2">
                <div class="form-group">
                  <label for="orig_id"> Metric Schema</label>
                  <div class="w-100">
                    <input
                      id="metricSchema"
                      v-model="metricSchema"
                      type="text"
                      class="form-control custom-entry-input"
                      placeholder="Metric Schema"
                    />
                  </div>
                </div>
              </div>
              <div class="col-12 pt-3">
                <div class="form-card__row__box">
                  <div class="form-group">
                    <div class="w-100">
                      <label for="contacts" class="form-group-row">
                        <span class="label-text"> Contacts </span>
                        <button
                          class="btn-form-add btn-primary"
                          @click="onAddElement(localContacts)"
                        >
                          <font-awesome-icon :icon="['fas', 'plus']" />
                        </button>
                      </label>
                    </div>
                    <div class="w-100 row no-space">
                      <div
                        v-for="(contact, index) in localContacts"
                        v-if="localContacts.length > 0"
                        :key="index"
                        class="col-4 pt-0 pb-1"
                      >
                        <div class="input-wrapper big d-flex">
                          <USelectMenu
                            :ref="`contact_${index}`"
                            v-model="localContacts[index]"
                            class="w-full lg:w-100"
                            searchable
                            selected-icon="i-heroicons-check-16-solid"
                            placeholder="Select a contact"
                            :options="contactsData"
                            value-attribute="id"
                            option-attribute="name"
                          >
                          </USelectMenu>
                          <button
                            class="btn-delete-input"
                            type="button"
                            @click="onDeleteElement(index, localContacts)"
                          >
                            <font-awesome-icon :icon="['far', 'trash-can']" />
                          </button>
                        </div>
                      </div>
                      <div v-else class="col-12 pt-0">
                        <div class="w-100 empty-elements text-slate-400">
                          <span
                            >There are no contacts associated with this
                            event</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 pt-2">
                <div class="form-group">
                  <label for="orig_id"> Metric Description</label>
                  <textarea
                    class="form-control"
                    placeholder="Metric Description"
                    rows="3"
                  ></textarea>
                </div>
              </div>
              <div class="w-100"></div>
            </div>
            <div class="w-100 row footer-row">
              <div class="form-footer">
                <UButton type="button" variant="secondary" @click="goBack">
                  Cancel
                </UButton>
                <UButton type="submit"> Submit </UButton>
              </div>
            </div>
          </div>
        </div>
        <CustomBorder />
        <div class="col-12">
          <div class="w-100">
            <div class="modal_section_title text-primaryOeb-500">
              Or search for an existing metric
            </div>
            <div class="row flex justify-between">
              <div class="col-7">
                <USelectMenu
                  v-model="selectedMetric"
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
              <div class="col-5">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import CustomBorder from "@/components/Common/CustomBorder.vue";
import type { Metric } from "@/types/challenge_metric";
import { useMetrics } from "@/stores/metrics.ts";
import metricsSearcher from "@/utils/metricsMatch";
import AddMetricTable from "@/components/Dashboard/entries/events/challenges/metrics/AddMetricTable.vue";

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
const selectedMetricResults = ref<boolean[]>([]);
const token: string = data?.value.accessToken;
const processedMetrics = ref(new Set());
const selectedMetric = ref(null);
const localContacts = ref<string[]>([]);
const dialogElement = ref<{ element: string[]; index: number } | null>(null);
const metricAssociatedList = ref<{
  [key: string]: { count: number; challenges: any[] };
}>({});

interface BasicChallenge {
  challenge_id: string;
  name: string;
}

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
  console.log(selectedMetricResults.value);
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
</style>
