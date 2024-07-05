<template>
    <div class="row">
        <div class="col-8">
            <h1>
                Event - {{ currentEvent.name }}
            </h1>
            <span>
                <a :href="currentEvent.url" target="_blank">
                    <UIcon name="i-heroicons-link"></UIcon>
                    {{ currentEvent.url }}
                </a>
            </span>
            <div class="">
                <USelectMenu
                    searchable
                    searchable-placeholder="Search a event..."
                    v-model="eventSelected"
                    :options="eventsArray"
                    @change="handleChangeEvent"
                />
            </div>
        </div>
        <div class="col-4">
            <UIcon name="i-heroicons-flag-solid"></UIcon>
            {{ currentEvent.challenges.length }}
            {{ pluralize('Challenges', currentEvent.challenges.length) }}
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
console.log("eventSelected; " , eventSelected)

function handleChangeEvent() {
    let event = props.events.find((item) => item.name == eventSelected.value)
    communityStore.setCurrentEvent(event)
}

</script>