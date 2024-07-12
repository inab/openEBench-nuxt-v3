<template>
    <div class="community-event-selector row">
        <div class="col-8">
            <div class="">
                <USelectMenu
                    searchable
                    searchable-placeholder="Search a event..."
                    v-model="eventSelected"
                    :options="eventsArray"
                    class="community-event-selector__select"
                    @change="handleChangeEvent"
                >
                    <template #label>
                        <span class="h-2 w-2 rounded-full bg-primary-500 dark:bg-primary-400" />
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
            {{ pluralize('Challenges', currentEvent.challenges.length) }}
        </div>
        <div class="col-12" v-if="currentEvent.url">
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
import pluralize from 'pluralize';
import { useCommunity } from '@/stores/community'

const props = defineProps<{
    events: []
}>();

const communityStore = useCommunity()

let currentEvent = computed(() => communityStore.getCurrentEvent)
let eventsArray = props.events.map((item: any) => item.name)
let eventSelected = ref(currentEvent.value.name)

function handleChangeEvent() {
    let event = props.events.find((item) => item.name == eventSelected.value)
    communityStore.setCurrentEvent(event)
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
        color: v-bind(--color-gray-500);
    }
}
.primary-label {
    color: #0b579f;
    font-size: 18px;
    font-weight: 600;
}
</style>