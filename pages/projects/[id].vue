<template>
  <div class="project-item">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="container mx-auto">
      <div v-if="pending">
        <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
        <div class="space-y-2">
          <USkeleton class="h-4 w-[250px]" />
          <USkeleton class="h-4 w-[200px]" />
        </div>
      </div>
      <div v-else>
        <CommunityInfo :community="summaryObj" :community-references="communityReferences" />
        <div class="community-tabs md:flex ">
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
            <template #summary="{ item }">
              <div class="p-5 custom-tab">
                <CommunityEventSummary :markdown="eventData">
                </CommunityEventSummary>
              </div>
            </template>
            <template #results="{ item }">
              <div class="p-5 custom-tab">
                <CommunityEvent :current-event="currentEvent" :events="eventsObj" :community-id="communityId" />
              </div>
            </template>
            <template #datasets="{ item }">
              <div class="p-5 custom-tab">
                <CommunityDataset :datasets="datasetsObj" :community-id="communityId" />
              </div>
            </template>
            <template #tools="{ item }">
              <div class="p-5 custom-tab">
                <CommunityTools :tools="toolsObj" :community-id="communityId" />
              </div>
            </template>
          </UTabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import CommunityInfo from "@/components/Community/CommunityInfo.vue";
import CommunityEvent from "@/components/Community/CommunityEvent/CommunityEvent.vue";
import CommunityDataset from "@/components/Community/CommunityDataset/CommunityDataset.vue";
import CommunityTools from "@/components/Community/CommunityTools/CommunityTools.vue";
import CommunityEventSummary from "@/components/Community/CommunityEvent/CommunityEventSummary.vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import { useCommunity } from "@/stores/community";

const route = useRoute();
const communityStore = useCommunity();
const community: Ref<any> = ref(null);
const communityId: string = route.params.id;
const { data, pending }: { data: any; pending: boolean } = await useAsyncData(
  "community",
  () => communityStore.requestCommunityData(communityId),
);

community.value = data.value ?? null;

const summaryObj = communityStore.getCommunityData;
const datasetsObj = communityStore.getDatasets;
const toolsObj = communityStore.getTools;
const eventsObj: [] = communityStore.getEvents;
const communityReferences = communityStore.getCommunityReferences;
const currentEvent = computed(() => communityStore.getCurrentEvent);
const eventData = computed(() => communityStore.getCommunityData);

const tabsItems = [
  {
    label: "Summary",
    icon: "i-heroicons-squares-2x2-16-solid",
    slot: "summary",
  },
  {
    label: "Results",
    icon: "i-heroicons-squares-2x2-16-solid",
    slot: "results",
  },
  {
    label: "Datasets",
    icon: "i-heroicons-folder-open",
    slot: "datasets",
  },
  {
    label: "Tools",
    icon: "i-heroicons-cube-16-solid",
    slot: "tools",
  },
];

const routeArray: Array = [
  { label: "Project Spaces", isActualRoute: false, route: "/projects" },
  { label: community.value?.acronym, isActualRoute: true },
];
</script>

<style scoped>
.custom-tab {
  border: 1px solid rgba(243, 244, 246);
  border-radius: 0.5rem;
}
</style>
