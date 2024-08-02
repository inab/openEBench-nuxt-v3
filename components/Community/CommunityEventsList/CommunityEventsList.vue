<template>
  <div class="community-events-list">
    <template v-if="!events || events.length == 0">
      <p>No events found</p>
    </template>
    <template v-else>
      <div class="community-events-list__header">
        <h2>Please choose an event:</h2>
        <div class="community-events-list__header__subtitle">
          <p
            class="text-body-2 text--secondary d-flex align-center text-stone-500"
          >
            <span>
              <UIcon name="i-heroicons-information-circle" scale="2"></UIcon>
            </span>
            An Event corresponds to a time-bound contest where a tool, pipeline,
            service or product, i.e. the participant, is compared against other
            participants using a predefined collection of reference datasets and
            assessment metrics.
          </p>
        </div>
      </div>
      <div class="row">
        <EventCard
          v-for="event in props.events"
          :key="event._id"
          class="col-4"
          :event="event"
          :community-id="communityId"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import EventCard from "@/components/Cards/EventCard/EventCard.vue";

const props = defineProps<{
  events?: Object[];
  communityId: string;
}>();
</script>
