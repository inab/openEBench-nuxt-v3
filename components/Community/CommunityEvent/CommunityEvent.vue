<template>
    <div>
        <CommunityEventSelector
            :currentEvent="currentEvent"
            :events="events"
        />
        <CommunityEventTable
            :event="currentEvent"
        />
    </div>
</template>

<script setup lang="ts">
	import CommunityEventSelector from '@/components/Community/CommunityEvent/CommunityEventSelector.vue'
    import CommunityEventTable from '@/components/Community/CommunityEvent/CommunityEventTable.vue'

    const props = defineProps<{
        currentEvent: Object,
        events: []
    }>();
</script>