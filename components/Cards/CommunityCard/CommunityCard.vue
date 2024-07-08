<script setup lang="ts">
import pluralize from 'pluralize';

const props = defineProps<{
    community: any;
    referenceTools: any[];
    to: string;
}>();

console.log(props.community);
</script>
<template>
    <div class="max-w-sm rounded overflow-hidden shadow-lg">
        {{ community.referenceTools }}
        <img class="w-full" :src="community.logo" 
            :alt="`community ${community.name}`"
            :title="`${community.acronym}`">
        <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">
                {{ community.acronym }}
            </div>
            <p class="text-gray-700 text-base">
                {{ community.name }}
            </p>
        </div>
        <div class="px-6 pt-4 pb-2">
            <div v-if="community.benchmarkingEvents.length > 0"
                class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                <font-awesome-icon :icon="['far', 'calendar-check']" />
				{{ community.benchmarkingEvents.length }}
				{{ pluralize('Events', community.benchmarkingEvents.length) }}
            </div>
            <div class="inline-block bg-green-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                <div class="text-xs font-normal leading-none max-w-full flex-initial">{{ community.status }}</div>
            </div>
            <div v-if="referenceTools.length > 0"
                class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                <font-awesome-icon :icon="['fas', 'gear']" />
				{{ community.benchmarkingEvents.length }}
				{{ pluralize('Events', community.benchmarkingEvents.length) }}
            </div>
        </div>
        <div class="px-6 pt-4 pb-2">
            <button class="bg-white hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <NuxtLink :to="to">
                    Current Event
                </NuxtLink>
            </button>
        </div>
    </div>
</template>