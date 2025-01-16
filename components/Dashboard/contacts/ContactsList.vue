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
        <button class="btn-custom-badget text-sm" @click="viewContact(row._id)">
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
    <ContactModal
      :is-modal-open="isModalOpen"
      :contact-id="contactIdOpen"
      :token="token"
      @close-modal="closeModal"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import type { Community } from "@/types/communities";
import type { Contact } from "@/types/contact";
import ContactModal from "@/components/Dashboard/contacts/ContactModal.vue";

const props = defineProps<{
  contactsData: Contact[];
  isLoading: boolean;
  token: string;
}>();

const { data } = useAuth();
const runtimeConfig = useRuntimeConfig();
let token: string | undefined;
if (data.value) {
  token = data.value.accessToken;
}
const isModalOpen = ref(false);
const isSearchingContact = ref(false);
const search = ref("");
const _total = ref(0);
const page = ref<number>(1);
const pageCount = ref<number>(10);
const contactIdOpen = ref("");

const pageFrom = computed(
  () => (Number(page.value) - 1) * Number(pageCount.value) + 1,
);
const pageTo = computed(() =>
  Math.min(
    Number(page.value) * Number(pageCount.value),
    Number(_total.value),
  ),
);

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


function viewContact(contact: Contact) {
  openModal(contact);
}

const closeModal = () => {
  isModalOpen.value = false;
  isSearchingContact.value = true;
  contactIdOpen.value = "";
};


const openModal = async (row: Contact) => {
  isModalOpen.value = true;
  contactIdOpen.value = row;
  console.log(row)
  console.log(contactIdOpen.value);
};

</script>
