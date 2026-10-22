<template>
	<div class="project-item">
		<BreadcrumbsBar :breadcrumbs-array="routeArray" />
		<div class="container mx-auto">
			<div v-if="pending">
				<USkeleton class="h-12 w-12 rounded-full" />
				<div class="space-y-2">
					<USkeleton class="h-4 w-[250px]" />
					<USkeleton class="h-4 w-[200px]" />
				</div>
			</div>
			<div v-else>
				<CommunityInfo :community="summaryObj" :community-references="communityReferences" />
				<div class="community-tabs md:flex">
					<UTabs :items="tabsItems" class="w-full">
						<template #default="slotProps">
							<div class="flex items-center gap-2 relative truncate">
								<span class="">{{ slotProps.item.label }}</span>
								<UBadge
									v-if="slotProps.item.label == 'Datasets' && datasetsObj.length > 0"
									color="neutral"
									variant="subtle"
									class="rounded-full"
									>{{ datasetsObj.length }}</UBadge
								>
								<UBadge
									v-if="slotProps.item.label == 'Tools' && toolsObj.length > 0"
									color="neutral"
									variant="subtle"
									class="rounded-full"
									>{{ toolsObj.length }}</UBadge
								>
								<span
									v-if="isTabSelected(slotProps)"
									class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400"
								/>
							</div>
						</template>
						<template #summary>
							<div class="p-5 custom-tab">
								<CommunityEventSummary :markdown="eventData"> </CommunityEventSummary>
							</div>
						</template>
						<template #results>
							<div class="p-5 custom-tab">
								<CommunityEvent
									:current-event="currentEvent"
									:events="eventsObj"
									:community-id="communityId"
								/>
							</div>
						</template>
						<template #datasets>
							<div class="p-5 custom-tab">
								<CommunityDataset :datasets="datasetsObj" :community-id="communityId" />
							</div>
						</template>
						<template #tools>
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
import { computed } from 'vue';
import CommunityInfo from '@/components/Community/CommunityInfo.vue';
import CommunityEvent from '@/components/Community/CommunityEvent/CommunityEvent.vue';
import CommunityDataset from '@/components/Community/CommunityDataset/CommunityDataset.vue';
import CommunityTools from '@/components/Community/CommunityTools/CommunityTools.vue';
import CommunityEventSummary from '@/components/Community/CommunityEvent/CommunityEventSummary.vue';
import BreadcrumbsBar from '@/components/Common/BreadcrumbsBar.vue';
import { useCommunity } from '~~/stores/community';

const route = useRoute();
const communityStore = useCommunity();

function isTabSelected(slot: object): boolean {
	return 'selected' in slot && slot.selected === true;
}

const communityId = route.params.id as string;

const { data: community, pending } = await useAsyncData(`project-community-${communityId}`, () =>
	communityStore.requestCommunityData(communityId)
);

const summaryObj = communityStore.getCommunityData;
const datasetsObj = communityStore.getDatasets;
const toolsObj = communityStore.getTools;
const eventsObj: any[] = communityStore.getEvents;
const communityReferences = communityStore.getCommunityReferences;
const currentEvent = computed(() => communityStore.getCurrentEvent);
const eventData = computed(() => communityStore.getCommunityData);

const tabsItems = [
	{
		label: 'Summary',
		icon: 'i-heroicons-squares-2x2-16-solid',
		slot: 'summary',
	},
	{
		label: 'Results',
		icon: 'i-heroicons-squares-2x2-16-solid',
		slot: 'results',
	},
	{
		label: 'Datasets',
		icon: 'i-heroicons-folder-open',
		slot: 'datasets',
	},
	{
		label: 'Tools',
		icon: 'i-heroicons-cube-16-solid',
		slot: 'tools',
	},
];

const routeArray = [
	{ label: 'Project Spaces', isActualRoute: false, route: '/projects' },
	{ label: (community.value as { acronym?: string } | null)?.acronym, isActualRoute: true },
];
</script>

<style scoped>
.custom-tab {
	border: 1px solid rgba(243, 244, 246);
	border-radius: 0.5rem;
}
</style>
