<template>
  <div class="dashboard-community-event-challenge-edit">
    <div class="w-100 container">
      <div v-if="isLoadingData" class="w-100">
        <div class="space-y-2">
          <USkeleton class="dashboard-community-edit__skeleton__small" />
          <USkeleton class="dashboard-community-edit__skeleton__big" />
        </div>
      </div>
      <div v-else class="dashboard-community-event-challenge-edit__content">
        <div class="w-100">
          <CustomTab
            :items="items"
            :selected="selectedTab"
            @change-selected="changeSelected"
          >
          </CustomTab>
          <div v-if="selectedTab == '0'">
            <UForm
              :schema="schema"
              :state="state"
              class="space-y-4"
              @submit="onSubmitChallenge"
            >
              <div class="w-100 form-card">
                <div class="form-card__row">
                  <div class="form-card__row__box">
                    <div class="row">
                      <div class="col-4 typeOptions">
                        <div class="form-group">
                          <label for="id">
                            Challenge ID
                            <span class="text-red-400 required">*</span>
                          </label>

                          <div class="w-100">
                            <input
                              id="id"
                              v-model="state._id"
                              type="text"
                              class="form-control custom-entry-input"
                              placeholder="Challenge id"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="col-4 typeOptions">
                        <div class="form-group">
                          <label for="id">
                            Event ID
                            <span class="text-red-400 required">*</span>
                          </label>
                          <div class="w-100">
                            <input
                              id="id"
                              v-model="eventId"
                              type="text"
                              class="form-control custom-entry-input"
                              placeholder="Event id"
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                      <div class="col-4 typeOptions">
                        <div class="form-group">
                          <label for="id">
                            Community ID
                            <span class="text-red-400 required">*</span>
                          </label>
                          <div class="w-100">
                            <input
                              id="id"
                              v-model="state.community_id"
                              type="text"
                              class="form-control custom-entry-input"
                              placeholder="Community id"
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                      <div class="col-4 typeOptions pt-3">
                        <div class="form-group">
                          <label for="orig_id"> Original ID </label>
                          <div class="w-100">
                            <input
                              id="orig_id"
                              v-model="state.orig_id"
                              type="text"
                              class="form-control custom-entry-input"
                              placeholder="Original ID"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-card__row">
                  <div class="form-card__row__box w-100">
                    <div class="row">
                      <div class="col-4">
                        <div class="form-group">
                          <label for="dates">
                            Challenge Start Date
                            <span class="text-red-400 required">*</span>
                          </label>
                          <VueDatePicker
                            v-model="localDates.dates.benchmark_start"
                            :format="dateFormat"
                            locale="en"
                          ></VueDatePicker>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="form-group">
                          <label for="dates">
                            Challenge End Date
                            <span class="text-red-400 required">*</span>
                          </label>
                          <VueDatePicker
                            v-model="localDates.dates.benchmark_stop"
                            :format="dateFormat"
                            locale="en"
                          >
                          </VueDatePicker>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="form-group">
                          <label for="dates">Is Automated Event</label>
                          <USelect
                            v-model="state.is_automated"
                            class="selector"
                            :options="automatedOptions"
                            option-attribute="label"
                            value-attribute="value"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-card__row">
                  <div class="form-card__row__box w-100">
                    <div class="row">
                      <div class="col-8">
                        <div class="form-group">
                          <label for="name">Name</label>
                          <input
                            id="name"
                            v-model="state.name"
                            type="text"
                            placeholder="Challenge name"
                            class="form-control custom-entry-input"
                          />
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="form-group">
                          <label for="acronym">Acronym</label>
                          <input
                            id="acronym"
                            v-model="state.acronym"
                            type="text"
                            placeholder="Challenge acronym"
                            class="form-control custom-entry-input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-card__row">
                  <div class="form-card__row__box w-100">
                    <div class="row">
                      <div class="col-12">
                        <div class="form-group">
                          <label for="_schema">Schema</label>
                          <input
                            id="_schema"
                            v-model="state._schema"
                            placeholder="https://www.elixir-europe.org/excelerate/WP2/json-schemas/1.0/Challenge"
                            type="text"
                            class="form-control custom-entry-input"
                          />
                        </div>
                      </div>
                      <div class="col-12 pt-3">
                        <div class="form-group">
                          <label for="description">Description</label>
                          <textarea
                            id="description"
                            v-model="state.description"
                            class="form-control"
                            rows="10"
                          >
                          </textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-card__row">
                  <div class="form-card__row__box w-100">
                    <div class="row">
                      <div class="col-6">
                        <div class="form-card__row__box">
                          <div class="form-group">
                            <div class="w-100">
                              <label for="contacts" class="form-group-row">
                                <span class="label-text"> References </span>
                                <button
                                  class="btn-form-add btn-primary"
                                  :disabled="
                                    !challengePrivileges.challenge.update ||
                                    isView ||
                                    checkEmptyReferences
                                  "
                                  @click="onAddElement(localReferences)"
                                >
                                  <font-awesome-icon :icon="['fas', 'plus']" />
                                </button>
                              </label>
                            </div>
                            <div class="w-100 row no-space">
                              <div
                                v-for="(reference, index) in localReferences"
                                v-if="localReferences.length > 0"
                                :key="index"
                                class="col-12 pt-0 pb-1"
                              >
                                <div class="input-wrapper">
                                  <input
                                    v-model="localReferences[index]"
                                    type="text"
                                    class="form-control"
                                    :disabled="
                                      !challengePrivileges.challenge.update
                                    "
                                  />
                                  <button
                                    v-if="
                                      challengePrivileges.challenge.update &&
                                      !isView
                                    "
                                    class="btn-delete-input"
                                  >
                                    <font-awesome-icon
                                      :icon="['far', 'trash-can']"
                                    />
                                  </button>
                                </div>
                              </div>
                              <div v-else class="col-12 pt-0">
                                <div
                                  class="w-100 empty-elements text-slate-400"
                                >
                                  <span
                                    >There are no reference associated with this
                                    event</span
                                  >
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="form-card__row__box">
                          <div class="form-group">
                            <div class="w-100">
                              <label for="contacts" class="form-group-row">
                                <span class="label-text"> Contacts </span>
                                <button
                                  class="btn-form-add btn-primary"
                                  :disabled="
                                    !challengePrivileges.challenge.update ||
                                    isView ||
                                    checkEmptyContacts
                                  "
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
                                class="col-12 pt-0 pb-1"
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
                                    v-if="
                                      challengePrivileges.challenge.update &&
                                      !isView
                                    "
                                    class="btn-delete-input"
                                    @click="
                                      onDeleteElement(index, localContacts)
                                    "
                                  >
                                    <font-awesome-icon
                                      :icon="['far', 'trash-can']"
                                    />
                                  </button>
                                </div>
                              </div>
                              <div v-else class="col-12 pt-0">
                                <div
                                  class="w-100 empty-elements text-slate-400"
                                >
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
                    </div>
                  </div>
                  <div class="row w-100">
                    <div v-if="oks" class="ok-response">
                      <div class="alert alert-success text-center">
                        {{ oks }}
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="errors.length > 0" class="row errors">
                  <div class="col-12">
                    <div class="alert alert-danger" v-html="getErrors"></div>
                  </div>
                </div>
                <div class="form-footer">
                  <UButton type="button" variant="secondary" @click="goBack">
                    Cancel
                  </UButton>
                  <UButton
                    v-if="challengePrivileges.update && !isView"
                    type="submit"
                    :disabled="!challengePrivileges.update || isView"
                  >
                    Submit
                  </UButton>
                </div>
              </div>
            </UForm>
          </div>
          <div v-else-if="selectedTab == '1'">
            <ChallengeMetrics
              :metric-data="metricData"
              :is-loading-data="isLoadingData"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import type { Challenge } from "@/types/challenge";
import { ChallengeDates } from "@/types/challenge";
import type { CommunityPrivilegeActions } from "@/constants/privileges";
import CustomDialog from "@/components/Common/CustomDialog.vue";
import "@vuepic/vue-datepicker/dist/main.css";
import {
  object,
  string,
  array,
  safeParse,
  boolean,
  optional,
  date,
} from "valibot";
import VueDatePicker from "@vuepic/vue-datepicker";
import type { FormSubmitEvent, FormErrorEvent } from "#ui/types";
import { getLocaleDateString } from "@/constants/global_const";
import CustomTab from "@/components/Common/CustomTab.vue";
import ChallengeMetrics from "@/components/Dashboard/entries/events/challenges/ChallengeMetrics.vue";

const router = useRouter();
const { data } = useAuth();
const userStore = useUser();
const token: string = data?.value.accessToken;

const props = defineProps<{
  id: string;
  communityId: string;
  eventId: string;
  isLoadingData: boolean;
  isView: boolean;
  challengePrivileges: CommunityPrivilegeActions;
  challengeObj: Challenge;
}>();

const dialogTitle = ref("");
const dialogType = ref("yesno");
const isDialogOpened = ref(false);
const dialogText = ref("");
const localReferences = ref<string[]>([]);
const localContacts = ref<string[]>([]);
const localMetricsCategories = ref<string[]>([]);
const eventId = ref(props.eventId);
const communityId = ref(props.communityId);
const contactsData = ref<string[]>([]);
const errors = ref<string[]>([]);
const oks = ref<string>("");
const selectedTab = ref("0");
const localDates = ref({
  dates: {
    benchmark_start: new Date(),
    benchmark_stop: new Date(),
    creation: new Date(),
    modification: new Date(),
  },
});

const metricData = ref<string[]>([]);

const state = ref({
  _id: "",
  community_id: "",
  name: "",
  acronym: "",
  _schema: "",
  benchmarking_event_id: "",
  challenge_contact_ids: [],
  dates: {
    benchmark_start: "",
    benchmark_stop: "",
  },
  is_automated: false,
  url: "",
  orig_id: "",
  references: [],
  metrics_categories: [],
});

const items = [
  {
    key: "challenge",
    label: "Challenge",
    icon: "i-heroicons-calendar-date-range-16-solid",
    index: 0,
  },
  {
    key: "metrics",
    label: "Metrics Data",
    icon: "i-heroicons-document-chart-bar",
    index: 1,
  },
];

const schema = object({
  _id: string(),
  community_id: string(),
  name: string(),
  acronym: string(),
  is_automated: boolean(),
  dates: object({
    benchmark_start: date(),
    benchmark_stop: date(),
  }),
  _schema: string(),
  url: string(),
  orig_id: string(),
  is_automated: boolean(),
});

const lang = window.navigator.userLanguage || window.navigator.language;
const dateFormat = computed(() => getLocaleDateString(lang));
const automatedOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];
const elementToDelete = ref({
  index: null as number | null,
  element: [] as string[],
});

const challengeData = computed(() => {
  state.value = {
    _id: props.challengeObj?._id || "",
    community_id: props.communityId || "",
    name: props.challengeObj?.name || "",
    acronym: props.challengeObj?.acronym || "",
    _schema: props.challengeObj?._schema || "",
    benchmarking_event_id: props.challengeObj?.benchmarking_event_id || "",
    challenge_contact_ids: props.challengeObj?.challenge_contact_ids || [],
    dates: {
      benchmark_start:
        new Date(props.challengeObj?.dates.benchmark_start) || new Date(),
      benchmark_stop:
        new Date(props.challengeObj?.dates.benchmark_stop) || new Date(),
    },
    url: props.challengeObj?.url || "",
    orig_id: props.challengeObj?.orig_id || "",
    references: props.challengeObj?.references || [],
    metrics_categories: props.challengeObj?.metrics_categories || [],
    is_automated: props.eventObj?.is_automated || false,
  };

  return state;
});
challengeData.value;

if (props.challengeObj && props.challengeObj.references) {
  localReferences.value = props.challengeObj.references;
}

if (props.challengeObj && props.challengeObj.metrics_categories) {
  localMetricsCategories.value = props.challengeObj.metrics_categories;
}

if (props.challengeObj && props.challengeObj.challenge_contact_ids) {
  localContacts.value =
    props.challengeObj.challenge_contact_ids.map((contact: string) => {
      return contact;
    }) || [];
}

if (props.challengeObj && props.challengeObj.dates) {
  localDates.value.dates = {
    benchmark_start: new Date(props.challengeObj.dates.benchmark_start),
    benchmark_stop: new Date(props.challengeObj.dates.benchmark_stop),
    creation: new Date(props.challengeObj.dates.creation),
    modification: new Date(props.challengeObj.dates.modification),
  };
}

function onAddElement(array: []) {
  array.push("");
}

const checkEmptyContacts = computed(() => {
  return localContacts.value.some((contact: string) => contact === "");
});

const checkEmptyReferences = computed(() => {
  return localReferences.value.some((keyword: string) => keyword === "");
});

const checkEmptyMetricsCategories = computed(() => {
  return localMetricsCategories.value.some(
    (category: string) => category === "",
  );
});

const fetchContacts = async (token: string): Promise<void> => {
  try {
    if (userStore.getContactsList && userStore.getContactsList.length > 0) {
      contactsData.value = userStore.getContactsList;
    } else {
      contactsData.value = await userStore.fetchContacts(token);
    }
  } catch (error) {
    console.error("Error fetching contacts data:", error);
  }
};

function changeSelected(index: string) {
  console.log("index", index);
  selectedTab.value = index;
}

function goBack() {
  router.push(
    `/dashboard/communities/${props.communityId}/events/${props.eventId}/challenges`,
  );
}

watch(
  () => props.challengeObj,
  (newVal) => {
    if (newVal && newVal.references) {
      localReferences.value = newVal.references;
    }
    if (newVal && newVal.challenge_contact_ids) {
      localContacts.value =
        newVal.challenge_contact_ids.map((contact: string) => {
          return contact;
        }) || [];
    }
    if (newVal && newVal.metrics_categories) {
      localMetricsCategories.value = newVal.metrics_categories;
    }
    if (newVal && newVal.dates) {
      localDates.value.dates = {
        benchmark_start: new Date(newVal.dates.benchmark_start),
        benchmark_stop: new Date(newVal.dates.benchmark_stop),
        creation: new Date(newVal.dates.creation),
        modification: new Date(newVal.dates.modification),
      };
    }

    if (newVal && newVal.metrics_categories) {
      metricData.value = newVal.metrics_categories;
    }
  },
  { immediate: true },
);
onMounted(() => {
  fetchContacts(token);
});
</script>

<style scoped lang="scss">
.dashboard-community-event-challenge-edit {
  &__title {
    padding-bottom: 20px;
    padding-top: 20px;
    h2 {
      border-color: rgb(226, 232, 240, 1);
      border-bottom-width: 1px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 5px;
      span {
        padding-bottom: 5px;
      }
      a {
        padding: 5px 10px;
        font-size: 14px;
        text-decoration: none;
        margin-bottom: 5px;
      }
    }
  }
  &__skeleton {
    &__small {
      width: 100%;
      height: 50px;
    }
    &__big {
      width: 100%;
      height: 250px;
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
  &__content {
    a {
      color: theme("colors.primary.500");
      text-decoration: none;
    }
    .form-group {
      padding-bottom: 20px;
      .row {
        padding: 0 25px;
        .col-6,
        .col-3 {
          padding: 5px;
        }
      }
    }
    .input-wrapper {
      padding-bottom: 10px;
      display: flex;
      gap: 10px;
      justify-content: start;
      align-items: baseline;
    }
  }
  .form-footer {
    display: flex;
    justify-content: end;
    gap: 10px;
  }
  .form-group-row {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    .label-text {
      border-bottom: 1px solid #e9ecef;
      width: 90%;
    }
    .btn-form-add.btn-primary {
      padding: 1px 6px;
      height: 28px;
    }
  }
  .form-card {
    padding: 10px 15px;
    border-radius: 5px;
    background-color: rgba(233, 236, 239, 0.2);
    box-shadow:
      rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
      rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
    &__row {
      padding: 10px 15px;
      display: grid;
      grid-template-columns: auto auto;
      column-gap: 10px;
      row-gap: 20px;
      &:last-child {
        width: 100%;
      }
      .no-space {
        padding: 0;
      }
      &__box {
        padding: 10px 20px;
        border: 1px solid rgba(233, 236, 239);
        background-color: white;
        border-radius: 7px;
        &:last-child {
          width: 100%;
          grid-column: span 2;
        }
      }
    }
  }
  .custom-entry-input::placeholder {
    opacity: 0.5;
    color: rgba(0, 0, 0, 0.3);
  }
}
</style>
