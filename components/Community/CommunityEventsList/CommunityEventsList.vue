<template>
  <div class="community-events-list">
    <template v-if="!events || events.length == 0">
      <p>No events found</p>
    </template>
    <template v-else>
      <div class="community-events-list__header">
        <h3 class="mb-4">Please choose an event:</h3>
        <div class="community-events-list__header__subtitle">
          <p
            class="text-body-2 text--secondary d-flex align-items-center text-stone-500"
          >
            <span class="mt-1 me-3">
              <UIcon name="i-heroicons-information-circle" scale="2"></UIcon>
            </span>
            An Event corresponds to a time-bound contest where a tool, pipeline,
            service, or product, i.e. the participant, is compared against other
            participants using a predefined collection of reference datasets and
            assessment metrics.
          </p>
        </div>
      </div>
      <div class="row mt-5">
        <EventCard
          v-for="event in props.events"
          :key="event._id"
          class="col-12 col-sm-6 col-md-4 mb-4"
          :event="event"
          :community-id="communityId"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import EventCard from "@/components/Cards/EventCard/EventCard.vue";

interface Challenge {
  _id: string;
  name: string;
  acronym: string;
  url: string;
  __typename: string;
}

interface Dates {
  creation: string;
  __typename: string;
}

interface Event {
  _id: string;
  dates: Dates;
  name: string;
  url: string;
  challenges: Challenge[];
  __typename: string;
}

const props = defineProps<{
  events?: Event[];
  communityId: string;
}>();
</script>
