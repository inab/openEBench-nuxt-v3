<template>
  <div class="benchmarking-community">
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
        <div class="community-tabs md:flex">
          <UTabs :items="tabsItems" class="w-full" :ui="{ list: { tab: { active: 'text-primaryOeb-500' } } }">
            <template #default="{ item, index, selected }">
              <div class="flex items-center gap-2 relative truncate">
                <span class="">{{ item.label }}</span>
                <UBadge v-if="item.label == 'Datasets' && datasetsObj.length > 0" color="gray" variant="solid"
                  :ui="{ rounded: 'rounded-full' }">{{ datasetsObj.length }}</UBadge>
                <UBadge v-if="item.label == 'Tools' && toolsObj.length > 0" color="gray" variant="solid"
                  :ui="{ rounded: 'rounded-full' }">{{ toolsObj.length }}</UBadge>
                <span v-if="selected"
                  class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
              </div>
            </template>
            <template #results>
              <div class="p-4 custom-tab">
                <CommunityEvent :current-event="currentEvent" :events="eventsObj" :community-id="communityId" />
              </div>
            </template>
            <template v-if="datasetsObj && datasetsObj.length > 0" #datasets>
              <div class="custom-tab">
                <div class="p-4">
                  <CommunityDataset :datasets="datasetsObj" :community-id="communityId" />
                </div>
              </div>
            </template>
            <template v-if="toolsObj && toolsObj.length > 0" #tools>
              <div class="custom-tab">
                <div class="p-4">
                  <CommunityTools :tools="toolsObj" :community-id="communityId" />
                </div>
              </div>
            </template>
            <template v-if="eventData && eventData.summary" #summary>
              <div class="custom-tab">
                <div class="p-4">
                  <CommunityEventSummary :markdown="eventData">
                  </CommunityEventSummary>
                </div>
              </div>
            </template>
          </UTabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CommunityInfo from "@/components/Community/CommunityInfo.vue";
import CommunityEvent from "@/components/Community/CommunityEvent/CommunityEvent.vue";
import CommunityDataset from "@/components/Community/CommunityDataset/CommunityDataset.vue";
import CommunityTools from "@/components/Community/CommunityTools/CommunityTools.vue";
import CommunityEventSummary from "@/components/Community/CommunityEvent/CommunityEventSummary.vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import { useCommunity } from "@/stores/community";

const route = useRoute();
const communityStore = useCommunity();
const isPending = ref(false);
const community: Ref<any> = ref(null);
const communityId: string = route.params.community;
const event: string = route.query.event;

if (communityStore.communityId === communityId) {
  community.value = communityStore.getCommunityData;
} else {
  const { data, pending }: { data: any; pending: Ref<boolean> } = await useAsyncData(
    "community",
    () => communityStore.requestCommunityData(communityId, event),
  );
  community.value = data.value ?? null;
  isPending.value = pending.value;
}

const datasetsObj = communityStore.getDatasets;
const toolsObj = communityStore.getTools;
const eventsObj: any[] = communityStore.getEvents;

const communityReferences = communityStore.getCommunityReferences;

const currentEvent = computed(() => {
  const selectedEvent = communityStore.getCurrentEvent;


  // If no event is selected, select the first available event.
  if (!selectedEvent && eventsObj.length > 0) {
    const firstEvent = eventsObj[0];
    communityStore.setCurrentEvent(firstEvent);
    return firstEvent;
  }
  return selectedEvent;
});

const eventData = computed(() => communityStore.getCommunityData);

const tabsItems = [
  {
    label: "Results",
    icon: "i-heroicons-squares-2x2-16-solid",
    slot: "results",
  },
  {
    label: "Datasets",
    icon: "i-heroicons-folder-open-16-solid",
    slot: "datasets",
  },
  {
    label: "Tools",
    icon: "i-heroicons-cube-16-solid",
    slot: "tools",
  },
];

if (!datasetsObj || datasetsObj.length == 0) {
  tabsItems.splice(1);
}
if (!toolsObj || toolsObj.length == 0) {
  tabsItems.splice(1);
}
if (eventData.value && (eventData.value as { summary?: any }).summary) {
  tabsItems.push({
    label: "Summary",
    icon: "i-heroicons-squares-2x2-16-solid",
    slot: "summary",
  });
}

const routeArray = computed(() => [
  {
    label: "Benchmarking Communities",
    isActualRoute: false,
    route: "/benchmarking",
  },
  {
    label: community.value?.acronym + " " + "Events",
    isActualRoute: false,
    route: "/benchmarking/" + communityId + "/events",
  },
  {
    label: currentEvent.value?.name,
    isActualRoute: true,
  },
]);



watch(
  () => route.query.event,
  async (newEventId) => {
    if (newEventId) {
      const newEvent = eventsObj.find((event) => event._id === newEventId);
      if (newEvent) {
        communityStore.setCurrentEvent(newEvent);
      } else {
        // If the event is not found in the current list, makes a request to get the event data.
        await communityStore.requestCommunityData(communityId, newEventId);
      }
    } else {
      // If no event is selected, make sure `currentEvent` is null.
      communityStore.setCurrentEvent(null);
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.community-tabs ul {
  margin: 0;
  padding: 0;
}

.custom-tab {
  border: 1px solid rgba(243, 244, 246);
  border-radius: 0.5rem;
}
</style>
