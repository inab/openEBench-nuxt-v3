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
                            :taggable="true"
                            @tag="addTag"
                            label="label"
                            track-by="label">
                            <template #selection="{ values, search, isOpen }">
                                <div v-for="value in values" :key="value.value" class="selector-label" 
                                :class="`status-${ value.value } option-btn`">
                                    <span>{{ value.label }}</span>
                                    <i 
                                        tabindex="1" 
                                        class="multiselect__tag-icon"
                                        @click="removeTag(value)"
                                        />
                                </div>
                            </template>
                            <template #option="props">
                                <span class="d-flex">
                                    <span
                                        class="h-2 w-2 rounded-full rounded-options" 
                                        :class="`status-${ props.option.value }__option`">
                                    </span>
                                    <span>{{ props.option.label }}</span>
                                </span>
                            </template>
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
                            base: '',
                            padding: 'px-2.5 py-2.5',
                            font: '',
                            size: 'text-sm',
                        },
                    }">
                    <template #logos-data="{ row }">
                        <div class="user-communities__body__table__logo">
                            <img :src="row.logo" alt="Community logo" class="" />
                        </div>
                    </template>
                
                    <template #name-data="{ row }">
                        <div class="d-flex f-items-center">
                            <span>{{ row._id }} - {{ row.name }}</span>
                        </div> 
                    </template>
                    <template #actions-data="{ row }">
                        <div class="action-btn-group">
                            <button class="btn-custom-badget text-sm">
                                <NuxtLink :to="`/benchmarking/${row._id}`" 
                                    title="View community events" 
                                    class="text-sm">
                                    Life <font-awesome-icon :icon="['far', 'eye']" />
                                </NuxtLink>
                            </button>
                            <div v-if="row.actions">
                                <div class="text-center" v-if="row.privileges === 'Owner' && row.actions.community">
                                    <button title="Edit community" class="btn-custom-badget text-sm">
                                        <NuxtLink :to="getCommunityEditLink(row)"
                                            class="text-sm">
                                            View <font-awesome-icon :icon="['fas', 'pencil']" />
                                        </NuxtLink>
                                    </button>
                                </div>
                                <div class="text-center" v-else-if="row.privileges=== 'Manager' && row.actions.community">
                                    <button title="Edit community" class="btn-custom-badget text-sm">
                                        <NuxtLink :to="getCommunityEditLink(row)"
                                            class="text-sm">
                                            View <font-awesome-icon :icon="['fas', 'pencil']" />
                                        </NuxtLink>
                                    </button>
                                </div>
                                <div class="text-center" v-else-if="row.privileges=== 'anyone' && row.actions.community">
                                    <button title="Edit community" class="btn-custom-badget text-sm">
                                        <NuxtLink :to="getCommunityEditLink(row)"
                                            class="text-sm">
                                            View <font-awesome-icon :icon="['fas', 'pencil']" />
                                        </NuxtLink>
                                    </button>
                                </div>
                            </div>
                            <button class="btn-custom-badget text-sm">
                                <NuxtLink :to="getCommunityEditLink(row, true)" 
                                    title="View community events" 
                                    class="text-sm">
                                    Events <font-awesome-icon :icon="['fas', 'calendar-check']" />
                                </NuxtLink>
                            </button>
                        </div>
                        
                    </template>
                    <template #type-data="{row}">
                        <div class="inline-block rounded-full text-left">
                            <template v-if="row._metadata && row._metadata">
                                <font-awesome-icon :icon="['fas', 'diagram-project']" />
                                <span>
                                    Project
                                </span>
                            </template>
                            <template v-else>
                                <font-awesome-icon :icon="['fas', 'people-group']" />
                                <span>
                                    Community
                                </span>
                            </template>
                        </div>
                    </template>
                    <template #status-data="{ row }">
                        <div class="inline-block rounded-full custom-badget font-semibold" 
                            :class="`status-${row.status}`"
                            :title="`${'Status'} ${row.status}`">
                            <div class="text-xs font-normal leading-none max-w-full flex-initial font-semibold"
                                :title="`${'Status'} ${row.status}`">
                                {{ row.status }}
                            </div>
                        </div>
                    </template>
                    <template #role-data="{ row }">
                        <span v-if="row.privileges === 'Owner' && row.actions.community"
                            title="Community Owner"
                            class="row-icon">
                            <font-awesome-icon :icon="['fas', 'key']" />
                        </span>
                        <span v-else-if="row.privileges === 'Manager' && row.actions.community"
                            title="Community Manager"
                            class="row-icon">
                            <font-awesome-icon :icon="['fas', 'gear']" />
                        </span>
                        <span v-else>
                            -
                        </span>
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
import { CommunityStatusColors, CommunityStatusLabels, CommunityStatusTextColors, CommunityStatusBackgroundColors } from '@/constants/community_const'
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

const columns: Array<CommunityColumnsDashboard> = [
    {
        key: 'logos',
    },{
        key: 'name',
        label: 'NAME'
    },{
        key: 'role',
        label: 'ROLE'
    },{
        key: "community_contact",
        label: "CONTACTS"
    },{
        key: 'type',
        label: 'TYPE'
    },{
        key: 'status',
        label: 'STATUS'
    },{
        key: 'actions',
        label: 'ACTIONS'
    }
];

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
            console.log(ch)
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

function addTag(newTag: string) {
    const tag = {
        label: newTag,
        value: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
    }
    todoStatus.options.push(tag)
    todoStatus.value.push(tag)
}

function removeTag(tagName: string) {
    selectedStatus.value = selectedStatus.value.filter((tag) => {
        return  tagName.value != tag.value
    });
}

function getCommunityEditLink(row: any, isEvent: boolean = false) {
    if(isEvent) {
        return `/dashboard/entries/${row._id}?events=true`;
    }
    return `/dashboard/entries/${row._id}`;
}

</script>
<style lang="scss" scoped>
.user-communities {
    &__body {
        padding: 1rem;
        &__table {
            margin-top: 1rem;
            a {
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
        min-width: 100px;
        text-transform: capitalize;
        &.filter-badget {
            margin-right: 0.5rem;
        }
    }
    .btn-event {
        padding: 5px;
        font-size: 16px;
        a {
            color: theme('colors.gray.400');
            &:hover {
                color: theme('colors.secondaryOeb.500');
            }
        }
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
.row-icon {
    padding-right: 10px;
}
.action-btn-group {
    display: flex;
    gap: 10px;
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
    padding: 0px 00px 0 0px;
}
.multiselect__tags {
    border: none;
    box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px inset, rgb(209, 213, 219) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px !important;
    display: flex;
    gap: 10px;
    padding: 5px;
    align-items: center;
    height: 32px;
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
    min-height: 32px;
}
.multiselect__placeholder {
    margin-bottom: 2px;
    padding-top: 5px;
    padding-left: 10px;
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
.multiselect__tag-icon {
    position: relative;
}
.selector-label {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 23px;
    width: auto;
    padding: 2px 7px;
    border-radius: 50px;
    span {
        padding: 0px;
    }
}
.rounded-options {
    display: flex;
    width: 10px;
    height: 10px;
    margin-right: 10px;
}
.logo-col {
    display: flex;
    justify-content: center;
    .logo-col-wrapper {
        width: 200px;
        height: 200px;
        display: flex;
        justify-content: center;
        border: 1px solid #e9ecef;
        border-radius: 5px;
        background-color: white;
        .form-logo {
            width: 150px;
            height: 150px;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }
    }
}
.form-logo-input {
    width: 200px;
    display: flex;
    justify-content: center;
    button {
        padding: 2px 25px;
        margin-top: 10px;
    }
}

</style>