<template>
    <div class="community-event-table">
        <div class="community-event-table__border px-3 py-3.5 relative not-prose bg-white overflow-hidden">
            <div class="flex px-1 py-3.5">
                <UInput
                    color="white"
                    variant="outline"
                    icon="i-heroicons-magnifying-glass"
                    v-model="search"
                    placeholder="Search ..."
                    class="input-search"
                />
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
                    <NuxtLink
                        class="text-primary-500 dark:text-primary-400"
                        title="Go to challenge"
                        :to="`${community}/${row._id}`">
                        {{  row.acronym }}
                    </NuxtLink>
                </template>
                <template #participant-data="{ row }">
                    <NuxtLink
                        class="text-primary-500 dark:text-primary-400"
                        title="Go to participant"
                        :to="`${community}/${row._id}/participants`"
                        >
                        Participant
                    </NuxtLink>
                </template>
            </UTable>
            <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                <UPagination v-model="page" :page-count="pageCount" :total="totalPages"
                :ui="{
                    wrapper: 'flex items-center gap-1',
                    rounded: '!rounded-full min-w-[32px] justify-center',
                    default: {
                      activeButton: {
                        variant: 'outline'
                      }
                    }
                  }" />
            </div>
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

<style scoped lang="scss">
.community-event-table {
    border: none;
    &__border {
        border-radius: 0.5rem;
        border: 1px solid theme('colors.slate.100');
    }
    .input-search {
        input {
            box-shadow: none !important;
            :focus {
                border: 1px solid theme('colors.primary.500');
            }
        }
    }
        
    table {
        a {
            color: theme('colors.primary.500');
            text-decoration: none;
            &:hover {
                color: theme('colors.primary.400');
            }
        }
    }
}
.form-checkbox:checked,
.form-checkbox:indeterminate {
    background-color: currentColor !important;
}
</style>
<style lang="scss">
.input-search input {
    box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px inset, rgb(209, 213, 219) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px !important; 
}
.input-search input:focus {
    border: 1px solid theme('colors.primary.500') !important;
    box-shadow: none !important;
}
</style>