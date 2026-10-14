<template>
  <div class="community-event-selector row">
    <div class="col-12 col-md-10 ps-1">
      <div class="community-event-selector__item">
        <USelectMenu
          v-model="eventSelected"
          v-model:search-term="searchTerm"
          :items="eventItems"
          label-key="label"
          value-key="value"
          :trailing-icon="''"
          :search-input="{ placeholder: 'Search an event...' }"
          class="community-event-selector__select"
          @update:model-value="handleChangeEvent"
        >
          <template #default="{ open }">
            <span class="h-2 w-2 shrink-0 rounded-full bg-primary-500 dark:bg-primary-400" />
            <span class="community-event-selector__selected">
              {{ selectedEventName }}
            </span>
            <UIcon
              name="i-heroicons-chevron-right-20-solid"
              class="community-event-selector__arrow"
              :class="{ 'rotate-90': open }"
            />
          </template>
        </USelectMenu>
      </div>
    </div>
    <div class="col-12 col-md-2 pe-0 text-right primary-label">
      <UIcon name="i-heroicons-flag-solid" class=""></UIcon>
      {{ challengeCount }}
      {{ pluralize('Challenges', challengeCount) }}
    </div>
    <div v-if="currentEvent.url" class="col-12">
      <span>
        <a :href="currentEvent.url" target="_blank">
          <UIcon name="i-heroicons-link"></UIcon>
          {{ currentEvent.url }}
        </a>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import pluralize from 'pluralize';
import { useCommunity } from '~~/stores/community';

// PROPS
const props = defineProps<{
  currentEvent: { _id?: string; name?: string; url?: string; challenges?: any[] } | null;
  events: Array<{ _id: string; name: string; url?: string; challenges?: any[] }>;
  communityId: string;
}>();

const router = useRouter();
const communityStore = useCommunity();
const currentEvent = computed(() => props.currentEvent ?? {});
const eventItems = computed(() =>
  props.events.map((event) => ({ label: event.name, value: event._id }))
);
const eventSelected = ref(props.currentEvent?._id ?? '');
const searchTerm = ref('');
const selectedEventName = computed(
  () => props.events.find((event) => event._id === eventSelected.value)?.name ?? ''
);
const challengeCount = computed(() => currentEvent.value.challenges?.length ?? 0);

watch(
  () => props.currentEvent?._id,
  (eventId) => {
    eventSelected.value = eventId ?? '';
  },
  { immediate: true }
);

async function handleChangeEvent(eventId: string) {
  const event = props.events.find((item) => item._id === eventId);
  if (!event) return;

  communityStore.setCurrentEvent(event);
  await router.push({
    path: `/benchmarking/${props.communityId}`,
    query: { event: event._id },
    replace: true,
  });

  await communityStore.requestCommunityData(props.communityId, event._id);
}
</script>

<style scoped lang="scss">
.community-event-selector {
  width: 100%;
  padding-bottom: 40px;
  button {
    color: #0b579f !important;
  }
  a {
    text-decoration: none;
    color: #6a98c4;
    font-size: 15px;
  }
  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  :deep(.community-event-selector__select) {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.5rem;
    width: 100%;
    min-height: 46px;
    padding: 0.625rem 0;
    border: 0 !important;
    border-radius: 0;
    background-color: transparent;
    color: #0b579f !important;
    font-size: 18px;
    font-weight: 600;
    box-shadow: none !important;
  }
  &__selected {
    min-width: 0;
    text-align: left;
    white-space: nowrap;
  }
  &__arrow {
    width: 1.25rem;
    height: 1.25rem;
    flex: none;
    color: #9ca3af;
    transition: transform 150ms ease;
  }
}
.primary-label {
  color: #0b579f;
  font-size: 18px;
  font-weight: 600;
}
</style>
