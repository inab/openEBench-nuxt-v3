<template>
  <div class="dashboard-community-event-edit">
    <div class="w-100 container">
      <div v-if="isLoadingData" class="">
        <div class="space-y-2">
          <USkeleton class="dashboard-community-edit__skeleton__small" />
          <USkeleton class="dashboard-community-edit__skeleton__big" />
        </div>
      </div>
      <div v-else class="dashboard-community-event-edit__content">
        <div class="w-100 tab-wrapper">
          <CustomTab
            :items="items"
            :selected="selectedTab"
            @change-selected="changeSelected"
          >
          </CustomTab>
          <CustomTabBody>
            <div v-if="selectedTab == '0'">
              <UForm
                :schema="schema"
                :state="state"
                class="space-y-4"
                @submit="onSubmitCommunityEvent"
              >
                <div class="w-100 form-card">
                  <div class="form-card__row">
                    <div class="form-card__row__box w-100">
                      <div class="row">
                        <div class="col-4 typeOptions">
                          <div class="form-group">
                            <label for="id">
                              ID
                              <span class="text-red-400 required">*</span>
                            </label>
                            <div class="w-100">
                              <input
                                id="id"
                                v-model="eventData._id"
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
                                v-model="eventData.community_id"
                                type="text"
                                class="form-control custom-entry-input"
                                placeholder="Community id"
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-4">
                          <div class="form-group">
                            <label for="dates">
                              Event Start Date
                              <span class="text-red-400 required">*</span>
                            </label>
                            <VueDatePicker
                              v-model="localDates.dates.benchmark_start"
                            ></VueDatePicker>
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="form-group">
                            <label for="dates">
                              Event End Date
                              <span class="text-red-400 required">*</span>
                            </label>
                            <VueDatePicker
                              v-model="localDates.dates.benchmark_stop"
                            ></VueDatePicker>
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="form-group">
                            <label for="dates">Is Automated Event</label>
                            <USelect
                              v-model="localAutomated"
                              class="selector"
                              :options="automatedOptions"
                              option-attribute="label"
                              value-attribute="value"
                            />
                          </div>
                        </div>
                        <div class="col-8">
                          <div class="form-group">
                            <label for="name">
                              Name
                              <span class="text-red-400 required">*</span>
                            </label>
                            <input
                              id="name"
                              v-model="state.name"
                              type="text"
                              class="form-control custom-entry-input"
                              placeholder="Event name"
                              :disabled="!eventPrivileges.update"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-card__row">
                    <div class="form-card__row__box w-100">
                      <div class="row">
                        <div class="col-6">
                          <div class="form-group">
                            <label for="url">
                              URL
                              <span v-if="state.url && state.url.length > 0">
                                <a :href="state.url" target="_blank">
                                  <font-awesome-icon :icon="['fas', 'link']" />
                                  Open</a
                                >
                              </span>
                            </label>
                            <input
                              id="url"
                              v-model="state.url"
                              type="text"
                              class="form-control custom-entry-input"
                              placeholder="URL"
                              :disabled="!eventPrivileges.update"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-card__row">
                    <div class="w-100">
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
                                      !eventPrivileges.update ||
                                      isView ||
                                      checkEmptyReferences
                                    "
                                    @click="onAddElement(localReferences)"
                                  >
                                    <font-awesome-icon
                                      :icon="['fas', 'plus']"
                                    />
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
                                        !eventPrivileges.update || isView
                                      "
                                    />
                                    <button
                                      v-if="
                                        eventPrivileges.update && !isView
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
                                      >There are no reference associated with
                                      this event</span
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
                                      !eventPrivileges.update ||
                                      isView ||
                                      checkEmptyContacts
                                    "
                                    @click="onAddElement(localContacts)"
                                  >
                                    <font-awesome-icon
                                      :icon="['fas', 'plus']"
                                    />
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
                                      class="btn-delete-input"
                                      type="button"
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
                                      >There are no contacts associated with
                                      this event</span
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
                    <UButton type="button" @click="goBack"> Cancel </UButton>
                    <UButton
                      v-if="eventPrivileges.update && !isView"
                      type="submit"
                      :disabled="!eventPrivileges.update || isView"
                    >
                      Submit
                    </UButton>
                  </div>
                </div>
              </UForm>
            </div>
            <div v-else-if="selectedTab == '1'">
              <div>
                <EventChallengesList
                  :challenges="challenges"
                  :is-loading-challenges="isLoadinChallenges"
                  :commmunity-privileges="eventPrivileges"
                  :event-id="id"
                  :community-id="communityId"
                />
              </div>
            </div>
          </CustomTabBody>
        </div>
      </div>
    </div>
    <CustomDialog :is-dialog-open="isDialogOpened" @modal-close="dialogShow">
      <template #header>
        {{ dialogTitle }}
      </template>
      <template #content>
        {{ dialogText }}
      </template>
      <template #footer>
        <template v-if="dialogType && dialogType === 'yesno'">
          <button
            type="button"
            class="btn-primary"
            @click="isDialogOpened = false"
          >
            No
          </button>
          <button
            type="button"
            class="btn-primary"
            @click="isDialogOpened = false"
          >
            Yes
          </button>
        </template>
        <template v-else>
          <button
            type="button"
            class="btn-primary"
            @click="isDialogOpened = false"
          >
            Cancel
          </button>
        </template>
      </template>
    </CustomDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { useUser } from "@/stores/user.ts";
import type { Event } from "@/types/events";
import type { Challenge } from "@/types/challenge";
import type { CommunityPrivilegeActions } from "@/constants/privileges";
import EventChallengesList from "@/components/Dashboard/entries/events/EventChallengesList.vue";
import CustomDialog from "@/components/Common/CustomDialog.vue";
import CustomTab from "@/components/Common/CustomTab.vue";
import CustomTabBody from "@/components/Common/CustomTabBody.vue";
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
} from "valibot";
import type { FormSubmitEvent, FormErrorEvent } from "#ui/types";

const router = useRouter();
const { data } = useAuth();
const token: string = data?.value.accessToken;
const userStore = useUser();

const props = defineProps<{
  id: string;
  communityId: string;
  eventObj: Event | null;
  isLoadingData: boolean;
  isView: boolean;
  eventPrivileges: CommunityPrivilegeActions;
  challenges: Array<Challenge>;
  isLoadinChallenges: boolean;
  tabIndex: string;
}>();

console.log("eventPrivileges: " , props.eventPrivileges)

const dialogTitle = ref("");
const dialogType = ref("yesno");
const isDialogOpened = ref(false);
const dialogText = ref("");
const selectedTab = ref(props.tabIndex);
const items = [
  {
    key: "summary",
    label: "Event Data",
    icon: "i-heroicons-document-chart-bar",
    index: 0,
  },
  {
    key: "challenges",
    label: "Challenges",
    icon: "i-heroicons-calendar-date-range-16-solid",
    index: 1,
  },
];

const state = ref({
  _id: "",
  name: "",
  community_id: "",
  bench_contact_ids: "",
  dates: {
    benchmark_start: "",
    benchmark_stop: "",
    creation: "",
    modification: "",
  },
  orig_id: "",
  _schema: "",
  references: [],
  is_automated: false,
  url: "",
});

const schema = object({
  _id: string(),
  name: string(),
  community_id: string(),
  bench_contact_ids: array(
    object({
      id: string(),
      name: string(),
    }),
  ),
  dates: object({
    benchmark_start: date(),
    benchmark_stop: date(),
    creation: date(),
    modification: date(),
  }),
  references: optional(array(string())),
  _schema: string(),
  url: optional(string()),
  is_automated: boolean(),
});

const automatedOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];
const errors = ref<string[]>([]);
const oks = ref<string>("");
const contactsData = ref<string[]>([]);
const localReferences = ref<string[]>([]);
const localContacts = ref<string[]>([]);
const localAutomated = ref<boolean>(false);
const localDates = ref({
  dates: {
    benchmark_start: new Date(),
    benchmark_stop: new Date(),
    creation: new Date(),
    modification: new Date(),
  },
});

const eventData = computed(() => {
  state.value = {
    _id: String(props.eventObj?._id || ""),
    name: props.eventObj?.name || "",
    community_id: props.eventObj?.community_id || "",
    bench_contact_ids:
      props.eventObj?.bench_contact_ids.map((contact: string) => {
        return {
          id: contact,
          name: contact,
        };
      }) || [],
    dates: {
      benchmark_start:
        new Date(props.eventObj?.dates.benchmark_start) || new Date(),
      benchmark_stop:
        new Date(props.eventObj?.dates.benchmark_stop) || new Date(),
      creation: new Date(props.eventObj?.dates.creation) || new Date(),
      modification: new Date(props.eventObj?.dates.modification) || new Date(),
    },
    orig_id: props.eventObj?.orig_id || "",
    _schema: props.eventObj?._schema || "",
    references: props.eventObj?.references || array<string>(),
    is_automated: props.eventObj?.is_automated || false,
    url: props.eventObj?.url || "",
  };
  return props.eventObj;
});

if (props.eventObj && props.eventObj.references) {
  localReferences.value =
    props.eventObj.references.map((reference: string) => {
      return reference;
    }) || [];
}

if (props.eventObj && props.eventObj.bench_contact_ids) {
  localContacts.value =
    props.eventObj.bench_contact_ids.map((contact: string) => {
      return contact;
    }) || [];
}

if (props.eventObj && props.eventObj.is_automated) {
  localAutomated.value = Boolean(props.eventObj.is_automated);
}

if (props.eventObj && props.eventObj.dates) {
  localDates.value.dates = {
    benchmark_start: new Date(props.eventObj.dates.benchmark_start),
    benchmark_stop: new Date(props.eventObj.dates.benchmark_stop),
    creation: new Date(props.eventObj.dates.creation),
    modification: new Date(props.eventObj.dates.modification),
  };
}

if (props.tabIndex) {
  selectedTab.value = props.tabIndex;
}

function onAddElement(array: string[]) {
  array.push("");
}

const elementToDelete = ref<{ index: number; element: string[] } | null>(null);

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

function restartElementToDelete() {
  elementToDelete.value = {
    index: null,
    element: [],
  };
}

function deleteElement() {
  if (elementToDelete.value.index !== null) {
    elementToDelete.value.element.splice(elementToDelete.value.index, 1);
    isDialogOpened.value = false;
  }
}

function changeSelected(index: string) {
  selectedTab.value = index;
}

function dialogShow() {
  console.log("dialogShow!!!!");
}

const getErrors = computed(() => errors.value.join(", "));

async function onSubmitCommunityEvent(event: FormSubmitEvent<Schema>) {
  const result = safeParse(schema, state.value);
  if (result.success) {
    const customErrors = validateRequiredFields(state.value);
    if (customErrors.length > 0) {
      errors.value = errorClean(customErrors);
    } else {
      errors.value = [];
      await updateBenchmarkingEvent();
    }
  } else {
    errors.value = result.error.issues.map((issue) => issue.message);
  }
}

async function updateBenchmarkingEvent() {
  const cleanContacts = deleteEmptyElements(localContacts.value);
  const cleanReferences = deleteEmptyElements(localReferences.value);

  const body = {
    _id: state.value._id,
    name: state.value.name,
    community_id: state.value.community_id,
    bench_contact_ids: cleanContacts.map((element) => {
      return element;
    }),
    _schema: state.value._schema,
    references: cleanReferences.map((element) => {
      return element;
    }),
    url: state.value.url,
    is_automated: localAutomated.value,
    dates: {
      benchmark_start: new Date(
        Date.UTC(
          localDates.value.dates.benchmark_start.getUTCFullYear(),
          localDates.value.dates.benchmark_start.getUTCMonth(),
          localDates.value.dates.benchmark_start.getUTCDate(),
          localDates.value.dates.benchmark_start.getUTCHours(),
          localDates.value.dates.benchmark_start.getUTCMinutes(),
          localDates.value.dates.benchmark_start.getUTCSeconds(),
        ),
      ).toISOString(),
      benchmark_stop: new Date(
        Date.UTC(
          localDates.value.dates.benchmark_stop.getUTCFullYear(),
          localDates.value.dates.benchmark_stop.getUTCMonth(),
          localDates.value.dates.benchmark_stop.getUTCDate(),
          localDates.value.dates.benchmark_stop.getUTCHours(),
          localDates.value.dates.benchmark_stop.getUTCMinutes(),
          localDates.value.dates.benchmark_stop.getUTCSeconds(),
        ),
      ).toISOString(),
      creation: new Date(
        Date.UTC(
          localDates.value.dates.creation.getUTCFullYear(),
          localDates.value.dates.creation.getUTCMonth(),
          localDates.value.dates.creation.getUTCHours(),
          localDates.value.dates.creation.getUTCDate(),
          localDates.value.dates.creation.getUTCMinutes(),
          localDates.value.dates.creation.getUTCSeconds(),
        ),
      ).toISOString(),
      modification: new Date(
        Date.UTC(
          localDates.value.dates.modification.getUTCMonth(),
          localDates.value.dates.modification.getUTCFullYear(),
          localDates.value.dates.modification.getUTCDate(),
          localDates.value.dates.modification.getUTCHours(),
          localDates.value.dates.modification.getUTCMinutes(),
          localDates.value.dates.modification.getUTCSeconds(),
        ),
      ).toISOString(),
    },
  };

  try {
    const response = await fetch(
      `/api/staged/BenchmarkingEvent/${state.value._id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      throw new Error("Error in API response");
    }

    const responseData = await response.json();
    if (responseData.status == 200) {
      errors.value = [];
      router.push(
        `/dashboard/projects_communities/${state.value.community_id}?events=true`,
      );
    } else {
      const errorResponse = JSON.parse(responseData.body);
      if (typeof errorResponse.error === "string") {
        errors.value.push(errorResponse.error);
      } else {
        errors.value = errorResponse.error.map((error: any) => {
          if (error.pointer) {
            return `${error.message}`;
          }
          return error.message;
        });
      }
    }
  } catch (error) {
    console.error("Error fetching communities data:", error);
  }
}

const checkEmptyContacts = computed(() => {
  return localContacts.value.some((contact: string) => contact === "");
});

const checkEmptyReferences = computed(() => {
  return localReferences.value.some((keyword: string) => keyword === "");
});

function goBack() {
  router.push(`/dashboard/projects_communities/${state.value.community_id}`);
}

function convertToUTCFullDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString();
}

function deleteEmptyElements(array: string[]): string[] {
  return array.filter((element) => element.trim() !== "");
}

function validateRequiredFields(data: any): string[] {
  const requiredFields = [
    "_id",
    "_schema",
    "name",
    "dates.benchmark_start",
    "dates.benchmark_end",
    "community_id",
    "bench_contact_ids",
  ];
  const errorMessages: string[] = [];

  requiredFields.forEach((field) => {
    if (typeof data[field] === "string" && data[field].trim() === "") {
      errorMessages.push(`${field} cannot be empty`);
    }
  });

  if (data["_id"] && !checkIdPattern(data["_id"])) {
    errorMessages.push(
      `_id is not in the correct format. Example: <b><i>${state.value.community_id}000000A</i></b>`,
    );
  }

  if (localContacts.value.length == 0) {
    errorMessages.push(`community_contact_ids cannot be empty`);
  } else {
    localContacts.value.forEach((contact: string, index: number) => {
      if (contact.trim() === "") {
        errorMessages.push(`community_contact_ids  cannot be empty`);
      }
    });
  }

  if (!state.value.dates.benchmark_start) {
    errorMessages.push("benchmark_start date is required");
  }
  if (!state.value.dates.benchmark_stop) {
    errorMessages.push("benchmark_end date is required");
  }

  return errorMessages;
}

function errorClean(errors: string[]): string[] {
  const cleanedErrors = errors.map((element: string) =>
    elementTranslator(element.trim()),
  );
  return cleanedErrors;
}

function checkIdPattern(id: string) {
  const pattern = new RegExp("^OEBE[0-9]{3}[A-Z0-9]{7}$");
  return pattern.test(id);
}

function elementTranslator(element: string) {
  // Define a mapping of field names to their replacements
  const fieldMap: { [key: string]: string } = {
    community_contact_ids: "Contacts",
    references: "References",
    _id: "ID",
    _schema: "Schema",
    name: "Name",
    benchmark_end: "Event End",
    benchmark_start: "Event Start",
  };

  // Replace the field name in the error message if it exists in the fieldMap
  for (const [field, replacement] of Object.entries(fieldMap)) {
    const regex = new RegExp(`\\b${field}\\b`, "g");
    element = element.replace(regex, `<b>${replacement}</b>`);
  }

  return element;
}

onMounted(() => {
  fetchContacts(token);
});

watch(
  () => props.eventObj,
  (newVal) => {
    if (newVal && newVal.bench_contact_ids) {
      localContacts.value =
        newVal.bench_contact_ids.map((contact: string) => {
          return contact;
        }) || [];
    }
    if (newVal && newVal.references) {
      localReferences.value = newVal.references;
    }

    if (newVal && newVal.is_automated) {
      localAutomated.value = Boolean(newVal.is_automated);
    }
    if (newVal && newVal.dates) {
      localDates.value.dates = {
        benchmark_start: new Date(newVal.dates.benchmark_start),
        benchmark_stop: new Date(newVal.dates.benchmark_stop),
        creation: new Date(newVal.dates.creation),
        modification: new Date(newVal.dates.modification),
      };
    }
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
.dashboard-community-event-edit {
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
        &.no-space {
          padding: 0;
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
    &__row {
      padding: 10px 15px;
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
        border-radius: 3px;
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
