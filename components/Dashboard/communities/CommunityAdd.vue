<template>
    <div class="dashboard-community-edit">
        <div class="w-100 container">
            <div class="dashboard-community-edit__title">
                <h2 class="text-primaryOeb-500 ">
                    <span class="">New Community</span>
                </h2>
            </div>
            <div class="dashboard-community-edit__content">
                <div class="">
                    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmitCommunity">
                        <div class="w-100 form-card">
                            <div class="row justify-content-between">
                                <div class="col-4">
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
                                <div class="col-4">
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
                            </div>
                            <div class="row">
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="acronym">
                                            Acronym
                                            <span class="text-red-400 required">*</span>
                                        </label>
                                        <div class="w-100">
                                            <input type="text" class="form-control custom-entry-input" 
                                                id="acronym"
                                                placeholder="Community acronym" 
                                                v-model="state.acronym" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-8">
                                    <div class="form-group">
                                        <label for="description">
                                            Name
                                            <span class="text-red-400 required">*</span>
                                        </label>
                                        <div class="w-100">
                                            <input type="text" class="form-control custom-entry-input" 
                                                placeholder="Community name" 
                                                id="name" 
                                                v-model="state.name" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="description">Description</label>
                                        <textarea class="form-control" id="description" rows="10" 
                                            v-model="state.description" >
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
                                                    <span class="label-text w-100">
                                                        Links
                                                    </span>
                                                    <button class="btn-form-add btn-primary"
                                                        type="button"
                                                        @click="onAddElement(localLinks, inputLinkRefs)"
                                                        :disabled="checkEmptyLinks">
                                                        <font-awesome-icon :icon="['fas', 'plus']" />
                                                    </button>
                                                </label>
                                            </div>
                                            <div class="w-100 row no-space">
                                                <div v-if="localLinks.length>0" v-for="(link, index) in localLinks" :key="index"
                                                    class="col-12 d-flex pl-0">
                                                    <div class="input-wrapper big d-flex">
                                                        <span>{{ index + 1}}.</span>
                                                        <input type="text" 
                                                            class="form-control" 
                                                            id="link"
                                                            v-model="localLinks[index]" 
                                                            ref="inputLinkRefs"
                                                            />
                                                        <button class="btn-delete-input"
                                                            type="button"
                                                            @click="onDeleteElement(index, localLinks)">
                                                            <font-awesome-icon :icon="['far', 'trash-can']" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="col-12 pt-0" v-else>
                                                    <div class="w-100 empty-elements text-slate-400">
                                                        <span>There are no links associated with this community</span>
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
                                                    <span class="label-text w-100">
                                                        Contacts
                                                        <span class="text-red-400 required">*</span>
                                                    </span>
                                                    <button class="btn-form-add btn-primary"
                                                        @click="onAddElement(localContacts, inputContactsRefs)"
                                                        type="button"
                                                        :disabled="checkEmptyContacts">
                                                        <font-awesome-icon :icon="['fas', 'plus']" />
                                                    </button>
                                                </label>
                                            </div>
                                            <div class="w-100 row no-space">
                                                <div v-if="localContacts.length>0" v-for="(contact, index) in localContacts" :key="index" 
                                                    class="col-12 pt-0">
                                                    <div class="input-wrapper big d-flex">
                                                        <input type="text" 
                                                            class="form-control"
                                                            ref="inputContactsRefs"
                                                            v-model="localContacts[index]" />
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
                                            <label for="schema" class="w-100">
                                                Schema
                                                <span class="text-red-400 required">*</span>
                                            </label>
                                            <div class="w-100 d-flex">
                                                <input type="text" class="form-control custom-entry-input" 
                                                    id="schema"
                                                    placeholder="https://schema.org/Community"
                                                    v-model="state._schema" />
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
                                                    <span class="label-text w-100">
                                                        Keywords
                                                    </span>
                                                    <button class="btn-form-add btn-primary"
                                                        @click="onAddElement(localKeywords, inputKeywordsRefs)"
                                                        type="button"
                                                        :disabled="checkEmptyKeywords">
                                                        <font-awesome-icon :icon="['fas', 'plus']" />
                                                    </button>
                                                </label>
                                            </div>
                                            <div class="w-100 row no-space">
                                                <div v-if="localKeywords.length>0" v-for="(keys, index) in localKeywords" :key="index"
                                                    class="col-6 pt-0">
                                                    <div class="input-wrapper">
                                                        <input type="text" 
                                                            class="form-control"
                                                            v-model="localKeywords[index]"
                                                            ref="inputKeywordsRefs"
                                                            />
                                                        <button class="btn-delete-input"
                                                            type="button">
                                                            <font-awesome-icon :icon="['far', 'trash-can']" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="col-12 pt-0" v-else>
                                                    <div class="w-100 empty-elements text-slate-400">
                                                        <span>There are no keywords associated with this community</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="errors" v-if="errors.length>0">
                                <div class="alert alert-danger">
                                    {{ getErrors }}
                                </div>
                            </div>
                            <div class="form-footer">
                                <UButton type="button" variant="secondary"
                                    @click="goBack">
                                    Cancel
                                </UButton>
                                <UButton type="submit">
                                    Submit
                                </UButton>
                            </div>
                        </div>
                    </UForm>
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
                    <button type="button" class="btn-dialog bg-slate-50" @click="isDialogOpened = false">No</button>
                    <button type="button" class="btn-dialog btn-primary btn-ok" @click="deleteElement">Yes</button>
                </template>
                <template v-else>
                    <button type="button" class="btn-primary" @click="isDialogOpened = false">Cancel</button>
                </template>
            </template>
        </CustomDialog>
    </div>
</template>


<script setup lang="ts">
import { computed, ref, nextTick } from "vue";
import { Community } from "@/types/communities";
import { CommunityStatusLabels } from '@/constants/community_const';
import { useRouter } from "vue-router";
import CustomSubtitle from "@/components/Common/CustomSubtitle.vue";
import type { FormSubmitEvent } from '#ui/types';
import CustomDialog from "@/components/Common/CustomDialog.vue";
import { object, string, array, safeParse, nonEmpty } from 'valibot';

const router = useRouter();
const { data } = useAuth();
const token: string = data?.value.accessToken;

const state = ref({
    _id: '',
    acronym: '',
    status: '',
    name: '',
    description: '',
    links: [],
    keywords: [],
    _schema: 'https://www.elixir-europe.org/excelerate/WP2/json-schemas/1.0/Community',
    community_contact_ids: []
});

const schema = object({
    _id: string(),
    acronym: string(),
    status: string(),
    name: string(),
    description: string(),
    _schema: string(),
    links: array(),
    keywords: array(),
    community_contact_ids: array(string([nonEmpty('No puede estar vacío')]))
});

const errors = ref<string[]>([]);
const inputLinkRefs = ref<(HTMLInputElement | null)[]>([]);
const inputContactsRefs = ref<(HTMLInputElement | null)[]>([]);
const inputKeywordsRefs = ref<(HTMLInputElement | null)[]>([]);

// Default value is active?
const localStatus = ref({
    value: "active",
    label: "Active"
});

let dialogTitle = ref("");
let dialogType = ref("yesno");
let isDialogOpened = ref(false);
let dialogText = ref("");
let dialogElement = ref<{ element: string[]; index: number } | null>(null);

state.value.status = localStatus.value.value;

let localContacts = ref<string[]>([]);
let localLinks = ref<string[]>([]);
let localKeywords = ref<string[]>([]);

const checkEmptyLinks = computed(() => {
    return localLinks.value.some((link: string) => link === '');
});

const checkEmptyContacts = computed(() => {
    return localContacts.value.some((contact: string) => contact === '');
});

const checkEmptyKeywords = computed(() => {
    return localKeywords.value.some((keyword: string) => keyword === '');
});

function validateRequiredFields(data: any): string[] {
    const requiredFields = ['_id', '_schema', 'acronym', 'status', 'community_contact_ids'];
    const errorMessages: string[] = [];
    
    requiredFields.forEach(field => {
        if (typeof data[field] === 'string' && data[field].trim() === '') {
            errorMessages.push(`${field} cannot be empty`);
        }
    });
    data.community_contact_ids.forEach((contact: string, index: number) => {
        if (contact.trim() === '') {
            errorMessages.push(`community_contact_ids[${index}] cannot be empty`);
        }
    });
    return errorMessages;
}

function deleteEmptyElements(array: string[]) {
    return array.filter((element: string) => element !== '');
}

async function onSubmitCommunity(event: FormSubmitEvent<Schema>) {
    event.preventDefault();

    const result = safeParse(schema, state.value);

    if (result.success) {
        const customErrors = validateRequiredFields(state.value);

        if (customErrors.length > 0) {
            errors.value = customErrors;
        } else {
            const response = await createCommunity();
            console.log(response);
        }
    } else {
        errors.value = result.error.issues.map(issue => issue.message);
    }
}

//["Salvador.Capella-Gutierrez"]
async function createCommunity() {
    let cleanLinks = deleteEmptyElements(localLinks.value);
    let cleanKeywords = deleteEmptyElements(localKeywords.value);
    let cleanContacts = deleteEmptyElements(localContacts.value);

    const body = [{
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
    }];

    try {
        const response = await fetch(`/api/staged/Community`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }

        const responseData = await response.json();
        if(responseData.status == 200) {
            errors.value = [];
            router.push("/dashboard/communities");
        } else {
            let errorResponse = JSON.parse(responseData.body);
            errors.value = errorResponse.error.map((error: any) => {
                if(error.pointer) {
                    return `${error.message}`;
                }
                return error.message;
            });
        }
    } catch (error) {
        console.error("Error fetching communities data:", error);
    }
}


function goBack() {
    router.push("/dashboard/communities");
}

const getErrors = computed(() => errors.value.join(", "));

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
    dialogElement.value = null;
    if (element[index] === '') {
        element.splice(index, 1);
    } else {
        dialogElement.value = {
            element: element,
            index: index
        };
        dialogText.value = "Are you sure you want to delete this element?";
        dialogTitle.value = "Delete Element";
        isDialogOpened.value = true;
    }
    inputRefs.value.splice(index, 1); // Remove the corresponding ref
}

function deleteElement() {
    console.log("Deleting element");
    isDialogOpened.value = false;
    dialogElement.value?.element.splice(dialogElement.value.index, 1);
    dialogElement.value = null;
}

function dialogShow() {
    console.log('dialogShow!!!!');
}


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
            //background-color: rgba(233, 236, 239, .4) ;
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
                .empty-elements {
                    text-align: center;
                    font-size: 14px;
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
                padding-bottom: 5px;
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
                .no-space {
                    padding: 0;
                }
                &__box {
                    padding: 10px 20px;
                    border: 1px solid rgba(233,236,239);
                    background-color: white;
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
</style>