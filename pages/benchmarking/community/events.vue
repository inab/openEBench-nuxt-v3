<template>
  <div class="benchmarking-community-events">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="mx-auto container">
      <div v-if="isPending">
        <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
        <div class="space-y-2">
          <USkeleton class="h-4 w-[250px]" />
          <USkeleton class="h-4 w-[200px]" />
        </div>
      </div>
      <div v-else>
        <CommunityInfo :community="community" :community-references="communityReferences" />
        <CommunityEventsList :events="eventsObj" :community-id="community_Id" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import CommunityInfo from "@/components/Community/CommunityInfo.vue";
import CommunityEventsList from "@/components/Community/CommunityEventsList/CommunityEventsList.vue";
import { useCommunity } from "@/stores/community";
import noDataAvailable from "@/layouts/noDataAvailable.vue";

interface Link {
  uri: string;
  comment: string | null;
  label: string;
}

interface Community {
  _id: string;
  name: string;
  acronym: string;
  description: string;
  status: string;
  keywords: string[];
  references: any[] | null;
  community_contact_ids: string[];
  links: Link[];
}

interface Challenge {
  _id: string;
  name: string;
  acronym: string;
  url: string;
  __typename: string;
}

const route = useRoute();
const communityStore = useCommunity();
const community: Ref<any> = ref(null);
const isPending = ref(false);
const community_Id = Array.isArray(route.params.community)
  ? route.params.community[0]
  : route.params.community;

if (communityStore.communityId && communityStore.communityId == community_Id) {
  community.value = communityStore.getCommunityData;
} else {
  const { data, pending }: { data: any, pending: Ref<boolean> } = await useAsyncData(
    "community",
    () => communityStore.requestCommunityData(community_Id, event),
  );
  community.value = data.value ?? null;
  isPending.value = pending.value;
}

const eventsObj = computed(() => communityStore.getEvents ?? []);
const communityReferences = computed(() => communityStore.getCommunityReferences ?? []);

const routeArray: Array<{ label: string; isActualRoute: boolean; route?: string }> = [
  {
    label: "Benchmarking Communities",
    isActualRoute: false,
    route: "/benchmarking",
  },
  { label: community.value?.acronym + " " + "Events", isActualRoute: true },
];
</script>