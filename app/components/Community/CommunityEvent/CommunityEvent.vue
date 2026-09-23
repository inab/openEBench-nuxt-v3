<template>
  <div class="community-event">
    <div v-if="events && events.length > 0" class="w-100">
      <CommunityEventSelector :current-event="currentEvent" :events="events" />
      <CommunityEventTableContent
        :event="currentEvent"
        :community-id="communityId"
      />
    </div>
    <div v-else class="w-100">
      <CommunityEmpty />
    </div>
  </div>
</template>

<script setup lang="ts">
import CommunityEventSelector from "@/components/Community/CommunityEvent/CommunityEventSelector.vue";
import CommunityEventTableContent from "@/components/Community/CommunityEvent/CommunityEventTableContent.vue";
import CommunityEmpty from "@/components/Community/CommunityEvent/CommunityEmpty.vue";

defineProps<{
  currentEvent: Object;
  events: Array<any>;
  communityId: string;
}>();
</script>
