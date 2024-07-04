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

const props = defineProps<{
    currentEvent: Object,
    events: []
}>();

let eventSelected = computed(() => props.currentEvent.name)
let eventsArray = props.events.map((item: any) => item.name)

</script>