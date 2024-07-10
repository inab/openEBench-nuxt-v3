<template>
	<div class="container mx-auto">
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
				:ui="{ list: { tab: { active: 'text-primaryOeb-50' } } }">
					<template #default="{ item, index, selected }">
					<div class="flex items-center gap-2 relative truncate">
						<UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />
						<span class="">{{ item.label }}</span>
						<UBadge color="gray" variant="solid" :ui="{ rounded: 'rounded-full' }" v-if="item.label=='Datasets' && datasetsObj.length>0">{{ datasetsObj.length }}</UBadge>
						<UBadge color="gray" variant="solid" :ui="{ rounded: 'rounded-full' }" v-if="item.label=='Tools' && toolsObj.length>0">{{ toolsObj.length }}</UBadge>				
						<span v-if="selected" class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
					</div>
					</template>
					<template #results="{ item }">
						<div class="p-4 custom-tab">
							<CommunityEvent
								:currentEvent="currentEvent"
								:events="eventsObj"
								:communityId="communityId"
							/>
						</div>
					</template>
					<template #datasets="{ item }">
						<div class="p-4 custom-tab">
							<h1 class="text-h4">{{ item.label }}</h1>
						</div>
						<div class="p-4">
							<CommunityDataset
								:datasets="datasetsObj"
								:communityId="communityId"
							/>
						</div>
					</template>
					<template #tools="{ item }">
						<div class="p-4 custom-tab">
							<h1 class="text-h4">{{ item.label }}</h1>
						</div>
						<div class="p-4">
							<CommunityTools
								:tools="toolsObj"
								:communityId="communityId"
							/>
						</div>
					</template>
				</UTabs>
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
	import { useCommunity } from '@/stores/community'

    const route = useRoute()
	
	const communityStore = useCommunity()
	const community: Ref<any> = ref(null);
	const communityId: string = route.params.community
	const { data, pending }: { data: any, pending: boolean } = await useAsyncData('community', 
		() => communityStore.requestCommunityData(communityId))

	community.value = data.value ?? null;

	const datasetsObj = communityStore.getDatasets
	const toolsObj = communityStore.getTools
	const eventsObj: [] = communityStore.getEvents
	const communityReferences = communityStore.getCommunityReferences
	let currentEvent = computed(() => communityStore.getCurrentEvent)


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