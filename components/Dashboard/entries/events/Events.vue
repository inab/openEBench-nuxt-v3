<template>
  <div class="user-comminity-events">
    <div class="user-community-events__body">
      <div class="user-community-events__body__table">
        <div class="flex items-center justify-end gap-3 py-3">
          <UInput
            v-model="search"
            color="primary"
            variant="outline"
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="Search ..."
            class="input-search"
          />
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
              padding: 'px-3 py-3',
              font: '',
              size: 'text-sm',
            },
          }"
        >
          <template #actions-data="{ row }">
            {{ row }}

            <div v-if="row.actions">
              <div v-if="row.privileges === 'Owner' && row.actions.event">
                <template v-if="row.actions.event.read">
                  <button title="View community" class="btn-event">
                    <NuxtLink :to="`/dashboard/community/${row._id}?view`">
                      <font-awesome-icon :icon="['fas', 'eye']" />
                    </NuxtLink>
                  </button>
                </template>
                <template v-if="row.actions.event.update">
                  <button title="Edit community" class="btn-event">
                    <NuxtLink :to="`/dashboard/community/${row._id}`">
                      <font-awesome-icon :icon="['fas', 'pencil']" />
                    </NuxtLink>
                  </button>
                </template>
              </div>
              <div
                v-else-if="row.privileges === 'Manager' && row.actions.event"
              >
                <template v-if="row.actions.event.read">
                  <button title="View Entry" class="btn-event">
                    <NuxtLink :to="`/dashboard/projects_communities/${row._id}?view`">
                      <font-awesome-icon :icon="['fas', 'eye']" />
                    </NuxtLink>
                  </button>
                </template>
                <template v-if="row.actions.event.create">
                  <button title="Create Entry" class="btn-event">
                    <NuxtLink :to="`/dashboard/projects_communities/${row._id}`">
                      <font-awesome-icon :icon="['fas', 'plus']" />
                    </NuxtLink>
                  </button>
                </template>
                <template v-if="row.actions.event.update">
                  <button title="Edit Entry" class="btn-event">
                    <NuxtLink :to="`/dashboard/projects_communities/${row._id}/edit`">
                      <font-awesome-icon :icon="['fas', 'pencil']" />
                    </NuxtLink>
                  </button>
                </template>
              </div>
              <div v-else-if="row.privileges === 'anyone' && row.actions.event">
                <template v-if="row.actions.event.read">
                  <button title="View community" class="btn-event">
                    <NuxtLink :to="`/dashboard/community/${row._id}/edit`">
                      <font-awesome-icon :icon="['fas', 'eye']" />
                    </NuxtLink>
                  </button>
                </template>
              </div>
            </div>
          </template>
          <template #challenges-data="{ row }">
            <NuxtLink
              :to="`/dashboard/community/${row.community_id}/events/${row._id}/challenges`"
              title="View community events challenges"
              class="user-communities__events"
            >
              <font-awesome-icon :icon="['fas', 'circle-arrow-right']" />
            </NuxtLink>
          </template>
        </UTable>
        <div
          v-if="filteredRows.length > 0"
          class="flex flex-wrap justify-between items-center pt-2"
        >
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useUser } from "@/stores/user.ts";
import { EventColumnsDashboard } from "@/types/Event";

defineProps<{
  isLoadingData: any;
}>();

const userStore = useUser();
const communitiesEventsData = computed(
  () => userStore.getUserCommunitiesEvents,
);
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
const search = ref<string>("");

const columns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "bench_contact",
    label: "MANAGERS",
  },
  {
    key: "actions",
    label: "ACTIONS",
  },
  {
    key: "challenges",
    label: "CHALLENGES",
  },
];

const _total = ref(0);
const filteredRows = computed(() => {
  if (
    communitiesEventsData.value.length === 0 ||
    !communitiesEventsData.value.communityEvents ||
    communitiesEventsData.value.communityEvents.length === 0
  ) {
    return [];
  }
  if (!search.value || search.value === "") {
    _total.value = communitiesEventsData.value.communityEvents.length;
    return communitiesEventsData.value.communityEvents.slice(
      (Number(page.value) - 1) * Number(pageCount.value),
      Number(page.value) * Number(pageCount.value),
    );
  }

  const filteredSearcher = communitiesEventsData.value.communityEvents.filter(
    (communityEvent: any) => {
      return Object.values(communityEvent).some((ch) => {
        return String(ch).toLowerCase().includes(search.value.toLowerCase());
      });
    },
  );

  _total.value = filteredSearcher.length;

  return filteredSearcher.slice(
    (Number(page.value) - 1) * Number(pageCount.value),
    Number(page.value) * Number(pageCount.value),
  );
});

const totalPages = computed(() => {
  return Math.ceil(Number(_total.value) / Number(pageCount.value));
});
</script>
