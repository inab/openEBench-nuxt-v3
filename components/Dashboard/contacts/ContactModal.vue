<template>
  <div>
    <CustomModal
      :is-open="isModalOpen"
      width="600"
      class="dashboard-contacts-modal"
      @modal-close="closeModal"
    >
      <template #header>
        <div class="modal-title">Edit contact</div>
        <button
          class="modal-close"
          aria-label="Close modal"
          @click="closeModal"
        >
          <UIcon name="i-heroicons-x-mark-16-solid" />
        </button>
      </template>
      <template #content>
        <div class="w-100">
          <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmitContactUpdate"
          >
            <div class="w-100">
              <div
                v-if="isSearchingContact || !contactObj"
                class="flex justify-content-center items-center"
              >
                <div class="space-y-2 pt-4">
                  <USkeleton class="h-8 w-[400px]" />
                  <USkeleton class="h-8 w-[400px]" />
                  <USkeleton class="h-20 w-[400px]" />
                </div>
              </div>
              <div v-else>
                <div class="form-card__row__box row pb-3">
                  <div class="col-6">
                    <label for="id">
                      Name
                      <span class="text-red-400 required">*</span>
                    </label>
                    <div class="w-100">
                      <input
                        id="id"
                        v-model="state.givenName"
                        type="text"
                        class="form-control custom-entry-input"
                        placeholder="Contact Name"
                      />
                    </div>
                  </div>
                  <div class="col-6">
                    <label for="id">
                      Surname
                      <span class="text-red-400 required">*</span>
                    </label>
                    <div class="w-100">
                      <input
                        id="surname"
                        v-model="state.surname"
                        type="text"
                        class="form-control custom-entry-input"
                        placeholder="Contact Surname"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-card__row__box row pb-3">
                  <div class="col-6">
                    <label for="id"> ORCID </label>
                    <div class="w-100">
                      <input
                        id="surname"
                        v-model="state._id"
                        type="text"
                        disabled
                        class="form-control custom-entry-input"
                        placeholder="ORCID"
                      />
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="form-group">
                      <label for="email">
                        Email
                        <span class="text-red-400 required">*</span>
                      </label>
                      <div class="w-100">
                        <input
                          id="email"
                          v-model="state.email"
                          type="text"
                          class="form-control custom-entry-input"
                          placeholder="Contact Email"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-card__row__box row pb-3">
                  <div class="col-6">
                    <label for="provenance_created"> Provenance created:</label>
                    <div class="w-100">
                      <input
                        id="provenance_created"
                        v-model="state._provenance.created"
                        type="text"
                        disabled
                        class="form-control custom-entry-input"
                        placeholder="Provenance created"
                      />
                    </div>
                  </div>
                  <div class="col-6">
                    <label for="provenance_updated">
                      Provenance updated:
                    </label>
                    <div class="w-100">
                      <input
                        id="provenance_updated"
                        v-model="state._provenance.updated"
                        type="text"
                        disabled
                        class="form-control custom-entry-input"
                        placeholder="Provenance updated"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-card__row__box row pb-3">
                  <div class="col-12">
                    <div class="form-group">
                      <label for="notes"> Notes </label>
                      <div class="w-100">
                        <textarea
                          v-model="contactObj.notes"
                          class="form-control custom-entry-input"
                          placeholder="Notes..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-card__row__box row pb-3">
                  <div class="col-6">
                    <label for="id"> Initial Community </label>
                    <div class="w-100">
                      <USelectMenu
                        v-model="state.initial_community_id"
                        class="w-full custom-select-input"
                        :options="communities"
                        searchable
                        searchable-placeholder="Search a community..."
                        value-attribute="_id"
                        option-attribute="name"
                      />
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="w-100 pt-3">
                      <label for="contacts" class="form-group-title">
                        <span class="label-text"> User communities </span>
                        <button
                          class="btn-form-add btn-primary"
                          type="button"
                          :disabled="checkEmptyContacts"
                          @click="
                            onAddContact(allCommunitiesPrivileges, itemRefs)
                          "
                        >
                          <font-awesome-icon :icon="['fas', 'plus']" />
                        </button>
                      </label>
                    </div>
                    <div
                      v-if="allCommunitiesPrivileges.length > 0"
                      class="w-100 row no-space"
                    >
                      <div
                        v-for="(contact, index) in allCommunitiesPrivileges"
                        :key="index"
                        ref="items"
                        class="col-12 pt-0 form-group-row"
                      >
                        <div class="input-wrapper big d-flex">
                          <USelectMenu
                            :ref="`contact_${index}`"
                            v-model="allCommunitiesPrivileges[index].id"
                            class="w-full lg:w-100"
                            searchable
                            selected-icon="i-heroicons-check-16-solid"
                            placeholder="Select a Community"
                            :options="communities"
                            value-attribute="_id"
                            option-attribute="name"
                          >
                          </USelectMenu>
                          <USelect
                            v-model="allCommunitiesPrivileges[index].role"
                            :options="rolesObj"
                            class="w-48"
                          />
                          <button
                            class="btn-delete-input"
                            type="button"
                            @click="
                              onDeleteElement(index, allCommunitiesPrivileges)
                            "
                          >
                            <font-awesome-icon :icon="['far', 'trash-can']" />
                          </button>
                        </div>
                        <div
                          v-if="isValidatorOpened[index].isOpened"
                          class="w-100 delete-validator alert alert-danger text-center"
                        >
                          <label class="w-100"
                            >Are you sure you want to delete this
                            element?</label
                          >
                          <div class="flex w-100">
                            <button
                              type="button"
                              class="btn-dialog bg-slate-50 btn-nok"
                              @click="isValidatorOpened[index].isOpened = false"
                            >
                              No
                            </button>
                            <button
                              type="button"
                              class="btn-dialog btn-primary btn-ok"
                              @click="deleteElement(index)"
                            >
                              Yes
                            </button>
                          </div>
                        </div>
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
              <div class="form-footer pt-3">
                <UButton
                  type="button"
                  color="white"
                  variant="solid"
                  @click="closeModal"
                >
                  Cancel
                </UButton>
                <UButton class="" type="submit"> Submit </UButton>
              </div>
            </div>
          </UForm>
        </div>
      </template>
      <template #footer>
        <div class="form-footer"></div>
      </template>
    </CustomModal>
    <!-- <CustomDialog :is-dialog-open="isValidatorOpened" :width="400">
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
            @click="isValidatorOpened = false"
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
            @click="isValidatorOpened = false"
          >
            Cancel
          </button>
        </template>
      </template>
    </CustomDialog> -->
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  computed,
  defineEmits,
  useTemplateRef,
  nextTick,
} from "vue";
import type { FormErrorEvent, FormSubmitEvent } from "#ui/types";
import CustomModal from "@/components/Common/CustomModal.vue";
import { useUser } from "@/stores/user.ts";
import type {
  Community,
  CommunityPrivileges,
  UserCommunityRoles,
  UserCommunityPrivilege,
} from "@/types/communities";
import type { Contact } from "@/types/contact";
import { object, string, safeParse, array } from "valibot";
import { useRouter } from "vue-router";
import CustomDialog from "@/components/Common/CustomDialog.vue";

const props = defineProps<{
  isModalOpen: boolean;
  modalTitle: string;
  contactId: string;
  isContactEditable?: boolean;
  token: string;
}>();

const emits = defineEmits(["close-modal"]);
const userStore = useUser();
const runtimeConfig = useRuntimeConfig();
const contactObj = ref<Contact | null>(null);
const communities = ref<Community[]>([]);
const isSearchingContact = ref(true);
const errors = ref<string[]>([]);
const oks = ref<string>("");
const router = useRouter();
const allCommunitiesPrivileges = ref<UserCommunityPrivilege[]>([]);
const rolesObj = ref<UserCommunityRoles[]>([
  { label: "Owner", value: "owner" },
  { label: "Manager", value: "manager" },
  { label: "Contributor", value: "contributor" },
]);
const isValidatorOpened = ref([
  { index: null as number | null, isOpened: false },
]);
const dialogElement = ref<{ element: string[]; index: number } | null>(null);
const elementToDelete = ref({
  index: null as number | null,
  element: [] as string[],
});
const itemRefs = useTemplateRef("items");

const state = ref({
  _id: "",
  givenName: "",
  surname: "",
  email: "",
  notes: "",
  _schema:
    "https://www.elixir-europe.org/excelerate/WP2/json-schemas/1.0/Contact",
  initial_community_id: "",
  _provenance: {
    created: "",
    updated: "",
  },
});

const schema = object({
  _id: string(),
  givenName: string(),
  surname: string(),
  email: string(),
  notes: string(),
  _schema: string(),
  initial_community_id: string(),
  _provenance: object({
    created: string(),
    updated: string(),
  }),
});

const getErrors = computed(() => errors.value.join(", "));

const closeModal = () => {
  isSearchingContact.value = true;
  contactObj.value = null;
  errors.value = [];
  emits("close-modal");
};

async function fetchContact(id: string): Promise<Contact> {
  isSearchingContact.value = true;
  try {
    const response = await fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Contact/${id}`,
      {
        headers: {
          Authorization: `Bearer ${props.token}`,
          Accept: "application/json",
        },
        method: "GET",
      },
    );
    const data = await response.json();

    if (!data.notes) {
      data.notes = "";
    }
    contactObj.value = data;
    fetchUserCommunities(props.token).then((result) => {
      communities.value = result;
    });

    fetchAllPrivileges(props.token).then((result) => {
      allCommunitiesPrivileges.value = result || [];
    });
    return data;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    isSearchingContact.value = false;
  }
}

const fetchUserCommunities = async (token: string): Promise<any[]> => {
  try {
    const communitiesResponse = await userStore.fetchCommunities(token);
    return communitiesResponse.map((community) => {
      return {
        ...community,
        name: `${community._id} - ${community.name}`,
      };
    });
  } catch (error) {
    console.error("Error fetching communities data:", error);
    return [];
  }
};

const fetchAllPrivileges = async (
  token: string,
): Promise<UserCommunityPrivilege[]> => {
  try {
    const privilegesResponse = await fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}query/privileges/${props.contactId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!privilegesResponse.ok) {
      return [];
    }

    const privilegesData = await privilegesResponse.json();
    return privilegesData || [];
  } catch (error) {
    console.error("Error fetching communities data:", error);
    return [];
  }
};

function validateRequiredFields(data: any): string[] {
  const requiredFields = ["givenName", "surname", "email"];
  const errorMessages: string[] = [];
  requiredFields.forEach((field) => {
    if (
      (typeof data[field] === "string" && data[field].trim() === "") ||
      (Array.isArray(data[field]) && data[field].length === 0)
    ) {
      errorMessages.push(`${field} cannot be empty`);
    }
  });
  return errorMessages;
}

async function onSubmitContactUpdate(event: FormSubmitEvent<Schema>) {
  const result = safeParse(schema, state.value);
  if (result.success) {
    const customErrors = validateRequiredFields(state.value);
    if (customErrors.length > 0) {
      errors.value = customErrors;
    } else {
      await updateContact();
    }
  } else {
    errors.value = result.error.issues.map((issue) => issue.message);
  }
}

function onDeleteElement(index: number, element: string[]) {
  dialogElement.value = null;
  if (element[index] === "") {
    element.splice(index, 1);
    restartElementToDelete();
  } else {
    isValidatorOpened.value[index] = {
      index: index,
      isOpened: true,
    };
    elementToDelete.value = {
      index: index,
      element: element,
    };
  }
}

function deleteElement(index: number) {
  if (elementToDelete.value.index !== null) {
    elementToDelete.value.element.splice(elementToDelete.value.index, 1);
    isValidatorOpened.value[index] = {
      index: index,
      isOpened: false,
    };
  }
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

    isValidatorOpened.value.push({
      index: lastElementIndex,
      isOpened: false,
    });

    if (inputElement) {
      inputElement.focus();
    }
  });
}

function restartElementToDelete() {
  elementToDelete.value = {
    index: null,
    element: [],
  };
}

const checkEmptyContacts = computed(() => {
  const privileges = allCommunitiesPrivileges.value;

  if(!Array.isArray(privileges)) {
    return false;
  }
  if (allCommunitiesPrivileges.value.length == 0) {
    return false;
  }
  
  const filter = privileges.map((contact) => contact);
  return filter[0] ?? { community: "", role: "" };
});

async function updateContact() {
  errors.value = [];
  const body = {
    _id: state.value._id,
    givenName: state.value.givenName,
    surname: state.value.surname,
    email: state.value.email,
    notes: state.value.notes,
    _schema: state.value._schema,
    initial_community_id: contactObj.value?.initial_community_id,
  };

  try {
    const response = await fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Contact/${props.contactId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();
    if (data.status >= 200 && data.status < 300) {
      const privilegesObj = allCommunitiesPrivileges;
      const updatePrivileges = await fetch(
        `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}query/privileges/${props.contactId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${props.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(privilegesObj),
        },
      );

      const msg =
        "Your user changes have been saved. Redirecting to the users list...";

      await showOkMessage(msg).then(() => {
        router.push("/dashboard/users");
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
    errors.value.push(error);
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

watch(
  () => props.contactId,
  async (newVal) => {
    if (newVal) {
      const contactData = await fetchContact(newVal);
      state.value = contactData ?? { ...state.value };
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.input-wrapper {
  background-color: theme("colors.primary.50");
  padding: 0.6rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  line-height: 1;
  padding-bottom: 10px;
  display: flex;
  gap: 10px;
  justify-content: start;
  align-items: baseline;
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

.input-wrapper input:disabled {
  background-color: #e9ecef !important;
  opacity: 1;
}

.form-footer {
  display: flex;
  justify-content: end;
  gap: 10px;
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
.form-group-title {
  display: flex;
  justify-content: space-between;
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
.form-group-row {
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
.empty-elements {
  text-align: center;
  font-size: 14px;
  color: black;
  background-color: theme("colors.primary.50");
  padding: 10px 20px;
}
.delete-validator {
  .flex {
    justify-content: space-around;
    .btn-ok,
    .btn-nok {
      padding: 3px 10px;
    }
    .btn-nok {
      border: 1px solid #dee2e6;
      border-radius: 0.375rem;
    }
  }
}
</style>
