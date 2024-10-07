<template>
  <div class="community-events-list">
    <template v-if="!paginatedEvents || paginatedEvents.length === 0">
      <p>No events found</p>
    </template>
    <template v-else>
      <div class="community-events-list__header">
        <h3 class="mb-4">Please choose an event:</h3>
        <div class="community-events-list__header__subtitle">
          <p class="text-body-2 text--secondary d-flex align-items-center text-stone-500">
            <span class="mt-1 me-3">
              <UIcon name="i-heroicons-information-circle" scale="2" />
            </span>
            An Event corresponds to a time-bound contest where a tool, pipeline,
            service, or product, i.e., the participant, is compared against other
            participants using a predefined collection of reference datasets and
            assessment metrics.
          </p>
        </div>
      </div>
      <div class="row mt-5">
        <EventCard
          v-for="event in paginatedEvents"
          :key="event._id"
          class="col-12 col-sm-6 col-md-4 mb-4"
          :event="event"
          :community-id="communityId"
        />
      </div>
      <!-- Pagination Controls -->
      <div v-if="pageCount > 1" class="pagination-container mt-4">
        <UPagination
          :active-button="{ variant: 'outline' }"
          :inactive-button="{ color: 'gray' }"
          :model-value="currentPage"
          :total="pageCount"
          @update:model-value="changePage"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
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

const itemsPerPage = 9; // Number of items per page
const currentPage = ref(1);

const paginatedEvents = computed(() => {
  if (!props.events) return [];
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return props.events.slice(startIndex, endIndex);
});

const pageCount = computed(() => {
  if (!props.events) return 1;
  return Math.ceil(props.events.length / itemsPerPage);
});

function changePage(page: number) {
  if (page >= 1 && page <= pageCount.value) {
    currentPage.value = page;
  }
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
}
</style>
