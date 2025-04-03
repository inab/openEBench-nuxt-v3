<template>
  <div class="dashboard-contacts-list">
    <div
      v-if="filteredRows.length > 0"
      class="flex justify-content-end py-2.5 dark:border-gray-700"
    >
      <div class="pr-3">
        <USelectMenu
          v-model="communitiesSelected"
          placeholder="Select a community"
          :options="globalCommunities"
          by="id"
          multiple
          searchable
          show-create-option-when="always"
          option-attribute="name"
          class="input-search"
          @change="handleCommunityFilter"
        >
          <template #option="{ option }">
            <div
              class="inline-block rounded-full custom-badget font-semibold"
              :class="`status-${option.status} no-hover`"
              :title="`${'Status'} ${option.status}`"
            >
              <div
                class="text-xs font-normal leading-none max-w-full flex-initial font-semibold p-1"
                :title="`${'Status'} ${option.status}`"
              >
                <span v-if="option.status === 'active'"
                  ><font-awesome-icon :icon="['fas', 'check']"
                /></span>
                <span v-else-if="option.status === 'archived'"
                  ><font-awesome-icon :icon="['fas', 'box-archive']"
                /></span>
                <span v-else-if="option.status === 'incubating'"
                  ><font-awesome-icon :icon="['fas', 'stopwatch']"
                /></span>
                <span v-else-if="option.status === 'abandoned'"
                  ><font-awesome-icon :icon="['fas', 'ban']"
                /></span>
                <span v-else-if="option.status === 'unknown'"
                  ><font-awesome-icon :icon="['far', 'circle-question']"
                /></span>
              </div>
            </div>
            <span>{{ option.name }}</span>
          </template>
        </USelectMenu>
      </div>
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
        <div v-for="(email, index) in row.email" :key="index" class="d-flex">
          {{ email }}
        </div>
      </template>
      <template #communities-data="{ row }">
        <div
          v-for="(community, index) in row.community_id"
          :key="index"
          :class="`${getCommunityColor(community)} no-hover community-row-badget`"
        >
          {{ parseCommunity(community)?.name }}
          <NuxtLink
            :to="`/dashboard/projects_communities/${community}`"
            class="text-primaryOeb-950 pr-1"
          >
            <font-awesome-icon :icon="['fas', 'external-link-alt']" />
          </NuxtLink>
        </div>
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
        :total="_total"
      />
    </div>
    <ContactModal
      :is-modal-open="isModalOpen"
      modal-title="Contact View"
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
import { useUser } from "@/stores/user.ts";
import ContactModal from "@/components/Dashboard/contacts/ContactModal.vue";

const props = defineProps<{
  contactsData: Contact[];
  isLoading: boolean;
  token: string;
}>();

const runtimeConfig = useRuntimeConfig();
const isModalOpen = ref(false);
const isSearchingContact = ref(false);
const search = ref("");
const _total = ref(0);
const page = ref<number>(1);
const pageCount = ref<number>(10);
const contactIdOpen = ref("");
const userStore = useUser();
const communitiesSelected = ref<Community[]>([]);

const pageFrom = computed(
  () => (Number(page.value) - 1) * Number(pageCount.value) + 1,
);

const pageTo = computed(() =>
  Math.min(Number(page.value) * Number(pageCount.value), Number(_total.value)),
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

const filteredRows = computed(() => {
  const communities = Array.isArray(communitiesSelected.value)
    ? communitiesSelected.value
    : [communitiesSelected.value];

  if (!search.value && communities.length === 0) {
    _total.value = props.contactsData.length;
    return props.contactsData.slice(
      (page.value - 1) * pageCount.value,
      page.value * pageCount.value,
    );
  }
  
  const filteredSearcher = props.contactsData.filter((contact: Contact) => {
    const matchesSearch =
      !search.value ||
      Object.values(contact).some((value) =>
        String(value).toLowerCase().includes(search.value.toLowerCase()),
      );

    const matchesCommunity =
      communities.length === 0 ||
      communities.some((community) =>
        Array.isArray(contact.community_id)
          ? contact.community_id.includes(community.id)
          : false,
      );

    return matchesSearch && matchesCommunity;
  });

  _total.value = filteredSearcher.length;

  filteredSearcher.sort((a: Contact, b: Contact) => {
    const aIds = Array.isArray(a.community_id) ? a.community_id.sort() : [];
    const bIds = Array.isArray(b.community_id) ? b.community_id.sort() : [];

    const aMin = aIds.length > 0 ? aIds[0] : "";
    const bMin = bIds.length > 0 ? bIds[0] : "";

    if (aMin < bMin) return -1;
    if (aMin > bMin) return 1;
    return 0;
  });

  return filteredSearcher.slice(
    (Number(page.value) - 1) * Number(pageCount.value),
    Number(page.value) * Number(pageCount.value),
  );
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
};

const fetchUserCommunities = async () => {
  try {
    const communitiesResponse = await userStore.fetchCommunities(props.token);
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
    return response;
  } catch (error) {
    console.error("Error fetching communities data:", error);
    return [];
  }
};

const parseCommunity = (communityRow: Community): Community | undefined => {
  return globalCommunities.value.find((community) => {
    return community.id === communityRow;
  });
};

const globalCommunities = ref<Community[]>([]);

fetchUserCommunities().then((communities) => {
  globalCommunities.value = communities;
});

function handleCommunityFilter() {
  if (communitiesSelected.value.length > 0) {
    sort.value.column = "communities";
  } else {
    sort.value.column = "fullName";
  }

  return globalCommunities.value.filter((community) => {
    return community.id === communitiesSelected.value.id;
  });
}

function getCommunityColor(communityId: string) {
  const row = globalCommunities.value.find((community) => {
    return community.id === communityId;
  });
  return `${"status-" + row?.status}`;
}
</script>

<style lang="css" scoped>
.input-search div button {
  min-width: 180px !important;
}
.community-row-badget {
  width: auto;
  padding: 0.25rem 0.5rem;
  border-radius: 25px;
  text-align: center;
}
</style>
