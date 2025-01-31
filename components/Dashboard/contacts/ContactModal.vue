<template>
  <CustomModal :is-open="isModalOpen" width="600" @modal-close="closeModal">
    <template #header>
      <div class="modal-title">Edit contact</div>
      <button class="modal-close" aria-label="Close modal" @click="closeModal">
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
          @error="onError"
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
                  <label for="type"> Type </label>
                  <div class="w-100">
                    <USelect
                      v-model="state.contact_type"
                      :options="contactTypeOptions"
                      class="custom-select-input"
                    />
                  </div>
                </div>
                <div class="col-6">
                  <label for="id"> ORCID </label>
                  <div class="w-100">
                    <input
                      id="surname"
                      v-model="state.orcid"
                      type="text"
                      class="form-control custom-entry-input"
                      placeholder="ORCID"
                    />
                  </div>
                </div>
              </div>
              <div class="form-card__row__box row pb-3">
                <div class="col-12">
                  <div class="form-group">
                    <label for="email">
                      Email
                      <span class="text-red-400 required">*</span>
                    </label>
                    <div class="w-100">
                      <input
                        id="email"
                        v-model="state.email[0]"
                        type="text"
                        class="form-control custom-entry-input"
                        placeholder="Contact Email"
                      />
                    </div>
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
                  <label for="id"> Community </label>
                  <div class="w-100">
                    <USelectMenu
                      v-model="contactObj.community_id"
                      class="w-full custom-select-input"
                      :options="communities"
                      searchable
                      searchable-placeholder="Search a community..."
                      value-attribute="_id"
                      option-attribute="name"
                    />
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
              <UButton type="button" @click="closeModal"> Cancel </UButton>
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
</template>

<script setup lang="ts">
import { ref, watch, computed, defineEmits } from "vue";
import type { FormErrorEvent, FormSubmitEvent } from "#ui/types";
import CustomModal from "@/components/Common/CustomModal.vue";
import { useUser } from "@/stores/user.ts";
import type { Community } from "@/types/communities";
import type { Contact } from "@/types/contact";
import { array, object, string, safeParse } from "valibot";

const props = defineProps<{
  isModalOpen: boolean;
  modalTitle: string;
  contactId: string;
  isContactEditable: boolean;
  token: string;
}>();

const emits = defineEmits(["close-modal"]);
const userStore = useUser();
const contactTypeOptions = ["person", "helpdesk", "other"];
const runtimeConfig = useRuntimeConfig();
const contactObj = ref<Contact | null>(null);
const communities = ref<Community[]>([]);
const isSearchingContact = ref(true);
const errors = ref<string[]>([]);
const oks = ref<string>("");

const state = ref({
  _id: "",
  givenName: "",
  surname: "",
  email: [],
  notes: "",
  _schema:
    "https://www.elixir-europe.org/excelerate/WP2/json-schemas/1.0/Contact",
  contact_type: "",
  community_id: "",
});

const schema = object({
  _id: string(),
  givenName: string(),
  surname: string(),
  email: array(string()),
  notes: string(),
  _schema: string(),
  contact_type: string(),
  community_id: string(),
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

    communities.value = await fetchUserCommunities(props.token);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    isSearchingContact.value = false;
  }
}

const fetchUserCommunities = async (token: string): Promise<void> => {
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
  }
};

async function onError(event: FormErrorEvent) {
  // console.log("state: ", state.value);
  // console.log("event: ", event);
}

function validateRequiredFields(data: any): string[] {
  const requiredFields = ["givenName", "surname	", "email"];
  const errorMessages: string[] = [];

  requiredFields.forEach((field) => {
    if (typeof data[field] === "string" && data[field].trim() === "") {
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
      errors.value = [
        "API Error: The new metric could not be added to the challenge.",
      ];
    }
  } else {
    errors.value = result.error.issues.map((issue) => issue.message);
  }
}

watch(
  () => props.contactId,
  async (newVal) => {
    if (newVal) {
      contactObj.value = await fetchContact(newVal);
      state.value = contactObj.value;
    }
  },
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
</style>
