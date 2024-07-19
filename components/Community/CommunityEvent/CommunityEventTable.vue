<template>
    <div class="community-event-table">
        <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
            <UInput v-model="search" placeholder="Search ..." />
        </div>
        <UTable
            :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
            :progress="{ color: 'primary', animation: 'carousel' }"
            :rows="rows"
            :columns="columns"
            v-model="selected"
            :ui="{
                tr: {
                    base: '',
                    selected: 'bg-cool-200 dark:bg-gray-800/50',
                    active: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer',
                },
                th: {
                    base: 'text-left rtl:text-right',
                    padding: 'px-2.5 py-2.5',
                    color: 'text-gray-900 dark:text-white',
                    font: 'font-semibold',
                    size: 'text-sm',
                  },
                  td: {
                    base: 'whitespace-nowrap',
                    padding: 'px-3 py-3',
                    color: 'text-gray-500 dark:text-gray-400',
                    font: '',
                    size: 'text-sm',
                  },
            }"
        >
            <template #name-data="{ row }">
                <span :class="[selected.find(eventsFormated => eventsFormated._id === row.id) && 'text-primary-500 dark:text-primary-400']">
                    {{ row.name }}
                </span>
            </template>
            <template #_id-data="{ row }">
                <NuxtLink :to="`${community}/${row._id}`" class="text-primary-500 dark:text-primary-400">
                    {{  row.acronym }}
                </NuxtLink>
            </template>
            <template #participant-data="{ row }">
                <NuxtLink :to="`${community}/${row._id}/participant`" class="text-primary-500 dark:text-primary-400">
                    Participant
                </NuxtLink>
            </template>
        </UTable>
        <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
            <UPagination v-model="page" :page-count="pageCount" :total="eventChallenges.length" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    eventChallenges: Object,
    communityId: string
}>()

let community = computed(() => props.communityId)
let page = ref(1)
const pageCount = 10
let search = ref('')
let selected = ref([])

const columns = [
    {
        key: "_id",
        label: "Acronym"
    },
    {
        key: "participant",
        label: "Participant"
    },
    {
        key: "name",
        label: "Name"
    }
]

const rows = computed(() => {
  return props.eventChallenges.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})
</script>