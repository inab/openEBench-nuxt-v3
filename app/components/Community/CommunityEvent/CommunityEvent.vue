<template>
	<div class="community-event">
		<div v-if="events && events.length > 0" class="w-100">
			<CommunityEventSelector
				:current-event="currentEvent"
				:events="events"
				:community-id="communityId"
			/>
			<CommunityEventTableContent :event="currentEvent" :community-id="communityId" />
		</div>
		<div v-else class="w-100">
			<CommunityEmpty />
		</div>
	</div>
</template>

<script setup lang="ts">
import CommunityEventSelector from '@/components/Community/CommunityEvent/CommunityEventSelector.vue';
import CommunityEventTableContent from '@/components/Community/CommunityEvent/CommunityEventTableContent.vue';
import CommunityEmpty from '@/components/Community/CommunityEvent/CommunityEmpty.vue';
import type { EventWithChallenges } from '~~/types/pages-types';

defineProps<{
	currentEvent: EventWithChallenges;
	events: Array<EventWithChallenges>;
	communityId: string;
}>();
</script>
