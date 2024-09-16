<template>
    <div class="user-communities">
        <div class="user-communities__body">
            <div class="user-communities__body__table">
                <div class="flex items-center justify-between gap-3 py-3">
                    <div class="col-5">
                        <multiselect 
                            v-model="selectedStatus" 
                            :options="todoStatus" 
                            :multiple="true" 
                            :close-on-select="true" 
                            :clear-on-select="true"
                            :preserve-search="false" 
                            placeholder="Select status" 
                            :preselect-first="false"
                            :searchable="false"
                            label="label" 
                            track-by="label">
                        </multiselect>
                    </div>
                    <UInput
                        v-model="search"
                        color="primary"
                        variant="outline"
                        icon="i-heroicons-magnifying-glass-20-solid"
                        placeholder="Search ..."
                        class="input-search"
                    />
                </div>
                <UTable
                    :columns="columns"
                    :loading="isLoadingData"
                    :rows="filteredRows"
                    :ui="{
                        tr: {
                            base: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer',
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
                    }">
                    <template #logos-data="{ row }">
                        <div class="user-communities__body__table__logo">
                            <img :src="row.logo" alt="Community logo" class="" />
                        </div>
                    </template>
                
                    <template #community_name-data="{ row }">
                        <NuxtLink 
                        :to="row.to"
                        class="text-primaryOeb-500"
                        title="Go to benchmarking">
                            <div class="d-flex f-items-center">
                                <span>{{ row.community_name }}</span>
                            </div>
                        </NuxtLink>
                    </template>
                    
                    <template #actions-data="{ row }">
                        <div v-if="row.actions">
                            <div v-if="row.privileges === 'Owner' && row.actions.community">
                                <template v-if="row.actions.community.read">
                                    <button title="View community" class="btn-event">
                                        <NuxtLink :to="`/dashboard/community/${row._id}?view`">
                                            <font-awesome-icon :icon="['fas', 'eye']" />
                                        </NuxtLink>
                                    </button>
                                </template>
                                <template v-if="row.actions.community.update">
                                    <button title="Edit community" class="btn-event">
                                        <NuxtLink :to="`/dashboard/community/${row._id}`">
                                            <font-awesome-icon :icon="['fas', 'pencil']" />
                                        </NuxtLink>
                                    </button>
                                </template>
                                <template v-if="row.actions.community.delete">
                                    <button title="Delete community" class="btn-event">
                                        <font-awesome-icon :icon="['fas', 'trash']" />
                                    </button>
                                </template>
                            </div>
                            <div v-else-if="row.privileges=== 'Manager' && row.actions.community">
                                <template v-if="row.actions.community.read">
                                    <button title="View community" class="btn-event">
                                        <NuxtLink :to="`/dashboard/community/${row._id}?view`">
                                            <font-awesome-icon :icon="['fas', 'eye']" />
                                        </NuxtLink>
                                    </button>
                                </template>
                                <template v-if="row.actions.community.create">
                                    <button title="Create community" class="btn-event">
                                        <NuxtLink :to="`/dashboard/community/${row._id}`">
                                            <font-awesome-icon :icon="['fas', 'plus']" />
                                        </NuxtLink>
                                    </button>
                                </template>
                                <template v-if="row.actions.community.update">
                                    <button title="Edit community" class="btn-event">
                                        <NuxtLink :to="`/dashboard/community/${row._id}/edit`">
                                            <font-awesome-icon :icon="['fas', 'pencil']" />
                                        </NuxtLink>
                                    </button>
                                </template>
                                <template v-if="row.actions.community.delete">
                                    <button title="Delete community" class="btn-event">
                                        <font-awesome-icon :icon="['fas', 'trash']" />
                                    </button>
                                </template>
                            </div>
                            <div v-else-if="row.privileges=== 'anyone' && row.actions.community">
                                <template v-if="row.actions.community.read">
                                    <button title="View community" class="btn-event">
                                        <NuxtLink :to="`/dashboard/community/${row._id}/edit`">
                                            <font-awesome-icon :icon="['fas', 'eye']" />
                                        </NuxtLink>
                                    </button>
                                </template>
                            </div>
                        </div>
                        <div v-else>
                            <div>-</div>
                        </div>
                        
                    </template>
                    
                    <template #status-data="{ row }">
                        <div class="inline-block rounded-full text-primaryOeb-950 custom-badget font-semibold text-gray-700" :class="CommunityStatusColors[row.status]">
                            <div class="text-xs font-normal leading-none max-w-full flex-initial font-semibold" :title="`${'Status'} ${row.status}`">
                                {{ row.status }}
                            </div>
                        </div>
                    </template>
                    <template #events-data="{ row }">
                        <NuxtLink :to="`/dashboard/community/${row._id}`" title="View community events" class="user-communities__events">
                            <font-awesome-icon :icon="['fas', 'circle-arrow-right']" />
                        </NuxtLink>
                    </template> 
                
                </UTable>
                <div
                    v-if="filteredRows.length > 0"
                    class="flex flex-wrap justify-between items-center pt-2"
                    >
                    <div>
                        <span class="text-sm leading-5">
                        Showing
                        <span class="font-medium">{{ pageFrom }}</span>
                        to
                        <span class="font-medium">{{ pageTo }}</span>
                        of
                        <span class="font-medium">{{ _total }}</span>
                        results
                        </span>
                    </div>
                    <UPagination 
                        v-model="page" 
                        :page-count="pageCount" 
                        :total="_total" 
                        :ui="{
                            wrapper: 'flex items-center',
                            default: {
                                activeButton: {
                                base: 'bg-primary-500 dark:bg-primary-400',
                                color: 'text-white',
                                },
                            },
                        }"
                        />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useUser } from "@/stores/user.ts";
import { CommunityStatusColors, CommunityStatusLabels } from '@/constants/community_const'
import { CommunityColumnsDashboard, CommunityStatus } from "@/types/communities";
import Multiselect from 'vue-multiselect';

defineProps<{
    isLoadingData: any;
}>();

const userStore = useUser();
const communitiesData = computed(() => userStore.getUserCommunities);
const page = ref<Number>(1);
const pageCount = ref<Number>(10);
const pageFrom = computed(() => (Number(page.value) - 1) * Number(pageCount.value) + 1);
const pageTo = computed(() =>
  Math.min(Number(page.value) * Number(pageCount.value), Number(totalPages.value)),
);
const search = ref<string>("");
const selectedStatus = ref(<Array<CommunityStatus>>[]);
const todoStatus = ref<Array<{ value: string, label: string }>>(CommunityStatusLabels);

const columns: Array<CommunityColumnsDashboard> = [{
    key: 'logos',
},{
    key: 'name',
    label: 'NAME'
},{
    key: "community_contact",
    label: "CONTACTS"
},{
    key: 'status',
    label: 'STATUS'
},{
    key: 'actions',
    label: 'ACTIONS'
}, {
    key: 'events',
    label: 'EVENTS'
}];

let _total = ref(0);

const filteredRows = computed(() => {
    if(communitiesData.value.length === 0) {
        return [];
    }
    if (!search.value && selectedStatus.value.length === 0) {
        _total.value = communitiesData.value.length;
        return communitiesData.value.slice(
        (Number(page.value) - 1) * Number(pageCount.value),
        Number(page.value) * Number(pageCount.value),
        );
    }

    const filteredSearcher = communitiesData.value.filter((challenge: any) => {
        return Object.values(challenge).some((ch) => {
            if(selectedStatus.value.length > 0) {
                return selectedStatus.value.some((status) => {
                    if(search.value) {
                        return status.value === challenge.status && String(ch).toLowerCase().includes(search.value.toLowerCase());
                    }
                    if (status.value === 'all') {
                        return String(ch).toLowerCase().includes(search.value.toLowerCase());
                    }
                    return status.value === challenge.status ;
            });
            } else {
                return String(ch).toLowerCase().includes(search.value.toLowerCase());
            }
        });
    });

    _total.value = filteredSearcher.length;

    return filteredSearcher.slice(
        (Number(page.value) - 1) * Number(pageCount.value),
        Number(page.value) * Number(pageCount.value),
    );
});


const totalPages = computed(() => {
    return Math.ceil(Number(_total.value) / Number(pageCount.value));
});

</script>
<style lang="scss" scoped>
.user-communities {
    &__body {
        padding: 1rem;
        &__table {
            margin-top: 1rem;
            a {
                color: theme('colors.primary.500');
                text-decoration: none;
            }
            &__logo {
                width: 60px;
            }
        }
    }
    &__events {
        font-size: 18px;
    }
    .custom-badget {
        padding: 0.45rem 0.5rem 0.6rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        line-height: 1;
        text-align: center;
        &.filter-badget {
            margin-right: 0.5rem;
        }
    }
    .btn-event {
        padding: 5px;
        font-size: 16px;
    }
    .input-search {
        input {
            box-shadow: none !important;
            :focus {
                border: 1px solid theme("colors.primary.500");
            }
        }
    }
    
}
.input-selector {
    padding: 5px 10px !important;
    input {
        box-shadow: none !important;
        :focus {
            border: 1px solid theme("colors.primary.500");
        }
    }
    button {
        color: #0b579f !important;
    }
}
</style>

<style lang="scss">
.input-selector {
    padding: 5px 10px !important;
    box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px inset, rgb(209, 213, 219) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px !important;
    display: block;
    border-radius: 6px;
    button {
        color: #0b579f !important;
    }
    :focus {
        border: 1px solid theme("colors.primary.500");
    }
    div:first-child {
        display: block;
        .custom-badget {
            margin-bottom: 5px;
        }
    }
}
.multiselect {
    padding-left: 0px;
}
.multiselect,
.multiselect__tags {
    min-height: 32px;
    padding: 0px 00px 0 8px;
}
.multiselect__tags {
    border: none;
    box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px inset, rgb(209, 213, 219) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px !important;
}
.multiselect__select {
    height: 32px;
    right: 2px;
    top: 3px;
}
.multiselect__tag {
    background-color: #e9ecef;
    border-radius: 9999px;
    font-size: 0.75rem;
    line-height: 1;
    text-align: center;
    margin-right: 0.5rem;
    margin-top: 5px;
    color: theme("colors.primary.500");
    padding: 4px 26px 4px 10px;
}
.multiselect__placeholder {
    margin-bottom: 2px;
    padding-top: 5px;
}
.multiselect__tag-icon {
    top: -2px;
}
.multiselect__tag-icon::after {    
    color: black;
}
.multiselect__option--highlight {
    background-color: theme("colors.primary.500");
}
.multiselect__option--highlight::after {
    background-color: theme("colors.primary.500");
}
.multiselect--active .multiselect__placeholder {
    display: block;
}
</style>