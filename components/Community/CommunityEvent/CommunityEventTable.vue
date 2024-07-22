<template>
    <div class="community-event-table">
        <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
            <UInput v-model="search" placeholder="Search ..." />
        </div>
        <UTable
            :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
            :rows="filteredRows"
            :columns="columns"
            v-model="selected"
            @select="select"
            :ui="{
                tr: {
                    base: '',
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
                    font: '',
                    size: 'text-sm',
                },
            }"
        >
            <template #name-data="{ row }">
                <span :class="[selected.find(eventsFormated => eventsFormated._id === row._id) && 'text-primaryOeb-500 dark:text-primary-400']">
                    {{ row.name }}
                </span>
            </template>
        
            <template #_id-data="{ row }">
                <NuxtLink :to="`${community}/${row._id}`" class="text-primary-500 dark:text-primary-400">
                    {{  row.acronym }}
                </NuxtLink>
            </template>
            <template #participant-data="{ row }">
                <NuxtLink :to="`${community}/${row._id}/participants`" class="text-primary-500 dark:text-primary-400">
                    Participant
                </NuxtLink>
            </template>
        </UTable>
        <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
            <UPagination v-model="page" :page-count="pageCount" :total="totalPages" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, watch } from 'vue'

const props = defineProps<{
    eventChallenges: Array<any>,
    communityId: string,
    filterArray: Array<any>,
}>()

const emit = defineEmits(['handleChangeChallengers'])

let community = computed(() => props.communityId)
let page = ref(1)
const pageCount = 10
let search = ref('')
let totalPages = ref(0)
let selected = ref<any[]>([])

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

const filteredRows = computed(() => {
    if (!search.value) {
        totalPages.value = props.eventChallenges.length
    return props.eventChallenges.slice((page.value - 1) * pageCount, (page.value) * pageCount)
    }

    let filteredSearcher = props.eventChallenges.filter((challenge: any) => {
        return Object.values(challenge).some((value) => {
            return String(value).toLowerCase().includes(search.value.toLowerCase())
        })
    })
    totalPages.value = filteredSearcher.length
    return filteredSearcher.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

function select (row: any) {
    const index = selected.value.findIndex((item: any) => item._id === row._id)
    if (index === -1) {
        selected.value.push(row)
    } else {
        selected.value.splice(index, 1)
    }
}

// Use watch, normal Obj bind, does not work
watch(selected, () => {
    emit('handleChangeChallengers', selected.value)
})
</script>

<style>
.form-checkbox:checked,
.form-checkbox:indeterminate {
    background-color: currentColor !important;
}
</style>