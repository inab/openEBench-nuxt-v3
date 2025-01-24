<template>
  <div class="dashboard-contacts-add">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />

    <div class="w-100 container">
      <div class="text-primaryOeb-500 border-slate-200 border-b mb-3">
        <div class="flex justify-content-between gap-3">
          <h2>New Contact</h2>
        </div>
      </div>
      <div class="w-100">
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmitContactAdd"
          @error="onError"
        >
          <div class="w-100">
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
                      v-model="state.notes"
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
                    v-model="communitiesSelected"
                    class="w-full custom-select-input"
                    :options="communities"
                    multiple 
                    searchable
                    searchable-placeholder="Search a community..."
                    placeholder="Select a community"
                    option-attribute="name"
                    by="id"
                  />
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
              <UButton type="button" variant="secondary" @click="goBack">
                Cancel
              </UButton>
              <UButton class="" type="submit"> Submit </UButton>
            </div>
          </div>
        </UForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { FormSubmitEvent } from "#ui/types";
import type { Community } from "@/types/communities";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import { useUser } from "@/stores/user.ts";
import { array, object, string, safeParse } from "valibot";
import { useRouter } from "vue-router";

const userStore = useUser();
const { data } = useAuth();
const contactTypeOptions = ["person", "helpdesk", "other"];
const runtimeConfig = useRuntimeConfig();
const communities = ref<Community[]>([]);
const errors = ref<string[]>([]);
const oks = ref<string>("");
const token: string = data?.value.accessToken;
const communitiesSelected = ref([]);
const router = useRouter();

const routeArray: Array = [
  { label: "Dashboard", isActualRoute: false, route: "/dashboard" },
  {
    label: `Contacts`,
    isActualRoute: false,
    route: `/dashboard/contacts`,
  },
  { label: "New Contact", isActualRoute: true },
];

const state = ref({
  _id: "",
  givenName: "",
  surname: "",
  email: [],
  notes: "",
  _schema:
    "https://www.elixir-europe.org/excelerate/WP2/json-schemas/1.0/Contact",
  contact_type: contactTypeOptions[0],
  community_id: "",
  orcid: ""
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
  orcid: string()
});

const getErrors = computed(() => errors.value.join(", "));

const fetchUserCommunities = async (token: string): Promise<void> => {
  try {
    const communitiesResponse = await userStore.fetchCommunities(token);
    const response = communitiesResponse.map((community: Community) => {
      return {
        id: community._id,
        name: `${community._id} - ${community.name}`,
        status: community.status,
      };
    });
    response.sort((a: Community, b: Community) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    communities.value = response;
  } catch (error) {
    console.error("Error fetching communities data:", error);
  }
};
fetchUserCommunities(token);

function goBack() {
  router.push("/dashboard/contacts");
}

function valueToName(value: string): string {
  switch (value) {
    case "givenName":
      return "Name";
    case "surname":
      return "Surname";
    case "email ":
      return "Email ";
    default:
      return value;
  }
}

function validateRequiredFields(data: any): string[] {
  const requiredFields = ["givenName", "surname", "email"];
  const errorMessages: string[] = [];
  requiredFields.forEach((field) => {
    if (typeof data[field] === "string" && data[field].trim() === "") {
      errorMessages.push(`${valueToName(field)} cannot be empty`);
    }
    if (Array.isArray(data[field]) && data[field].length === 0) {
      errorMessages.push(`${valueToName(field)} cannot be empty`);
    }
  });
  return errorMessages;
}

async function onSubmitContactAdd(event: FormSubmitEvent<Schema>) {
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
</script>
<style lang="scss" scoped>
.form-footer {
  display: flex;
  justify-content: end;
  gap: 10px;
}
</style>