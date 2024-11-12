<template>
  <div class="dashboard-contacts-list">
    <UTable
      :columns="columns"
      :rows="rows"
      :ui="{
        tr: {
          base: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer',
        },
        th: {
          base: 'text-left rtl:text-right',
          padding: 'px-2.5 py-2.5',
          color: 'text-gray-900 dark:text-white',
          font: 'font-semibold',
          size: 'text-sm',
        },
        td: {
          base: '',
          padding: 'px-3 py-3',
          font: '',
          size: 'text-sm',
        },
      }"
    >
      <template #view-data="{ row }">
        <button class="btn-custom-badget text-sm" @click="openModal(row._id)">
          <font-awesome-icon :icon="['far', 'calendar-check']" />
          View <font-awesome-icon :icon="['fas', 'pencil']" />
        </button>
      </template>
    </UTable>
    <div
      class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
    >
      <UPagination
        v-model="page"
        :page-count="pageCount"
        :total="props.contactsData.length"
      />
    </div>
    <CustomModal :is-open="isModalOpened" width="600" @modal-close="closeModal">
      <template #header>
        <h2>Edit contact</h2>
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
            <div class="w-100 form-card">
              <div class="form-card__row">
                <div class="form-card__row__box w-100">
                  <div class="row">
                    <div class="col-6 typeOptions">
                      <div class="form-group">
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
                    </div>
                    <div class="col-6 typeOptions">
                      <div class="form-group">
                        <label for="id">
                          Surname
                          <span class="text-red-400 required">*</span>
                        </label>
                        <div class="w-100">
                          <input
                            id="id"
                            v-model="state.surname"
                            type="text"
                            class="form-control custom-entry-input"
                            placeholder="Contact Surname"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-6 typeOptions">
                      <div class="form-group">
                        <label for="id">
                          Email
                          <span class="text-red-400 required">*</span>
                        </label>
                        <div class="w-100">
                          <USelect
                            v-model="state.contact_type"
                            :options="contactTypeOptions"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-6 typeOptions">
                      <div class="form-group">
                        <label for="id">
                          Community
                          <span class="text-red-400 required">*</span>
                        </label>
                        <div class="w-100">
                          <USelect
                            v-model="state.community_id"
                            :options="communities"
                            option-attribute="_id"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UForm>
        </div>
      </template>
      <template #footer>
        <button class="btn btn-primary">Save</button>
      </template>
    </CustomModal>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import CustomModal from "@/components/Common/CustomModal.vue";
import { useUser } from "@/stores/user.ts";
import type { Community } from "@/types/communities";

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

const props = defineProps<{
  contactsData: {
    _id: string;
    givenName: string;
    surname: string;
    email: string;
    notes: string;
    _schema: string;
    contact_type: string;
    community_id: string;
  }[];
}>();

const { data } = useAuth();
const runtimeConfig = useRuntimeConfig();
let token: string | undefined;
if (data.value) {
  token = data.value.accessToken;
}

const page = ref(1);
const pageCount = 15;
const isModalOpened = ref(false);
const communities = ref<Community[]>([]);
const userStore = useUser();

const state = ref({
  _id: "",
  givenName: "",
  surname: "",
  email: "",
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
  email: string(),
  notes: string(),
  _schema: string(),
  contact_type: string(),
  community_id: string(),
});

const columns = [
  {
    key: "givenName",
    label: "Name",
  },
  {
    key: "surname",
    label: "Surname",
  },
  {
    key: "contact_type",
    label: "type",
  },
  {
    key: "view",
    label: "View",
  },
];

const rows = computed(() => {
  return props.contactsData.slice(
    (page.value - 1) * pageCount,
    page.value * pageCount,
  );
});

const contactTypeOptions = ["person", "helpdesk", "other"];

async function openModal(id: string) {
  const contact = await fetchContactData(id);
  console.log("contact: ", contact);

  if (contact) {
    state.value = { ...contact };
    isModalOpened.value = true;
  }
}

async function onError(event: FormErrorEvent) {
  // console.log("state: ", state.value);
  // console.log("event: ", event);
}

async function SubmitContactUpdate(event: FormSubmitEvent<Schema>) {
  const result = safeParse(schema, state.value);
}

const fetchContactData = async (id: string): Promise<void> => {
  try {
    const response = await fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Contact/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        method: "GET",
      },
    );
    const data = await response.json();
    isModalOpened.value = true;
    if (token) {
      await fetchUserCommunities(token);
    } else {
      console.error("Token is undefined");
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};

const fetchUserCommunities = async (token: string): Promise<void> => {
  try {
    communities.value = await userStore.fetchCommunities(token);
    state.value.community_id = communities.value[0]._id.toString();
    console.log(state.value.community_id);
  } catch (error) {
    console.error("Error fetching communities data:", error);
  }
};
</script>
