<template>
  <div class="community-events">
    <div class="tab-body-title w-100 flex justify-content-between">
      Events
      <div v-if="eventPrivileges.create" class="">
        <NuxtLink
          :to="`/dashboard/projects_communities/${communityId}/events/add`"
          class="btn custom-btn btn-primary small"
          title="Create New Event"
        >
          Create New Event
        </NuxtLink>
      </div>
    </div>
    <div class="w-100">
      <div class="flex items-center justify-content-end gap-3 py-3">
        <div class="col-4">
          <UInput
            v-model="search"
            color="primary"
            variant="outline"
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="Search ..."
            class="input-search"
          />
        </div>
      </div>
      <UTable
        :columns="columns"
        :loading="isLoadingData"
        :rows="filteredRows"
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
            base: 'whitespace-nowrap',
            padding: 'py-3',
            font: '',
            size: 'text-sm',
          },
        }"
      >
        <template #dates-data="{ row }">
          <div>
            <div class="w-100">
              Benchmark start: {{ row.dates.benchmark_start }}
            </div>
          </div>
        </template>
        <template #bench_contact-data="{ row }">
          <span v-for="(contact, index) in getContactsArray(row.bench_contact)" :key="index">
            <a
              :href="`https://orcid.org/${getContactORCID(contact)}`"
              target="_blank"
              class="text-primaryOeb-500"
            >
              {{ contact }}
            </a>
            <br />
          </span>
        </template>
        <template #actions-data="{ row }">
          <div class="action-btn-group">
            <button class="btn-custom-badget text-sm">
              <NuxtLink
                :to="`/benchmarking/${row.community_id}?event=${row._id}`"
                title="Visit community event"
                class="text-sm"
              >
                <font-awesome-icon :icon="['far', 'eye']" />
                Visit
              </NuxtLink>
            </button>
            <div v-if="row.privileges === 'Owner' && row.actions.community">
              <button title="Edit Event" class="btn-custom-badget text-sm">
                <NuxtLink :to="getCommunityEventEditLink(row)">
                  <font-awesome-icon :icon="['fas', 'pencil']" />
                  Edit
                </NuxtLink>
              </button>
            </div>
            <div
              v-else-if="row.privileges === 'Manager' && row.actions.community"
            >
              <button title="Edit Event" class="btn-custom-badget text-sm">
                <NuxtLink :to="getCommunityEventEditLink(row)">
                  <font-awesome-icon :icon="['fas', 'pencil']" />
                  Edit
                </NuxtLink>
              </button>
            </div>
            <button class="btn-custom-badget text-sm">
              <NuxtLink
                :to="getCommunityEventEditLink(row, true)"
                title="View Event challenges"
                class="text-sm column-link"
              >
                <font-awesome-icon :icon="['far', 'calendar']" />
                Challenges
              </NuxtLink>
            </button>
          </div>
        </template>
      </UTable>
    </div>

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
        :ui="{
          wrapper: 'flex items-center',
          default: {
            activeButton: {
              base: 'bg-primary-500 dark:bg-primary-400',
              color: 'text-white',
            },
          },
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { CommunityPrivilegeActions } from "@/constants/privileges";
import type { Event } from "@/types/events";

const props = defineProps<{
  events?: Array<Event>;
  isLoadingData: boolean;
  commmunityPrivileges: CommunityPrivilegeActions;
  communityId: string;
}>();

console.log("events: " , props.events);

const columns = [
  {
    label: "Name",
    key: "name",
  },
  {
    label: "Dates",
    key: "dates",
  },
  {
    label: "Contacts",
    key: "bench_contact",
  },
  {
    key: "actions",
    label: "ACTIONS",
  },
];
const page = ref<number>(1);
const pageCount = ref<number>(10);
const search = ref<string>("");
const pageFrom = computed(
  () => (Number(page.value) - 1) * Number(pageCount.value) + 1,
);
const pageTo = computed(() =>
  Math.min(
    Number(page.value) * Number(pageCount.value),
    Number(totalPages.value),
  ),
);
const _total = ref(0);

const eventsData = computed(() => {
  if (!props.events) return [];
  return props.events.map((event) => {
    return {
      ...event,
    };
  });
});

const filteredRows = computed(() => {
  if (!props.events) return [];
  if (!search.value) {
    _total.value = props.events.length;
    return props.events.slice(
      (Number(page.value) - 1) * Number(pageCount.value),
      Number(page.value) * Number(pageCount.value),
    );
  }

  const filteredSearcher = props.events.filter((challenge: any) => {
    return Object.values(challenge).some((value) => {
      return String(value).toLowerCase().includes(search.value.toLowerCase());
    });
  });

  _total.value = filteredSearcher.length;

  return filteredSearcher.slice(
    (Number(page.value) - 1) * Number(pageCount.value),
    Number(page.value) * Number(pageCount.value),
  );
});

const eventPrivileges = computed(() => {
  return props.commmunityPrivileges.event;
});

const totalPages = computed(() => {
  return Math.ceil(Number(_total.value) / Number(pageCount.value));
});

const getCommunityEventEditLink = (row: any, isChallenge: boolean = false) => {
  if (isChallenge) {
    return `/dashboard/projects_communities/${row.community_id}/events/${row._id}?challenges=true`;
  }
  return `/dashboard/projects_communities/${row.community_id}/events/${row._id}`;
};


function getContactsArray(contacts) {
  return contacts.split(",");
}
function getContactORCID(orcid) {
  return orcid.split(":")[1];
}

</script>

<style scoped lang="scss">
.community-events {
  min-height: 225px;
}
.btn-event {
  padding: 5px;
  font-size: 16px;
  a {
    color: theme("colors.gray.400");
  }
}
.action-btn-group {
  display: flex;
  gap: 10px;
}

.column-link {
  display: block;
  min-width: 100px;
}
.btn-custom-badget a {
  width: 100%;
  height: 100%;
}
</style>
