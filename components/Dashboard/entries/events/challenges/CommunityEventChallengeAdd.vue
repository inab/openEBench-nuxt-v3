<template>
  <div class="dashboard-community-event-challenge-add">
    <div class="w-100 container">
      <div v-if="isLoadingData" class="w-100">
        <div class="space-y-2">
          <USkeleton class="dashboard-community-edit__skeleton__small" />
          <USkeleton class="dashboard-community-edit__skeleton__big" />
        </div>
      </div>
      <div v-else class="dashboard-community-event-challenge-edit__content">
        <div class="w-100">
          <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmitChallenge"
            @error="onError"
          >
            <div class="w-100 form-card">
              <div class="form-card__row">
                <div class="form-card__row__box w-100">
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
                            placeholder="OEBX0010000001"
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
                            v-model="communityId"
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
                          v-model="state.dates.challenge_start"
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
                          v-model="state.dates.challenge_stop"
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
                              <div class="w-100 empty-elements text-slate-400">
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
                                  @click="onDeleteElement(index, localContacts)"
                                >
                                  <font-awesome-icon
                                    :icon="['far', 'trash-can']"
                                  />
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
              <div v-if="errors.length > 0" class="form-card__row">
                <div class="col-12">
                  <div class="alert alert-danger" v-html="getErrors"></div>
                </div>
              </div>
              <div class="form-card__row">
                <div class="col-12">
                  <div class="form-footer">
                    <UButton type="button" variant="secondary" @click="goBack">
                      Cancel
                    </UButton>
                    <UButton
                      v-if="challengePrivileges.challenge.create"
                      type="submit"
                      :disabled="!challengePrivileges.challenge.create"
                    >
                      Submit
                    </UButton>
                  </div>
                </div>
              </div>
            </div>
          </UForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import type { Challenge } from "@/types/challenge";
import { useUser } from "@/stores/user.ts";
import { ChallengeDates } from "@/types/challenge";
import type { CommunityPrivilegeActions } from "@/constants/privileges";
import CustomDialog from "@/components/Common/CustomDialog.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import {
  object,
  string,
  array,
  safeParse,
  boolean,
  optional,
  date,
  description,
} from "valibot";
import type { FormSubmitEvent, FormErrorEvent } from "#ui/types";
import { getLocaleDateString } from "@/constants/global_const";

const router = useRouter();
const { data } = useAuth();
const userStore = useUser();

const props = defineProps<{
  communityId: string;
  eventId: string;
  isView: boolean;
  challengePrivileges: CommunityPrivilegeActions;
}>();

const token: string = data?.value.accessToken;
const dialogTitle = ref("");
const dialogType = ref("yesno");
const isDialogOpened = ref(false);
const dialogText = ref("");
const eventId = computed(() => props.eventId);
const communityId = computed(() => props.communityId);
const contactsData = ref<string[]>([]);
const localContacts = ref<string[]>([]);
const localReferences = ref<string[]>([]);
const localMetricsCategories = ref<string[]>([]);
const errors = ref<string[]>([]);
const oks = ref<string>("");

const state = ref({
  _id: "",
  benchmarking_event_id: eventId.value,
  name: "",
  acronym: "",
  is_automated: false,
  orig_id: "",
  dates: {
    challenge_start: "",
    challenge_stop: "",
  },
  _schema:
    "https://www.elixir-europe.org/excelerate/WP2/json-schemas/1.0/BenchmarkingEvent",
  challenge_contact_ids: [],
  url: "",
  references: [],
  description: "",
});

const schema = object({
  _id: string(),
  benchmarking_event_id: string(),
  name: string(),
  acronym: string(),
  is_automated: boolean(),
  dates: object({
    challenge_start: date(),
    challenge_stop: date(),
  }),
  orig_id: string(),
  _schema: string(),
  benchmarking_event_id: string(),
  challenge_contact_ids: array(string()),
  url: string(),
  references: array(string()),
  description: string(),
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

if (props.challengeObj && props.challengeObj.references) {
  localReferences.value = props.challengeObj.references;
}

if (props.challengeObj && props.challengeObj.metrics_categories) {
  localMetricsCategories.value = props.challengeObj.metrics_categories;
}

if (props.challengeObj && props.challengeObj.challenge_contact_ids) {
  localContacts.value =
    props.challengeObj.challenge_contact_ids.map((contact: string) => {
      return contact.replace(/\./g, " ");
    }) || [];
}

state.value.dates.challenge_start = new Date();
state.value.dates.challenge_stop = new Date(state.value.dates.challenge_start);
state.value.dates.challenge_stop = state.value.dates.challenge_stop.setMonth(
  state.value.dates.challenge_stop.getMonth() + 1,
);

const challengeStart = new Date();
const challengeStop = new Date(challengeStart);
challengeStop.setMonth(challengeStop.getMonth() + 1);

state.value.dates.challenge_start = challengeStart;
state.value.dates.challenge_stop = challengeStop;

function onAddElement(array: []) {
  array.push("");
}

const checkEmptyContacts = computed(() => {
  return localContacts.value.some((contact: string) => contact === "");
});

const checkEmptyReferences = computed(() => {
  return localReferences.value.some((keyword: string) => keyword === "");
});

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

function restartElementToDelete() {
  elementToDelete.value = {
    index: null,
    element: [],
  };
}

async function onSubmitChallenge(event: FormSubmitEvent<Schema>) {
  const result = safeParse(schema, state.value);
  if (result.success) {
    const customErrors = validateRequiredFields(state.value);
    if (customErrors.length > 0) {
      errors.value = errorClean(customErrors);
    } else {
      errors.value = [];
      await createChallenge();
    }
  } else {
    errors.value = result.error.issues.map((issue) => issue.message);
  }
}

const getErrors = computed(() => errors.value.join(", "));

function validateRequiredFields(data: any): string[] {
  const requiredFields = [
    "_id",
    "_schema",
    "name",
    "benchmarking_event_id",
    "is_automated",
    "dates",
    "challenge_contact_ids",
  ];
  const errorMessages: string[] = [];

  requiredFields.forEach((field) => {
    if (typeof data[field] === "string" && data[field].trim() === "") {
      errorMessages.push(`${field} cannot be empty`);
    }
  });

  if (data["_id"] && !checkIdPattern(data["_id"])) {
    const communityText = communityId.value.slice(0, 3); // Gets the first part
    const communityIdNumber = communityId.value.slice(4);
    errorMessages.push(
      `_id is not in the correct format. Example: <b><i>${communityText}X${communityIdNumber}000000A</i></b>`,
    );
  }

  if (localContacts.value.length == 0) {
    errorMessages.push(`challenge_contact_ids cannot be empty`);
  } else {
    localContacts.value.forEach((contact: string, index: number) => {
      if (contact.trim() === "") {
        errorMessages.push(`challenge_contact_ids  cannot be empty`);
      }
    });
  }

  if (!state.value.dates.challenge_start) {
    errorMessages.push("challenge_start date is required");
  }
  if (!state.value.dates.challenge_stop) {
    errorMessages.push("challenge_end date is required");
  }

  return errorMessages;
}

async function createChallenge() {
  const cleanContacts = deleteEmptyElements(localContacts.value);
  const cleanReferences = deleteEmptyElements(localReferences.value);

  const body = {
    _id: state.value._id,
    name: state.value.name,
    acronym: state.value.acronym,
    benchmarking_event_id: state.value.benchmarking_event_id,
    challenge_contact_ids: cleanContacts.map((element) => {
      return element;
    }),
    description: state.value.description,
    orig_id: state.value._id,
    _schema: state.value._schema,
    references: cleanReferences.map((element) => {
      return element;
    }),
    is_automated: state.value.is_automated,
    dates: {
      challenge_start: convertToUTCFullDate(state.value.dates.challenge_start),
      challenge_stop: convertToUTCFullDate(state.value.dates.challenge_stop),
    },
  };

  try {
    const response = await fetch(`/api/staged/Challenge`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Error in API response");
    }

    const responseData = await response.json();
    if (responseData.status == 200) {
      errors.value = [];
      router.push(
        `/dashboard/entries/${communityId.value}/events/${eventId.value}?challenges=true`,
      );
    } else {
      let errorResponse = JSON.parse(responseData.body);
      errorResponse = errorResponse.error || [];
      if (errorResponse.error) {
        errors.value = errorResponse.error.map((error: any) => {
          if (error) {
            return `${error}`;
          }
          return error.message;
        });
      } else if (errorResponse.message) {
        errors.value = [errorResponse.message];
      } else {
        errors.value = [errorResponse];
      }
    }
  } catch (error) {
    console.error("Error adding challenge data:", error);
  }
}

function convertToUTCFullDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString();
}

function deleteEmptyElements(array: string[]): string[] {
  return array.filter((element) => element.trim() !== "");
}

function checkIdPattern(id: string) {
  const text = communityId.value.slice(0, 3); // Gets the first part
  const IDNumber = communityId.value.slice(4);
  const pattern = new RegExp(`^${text}X${IDNumber}[A-Z0-9]{7}$`);
  return pattern.test(id);
}

function errorClean(errors: string[]): string[] {
  const cleanedErrors = errors.map((element: string) =>
    elementTranslator(element.trim()),
  );
  return cleanedErrors;
}

async function onError(event: FormErrorEvent) {
  // TODO check error
}

function elementTranslator(element: string) {
  // Define a mapping of field names to their replacements
  const fieldMap: { [key: string]: string } = {
    challenge_contact_ids: "Contacts",
    _id: "ID",
    _schema: "Schema",
    name: "Name",
    dates: "Dates",
    benchmark_end: "Challenge End",
    benchmark_start: "Challenge Start",
  };

  // Replace the field name in the error message if it exists in the fieldMap
  for (const [field, replacement] of Object.entries(fieldMap)) {
    const regex = new RegExp(`\\b${field}\\b`, "g");
    element = element.replace(regex, `<b>${replacement}</b>`);
  }

  return element;
}

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

const checkEmptyMetricsCategories = computed(() => {
  return localMetricsCategories.value.some(
    (category: string) => category === "",
  );
});

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
          return contact.replace(/\./g, " ");
        }) || [];
    }
    if (newVal && newVal.metrics_categories) {
      localMetricsCategories.value = newVal.metrics_categories;
    }

    if (newVal && newVal._id) {
      state.value._id = newVal._id;
    }
  },
  { immediate: true },
);

onMounted(() => {
  fetchContacts(token);
});
</script>

<style scoped lang="scss">
.dashboard-community-event-challenge-add {
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
        .content-box {
          border: 1px solid rgba(233, 236, 239);
        }
      }
    }
    &__box {
      padding: 10px 20px;
      border: 1px solid rgba(233, 236, 239);
      background-color: white;
      &:last-child {
        width: 100%;
        grid-column: span 2;
      }
    }
  }
  .custom-entry-input::placeholder {
    opacity: 0.5;
    color: rgba(0, 0, 0, 0.3);
  }
  .errors {
    padding: 10px 15px;
    .alert {
      padding: 10px;
    }
  }
}
</style>
