<template>
  <div class="community-event-challenges">
    <div
      v-if="commmunityPrivileges.challenge.create"
      class="w-100 flex justify-content-end gap-3 py-3"
    >
      <NuxtLink
        :to="`/dashboard/entries/${communityId}/events/${eventId}/add`"
        class="btn custom-btn btn-primary"
        title="Create New Event"
      >
        Create New Challenge
      </NuxtLink>
    </div>
    <UTable
      :columns="columns"
      :loading="isLoadingChallenges"
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
          base: '',
          padding: 'px-3 py-3',
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
      <template #actions-data="{ row }">
        <div class="action-btn-group">
          <button class="btn-custom-badget text-sm">
            <NuxtLink
              :to="`/benchmarking/${communityId}/${row._id}`"
              title="View community events"
              class="text-sm"
            >
              Live <font-awesome-icon :icon="['far', 'eye']" />
            </NuxtLink>
          </button>
          <div v-if="row.privileges === 'Owner' && row.actions.community">
            <button title="Edit community" class="btn-event text-neutral-300">
              <NuxtLink :to="getCommunityChallengeEditLink(row)">
                View <font-awesome-icon :icon="['fas', 'pencil']" />
              </NuxtLink>
            </button>
          </div>
          <div
            v-else-if="row.privileges === 'Manager' && row.actions.community"
          >
            <button title="Edit challenge" class="btn-custom-badget text-sm">
              <NuxtLink :to="getCommunityChallengeEditLink(row)">
                View <font-awesome-icon :icon="['fas', 'pencil']" />
              </NuxtLink>
            </button>
          </div>
          <div v-else-if="row.privileges === 'anyone' && row.actions.community">
            <button title="Edit challenge" class="btn-custom-badget text-sm">
              <NuxtLink :to="getCommunityChallengeEditLink(row)">
                View <font-awesome-icon :icon="['fas', 'pencil']" />
              </NuxtLink>
            </button>
          </div>
        </div>
      </template>
      <template #view-data="{ row }">
        <button class="btn-custom-badget text-sm">
          <NuxtLink
            :to="`/benchmarking/${communityId}?event=${row._id}`"
            title="View community events"
            class="text-sm"
          >
            Live
          </NuxtLink>
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
import type { Challenge } from "@/types/challenge";

const props = defineProps<{
  challenges?: Array<Challenge>;
  isLoadingChallenges: boolean;
  commmunityPrivileges: CommunityPrivilegeActions;
  eventId: string;
  communityId: string;
}>();

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
    key: "challenge_contact",
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

const challengesData = computed(() => {
  if (!props.challenges) return [];
  return props.challenges.map((challenge) => {
    return {
      ...challenge,
    };
  });
});

const filteredRows = computed(() => {
  if (!props.challenges) return [];

  if (!search.value) {
    _total.value = props.challenges.length;
    return props.challenges.slice(
      (Number(page.value) - 1) * Number(pageCount.value),
      Number(page.value) * Number(pageCount.value),
    );
  }

  const filteredSearcher = props.challenges.filter((challenge: any) => {
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

const totalPages = computed(() => {
  return Math.ceil(Number(_total.value) / Number(pageCount.value));
});

const challengePrivileges = computed(() => {
  return props.commmunityPrivileges.challenge;
});

const getCommunityChallengeEditLink = (row) => {
  return `/dashboard/entries/${props.communityId}/events/${props.eventId}/challenges/${row._id}`;
};
</script>

<style scoped lang="scss">
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
</style>
