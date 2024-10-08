<template>
    <div class="dashboard-community-edit">
        <div class="w-100 container">
            <div class="dashboard-community-edit__title">
                <h2 class="text-primaryOeb-500 ">
                    <span class="">{{ labelTitle }} : <i>{{ id }}</i></span>
                    <span class="">
                        <NuxtLink class="btn-primary hover_effect"
                            :to="'/benchmarking/' + id"
                        >
                        {{ labelButton}}
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
                                <UForm :schema="schema" :state="state" class="space-y-4"
                                    @error="onError"
                                    @submit="onSubmitCommunity">
                                    <div class="w-100 form-card">
                                        <div class="row justify-content-between">
                                            <div class="col-6">
                                                <div class="logo-col">
                                                    <div class="logo-col-wrapper">
                                                        <div class="form-logo">
                                                            <img v-if="localLogo && localLogo != ''" :src="localLogo" alt="Entry logo" />
                                                            <img v-else src="~/assets/images/dashboard/empty-logo.jpg" alt="Entry logo" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="d-flex justify-content-center">
                                                    <div class="form-logo-input">
                                                        <label for="file-upload" 
                                                            class="custom-file-upload btn-primary hover_effect">
                                                            Upload new logo
                                                            <font-awesome-icon :icon="['fas', 'upload']" />
                                                        </label>
                                                        <input id="file-upload" 
                                                            type="file"
                                                            accept="image/*"
                                                            @change="onFileChange" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <div class="row justify-content-end">
                                                    <div class="col-10 typeOptions">
                                                        <div class="form-group">
                                                            <label for="id">
                                                                ID
                                                                <span class="text-red-400 required">*</span>
                                                            </label>
                                                            <div class="w-100">
                                                                <input type="text" class="form-control custom-entry-input" 
                                                                    id="id"
                                                                    placeholder="Community id" 
                                                                    v-model="state._id" 
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-10">
                                                        <div class="form-group">
                                                            <label for="status">Status</label>
                                                            <USelectMenu  
                                                                v-model="localStatus.value" 
                                                                :options="CommunityStatusLabels"
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
                                                    <div class="col-10">
                                                        <div class="form-group">
                                                            <label for="type">Type</label>
                                                            <USelect v-model="state.type" 
                                                                :options="typeOptions" 
                                                                option-attribute="label" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <CustomBorder />
                                        <div class="row custom-section">
                                            <div class="col-6">
                                                <div class="form-group">
                                                    <label for="acronym">
                                                        Acronym
                                                        <span class="text-red-400 required">*</span>
                                                    </label>
                                                    <input type="text" class="form-control" id="acronym" v-model="communityData.acronym"
                                                        :disabled="!commmunityPrivileges.community.update || isView" />
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <div class="form-group">
                                                    <label for="description">
                                                        Name
                                                        <span class="text-red-400 required">*</span>
                                                    </label>
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
                                                                    :disabled="!commmunityPrivileges.community.update || isView || checkEmptyLinks"
                                                                    type="button">
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
                                                                    <span class="text-red-400 required">*</span>
                                                                </span>
                                                                <button class="btn-form-add btn-primary"
                                                                    @click="onAddElement(localContacts, itemRefs)"
                                                                    :disabled="!commmunityPrivileges.community.update || isView || cheEmptyContacts"
                                                                    type="button">
                                                                    <font-awesome-icon :icon="['fas', 'plus']" />
                                                                </button>
                                                            </label>
                                                        </div>
                                                        <div class="w-100 row no-space">
                                                            <div v-if="localContacts.length>0" v-for="(contact, index) in localContacts" 
                                                                :key="index"
                                                                ref="itemsContact"
                                                                class="col-12 pt-0">
                                                                <div class="input-wrapper big d-flex">
                                                                    <USelectMenu 
                                                                        v-model="localContacts[index]"
                                                                        class="w-full lg:w-100"
                                                                        searchable
                                                                        selected-icon="i-heroicons-check-16-solid"
                                                                        placeholder="Select a contact"
                                                                        :options="contactsData"
                                                                        value-attribute="id"
                                                                        option-attribute="name"
                                                                        :ref="`contact_${index}`">
                                                                    </USelectMenu>
                                                                    <button class="btn-delete-input"
                                                                        type="button"
                                                                        @click="onDeleteElement(index, localContacts)">
                                                                        <font-awesome-icon :icon="['far', 'trash-can']" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div class="col-12 pt-0" v-else>
                                                                <div class="w-100 empty-elements text-slate-400">
                                                                    <span>There are no contacts associated with this community</span>
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
                                                                id="_provenance" 
                                                                placeholder="https://provenance.org/Community" 
                                                                v-model="communityData._provenance" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-card__row__box">
                                                <div class="col-12">
                                                    <div class="form-group">
                                                        <label for="schema">
                                                            Schema
                                                            <span class="text-red-400 required">*</span>
                                                        </label>
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
                                                                    type="button"
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
                                                                        type="button"
                                                                        @click="onDeleteElement(index, localKeywords)"
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
                                        <div class="w-100">
                                            <div class="ok-response" v-if="oks">
                                                <div class="alert alert-success text-center">
                                                    {{ oks }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="w-100">
                                            <div class="errors" v-if="errors.length>0">
                                                <div class="alert alert-danger text-center">
                                                    {{ getErrors }}
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
            :width="400"
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
                    <button type="button" class="btn-primary" @click="deleteElement">Yes</button>
                </template>
                <template v-else>
                    <button type="button" class="btn-primary" @click="isDialogOpened = false">Cancel</button>
                </template>
            </template>
        </CustomDialog>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, onMounted, useTemplateRef, watch } from "vue";
import { useUser } from "@/stores/user.ts";
import { Community } from "@/types/communities";
import { CommunityStatusLabels, CommunityStatusColors } from '@/constants/community_const';
import EventsList from '@/components/Dashboard/entries/EventsList.vue';
import CommunitySummary from "@/components/Dashboard/entries/CommunitySummary.vue";
import CustomSubtitle from "@/components/Common/CustomSubtitle.vue";
import { CommunityPrivilegeActions } from '@/constants/privileges';
import { useRouter } from "vue-router";
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types'
import CustomDialog from "@/components/Common/CustomDialog.vue";
import { Event } from "@/types/events";
import { object, string, array, safeParse, optional } from 'valibot';
import CustomBorder from "@/components/Common/CustomBorder.vue";


const router = useRouter();
const runtimeConfig = useRuntimeConfig();
const { data } = useAuth();

const token: string = data?.value.accessToken;
const userStore = useUser();

const imageDefault = '~/assets/images/dashboards/empty-logo.jpg';

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
    _id: '',
    acronym: '',
    status: '',
    name: '',
    description: '',
    links: [] as string[],
    keywords: [] as string[],
    _schema: '',
    community_contact_ids: [] as string[],
    type: '',
    privileges: 'owner'
});

const schema = object({
    _id: string(),
    acronym: string(),
    status: string(),
    name: string(),
    description: string(),
    _schema: string(),
    links: array(object({
        uri: string(),
        label: string(),
        comment: optional(string()),

    })),
    keywords: array(string()),
    type: string(),
    community_contact_ids: array(object({
        id: string(),
        name: string(),
    })),
});

let dialogTitle = ref("");
let dialogType = ref("yesno");
let isDialogOpened = ref(false);
let dialogText = ref("");
let elementToDelete = ref({
    index: null as number | null,
    element: [] as string[]
});
let logo = ref("");
const errors = ref<string[]>([]);
const oks = ref<string>("");
const inputLinkRefs = ref<(HTMLInputElement | null)[]>([]);
const inputContactsRefs = ref<(HTMLInputElement | null)[]>([]);
const inputKeywordsRefs = ref<(HTMLInputElement | null)[]>([]);
const itemRefs = useTemplateRef('itemsContact')

const items = [{
    key: "main",
    label: 'Community Data',
    icon: 'i-heroicons-document-chart-bar',
}];

const getErrors = computed(() => errors.value.join(", "));

const userPrivileges: Array<string> = computed(() => userStore.getUserCommunitiesRoles);
if(userPrivileges.value.length == 0) {
    userStore.setUserCommunitiesRoles(data.value.oeb_roles)
}

let labelTitle = ref("");
let labelButton = ref("");

const communityData = computed(() => {
    state.value = {
        _id: props.communityObj?._id,
        acronym: props.communityObj?.acronym,
        status: props.communityObj?.status,
        name: props.communityObj?.name,
        description: props.communityObj.description,
        _metadata: props.communityObj._metadata ?? '',
        _schema: "https://www.elixir-europe.org/excelerate/WP2/json-schemas/1.0/Community",
        community_contact_ids: props.communityObj?.community_contact_ids.map((contact: string) => {
            return {
                id: contact,
                name: contact
            };
        }) || [],
        keywords: props.communityObj?.keywords ?? [],
        links: props.communityObj?.links ?? [],
    }

    if(!props.communityObj._metadata) {
        items.push({
            key: "events",
            label: 'Events',
            icon: 'i-heroicons-calendar',
        });
        state.value.type = 'Community';
        labelTitle.value = "Edit Community";
        labelButton.value = "View Community";
    } else {
        items.push({
            key: "summary",
            label: 'Summary',
            icon: 'i-heroicons-squares-2x2-16-solid',
        });
        state.value.type = 'Project';
        labelTitle.value = "Edit Project";
        labelButton.value = "View Project";
    }
    return state.value;
});

const typeOptions = [
    { value: 'Community', label: 'Community' },
    { value: 'Project', label: 'Project' }
];
let localContacts = ref<string[]>([]);
let localLinks = ref<string[]>([]);
let localKeywords = ref<string[]>([]);
let contactsData = ref<string[]>([]);
let localLogo = ref<string | null>(null);

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

if (props.communityObj && props.communityObj.community_contact_ids) {
    localContacts.value = props.communityObj.community_contact_ids.map((contact: string) => {
        return contact.replace(/\./g, " ");
    }) || [];
}

if (props.communityObj && props.communityObj.links) {
    localLinks.value = props.communityObj.links
        .filter((link: { comment?: string }) => {
            return !link.comment || link.comment !== '@logo';
        })
        .map((link: { uri: string }) => link.uri)
        .filter((uri: string | undefined): uri is string => uri !== undefined);
}

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
    router.push("/dashboard/entries");
}

async function onSubmitCommunity(event: FormSubmitEvent<Schema>) {
    event.preventDefault();

    oks.value = "";
    errors.value = [];

    const result = safeParse(schema, state.value);
    if (result.success) {
        const customErrors = validateRequiredFields(state.value);
        if (customErrors.length > 0) {
            errors.value = customErrors;
        } else {
            errors.value = [];
            await updateCommunity();
        }
    } else {
        errors.value = result.error.issues.map(issue => issue.message);
    }
}

async function onError (event: FormErrorEvent) {
    const element = document.getElementById(event.errors[0].id)
    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}


function deleteEmptyElements(array: string[]) {
    return array.filter((element: string) => element !== '');
}

async function updateCommunity() {
    let cleanLinks = deleteEmptyElements(localLinks.value);
    let cleanKeywords = deleteEmptyElements(localKeywords.value);
    let cleanContacts = deleteEmptyElements(localContacts.value);

    const body = {
        _id: state.value._id,
        _schema: state.value._schema,
        name: state.value.name,
        acronym: state.value.acronym,
        status: state.value.status,
        links: cleanLinks.map(element => {
            return { 
                uri: element,
                label: "MainSite"
            };
        }),
        keywords: cleanKeywords.map(element => {
            return element;
        }),
        community_contact_ids: cleanContacts.map(element => {
            return element;
        }),
        description: state.value.description
    };

    if (localLogo.value) {
        body.links.push({
            label: "other",
            comment: "@logo",
            uri: localLogo.value
        });
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

            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }

            const data = await response.json();
            if(data.status === 200) {
                let msg = "We've saved your community changes.";
                await showOkMessage(msg).then(() => {
                    router.push("/dashboard/entries");
                });
            } else {
                let responseData = JSON.parse(data.body)
                errors.value = [responseData.message];
            }
    } catch (error) {
        console.error("Error fetching communities data:", error);
    }
}

async function showOkMessage(msg: string) {
    oks.value = msg;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            oks.value = "";
            resolve('done');
        }, 5000);
    });
}


function validateRequiredFields(data: any): string[] {
    const requiredFields = ['_id','_schema', 'acronym', 'name', 'status', 'community_contact_ids'];
    const errorMessages: string[] = [];
    
    requiredFields.forEach(field => {
        if (typeof data[field] === 'string' && data[field].trim() === '') {
            errorMessages.push(`${field} cannot be empty`);
        }
    });

    if(localContacts.value.length == 0) {
        errorMessages.push(`community_contact_ids cannot be empty`);
    } else {
        localContacts.value.forEach((contact: string, index: number) => {
            if (contact.trim() === '') {
                errorMessages.push(`community_contact_ids  cannot be empty`);
            }
        });
    }
    return errorMessages;
}

function onChangeStatus(newStatus: string) {
    localStatus.value.value = newStatus.value;
    localStatus.value.label = newStatus.label;
}

function onAddElement(array: string[], arrayRef?: HTMLInputElement[]) {
    array.push('');
    nextTick(() => {
        const lastElementIndex = array.length - 1;
        const inputElement = arrayRef ? arrayRef[lastElementIndex] : null;
        if (inputElement) {
            inputElement.focus();
        }
    });
}

function onDeleteElement(index: number, element: string[]) {
    if (element[index] === '') {
        element.splice(index, 1);
        restartElementToDelete();
    } else {
        dialogText.value = "Are you sure you want to delete this element?";
        dialogTitle.value = "Delete Element";
        isDialogOpened.value = true;

        elementToDelete.value = {
            index: index,
            element: element
        }
    }
}

function restartElementToDelete() {
    elementToDelete.value = {
        index: null,
        element: []
    }
}

function deleteElement() {
    if (elementToDelete.value.index !== null) {
        elementToDelete.value.element.splice(elementToDelete.value.index, 1);
        isDialogOpened.value = false;
    }
}

function dialogShow() {
    console.log('dialogShow!!!!');
}

function onFileChange(event: Event) {
    let input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            localLogo.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
}

const fetchContacts = async (token: string): Promise<void> => {
    try {
        if(userStore.getContactsList && userStore.getContactsList.length>0) {
            contactsData.value = userStore.getContactsList;
        } else {
            contactsData.value = await userStore.fetchContacts(token);
        }
    } catch (error) {
        console.error("Error fetching contacts data:", error);
    }
}

onMounted(() => {
  fetchContacts(token);
});

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
            localLogo.value = newVal.links.find((link: { comment?: string }) => {
                return link.comment && link.comment === '@logo';
            })?.uri || '';
        }
        if (newVal && newVal.community_contact_ids) {
            localContacts.value = newVal.community_contact_ids.map((contact: string) => {
                return contact;
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
    .btn-dialog {
        padding: 5px 25px;
    }
    .custom-section {
        padding: 10px 0 0;
    }

    input[type="file"] {
        display: none;
    }
    .custom-file-upload {
        border: 1px solid #ccc;
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;
        margin-top: 10px;
        font-size: 14px;
    }
</style>