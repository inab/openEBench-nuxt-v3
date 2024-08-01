<template>
    <div class="benchmarking-community-events">
        <BreadcrumbsBar 
            :breadcrumbsArray = routeArray />
        <div class="mx-auto container">
            <div v-if="status && status.pending">
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
                <CommunityEventsList
                    :events="eventsObj"
                    :communityId="communityId"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BreadcrumbsBar from '@/components/Common/BreadcrumbsBar.vue';
import CommunityInfo from '@/components/Community/CommunityInfo.vue';
import CommunityEventsList from '@/components/Community/CommunityEventsList/CommunityEventsList.vue';
import { useCommunity } from '@/stores/community'

const route = useRoute()
const communityStore = useCommunity()
const community: Ref<any> = ref(null);
const communityId: string = route.params.community

if(communityStore.id && communityStore.id != communityId) {
    community.value = communityStore.getCommunityData
} else {
    const { data, status }: { data: any, pending: boolean } = await useAsyncData('community', 
		() => communityStore.requestCommunityData(communityId, event))
	community.value = data.value ?? null;
}
const eventsObj: [] = communityStore.getEvents
const communityReferences = communityStore.getCommunityReferences

let routeArray: Array = [
    { label: 'Benchmarking Communities', isActualRoute: false, route: '/benchmarking' },
    { label: community.value?.acronym + " " + "Events", isActualRoute: true }
]
</script>