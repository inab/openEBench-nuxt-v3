<template>
  <div class="dashboard-community-add">
    <div class="w-100 container">
      <div class="dashboard-community-add__title">
        <h2 class="text-primaryOeb-500">
          <span class="">New Community</span>
        </h2>
        <p>
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters, as opposed to using 'Content here, content here', making it
          look like readable English.
        </p>
      </div>
      <div class="dashboard-community-add__content">
        <div class="">
          <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmitCommunity"
          >
            <div class="w-100 form-card">
              <div class="row justify-content-between">
                <div class="col-6">
                  <div class="logo-col">
                    <div class="logo-col-wrapper">
                      <div class="form-logo">
                        <img
                          v-if="localLogo && localLogo != ''"
                          :src="localLogo"
                          alt="Entry logo"
                        />
                        <img
                          v-else
                          src="~/assets/images/dashboard/empty-logo.jpg"
                          alt="Entry logo"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="d-flex justify-content-center">
                    <div class="form-logo-input">
                      <label
                        for="file-upload"
                        class="custom-file-upload btn-primary hover_effect"
                      >
                        Upload new logo
                        <font-awesome-icon :icon="['fas', 'upload']" />
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        @change="onFileChange"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="row justify-content-end form-card__full_row">
                    <div class="form-card__row__box">
                      <div class="row justify-content-end">
                        <div class="col-12 typeOptions">
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
                                placeholder="Community id"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="form-group">
                            <label for="status">Status</label>
                            <USelectMenu
                              v-model="localStatus.value"
                              :options="CommunityStatusLabels"
                              @change="onChangeStatus"
                            >
                              <template #label>
                                <span
                                  :class="`status-${localStatus.value}__option inline-block h-2 w-2 flex-shrink-0 rounded-full`"
                                  aria-hidden="true"
                                />
                                <span class="truncate">{{
                                  localStatus.label
                                }}</span>
                              </template>
                              <template #option="{ option: item }">
                                <span
                                  class="h-2 w-2 rounded-full"
                                  :class="`status-${item?.value}__option`"
                                ></span>
                                <span>{{ item.label }}</span>
                              </template>
                            </USelectMenu>
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="form-group">
                            <label for="type">Type</label>
                            <USelect
                              v-model="state.type"
                              :options="typeOptions"
                              option-attribute="label"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <CustomBorder />
              <div class="row form-card__row">
                <div class="form-card__row__box">
                  <div class="form-group">
                    <label for="acronym">
                      Acronym
                      <span class="text-red-400 required">*</span>
                    </label>
                    <div class="w-100">
                      <input
                        id="acronym"
                        v-model="state.acronym"
                        type="text"
                        class="form-control custom-entry-input"
                        placeholder="Community acronym"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-card__row__box">
                  <div class="form-group">
                    <label for="name">
                      Name
                      <span class="text-red-400 required">*</span>
                    </label>
                    <div class="w-100">
                      <input
                        id="name"
                        v-model="state.name"
                        type="text"
                        class="form-control custom-entry-input"
                        placeholder="Community name"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="row form-card__full_row">
                <div class="form-card__row__box">
                  <div class="col-12">
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
            <div class="w-100 form-card">
              <CustomSubtitle text="Data" size="22px" />
              <div class="row form-card__row">
                <div class="form-card__row__box">
                  <div class="col-12">
                    <div class="form-group">
                      <div class="w-100">
                        <label for="contacts" class="form-group-row">
                          <span class="label-text">Links</span>
                          <button
                            class="btn-form-add btn-primary btn-add-link"
                            type="button"
                            :disabled="checkEmptyLinks"
                            @click="onAddElement(localLinks, inputLinkRefs)"
                          >
                            <font-awesome-icon :icon="['fas', 'plus']" />
                          </button>
                        </label>
                      </div>
                      <div class="w-100 row no-space">
                        <div
                          v-for="(link, index) in localLinks"
                          v-if="localLinks.length > 0"
                          :key="index"
                          class="col-12 d-flex pl-0"
                        >
                          <div class="input-wrapper big d-flex">
                            <span>{{ index + 1 }}.</span>
                            <input
                              id="link"
                              ref="inputLinkRefs"
                              v-model="localLinks[index]"
                              type="text"
                              class="form-control"
                            />
                            <button
                              class="btn-delete-input"
                              type="button"
                              @click="onDeleteElement(index, localLinks)"
                            >
                              <font-awesome-icon :icon="['far', 'trash-can']" />
                            </button>
                          </div>
                        </div>
                        <div v-else class="col-12 pt-0">
                          <div class="w-100 empty-elements text-slate-400">
                            <span
                              >There are no links associated with this
                              community</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="form-card__row__box">
                  <div class="col-12">
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
                            :disabled="checkEmptyContacts"
                            @click="onAddElement(localContacts, itemRefs)"
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
                              <font-awesome-icon :icon="['far', 'trash-can']" />
                            </button>
                          </div>
                        </div>
                        <div v-else class="col-12 pt-0">
                          <div class="w-100 empty-elements text-slate-400">
                            <span
                              >There are no contacts associated with this
                              community</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-card__row__box">
                  <div class="col-12">
                    <div class="form-group">
                      <label for="schema" class="w-100">
                        Schema
                        <span class="text-red-400 required">*</span>
                      </label>
                      <div class="w-100 d-flex">
                        <input
                          id="schema"
                          v-model="state._schema"
                          type="text"
                          class="form-control custom-entry-input"
                          placeholder="https://schema.org/Community"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-card__row__box">
                  <div class="col-12">
                    <div class="form-group">
                      <div class="w-100">
                        <label for="contacts" class="form-group-row">
                          <span class="label-text">Keywords</span>
                          <button
                            class="btn-form-add btn-primary"
                            type="button"
                            :disabled="checkEmptyKeywords"
                            @click="
                              onAddElement(localKeywords, inputKeywordsRefs)
                            "
                          >
                            <font-awesome-icon :icon="['fas', 'plus']" />
                          </button>
                        </label>
                      </div>
                      <div class="w-100 row no-space">
                        <div
                          v-for="(keys, index) in localKeywords"
                          v-if="localKeywords.length > 0"
                          :key="index"
                          class="col-6 pt-0"
                        >
                          <div class="input-wrapper">
                            <input
                              id="keyword"
                              ref="inputKeywordsRefs"
                              v-model="localKeywords[index]"
                              type="text"
                              class="form-control"
                            />
                            <button
                              class="btn-delete-input"
                              type="button"
                              @click="onDeleteElement(index, localKeywords)"
                            >
                              <font-awesome-icon :icon="['far', 'trash-can']" />
                            </button>
                          </div>
                        </div>
                        <div v-else class="col-12 pt-0">
                          <div class="w-100 empty-elements text-slate-400">
                            <span
                              >There are no keywords associated with this
                              community</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-100">
                <div v-if="oks" class="ok-response">
                  <div class="alert alert-success text-center">
                    {{ oks }}
                  </div>
                </div>
              </div>
              <div v-if="errors.length > 0" class="errors">
                <div class="alert alert-danger">
                  {{ getErrors }}
                </div>
              </div>
              <div class="form-footer">
                <UButton type="button" variant="secondary" @click="goBack">
                  Cancel
                </UButton>
                <UButton type="submit"> Submit </UButton>
              </div>
            </div>
          </UForm>
        </div>
      </div>
    </div>
    <CustomDialog :is-dialog-open="isDialogOpened" :width="400">
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
import { computed, ref, nextTick, onMounted, useTemplateRef } from "vue";
import { useUser } from "@/stores/user.ts";
import { Community } from "@/types/communities";
import { CommunityStatusLabels } from "@/constants/community_const";
import { useRouter } from "vue-router";
import CustomSubtitle from "@/components/Common/CustomSubtitle.vue";
import type { FormSubmitEvent } from "#ui/types";
import CustomDialog from "@/components/Common/CustomDialog.vue";
import { object, string, array, safeParse, nonEmpty, is } from "valibot";
import CustomBorder from "@/components/Common/CustomBorder.vue";

const runtimeConfig = useRuntimeConfig();
const userStore = useUser();
const router = useRouter();
const { data } = useAuth();
const token: string = data?.value.accessToken;
const typeOptions = [
  { value: "Community", label: "Community" },
  { value: "Project", label: "Project" },
];

const localLogo = ref<string | null>(null);
const localLinks = ref<string[]>([]);
const localKeywords = ref<string[]>([]);
const localContacts = ref<string[]>([]);
const contactsData = ref<string[]>([]);
const localUsers = ref<
  {
    name: string;
    email: string;
    role: string;
  }[]
>([]);

const state = ref({
  _id: "",
  acronym: "",
  status: "",
  name: "",
  description: "",
  links: [],
  keywords: [],
  _schema:
    "https://www.elixir-europe.org/excelerate/WP2/json-schemas/1.0/Community",
  community_contact_ids: [],
  type: "Community",
  privileges: "owner",
  users: [],
});

const schema = object({
  _id: string(),
  acronym: string(),
  status: string(),
  name: string(),
  description: string(),
  _schema: string(),
  links: array(
    object({
      uri: string(),
      label: string(),
    }),
  ),
  keywords: array(string()),
  community_contact_ids: array(
    object({
      id: string(),
      name: string(),
    }),
  ),
  users: array(
    object({
      name: string(),
      email: string(),
      role: string(),
    }),
  ),
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

const errors = ref<string[]>([]);
const oks = ref<string>("");
const inputLinkRefs = ref<(HTMLInputElement | null)[]>([]);
const inputContactsRefs = ref<(HTMLInputElement | null)[]>([]);
const inputKeywordsRefs = ref<(HTMLInputElement | null)[]>([]);
const inputUsersRefs = ref<(HTMLInputElement | null)[]>([]);
const itemRefs = useTemplateRef("items");

// Default value is active?
const localStatus = ref({
  value: "active",
  label: "Active",
});

const userAvailableRoles = [
  { value: "owner", label: "Owner" },
  { value: "manager", label: "Manager" },
];

state.value.status = localStatus.value.value;

const localPrivilegesType = [
  {
    value: "owner",
    label: "Owner",
  },
];

const checkEmptyLinks = computed(() => {
  return localLinks.value.some((link: string) => link === "");
});

const checkEmptyContacts = computed(() => {
  if (localContacts.value.length == 0) {
    return false;
  }

  const filter = localContacts.value.map((contact: string) => {
    return contact === "";
  });

  return filter[0] ? filter[0] : false;
});

const checkEmptyKeywords = computed(() => {
  return localKeywords.value.some((keyword: string) => keyword === "");
});

const checkEmptyUsers = computed(() => {
  return localUsers.value.some((user: string) => user === "");
});

function validateRequiredFields(data: any): string[] {
  const requiredFields = [
    "_id",
    "_schema",
    "acronym",
    "name",
    "status",
    "community_contact_ids",
  ];
  const errorMessages: string[] = [];

  requiredFields.forEach((field) => {
    if (typeof data[field] === "string" && data[field].trim() === "") {
      errorMessages.push(`${field} cannot be empty`);
    }
  });

  if (localContacts.value.length == 0) {
    errorMessages.push(`community_contact_ids cannot be empty`);
  } else {
    localContacts.value.forEach((contact: string, index: number) => {
      if (contact.trim() === "") {
        errorMessages.push(`community_contact_ids  cannot be empty`);
      }
    });
  }
  return errorMessages;
}

function deleteEmptyElements(array: string[]) {
  return array.filter((element: string) => element !== "");
}

async function onSubmitCommunity(event: FormSubmitEvent<Schema>) {
  event.preventDefault();

  const result = safeParse(schema, state.value);
  if (result.success) {
    const customErrors = validateRequiredFields(state.value);

    if (customErrors.length > 0) {
      errors.value = customErrors;
    } else {
      errors.value = [];
      const response = await createCommunity();
    }
  } else {
    errors.value = result.error.issues.map((issue) => issue.message);
  }
}

async function createCommunity() {
  const cleanLinks = deleteEmptyElements(localLinks.value);
  const cleanKeywords = deleteEmptyElements(localKeywords.value);
  const cleanContacts = deleteEmptyElements(localContacts.value);

  const body = {
    _id: state.value._id,
    _schema: state.value._schema,
    name: state.value.name,
    acronym: state.value.acronym,
    status: state.value.status,
    links: cleanLinks.map((element) => {
      return {
        uri: element,
        label: "MainSite",
      };
    }),
    keywords: cleanKeywords.map((element) => {
      return element;
    }),
    community_contact_ids: cleanContacts.map((element) => {
      return element;
    }),
    description: state.value.description,
  };

  if (localLogo.value) {
    body.links.push({
      label: "other",
      comment: "@logo",
      uri: localLogo.value,
    });
  }

  // call to exist community
  let responseCommunity = null;
  try {
    responseCommunity = await fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Community/${state.value._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      },
    );
    responseCommunity = await responseCommunity.json();
    if (responseCommunity._id) {
      errors.value = [
        "Community ID already exists. Please, choose another one.",
      ];
      return true;
    }
  } catch (error) {
    console.error("Error fetching communities data:", error);
  }

  try {
    const response = await fetch(`/api/staged/Community`, {
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
      router.push("/dashboard/entries");
    } else {
      const errorResponse = JSON.parse(responseData.body);
      errors.value = errorResponse.error.map((error: any) => {
        if (error.pointer) {
          return `${error.message}`;
        }
        return error.message;
      });
    }
  } catch (error) {
    console.error("Error fetching communities data:", error);
  }
}

function goBack() {
  router.push("/dashboard/entries");
}

const getErrors = computed(() => errors.value.join(", "));

function onChangeStatus(newStatus: string) {
  localStatus.value.value = newStatus.value;
  localStatus.value.label = newStatus.label;
}

function onAddElement(array: string[], arrayRef?: HTMLInputElement[]) {
  array.push("");
  nextTick(() => {
    const lastElementIndex = array.length - 1;
    const inputElement = arrayRef ? arrayRef[lastElementIndex] : null;
    if (inputElement) {
      inputElement.focus();
    }
  });
}

function onAddObjectElement(
  array: { name: string; email: string; role: string }[],
  arrayRef?: HTMLInputElement[],
) {
  array.push({
    name: "",
    email: "",
    role: "owner",
  });

  nextTick(() => {
    const lastElementIndex = array.length - 1;
    const inputElement = arrayRef ? arrayRef[lastElementIndex] : null;
    if (inputElement) {
      inputElement.focus();
    }
  });
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

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      localLogo.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
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

onMounted(() => {
  fetchContacts(token);
});
</script>

<style scoped lang="scss">
.dashboard-community-add {
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
      .empty-elements {
        text-align: center;
        font-size: 14px;
      }
    }
    .input-wrapper {
      padding-bottom: 10px;
      display: flex;
      gap: 10px;
      justify-content: start;
      align-items: baseline;
      &.cols-4-input {
        display: grid;
        grid-template-columns: 7fr 7fr 7fr 1fr;
      }
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
      padding-bottom: 5px;
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
      grid-template-columns: 1fr 1fr;
      column-gap: 20px;
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
      }
    }
    &__full_row {
      display: block;
      padding: 0px 15px 20px;
      &__box {
        padding: 10px 20px;
        border: 1px solid rgba(233, 236, 239);
        background-color: white;
      }
    }
  }
  .custom-entry-input::placeholder {
    opacity: 0.5;
    color: rgba(0, 0, 0, 0.3);
  }
}
.btn-dialog {
  padding: 5px 25px;
}
input[type="file"] {
  display: none;
}
.custom-file-upload {
  border: 1px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 14px;
}
.logo-col {
  display: flex;
  justify-content: center;
  .logo-col-wrapper {
    width: 200px;
    height: 200px;
    display: flex;
    justify-content: center;
    border: 1px solid #e9ecef;
    border-radius: 5px;
    background-color: white;
    .form-logo {
      width: 150px;
      height: 150px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
}
.form-logo-input {
  width: 200px;
  display: flex;
  justify-content: center;
  button {
    padding: 2px 25px;
    margin-top: 10px;
  }
}
</style>
