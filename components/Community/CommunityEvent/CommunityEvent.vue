<template>
    <div class="community-event">
        <div class="w-100" v-if="events && events.length>0">
            <CommunityEventSelector
                :currentEvent="currentEvent"
                :events="events"

            />
            <CommunityEventTableContent
                :event="currentEvent"
                :communityId="communityId"
            />
        </div>
        <div class="w-100" v-else>
            <CommunityEmpty />
        </div>
    </div>
</template>

<script setup lang="ts">
	import CommunityEventSelector from '@/components/Community/CommunityEvent/CommunityEventSelector.vue'
    import CommunityEventTableContent from '@/components/Community/CommunityEvent/CommunityEventTableContent.vue'
    import CommunityEmpty from '@/components/Community/CommunityEvent/CommunityEmpty.vue'

    defineProps<{
        currentEvent: Object,
        events: [],
        communityId: string
    }>();
</script>