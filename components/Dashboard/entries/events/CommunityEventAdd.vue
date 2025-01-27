<template>
  <div class="dashboard-community-event-add">
    <div class="w-100 container">
      <div class="dashboard-community-event-add__title">
        <h2 class="text-primaryOeb-500">
          <span class="">New Event</span>
        </h2>
        <p>
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters, as opposed to using 'Content here, content here', making it
          look like readable English.
        </p>
      </div>
      <div class="dashboard-community-event-add__content">
        <div class="w-100">
          <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmitCommunityEvent"
            @error="onError"
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
                            v-model="state._id"
                            type="text"
                            class="form-control custom-entry-input"
                            placeholder="OEBE0010000000"
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
                          v-model="state.dates.benchmark_start"
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
                          v-model="state.dates.benchmark_stop"
                        ></VueDatePicker>
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
                          :disabled="!eventPrivileges.event.create"
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
                        <label for="schema">
                          Schema
                          <span class="text-red-400 required">*</span>
                        </label>
                        <input
                          id="schema"
                          v-model="state._schema"
                          type="text"
                          class="form-control custom-entry-input"
                          placeholder="https://schema.org/Community"
                          :disabled="!eventPrivileges.event.create"
                        />
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="form-group">
                        <label for="url">URL</label>
                        <input
                          id="url"
                          v-model="state.url"
                          type="text"
                          class="form-control custom-entry-input"
                          placeholder="URL"
                          :disabled="!eventPrivileges.event.create"
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
                                type="button"
                                :disabled="
                                  !eventPrivileges.event.create ||
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
                                  :disabled="!eventPrivileges.event.create"
                                />
                                <button
                                  v-if="eventPrivileges.event.create"
                                  class="btn-delete-input"
                                  type="button"
                                  @click="
                                    onDeleteElement(index, localReferences)
                                  "
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
                              <span class="label-text">
                                Contacts
                                <span class="text-red-400 required">*</span>
                              </span>
                              <button
                                class="btn-form-add btn-primary"
                                type="button"
                                :disabled="
                                  !eventPrivileges.event.create ||
                                  cheEmptyContacts
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
                              ref="items"
                              class="col-12 pt-0"
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
              <div v-if="errors.length > 0" class="row errors">
                <div class="col-12">
                  <div class="alert alert-danger" v-html="getErrors"></div>
                </div>
              </div>
              <div class="form-footer">
                <UButton type="button" @click="goBack"> Cancel </UButton>
                <UButton
                  v-if="eventPrivileges.event.create"
                  type="submit"
                  :disabled="!eventPrivileges.event.create"
                >
                  Submit
                </UButton>
              </div>
            </div>
          </UForm>
        </div>
      </div>
    </div>
    <CustomDialog
      :is-dialog-open="isDialogOpened"
      :width="400"
      @modal-close="dialogShow"
    >
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
            class="btn-dialog bg-slate-50"
            @click="isDialogOpened = false"
          >
            No
          </button>
          <button
            type="button"
            class="btn-dialog btn-primary btn-ok"
            @click="deleteElement"
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
import { computed, ref, onMounted } from "vue";
import { useUser } from "@/stores/user.ts";
import type { CommunityPrivilegeActions } from "@/constants/privileges";
import CustomDialog from "@/components/Common/CustomDialog.vue";
import type { FormSubmitEvent, FormErrorEvent } from "#ui/types";
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
import "@vuepic/vue-datepicker/dist/main.css";

const runtimeConfig = useRuntimeConfig();
const router = useRouter();
const userStore = useUser();
const { data } = useAuth();
const token: string = data?.value.accessToken;

const props = defineProps<{
  eventPrivileges: CommunityPrivilegeActions;
  communityId: string;
}>();

const state = ref({
  _id: "",
  name: "",
  community_id: props.communityId,
  bench_contact_ids: [],
  _schema:
    "https://www.elixir-europe.org/excelerate/WP2/json-schemas/1.0/BenchmarkingEvent",
  references: [],
  url: "",
  is_automated: false,
  dates: {
    benchmark_start: "",
    benchmark_stop: "",
  },
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
  }),
  references: optional(
    array(
      object({
        id: string(),
        name: string(),
      }),
    ),
  ),
  _schema: string(),
  url: optional(string()),
  is_automated: boolean(),
});

const dialogTitle = ref("");
const dialogType = ref("yesno");
const isDialogOpened = ref(false);
const dialogText = ref("");
const dialogElement = ref<{ element: string[]; index: number } | null>(null);
const elementToDelete = ref({
  index: null as number | null,
  element: [] as string[],
});

const automatedOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];
const errors = ref<string[]>([]);
const oks = ref<string>("");
const localReferences = ref<string[]>([]);
const localContacts = ref<string[]>([]);
const contactsData = ref<string[]>([]);

function onAddElement(array: string[]) {
  array.push("");
}

const cheEmptyContacts = computed(() => {
  return localContacts.value.some((contact: string) => contact === "");
});

const checkEmptyReferences = computed(() => {
  return localReferences.value.some((keyword: string) => keyword === "");
});

const benchmarkStart = new Date();
const benchmarkStop = new Date(benchmarkStart);
benchmarkStop.setMonth(benchmarkStop.getMonth() + 1);

state.value.dates.benchmark_start = benchmarkStart;
state.value.dates.benchmark_stop = benchmarkStop;

function goBack() {
  router.push(`/dashboard/projects_communities/${state.value.community_id}`);
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
      await createBenchmarkingEvent();
    }
  } else {
    errors.value = result.error.issues.map((issue) => issue.message);
  }
}

async function createBenchmarkingEvent() {
  const cleanContacts = deleteEmptyElements(localContacts.value);
  const cleanReferences = deleteEmptyElements(localReferences.value);

  const body = {
    _id: state.value._id,
    name: state.value.name,
    community_id: state.value.community_id,
    bench_contact_ids: cleanContacts.map((element) => {
      return element;
    }),
    orig_id: state.value._id,
    _schema: state.value._schema,
    references: cleanReferences.map((element) => {
      return element;
    }),
    url: state.value.url,
    is_automated: state.value.is_automated,
    dates: {
      benchmark_start: convertToUTCFullDate(state.value.dates.benchmark_start),
      benchmark_stop: convertToUTCFullDate(state.value.dates.benchmark_stop),
    },
  };

  try {
    const response = await fetch(`/api/staged/BenchmarkingEvent`, {
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
        `/dashboard/projects_communities/${state.value.community_id}?events=true`,
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
    console.error("Error fetching communities data:", error);
  }
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
    "dates.benchmark_stop",
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

function convertToUTCFullDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString();
}

function errorClean(errors: string[]): string[] {
  const cleanedErrors = errors.map((element: string) =>
    elementTranslator(element.trim()),
  );
  return cleanedErrors;
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

function deleteElement() {
  if (elementToDelete.value.index !== null) {
    elementToDelete.value.element.splice(elementToDelete.value.index, 1);
    isDialogOpened.value = false;
  }
}

function dialogShow() {
  console.log("dialogShow!!!!");
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

function checkIdPattern(id: string) {
  const pattern = new RegExp(`^${state.value.community_id}[A-Z0-9]{7}$`);
  return pattern.test(id);
}

async function onError(event: FormErrorEvent) {
  // TO CHECK
}

onMounted(() => {
  fetchContacts(token);
});
</script>

<style scoped lang="scss">
.dashboard-community-event-add {
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
    padding: 5px 20px;
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
