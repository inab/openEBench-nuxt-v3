<template>
	<div class="benchmarking-community">
		<BreadcrumbsBar 
			:breadcrumbsArray = routeArray />
		<div class="mx-auto container">
			<div v-if="pending">
				<USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
				<div class="space-y-2">
					<USkeleton class="h-4 w-[250px]" />
					<USkeleton class="h-4 w-[200px]" />
				</div>
			</div>
			<div v-else>
				<CommunityInfo
					:community="community"
					:communityReferences="communityReferences"
				/>
				<div class="community-tabs md:flex">
					<UTabs :items="tabsItems" class="w-full"
					:ui="{ list: { tab: { active: 'text-primaryOeb-500' } } }">
						<template #default="{ item, index, selected }">
							<div class="flex items-center gap-2 relative truncate">
								<UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />
								<span class="">{{ item.label }}</span>
								<UBadge color="gray" variant="solid" :ui="{ rounded: 'rounded-full' }" v-if="item.label=='Datasets' && datasetsObj.length>0">{{ datasetsObj.length }}</UBadge>
								<UBadge color="gray" variant="solid" :ui="{ rounded: 'rounded-full' }" v-if="item.label=='Tools' && toolsObj.length>0">{{ toolsObj.length }}</UBadge>				
								<span v-if="selected" class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
							</div>
						</template>
						<template #results>
							<div class="p-4 custom-tab">
								<CommunityEvent
									:currentEvent="currentEvent"
									:events="eventsObj"
									:communityId="communityId"
								/>
							</div>
						</template>
						<template #datasets v-if="datasetsObj && datasetsObj.length>0">
							<div class="p-4 custom-tab">
								<div class="p-4">
									<CommunityDataset
										:datasets="datasetsObj"
										:communityId="communityId"
									/>
								</div>
							</div>
						</template>
						<template #tools v-if="toolsObj && toolsObj.length>0">
							<div class="p-4 custom-tab">
								<div class="p-4">
									<CommunityTools
										:tools="toolsObj"
										:communityId="communityId"
									/>
								</div>
							</div>
						</template>
						<template #summary v-if="eventData && eventData.summary">
							<div class="p-4 custom-tab">
								<div class="p-4">
									<CommunityEventSummary
										:markdown="eventData">
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
	import { ref } from 'vue'
	import CommunityInfo from '@/components/Community/CommunityInfo.vue'
	import CommunityEvent from '@/components/Community/CommunityEvent/CommunityEvent.vue'
	import CommunityDataset from '@/components/Community/CommunityDataset/CommunityDataset.vue'
	import CommunityTools from '@/components/Community/CommunityTools/CommunityTools.vue'
	import CommunityEventSummary from '@/components/Community/CommunityEvent/CommunityEventSummary.vue'
	import BreadcrumbsBar from '@/components/Common/BreadcrumbsBar.vue';
	import { useCommunity } from '@/stores/community'

    const route = useRoute()
	const communityStore = useCommunity()
	const community: Ref<any> = ref(null);
	const communityId: string = route.params.community
	const event: string = route.query.event

	if(communityStore.communityId && communityStore.communityId != communityId) {
		community.value = communityStore.getCommunityData
	} else {
		const { data, pending }: { data: any, pending: boolean } = await useAsyncData('community', 
			() => communityStore.requestCommunityData(communityId, event))
		community.value = data.value ?? null;
	}
	
	const datasetsObj = communityStore.getDatasets
	const toolsObj = communityStore.getTools
	const eventsObj: [] = communityStore.getEvents
	const communityReferences = communityStore.getCommunityReferences
	let currentEvent = computed(() => communityStore.getCurrentEvent)
	const eventData = computed(() => communityStore.getCommunityData)

	const tabsItems = [{
		label: 'Results',
		icon: 'i-heroicons-squares-2x2-16-solid',
		slot: 'results'
	}, {
		label: 'Datasets',
		icon: 'i-heroicons-folder-open',
		slot: 'datasets'
	}, {
		label: 'Tools',
		icon: 'i-heroicons-cube-16-solid',
		slot: 'tools'
	}]

	if(!datasetsObj || datasetsObj.length == 0) {
		tabsItems.splice(1)
	}
	if(!toolsObj || toolsObj.length == 0) {
		tabsItems.splice(1)
	}
	if(eventData.value && (eventData.value as { summary?: any }).summary) {
		tabsItems.push({
			label: 'Summary',
			icon: 'i-heroicons-squares-2x2-16-solid',
			slot: 'summary'
		})
	}

	let routeArray: Array = [
		{ label: 'Benchmarking Communities', isActualRoute: false, route: '/benchmarking' },
		{ label: community.value?.acronym + " " + "Events", isActualRoute: true }
	]

	if(event) {
		routeArray[1].isActualRoute = false
		routeArray[1].route = '/benchmarking/'+ communityId + '/events'
		routeArray.push({ label: currentEvent.value?.name, isActualRoute: true })
	}
</script>

<style lang="scss" scoped>
.community-tabs ul {
    margin: 0;
    padding: 0;
}
.custom-tab {
	border: 2px solid rgba(243, 244, 246);
	border-radius: 0.5rem;
}
</style>