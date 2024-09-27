<template>
    <div class="dashboard-community-edit">
        <div class="w-100 container">
            <div class="dashboard-community-edit__title">
                <h2 class="text-primaryOeb-500 ">
                    <span class="">Edit Community : <i>{{ id }}</i></span>
                    <span class="">
                        <NuxtLink class="btn-primary hover_effect"
                            :to="'/benchmarking/' + id"
                        >
                        View Community
                        </NuxtLink>
                    </span>
                </h2>
            </div>
            <div class="" v-if="loadingData">
                <div class="space-y-2">
                    <USkeleton class="dashboard-community-edit__skeleton__small" />
                    <USkeleton class="dashboard-community-edit__skeleton__big" />
                </div>
            </div>
            <div class="dashboard-community-edit__content" v-else>
                <div class="w-100">
                    <UTabs :items="items">
                        <template #icon="{ item, selected }">
                            <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0 me-2" :class="[selected && 'text-secondaryOeb-500 dark:text-secondaryOeb-400']" />
                        </template>
                        <template #item="{ item }">
                            <div v-if="item.key === 'main'">
                                <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmitCommunity">
                                    <div class="w-100 form-card">
                                        <div class="row">
                                            <div class="col-6">
                                                <div class="form-group">
                                                    <label for="type">Type</label>
                                                    <input type="text"
                                                        class="form-control"
                                                        id="type"
                                                        v-model="communityData.type" 
                                                        disabled />
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <div class="form-group">
                                                    <label for="privileges">Privileges</label>
                                                    <input type="text"
                                                        class="form-control"
                                                        id="type"
                                                        v-model="localPrivilegesType" 
                                                        disabled />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-8">
                                                <div class="form-group">
                                                    <label for="acronym">Acronym</label>
                                                    <input type="text" class="form-control" id="acronym" v-model="communityData.acronym"
                                                        :disabled="!commmunityPrivileges.community.update || isView" />
                                                </div>
                                            </div>
                                            <div class="col-4">
                                                <div class="form-group">
                                                    <label for="status">Status</label>
                                                    <USelectMenu  
                                                        v-model="localStatus.value" 
                                                        :options="CommunityStatusLabels"
                                                        :disabled="!commmunityPrivileges.community.update || isView" 
                                                        :color="commmunityPrivileges.community.update?'white':'gray'"
                                                        @change="onChangeStatus">
                                                        <template #label>
                                                            <span 
                                                                :class="`status-${ localStatus.value }__option inline-block h-2 w-2 flex-shrink-0 rounded-full`" 
                                                                aria-hidden="true" />
                                                            <span class="truncate">{{ localStatus.label }}</span>
                                                        </template>
                                                        <template #option="{ option: item }">
                                                            <span
                                                                class="h-2 w-2 rounded-full" 
                                                                :class="`status-${ item?.value }__option`"></span>
                                                            <span>{{ item.label }}</span>
                                                        </template>
                                                    </USelectMenu>
                                                </div>
                                            </div>
                                            <div class="col-12">
                                                <div class="form-group">
                                                    <label for="description">Name</label>
                                                    <input type="text" class="form-control" id="name" v-model="communityData.name" 
                                                        :disabled="!commmunityPrivileges.community.update || isView"
                                                    />
                                                </div>
                                            </div>
                                            <div class="col-12">
                                                <div class="form-group">
                                                    <label for="description">Description</label>
                                                    <textarea class="form-control" id="description" rows="10" 
                                                        v-model="communityData.description"
                                                        :disabled="!commmunityPrivileges.community.update || isView">
                                                    </textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="w-100 form-card">
                                        <CustomSubtitle
                                            text="Data"
                                        />
                                        <div class="row form-card__row">
                                            <div class="form-card__row__box">
                                                <div class="col-12">
                                                    <div class="form-group">
                                                        <div class="w-100">
                                                            <label for="contacts"
                                                                class="form-group-row">
                                                                <span class="label-text text-gray-500">
                                                                    Links
                                                                </span>
                                                                <button class="btn-form-add btn-primary"
                                                                    @click="onAddElement(localLinks)"
                                                                    :disabled="!commmunityPrivileges.community.update || isView || checkEmptyLinks">
                                                                    <font-awesome-icon :icon="['fas', 'plus']" />
                                                                </button>
                                                            </label>
                                                        </div>
                                                        <div class="w-100 row no-space">
                                                            <div v-for="(link, index) in localLinks" :key="link"
                                                                class="col-12 d-flex pl-0">
                                                                <div class="input-wrapper big d-flex">
                                                                    <span>{{ index + 1}}.</span>
                                                                    <input type="text" class="form-control" 
                                                                        id="link" 
                                                                        v-model="localLinks[index]" 
                                                                        :disabled="!commmunityPrivileges.community.update || isView" />
                                                                    <button class="btn-delete-input"
                                                                        type="button"
                                                                        @click="onDeleteElement(index, localLinks)"
                                                                        v-if="commmunityPrivileges.community.update && !isView">
                                                                        <font-awesome-icon :icon="['far', 'trash-can']" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="form-card__row__box">
                                                <div class="col-12">
                                                    <div class="form-group">
                                                        <div class="w-100">
                                                            <label for="contacts"
                                                                class="form-group-row">
                                                                <span class="label-text text-gray-500">
                                                                    Contacts
                                                                </span>
                                                                <button class="btn-form-add btn-primary"
                                                                    @click="onAddElement(localContacts)"
                                                                    :disabled="!commmunityPrivileges.community.update || isView || cheEmptyContacts">
                                                                    <font-awesome-icon :icon="['fas', 'plus']" />
                                                                </button>
                                                            </label>
                                                        </div>
                                                        <div class="w-100 row no-space">
                                                            <div v-for="(contact, index) in localContacts" :key="index" 
                                                                class="col-6 pt-0">
                                                                <div class="input-wrapper">
                                                                    <input type="text" class="form-control" 
                                                                        v-model="localContacts[index]" 
                                                                        :disabled="!commmunityPrivileges.community.update || isView" />
                                                                    <button class="btn-delete-input"
                                                                        v-if="commmunityPrivileges.community.update && !isView">
                                                                        <font-awesome-icon :icon="['far', 'trash-can']" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="form-card__row__box">
                                                <div class="col-12">
                                                    <div class="form-group">
                                                        <label for="provenance" class="w-100">Provenance</label>
                                                        <div class="w-100 d-flex">
                                                            <input type="text" class="form-control custom-entry-input" 
                                                                id="schema" 
                                                                placeholder="https://provenance.org/Community" 
                                                                v-model="communityData._provenance" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="form-card__row__box">
                                                <div class="col-12">
                                                    <div class="form-group">
                                                        <label for="schema">Schema</label>
                                                        <div class="w-100 d-flex">
                                                            <input type="text" class="form-control custom-entry-input" 
                                                                id="schema"
                                                                placeholder="https://schema.org/Community"
                                                                v-model="communityData._schema" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="form-card__row__box">
                                                <div class="col-12">
                                                    <div class="form-group">
                                                        <div class="w-100">
                                                            <label for="contacts"
                                                                class="form-group-row">
                                                                <span class="label-text">
                                                                    Keywords
                                                                </span>
                                                                <button class="btn-form-add btn-primary"
                                                                    @click="onAddElement(localKeywords)"
                                                                    :disabled="!commmunityPrivileges.community.update || isView || checkEmptyKeywords">
                                                                    <font-awesome-icon :icon="['fas', 'plus']" />
                                                                </button>
                                                            </label>
                                                        </div>
                                                        <div class="w-100 row no-space">
                                                            <div v-for="(keys, index) in localKeywords" :key="index"
                                                                class="col-4 pt-0 mb-1">
                                                                <div class="input-wrapper">
                                                                    <input type="text" class="form-control" 
                                                                        v-model="localKeywords[index]" 
                                                                        :disabled="!commmunityPrivileges.community.update || isView" />
                                                                    <button class="btn-delete-input"
                                                                        v-if="commmunityPrivileges.community.update && !isView">
                                                                        <font-awesome-icon :icon="['far', 'trash-can']" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-footer">
                                            <UButton type="button" variant="secondary"
                                                @click="goBack">
                                                Cancel
                                            </UButton>
                                            <UButton type="submit"
                                                :disabled="!commmunityPrivileges.community.update || isView"
                                                v-if="commmunityPrivileges.community.update && !isView">
                                                Submit
                                            </UButton>
                                        </div>
                                    </div>
                                </UForm>
                            </div>
                            <div v-if="item.key === 'events'">
                                <div>
                                    <EventsList 
                                        :events="events"
                                        :is-loading-data="isLoadingEvents"
                                        :commmunityPrivileges="commmunityPrivileges"
                                        :communityId="id"
                                    />
                                </div>
                            </div>
                            <div v-if="item.key === 'summary'">
                                <CommunitySummary
                                    :metadata="communityData._metadata"
                                />
                            </div>
                        </template>
                    </UTabs>
                </div>
            </div>
        </div>
        <CustomDialog
            :isDialogOpen="isDialogOpened"
            @modal-close="dialogShow">
            <template #header>
                {{ dialogTitle }}
            </template>
            <template #content>
                {{ dialogText }}
            </template>
            <template #footer>
                <template v-if="dialogType && dialogType === 'yesno'">
                    <button type="button" class="btn-primary" @click="isDialogOpened = false">No</button>
                    <button type="button" class="btn-primary" @click="isDialogOpened = false">Yes</button>
                </template>
                <template v-else>
                    <button type="button" class="btn-primary" @click="isDialogOpened = false">Cancel</button>
                </template>
            </template>
        </CustomDialog>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { CommunityStatusLabels, CommunityStatusColors } from '@/constants/community_const';
import EventsList from '@/components/Dashboard/communities/EventsList.vue';
import CommunitySummary from "@/components/Dashboard/communities/CommunitySummary.vue";
import CustomSubtitle from "@/components/Common/CustomSubtitle.vue";
import { CommunityPrivilegeActions } from '@/constants/privileges';
import { useRouter } from "vue-router";
import type { FormSubmitEvent } from '#ui/types'
import * as v from "valibot";
import CustomDialog from "@/components/Common/CustomDialog.vue";
import { Event } from "@/types/events";


const router = useRouter();
const runtimeConfig = useRuntimeConfig();
const { data } = useAuth();
const token: string = data?.value.accessToken;

const props = defineProps<{
    id: string,
    communityObj: Community | null,
    loadingData: boolean,
    commmunityPrivileges: CommunityPrivilegeActions,
    isView: boolean,
    events: Array<Event>,
    isLoadingEvents: boolean,
    privilegesType: string,
}>();

const state = ref({
    acronym: '',
    status: '',
    name: '',
    description: ''
});

const schema = v.object({
    acronym: v.pipe(v.string()),
    status: v.pipe(v.string()),
    name: v.pipe(v.string()),
    description: v.pipe(v.string())
});

let dialogTitle = ref("");
let dialogType = ref("yesno");
let isDialogOpened = ref(false);
let dialogText = ref("");

const errors = ref<string[]>([]);

const items = [{
    key: "main",
    label: 'Community Data',
    icon: 'i-heroicons-document-chart-bar',
}]

const communityData = computed(() => {
    state.value = {
        acronym: props.communityObj?.acronym,
        status: props.communityObj?.status,
        name: props.communityObj?.name,
        description: props.communityObj.description,
        _metadata: props.communityObj._metadata ?? null,
    }

    if(!props.communityObj._metadata) {
        items.push({
            key: "events",
            label: 'Events',
            icon: 'i-heroicons-calendar',
        });
        state.value.type = 'Community';
    } else {
        items.push({
            key: "summary",
            label: 'Summary',
            icon: 'i-heroicons-squares-2x2-16-solid',
        });
        state.value.type = 'Project';
    }
    return state.value;
});

const localPrivilegesType = computed(() => {
    return props.privilegesType;
});

const localStatus = ref({
    value: "",
    label: ""
});
if (props.communityObj && typeof props.communityObj.status === 'string') {
  localStatus.value.value = props.communityObj.status.charAt(0).toUpperCase() + props.communityObj.status.slice(1);
}

let localContacts = ref<string[]>([]);
if (props.communityObj && props.communityObj.community_contact_ids) {
    localContacts.value = props.communityObj.community_contact_ids.map((contact: string) => {
        return contact.replace(/\./g, " ");
    }) || [];
}

let localLinks = ref<string[]>([]);
if (props.communityObj && props.communityObj.links) {
    localLinks.value = props.communityObj.links
        .filter((link: { comment?: string }) => {
            return !link.comment || link.comment !== '@logo';
        })
        .map((link: { uri: string }) => link.uri)
        .filter((uri: string | undefined): uri is string => uri !== undefined);
}

let localKeywords = ref<string[]>([]);
if (props.communityObj && props.communityObj.keywords) {
    localKeywords.value = props.communityObj.keywords;
}

const checkEmptyLinks = computed(() => {
    return localLinks.value.some((link: string) => link === '');
});

const cheEmptyContacts = computed(() => {
    return localContacts.value.some((contact: string) => contact === '');
});

const checkEmptyKeywords = computed(() => {
    return localKeywords.value.some((keyword: string) => keyword === '');
});

function goBack() {
    router.push("/dashboard/communities");
}

async function onSubmitCommunity(event: FormSubmitEvent<Schema>) {
    event.preventDefault();

    const result = v.safeParse(schema, state.value);
    if (result.success) {
        const response = await updateCommunity();
        /* TODO */
    } else {
        errors.value = result.error.issues.map(issue => issue.message);
    }
}

async function updateCommunity() {
    const body = {
        description: state.value.description,
        _id: props.id,
        links: ['http://questfororthologs.org/']
    }
    
    try {
        const response = await fetch(`/api/staged/Community/${props.communityObj._id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            });

            console.log(response);

            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }

            const data = await response.json();
            console.log('Respuesta exitosa:', data);
    } catch (error) {
        console.error("Error fetching communities data:", error);
    }
}

function onChangeStatus(newStatus: string) {
    localStatus.value.value = newStatus.value;
    localStatus.value.label = newStatus.label;
}

function onAddElement(array: string[]) {
    array.push('');
}

function onDeleteElement(index: number, element: string[]) {
    console.log(element[index]);
    if (element[index] === '') {
        element.splice(index, 1);
    } else {
        dialogText.value = "Are you sure you want to delete this element?";
        dialogTitle.value = "Delete Element";
        isDialogOpened.value = true;
    }
}

function dialogShow() {
    console.log('dialogShow!!!!');
}

watch(
    () => props.communityObj,
    (newVal) => {
        if (newVal && typeof newVal.status === 'string') {
            localStatus.value.label = newVal.status.charAt(0).toUpperCase() + newVal.status.slice(1);
            localStatus.value.value = newVal.status;
        }
        if (newVal && newVal.links) {
            localLinks.value = newVal.links
                .filter((link: { comment?: string }) => {
                    return !link.comment || link.comment !== '@logo';
                })
                .map((link: { uri: string }) => link.uri)
                .filter((uri: string | undefined): uri is string => uri !== undefined);
        }
        if (newVal && newVal.community_contact_ids) {
            localContacts.value = newVal.community_contact_ids.map((contact: string) => {
                return contact.replace(/\./g, " ");
            }) || [];
        }
        if (newVal && newVal.keywords) {
            localKeywords.value = newVal.keywords;
        }
    },
    { immediate: true }
);
</script>

<style scoped lang="scss">
    .dashboard-community-edit {
        &__title {
            padding-bottom: 20px;
            padding-top: 20px;
            h2 {
                border-color: rgb(226, 232, 240, 1);
                border-bottom-width: 1px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 5px;
                span {
                    padding-bottom: 5px;
                }
                a {
                    padding: 5px 10px;
                    font-size: 14px;
                    text-decoration: none;
                    margin-bottom: 5px;
                }
            }
        }
        &__skeleton {
            &__small {
                width: 100%;
                height: 50px;
            }
            &__big {
                width: 100%;
                height: 250px;
            }
        }
        .input-wrapper {
            background-color: theme("colors.primary.50");
            padding: 0.6rem 0.8rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            line-height: 1;
            input {
                border: none;
                background-color: rgba(255, 255, 255, .8);
                width: 100%;
            }
            &.big {
                margin-bottom: 5px;
                width: 100%;
            }

        }
        &__content {
            a {
                color: theme("colors.primary.500");
                text-decoration: none;
            }
            .form-group {
                padding-bottom: 20px;
                .row {
                    padding: 0 25px;
                    .col-6, .col-3 {
                        padding: 5px;
                    }
                }
            }
            .input-wrapper {
                padding-bottom: 10px;
                display: flex;
                gap: 10px;
                justify-content: start;
                align-items: baseline;
            }
        }
        .form-footer {
            display: flex;
            justify-content: end;
            gap: 10px;
        }
        .form-group-row {
            display: flex;
            justify-content: space-between;
            padding-bottom: 10px;
            .label-text {
                border-bottom: 1px solid #e9ecef;
                width: 90%;
            }
            .btn-form-add.btn-primary  {
                padding: 1px 6px;
                height: 28px;
            }
        }
        .form-card {
            padding: 10px 15px;
            border-radius: 5px;
            background-color: rgba(233,236,239, 0.2);
            box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
            &__row {
                padding: 30px 15px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                column-gap: 10px;
                row-gap: 20px;
                &:last-child {
                    width: 100%;
                }
                .no-space {
                    padding: 0;
                }
                &__box {
                    padding: 10px 20px;
                    border: 1px solid rgba(233,236,239);
                    background-color: white;
                    border-radius: 7px;
                    &:last-child {
                        width: 100%;
                        grid-column: span 2;
                    }
                }
            }
        }
        .custom-entry-input::placeholder {
            opacity: 0.5;
            color: rgba(0, 0, 0, 0.3);
        }
    }
</style>