<template>
  <div class="dashboard-community-edit">
    <div class="w-100 container">
      <div class="dashboard-community-edit__title">
        <h2 class="text-primaryOeb-500">
          <div class="w-100">
            OEB {{ labelType }} Code: {{ id }}
            <span class="title-name"
              ><i>( {{ communityData.name }} )</i></span
            >
          </div>
        </h2>
        <div class="w-100 d-flex justify-content-end">
          <NuxtLink
            class="btn-primary hover_effect header-button"
            :to="'/benchmarking/' + id"
          >
            {{ labelButton }}
          </NuxtLink>
        </div>
      </div>
      <div class="community-event-challenge__description text-gray-500 pb-4">
        Communities in OpenEBench are dynamic networks of experts who
        collaborate to advance software performance evaluation. They drive the
        creation and refinement of benchmarks, fostering a shared understanding
        of software capabilities and promoting innovation through collective
        knowledge sharing.
      </div>
      <div class="contribute-box">
        <div class="row">
          <div class="col-12">
            <div class="w-100 p-1 text-gray-500 text-center contribute-block">
              <img
                src="assets/images/dashboard/contribute_2.jpg"
                alt="Contribute image"
                class="metrics__body__img"
              />
              <p>
                I really like what this community is about, and I'm interested
                in getting involved!
              </p>
              <div class="w-100 text-center">
                <NuxtLink
                  class="btn-primary hover_effect header-button"
                  :to="'/dashboard/contribute/' + id"
                >
                  Contribute to community
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="loadingData" class="">
        <div class="space-y-2">
          <USkeleton class="dashboard-community-edit__skeleton__small" />
          <USkeleton class="dashboard-community-edit__skeleton__big" />
        </div>
      </div>
      <div v-else class="dashboard-community-edit__content">
        <div class="w-100 tab-wrapper">
          <CustomTab
            :items="items"
            :selected="selectedTab"
            @change-selected="changeSelected"
          ></CustomTab>
          <CustomTabBody>
            <div v-if="selectedTab == '0'">
              <CustomSubtitle text="Community Data" />
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
                            :disabled="
                              !commmunityPrivileges.community.update || isView
                            "
                          >
                            Upload new logo
                            <font-awesome-icon :icon="['fas', 'upload']" />
                          </label>
                          <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            :disabled="
                              !commmunityPrivileges.community.update || isView
                            "
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
                                  <UTooltip
                                    :ui="{
                                      width: 'max-w-lg',
                                      base: 'whitespace-normal break-words',
                                    }"
                                  >
                                    <template #text>
                                      Community concept (OpenEBench Benchmarking
                                      Data Model schemas)
                                    </template>
                                    <UIcon
                                      name="i-heroicons-information-circle"
                                    />
                                  </UTooltip>
                                  ID
                                  <span class="text-red-400 required">*</span>
                                </label>
                                <div class="w-100">
                                  <input
                                    id="id"
                                    v-model="state.id"
                                    type="text"
                                    class="form-control custom-entry-input"
                                    placeholder="Community id"
                                    disabled
                                  />
                                </div>
                              </div>
                            </div>
                            <div class="col-6">
                              <div class="form-group">
                                <label for="status">Status</label>
                                <USelectMenu
                                  v-model="localStatus.value"
                                  class="w-full custom-select-input"
                                  selected-icon="i-heroicons-hand-thumb-up-solid"
                                  :options="CommunityStatusLabels"
                                  :disabled="
                                    !commmunityPrivileges.community.update ||
                                    isView
                                  "
                                  :popper="{ arrow: true, offsetDistance: 0 }"
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
                                    <span
                                      v-if="item.label == localStatus.label"
                                    >
                                      <font-awesome-icon
                                        :icon="['fas', 'check']"
                                      />
                                    </span>
                                  </template>
                                </USelectMenu>
                              </div>
                            </div>
                            <div class="col-6">
                              <div class="form-group">
                                <label for="type">Type</label>
                                <USelect
                                  v-model="state.type"
                                  class="w-full custom-select-input"
                                  :options="typeOptions"
                                  option-attribute="label"
                                  :disabled="
                                    !commmunityPrivileges.community.update ||
                                    isView
                                  "
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
                          <UTooltip text="Unique community acronym">
                            <UIcon name="i-heroicons-information-circle" />
                          </UTooltip>
                          {{ inputLabels[state.type].acronym }}
                          <span class="text-red-400 required">*</span>
                        </label>
                        <input
                          id="acronym"
                          v-model="communityData.acronym"
                          type="text"
                          class="form-control"
                          :disabled="
                            !commmunityPrivileges.community.update || isView
                          "
                        />
                      </div>
                    </div>
                    <div class="form-card__row__box">
                      <div class="form-group">
                        <label for="description">
                          {{ inputLabels[state.type].name }}
                          <span class="text-red-400 required">*</span>
                        </label>
                        <input
                          id="name"
                          v-model="communityData.name"
                          type="text"
                          class="form-control"
                          :disabled="
                            !commmunityPrivileges.community.update || isView
                          "
                        />
                      </div>
                    </div>
                  </div>
                  <div class="row form-card__full_row pt-2">
                    <div class="form-card__row__box">
                      <div class="col-12">
                        <label for="description">Description</label>
                        <ckeditor
                          v-model="communityData.description"
                          :editor="ClassicEditor"
                          :config="config"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="w-100 form-card">
                  <CustomSubtitle text="More data" size="17px" />
                  <div class="row form-card__row">
                    <div class="form-card__row__box">
                      <div class="col-12">
                        <div class="form-group">
                          <div class="w-100">
                            <label for="links" class="form-group-row">
                              <span class="label-text"> Links </span>
                              <button
                                class="btn-form-add btn-primary"
                                :disabled="
                                  !commmunityPrivileges.community.update ||
                                  isView ||
                                  checkEmptyLinks
                                "
                                type="button"
                                @click="onAddElement(localLinks)"
                              >
                                <font-awesome-icon :icon="['fas', 'plus']" />
                              </button>
                            </label>
                          </div>
                          <div class="w-100 row no-space">
                            <div
                              v-for="(link, index) in localLinks"
                              :key="link"
                              class="col-12 d-flex pl-0"
                            >
                              <div class="input-wrapper big d-flex">
                                <span>{{ index + 1 }}.</span>
                                <input
                                  id="link"
                                  v-model="localLinks[index]"
                                  type="text"
                                  class="form-control"
                                  :disabled="
                                    !commmunityPrivileges.community.update ||
                                    isView
                                  "
                                />
                                <button
                                  v-if="
                                    commmunityPrivileges.community.update &&
                                    !isView
                                  "
                                  class="btn-delete-input"
                                  type="button"
                                  @click="onDeleteElement(index, localLinks)"
                                >
                                  <font-awesome-icon
                                    :icon="['far', 'trash-can']"
                                  />
                                </button>
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
                                :disabled="
                                  !commmunityPrivileges.community.update ||
                                  isView ||
                                  cheEmptyContacts
                                "
                                type="button"
                                @click="onAddContact(localContacts, itemRefs)"
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
                              ref="itemsContact"
                              class="col-12 pt-0"
                            >
                              <div class="input-wrapper big d-flex">
                                <span>{{ index + 1 }}.</span>
                                <USelectMenu
                                  :ref="`contact_${index}`"
                                  v-model="localContacts[index].id"
                                  class="w-full lg:w-100"
                                  searchable
                                  selected-icon="i-heroicons-check-16-solid"
                                  placeholder="Select a contact"
                                  :options="contactsData"
                                  value-attribute="id"
                                  option-attribute="name"
                                  :disabled="
                                    !commmunityPrivileges.community.update ||
                                    isView
                                  "
                                >
                                </USelectMenu>
                                <USelect
                                  v-model="localContacts[index].role"
                                  :options="rolesObj"
                                  class="w-48"
                                />
                                <button
                                  class="btn-delete-input"
                                  type="button"
                                  :disabled="
                                    !commmunityPrivileges.community.update ||
                                    isView
                                  "
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
                                  community</span
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row form-card__full_row">
                    <div class="form-card__row__box">
                      <div class="col-12">
                        <div class="form-group">
                          <div class="w-100">
                            <label for="contacts" class="form-group-row">
                              <span class="label-text"> Keywords </span>
                              <button
                                class="btn-form-add btn-primary"
                                type="button"
                                :disabled="
                                  !commmunityPrivileges.community.update ||
                                  isView ||
                                  checkEmptyKeywords
                                "
                                @click="onAddElement(localKeywords)"
                              >
                                <font-awesome-icon :icon="['fas', 'plus']" />
                              </button>
                            </label>
                          </div>
                          <div class="w-100 row no-space p-0">
                            <div
                              v-for="(keys, index) in localKeywords"
                              :key="index"
                              class="col-4 pt-0"
                            >
                              <div class="input-wrapper">
                                <span>{{ index + 1 }}.</span>
                                <input
                                  v-model="localKeywords[index]"
                                  type="text"
                                  class="form-control"
                                  :disabled="
                                    !commmunityPrivileges.community.update ||
                                    isView
                                  "
                                />
                                <button
                                  v-if="
                                    commmunityPrivileges.community.update &&
                                    !isView
                                  "
                                  class="btn-delete-input"
                                  type="button"
                                  @click="onDeleteElement(index, localKeywords)"
                                >
                                  <font-awesome-icon
                                    :icon="['far', 'trash-can']"
                                  />
                                </button>
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
                  <div class="w-100">
                    <div v-if="errors.length > 0" class="errors">
                      <div class="alert alert-danger text-center">
                        {{ getErrors }}
                      </div>
                    </div>
                  </div>
                  <div class="form-footer">
                    <UButton
                      type="button"
                      color="white"
                      variant="solid"
                      @click="goBack"
                    >
                      Cancel
                    </UButton>
                    <UButton
                      v-if="commmunityPrivileges.community.update && !isView"
                      type="submit"
                      :disabled="
                        !commmunityPrivileges.community.update || isView
                      "
                    >
                      Submit
                    </UButton>
                  </div>
                </div>
              </UForm>
            </div>
            <div v-if="selectedTab == '1'">
              <div>
                <EventsList
                  :events="events"
                  :is-loading-data="isLoadingEvents"
                  :commmunity-privileges="commmunityPrivileges"
                  :community-id="id"
                />
              </div>
            </div>
            <div v-if="selectedTab == '3'">
              <div>
                <CommunityConsent :community-id="id" />
              </div>
            </div>
          </CustomTabBody>
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
            class="btn-primary dialog-btn"
            @click="deleteElement"
          >
            Yes
          </button>
          <button
            type="button"
            class="btn-primary dialog-btn dialog-btn--no"
            color="gray"
            variant="solid"
            @click="isDialogOpened = false"
          >
            No
          </button>
        </template>
        <template v-else>
          <button
            type="button"
            class="btn-primary dialog-btn"
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
import {
  computed,
  ref,
  nextTick,
  onMounted,
  useTemplateRef,
  watch,
  watchEffect,
} from "vue";
import { useUser } from "@/stores/user.ts";

import {
  CommunityStatusLabels,
  CommunityStatusColors,
} from "@/constants/community_const";

import type { Community } from "@/types/communities";
import type { FormErrorEvent, FormSubmitEvent } from "#ui/types";
import type { CommunityPrivilegeActions } from "@/constants/privileges";
import type { Event } from "@/types/events";
import type { Contact } from "@/types/contact";

import EventsList from "@/components/Dashboard/entries/EventsList.vue";
import CustomSubtitle from "@/components/Common/CustomSubtitle.vue";
import { useRouter } from "vue-router";
import CustomDialog from "@/components/Common/CustomDialog.vue";
import { object, string, array, safeParse } from "valibot";
import CustomBorder from "@/components/Common/CustomBorder.vue";
import CustomTab from "@/components/Common/CustomTab.vue";
import CustomTabBody from "@/components/Common/CustomTabBody.vue";
import TurndownService from "turndown";
import CommunityConsent from "@/components/Dashboard/entries/CommunityConsent.vue";

import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Indent,
  IndentBlock,
  List,
  Link,
  Table,
  TableToolbar,
  BlockQuote,
  CodeBlock,
  HorizontalLine,
  SpecialCharacters,
  SpecialCharactersEssentials,
  Heading,
  SourceEditing,
} from "ckeditor5";
import { Ckeditor } from "@ckeditor/ckeditor5-vue";

import "ckeditor5/ckeditor5.css";
const turndownService = new TurndownService();

const router = useRouter();
const runtimeConfig = useRuntimeConfig();
const { data } = useAuth();
const token = ref(data?.value.accessToken);
const hasSetConsentTab = ref(false);

const userStore = useUser();
const imageDefault = "~/assets/images/dashboards/empty-logo.jpg";

const inputLabels = {
  Community: {
    acronym: "Community Acronym",
    name: "Community Name",
  },
  Project: {
    acronym: "Project Acronym",
    name: "Project Name",
  },
};

const props = defineProps<{
  id: string;
  communityObj?: Community | null;
  loadingData: boolean;
  commmunityPrivileges: CommunityPrivilegeActions;
  isView: boolean;
  events: Array<Event>;
  isLoadingEvents: boolean;
  privilegesType: string;
  tabIndex: string;
}>();

const state = ref({
  id: "",
  acronym: "",
  status: "",
  name: "",
  description: "",
  links: [],
  keywords: [],
  _schema: props.communityObj?._schema,
  community_contact_ids: [],
  type: "",
  privileges: "",
});

const schema = object({
  id: string(),
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
});

const dialogTitle = ref("");
const dialogType = ref("yesno");
const isDialogOpened = ref(false);
const dialogText = ref("");
const elementToDelete = ref({
  index: null as number | null,
  element: [] as string[],
});
const logo = ref("");
const errors = ref<string[]>([]);
const oks = ref<string>("");
const inputLinkRefs = ref<(HTMLInputElement | null)[]>([]);
const inputContactsRefs = ref<(HTMLInputElement | null)[]>([]);
const inputKeywordsRefs = ref<(HTMLInputElement | null)[]>([]);
const itemRefs = useTemplateRef("itemsContact");
const rolesObj = ref([
  { label: "Owner", value: "owner" },
  { label: "Manager", value: "manager" },
  { label: "Contributor", value: "contributor" },
]);

const config = computed(() => {
  return {
    licenseKey: "GPL",
    plugins: [
      Essentials,
      Paragraph,
      Bold,
      Italic,
      Underline,
      Strikethrough,
      Code,
      Indent,
      IndentBlock,
      List,
      Link,
      Table,
      TableToolbar,
      BlockQuote,
      CodeBlock,
      HorizontalLine,
      SpecialCharacters,
      SpecialCharactersEssentials,
      Heading,
      SourceEditing,
    ],
    toolbar: [
      "undo",
      "redo",
      "|",
      "heading",
      "|",
      "sourceEditing",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "code",
      "|",
      "bulletedList",
      "numberedList",
      "bulletedList ",
      "|",
      "link",
      "insertTable",
      "blockQuote",
      "codeBlock",
      "horizontalLine",
      "formatPainter",
      "specialCharacters",
    ],
  };
});

const items = ref([
  {
    key: "main",
    label: "Community Data",
    icon: "i-heroicons-document-chart-bar",
    index: 0,
  },
]);

const getErrors = computed(() => errors.value.join(", "));
const userAvailableRoles = [
  { value: "owner", label: "Owner" },
  { value: "manager", label: "Manager" },
];
const userPrivileges: Array<string> = computed(
  () => userStore.getUserCommunitiesRoles,
);

const labelTitle = ref("");
const labelButton = ref("");
const labelType = ref("");
const communityData = computed(() => ({
  id: props.communityObj?._id,
  acronym: props.communityObj?.acronym,
  status: props.communityObj?.status,
  name: props.communityObj?.name,
  description: props.communityObj?.description,
  _metadata: props.communityObj?._metadata ?? "",
  _schema: props.communityObj?._schema ?? "",
  community_contact_ids:
    props.communityObj?.community_contact_ids.map((contact: string) => ({
      id: contact,
      name: contact,
    })) || [],
  keywords: props.communityObj?.keywords ?? [],
  links: props.communityObj?.links ?? [],
}));

const typeOptions = [
  { value: "Community", label: "Community" },
  { value: "Project", label: "Project" },
];
const localContacts = ref<
  {
    id: string;
    role: string;
  }[]
>([]);
const localLinks = ref<string[]>([]);
const localKeywords = ref<string[]>([]);
const contactsData = ref<string[]>([]);
const localLogo = ref<string | null>(null);
const localUsers = ref<
  {
    name: string;
    email: string;
    role: string;
  }[]
>([]);

const selectedTab = ref(props.tabIndex);

const localPrivilegesType = computed(() => {
  return props.privilegesType;
});

const localStatus = ref({
  value: "",
  label: "",
});

if (props.communityObj && typeof props.communityObj.status === "string") {
  localStatus.value.value =
    props.communityObj.status.charAt(0).toUpperCase() +
    props.communityObj.status.slice(1);
}

if (props.communityObj && props.communityObj.community_contact_ids) {
  localContacts.value =
    props.communityObj.community_contact_ids.map((contact: string) => {
      return {
        id: contact,
        role: "owner" as const,
      };
    }) || [];
}

if (props.communityObj && props.communityObj.links) {
  localLinks.value = props.communityObj.links
    .filter((link: { comment?: string }) => {
      return !link.comment || link.comment !== "@logo";
    })
    .map((link: { uri: string }) => link.uri)
    .filter((uri: string | undefined): uri is string => uri !== undefined);
}

if (props.communityObj && props.communityObj.keywords) {
  localKeywords.value = props.communityObj.keywords;
}

if (props.tabIndex) {
  selectedTab.value = props.tabIndex;
}

const checkEmptyLinks = computed(() => {
  return localLinks.value.some((link: string) => link === "");
});

const cheEmptyContacts = computed(() => {
  return localContacts.value.some((contact: string) => contact === "");
});

const checkEmptyKeywords = computed(() => {
  return localKeywords.value.some((keyword: string) => keyword === "");
});

function goBack() {
  router.push("/dashboard/projects_communities");
}

async function onSubmitCommunity(event: FormSubmitEvent<Schema>) {
  const result = safeParse(schema, state.value);
  if (result.success) {
    const customErrors = validateRequiredFields(state.value);

    if (customErrors.length > 0) {
      errors.value = customErrors;
    } else {
      errors.value = [];
      await updateCommunity();
    }
  } else {
    errors.value = result.error.issues.map((issue) => issue.message);
  }
}

async function onError(event: FormErrorEvent) {
  const element = document.getElementById(event.errors[0].id);
  element?.focus();
  element?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deleteEmptyElements(array: string[]) {
  return array.filter((element: string) => element !== "");
}

async function updateCommunity() {
  const cleanLinks = deleteEmptyElements(localLinks.value);
  const cleanKeywords = deleteEmptyElements(localKeywords.value);
  const cleanContacts = deleteEmptyContact(localContacts.value);

  const markdownDescription = turndownService.turndown(state.value.description);

  const body = {
    _id: props.communityObj._id,
    _schema: state.value._schema,
    name: state.value.name,
    acronym: state.value.acronym,
    status: localStatus.value.value,
    community_contact_ids: cleanContacts.map((element) => {
      return element.id;
    }),
    description: markdownDescription,
  };

  if (cleanKeywords.length > 0) {
    body.keywords = cleanKeywords.map((uri) => ({
      uri,
    }));
  }

  if (cleanLinks.length > 0) {
    body.links = cleanLinks.map((uri) => ({
      uri,
      label: "MainSite",
    }));
  }
  if (localLogo.value) {
    if (!body.links) {
      body.links = [];
    }
    body.links.push({
      label: "other",
      comment: "@logo",
      uri: localLogo.value,
    });
  }

  console.log(body);

  try {
    const response = await fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Community/${props.communityObj._id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();

    if (data.status >= 200 && data.status < 300) {
      const msg =
        "Your community changes have been saved. Redirecting to the communities list...";
      await showOkMessage(msg).then(() => {
        router.push("/dashboard/projects_communities");
      });
    } else {
      const responseData = JSON.parse(data.body);
      if (responseData.message) {
        errors.value = [responseData.message];
      } else if (responseData.error) {
        errors.value = [responseData.error];
      } else {
        errors.value = [responseData];
      }
    }
  } catch (error) {
    console.error("Error fetching communities data:", error);
  }
}

async function showOkMessage(msg: string) {
  oks.value = msg;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      oks.value = "";
      resolve("done");
    }, 5000);
  });
}

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
    localContacts.value.forEach(
      (
        contact: {
          id: string;
          role: string;
        },
        index: number,
      ) => {
        if (contact.id.trim() === "") {
          errorMessages.push(`community_contact_ids  cannot be empty`);
        }
      },
    );
  }
  return errorMessages;
}

function consentTab(userPrivileges) {
  if (!userPrivileges?.value || !Array.isArray(items.value)) return;

  const canConsent = userPrivileges.value.find(
    (privilege) => privilege.role === "admin" || privilege.role === "owner",
  );

  const existItem = items.value.find((item) => item.index === 3);

  if (canConsent && !existItem) {
    items.value.push({
      key: "terms",
      label: "Terms of use",
      icon: "i-heroicons-megaphone",
      index: 3,
    });
  }
}

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

function onAddContact(
  contact: {
    id: string;
    role: string;
  },
  arrayRef?: HTMLInputElement[],
) {
  contact.push({
    id: "",
    role: rolesObj.value[0].value,
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
  if (element[index] === "") {
    element.splice(index, 1);
    restartElementToDelete();
  } else {
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

function deleteEmptyContact(array: { id: string; role: string }[]) {
  return array.filter((element) => element.id !== "");
}

function changeSelected(index: string) {
  selectedTab.value = index;
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

async function fetchContacts(token: string): Promise<Contact[]> {
  try {
    if (userStore.getContactsList && userStore.getContactsList.length > 0) {
      contactsData.value = userStore.getContactsList;
    } else {
      contactsData.value = await userStore.fetchContacts(token);
    }
  } catch (error) {
    console.error("Error fetching contacts data:", error);
  }
}

onMounted(() => {
  if (token.value) {
    fetchContacts(token.value);
  }
});

watch(
  () => props.communityObj,
  (newVal) => {
    if (newVal && typeof newVal.status === "string") {
      localStatus.value.label =
        newVal.status.charAt(0).toUpperCase() + newVal.status.slice(1);
      localStatus.value.value = newVal.status;
    }
    if (newVal && newVal.links) {
      localLinks.value = newVal.links
        .filter(
          (link: { comment?: string }) =>
            link.comment && link.comment.toLowerCase() !== "@logo",
        )
        .map((link: { uri?: string }) => link.uri)
        .filter((uri: string | undefined): uri is string => uri !== undefined);

      localLogo.value =
        newVal.links.find((link: { comment?: string; label?: string }) => {
          return link.label === "Logo" || link.comment === "@logo";
        })?.uri || "";
    }
    if (newVal && newVal.community_contact_ids) {
      localContacts.value =
        newVal.community_contact_ids.map((contact: string) => {
          return {
            id: contact,
            role: "owner" as const,
          };
        }) || [];
    }
    if (newVal && newVal.keywords) {
      localKeywords.value = newVal.keywords;
    }
  },

  { immediate: true },
);

watchEffect(() => {
  const community = props.communityObj;
  if (!community) return;

  state.value = communityData.value;

  if (!community._metadata) {
    items.value.push({
      key: "events",
      label: "Events",
      icon: "i-heroicons-calendar",
      index: 1,
    });
    state.value.type = "Community";
    labelTitle.value = "Edit Community";
    labelButton.value = "View Community";
    labelType.value = "Community";
  } else {
    items.value.push({
      key: "summary",
      label: "Summary",
      icon: "i-heroicons-squares-2x2-16-solid",
      index: 2,
    });
    state.value.type = "Project";
    labelTitle.value = "Edit Project";
    labelButton.value = "View Project";
    labelType.value = "Project";
  }

  if (!hasSetConsentTab.value) {
    if (userPrivileges.value.length === 0) {
      userStore.setUserCommunitiesRoles(data.value.oeb_roles);
      consentTab(data.value.oeb_role);
    } else {
      consentTab(userPrivileges);
    }
    hasSetConsentTab.value = true;
  }
});
</script>

<style scoped lang="scss">
.dashboard-community-edit {
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
    background-color: rgba(11, 87, 159, 0.058);
    padding: 0.6rem 0.8rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    line-height: 1;
    margin-bottom: 5px;
    input {
      border: none;
      background-color: rgba(255, 255, 255, 0.8);
      width: 100%;
      &:disabled {
        background-color: #e9ecef;
      }
    }
    &.big {
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

  .form-group-row {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    .label-text {
      border-bottom: 1px solid #e9ecef;
      width: 95%;
    }
    .btn-form-add.btn-primary {
      padding: 1px 6px;
      height: 28px;
    }
  }
  .form-card {
    &__row {
      padding: 10px 15px;
      display: grid;
      grid-template-columns: 1fr 1fr;
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
.custom-section {
  padding: 10px 0 0;
}

.title-name {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 10px;
  width: 100%;
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
  > .btn.primary {
    background-color: red;
  }
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
.header-button {
  padding: 5px 10px;
  font-size: 14px;
  text-decoration: none;
  margin-bottom: 5px;
}

.contribute-box {
  margin-top: 20px;
  margin-bottom: 50px;
  img {
    max-height: 110px;
  }
}
.tab-wrapper {
  border-top-left-radius: 9px;
  border-top-right-radius: 9px;
}
.contribute-block {
  display: grid;
  justify-items: center;
  align-items: center;
  grid-template-columns: 1fr 3fr 1fr;
  gap: 5px;
  width: fit-content;
  margin: 0 auto; 
  background-color: rgba(233, 236, 239, 0.2);
  border: 1px solid #ddd;
  border-radius: 10px;
}
</style>

<style>
.form-footer {
  display: flex;
  justify-content: end;
  gap: 10px;
}
</style>
