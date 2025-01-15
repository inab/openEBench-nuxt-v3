<template>
  <div class="dashboard-contacts-list">
    <div
      v-if="filteredRows.length > 0"
      class="flex justify-content-end py-2.5 dark:border-gray-700"
    >
      <UInput
        v-model="search"
        color="white"
        variant="outline"
        icon="i-heroicons-magnifying-glass-20-solid"
        placeholder="Search ..."
        class="input-search"
      />
    </div>
    <UTable
      :columns="columns"
      :loading="isLoading"
      :rows="filteredRows"
      :sort="sort"
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
          padding: 'px-2.5 py-2.5',
          font: '',
          size: 'text-sm',
        },
      }"
    >
      <template #email-data="{ row }">
        <p v-for="(email, index) in row.email" :key="index">{{ email }}</p>
      </template>
      <template #communities-data="{ row }">
        <p v-for="(community, index) in row.community_id" :key="index">
          {{ community }}
          <NuxtLink
            :to="`/dashboard/projects_communities/${community}`"
            class="text-primaryOeb-950"
          >
            <font-awesome-icon :icon="['fas', 'external-link-alt']" />
          </NuxtLink>
        </p>
      </template>
      <template #contact_type-data="{ row }">
        <div class="d-flex">
          <span v-if="row.contact_type === 'person'" class="mr-1">
            <font-awesome-icon :icon="['fas', 'user']" />
          </span>
          <span v-else-if="row.contact_type === 'helpdesk'" class="mr-1">
            <font-awesome-icon :icon="['fas', 'person-shelter']" />
          </span>
          <span v-else class="mr-1">
            <font-awesome-icon :icon="['fas', 'users']" />
          </span>
          {{ row.contact_type }}
        </div>
      </template>
      <template #view-data="{ row }">
        <button class="btn-custom-badget text-sm" @click="openModal(row._id)">
          <font-awesome-icon :icon="['fas', 'pencil']" />
          Edit
        </button>
      </template>
    </UTable>
    <div class="flex flex-wrap justify-between items-center pt-2">
      <div>
        <span class="text-sm leading-5">
          Showing
          <span class="font-medium">{{ pageFrom }}</span>
          to
          <span class="font-medium">{{ pageTo }}</span>
          of
          <span class="font-medium">{{ _total }}</span>
          results
        </span>
      </div>
      <UPagination
        v-model="page"
        class="pagination"
        :page-count="pageCount"
        :total="props.contactsData.length"
      />
    </div>
    <CustomModal :is-open="isModalOpened" width="600" @modal-close="closeModal">
      <template #header>
        <h2>Edit contact</h2>
        <UButton
          color="bg-slate-300"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class=""
          @click="isModalOpened = false"
        />
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
                        <label for="type">
                          Type
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
                            v-model="defaultCommunity"
                            :options="communities"
                            value-attribute="_id"
                            option-attribute="name"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 typeOptions">
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
                  <div class="row">
                    <div class="col-12 typeOptions">
                      <div class="form-group">
                        <label for="notes">
                          Notes
                          <span class="text-red-400 required">*</span>
                        </label>
                        <div class="w-100">
                          <UTextarea v-model="defaultNotes" />
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
import type { Ref } from "vue";
import { computed, ref } from "vue";
import { useUser } from "@/stores/user.ts";
import type { Community } from "@/types/communities";
import type { Contact } from "@/types/contact";
import CustomModal from "@/components/Common/CustomModal.vue";

const props = defineProps<{
  contactsData: Contact[];
  isLoading: boolean;
}>();

console.log("props.contactsData: ", props.contactsData);

const { data } = useAuth();
const runtimeConfig = useRuntimeConfig();
let token: string | undefined;
if (data.value) {
  token = data.value.accessToken;
}

const isModalOpened = ref(false);
const communities = ref<Community[]>([]);
const userStore = useUser();

const defaultCommunity: Ref<string> = ref("");
const defaultNotes: Ref<string> = ref("");
const search = ref("");
const _total = ref(0);
const page = ref<number>(1);
const pageCount = ref<number>(10);

const pageFrom = computed(
  () => (Number(page.value) - 1) * Number(pageCount.value) + 1,
);
const pageTo = computed(() =>
  Math.min(
    Number(page.value) * Number(pageCount.value),
    Number(totalPages.value),
  ),
);

// const state = ref({
//   _id: "",
//   givenName: "",
//   surname: "",
//   email: "",
//   notes: "",
//   _schema:
//     "https://www.elixir-europe.org/excelerate/WP2/json-schemas/1.0/Contact",
//   contact_type: "",
//   community_id: "",
// });

// const schema = object({
//   _id: string(),
//   givenName: string(),
//   surname: string(),
//   email: string(),
//   notes: string(),
//   _schema: string(),
//   contact_type: string(),
//   community_id: string(),
// });

const columns = [
  {
    key: "fullName",
    label: "NAME",
    sortable: true,
  },
  {
    key: "contact_type",
    label: "TYPE",
    sortable: true,
  },
  {
    key: "email",
    label: "EMAIL",
    sortable: true,
  },
  {
    key: "notes",
    label: "NOTES",
    sortable: true,
  },
  {
    key: "communities",
    label: "COMMUNITIES",
    sortable: true,
  },
  {
    key: "view",
    label: "ACTIONS",
  },
];

const sort = ref({
  column: "fullName",
  direction: "asc",
});

const rows = computed(() => {
  return props.contactsData.slice(
    (page.value - 1) * pageCount.value,
    page.value * pageCount.value,
  );
});

const filteredRows = computed(() => {
  if (!search.value) {
    _total.value = props.contactsData.length;
    return props.contactsData.slice(
      (page.value - 1) * pageCount.value,
      page.value * pageCount.value,
    );
  }

  const filteredSearcher = props.contactsData.filter((metric: any) => {
    return Object.values(metric).some((value) => {
      return String(value).toLowerCase().includes(search.value.toLowerCase());
    });
  });

  _total.value = filteredSearcher.length;

  return filteredSearcher.slice(
    (Number(page.value) - 1) * Number(pageCount.value),
    Number(page.value) * Number(pageCount.value),
  );
});

const totalPages = computed(() => {
  return Math.ceil(Number(_total.value) / Number(pageCount.value));
});

const contactTypeOptions = ["person", "helpdesk", "other"];

async function openModal(id: string) {
  const contact = await fetchContactData(id);
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
    defaultCommunity.value = data.community_id ?? "";
    defaultNotes.value =
      data.notes && data.notes != "Unknown" ? data.notes : "";
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
    communities.value = communities.value.map((community) => {
      return {
        ...community,
        name: `${community._id} - ${community.name}`,
      };
    });
  } catch (error) {
    console.error("Error fetching communities data:", error);
  }
};
</script>
