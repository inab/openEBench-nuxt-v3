<template>
    <div>
        <CommunityEventSelector
            :currentEvent="currentEvent"
            :events="events"

        />
        <CommunityEventTableContent
            :event="currentEvent"
            :communityId="communityId"
        />
    </div>
</template>

<script setup lang="ts">
	import CommunityEventSelector from '@/components/Community/CommunityEvent/CommunityEventSelector.vue'
    import CommunityEventTableContent from '~/components/Community/CommunityEvent/CommunityEventTableContent.vue'

    const props = defineProps<{
        currentEvent: Object,
        events: [],
        communityId: string
    }>();
</script>