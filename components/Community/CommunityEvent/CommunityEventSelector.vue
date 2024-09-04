<template>
  <div class="community-event-selector row">
    <div class="col-8">
      <div class="community-event-selector__item">
        <USelectMenu
          v-model="eventSelected"
          searchable
          searchable-placeholder="Search a event..."
          :options="eventsArray"
          class="community-event-selector__select"
          @change="handleChangeEvent"
        >
          <template #label>
            <span
              class="h-2 w-2 rounded-full bg-primary-500 dark:bg-primary-400"
            />
            <span class="primary-label truncate">{{ currentEvent.name }}</span>
          </template>
          <template #option="{ option: event }">
            <span class="truncate">{{ event }}</span>
          </template>
        </USelectMenu>
      </div>
    </div>
    <div class="col-4 text-right primary-label">
      <UIcon name="i-heroicons-flag-solid" class=""></UIcon>
      {{ currentEvent.challenges.length }}
      {{ pluralize("Challenges", currentEvent.challenges.length) }}
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
import { computed, ref } from "vue";
import pluralize from "pluralize";
import { useCommunity } from "@/stores/community";

// PROPS
const props = defineProps<{
  currentEvent: { url?: string; challenges?: any[] } | null;
  events: Array<any>;
  communityId: string;
}>();

const route = useRoute();
const router = useRouter();
const communityStore = useCommunity();
const currentEvent = computed(() => communityStore.getCurrentEvent || {});
const eventsArray = props.events.map((item: any) => item.name);
const eventSelected = ref(currentEvent.value ? currentEvent.value.name : null);

async function handleChangeEvent() {
  const event = props.events.find(
    (item: any) => item.name == eventSelected.value,
  );
  communityStore.setCurrentEvent(event);
  if (event) {
    await router.push({
      path: `/benchmarking/${route.params.community}`,
      query: { event: event._id },
      replace: true,
    });

    // Updates the data of the selected event.
    await communityStore.requestCommunityData(
      route.params.community,
      event._id,
    );
  }
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
  }
  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    button {
      box-shadow: none !important;
    }
  }
}
.primary-label {
  color: #0b579f;
  font-size: 16px;
  font-weight: 600;
}
</style>
<style>
.community-event-selector__item button {
  box-shadow: none !important;
}
</style>
