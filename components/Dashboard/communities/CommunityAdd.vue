<template>
    <div class="dashboard-community-edit">
        <div class="w-100 container">
            <div class="dashboard-community-edit__title">
                <h2 class="text-primaryOeb-500 ">
                    <span class="">Add New Community</span>
                </h2>
            </div>
            <div class="dashboard-community-edit__content">
                <div class="">
                    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmitCommunity">
                        <div class="w-100 form-card">
                            <div class="row">
                                <div class="col-8">
                                    <div class="form-group">
                                        <label for="acronym">Acronym</label>
                                        <input type="text" class="form-control custom-entry-input" 
                                            id="acronym"
                                            placeholder="Community acronym" 
                                            v-model="state.acronym" />
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
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="description">Name</label>
                                        <input type="text" class="form-control custom-entry-input" 
                                            placeholder="Community name" 
                                            id="name" 
                                            v-model="state.name" />
                                    </div>
                                </div>
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
                                                    <span class="label-text text-gray-500">
                                                        Links
                                                    </span>
                                                    <button class="btn-form-add btn-primary"
                                                        @click="onAddElement(localLinks)"
                                                        :disabled="checkEmptyLinks">
                                                        <font-awesome-icon :icon="['fas', 'plus']" />
                                                    </button>
                                                </label>
                                            </div>
                                            <div class="w-100 row no-space">
                                                <div v-if="localLinks.length>0" v-for="(link, index) in localLinks" :key="link"
                                                    class="col-12 d-flex pl-0">
                                                    <div class="input-wrapper big d-flex">
                                                        <span>{{ index + 1}}.</span>
                                                        <input type="text" class="form-control" 
                                                            id="link" 
                                                            v-model="localLinks[index]" />
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
                                                    <span class="label-text text-gray-500">
                                                        Contacts
                                                    </span>
                                                    <button class="btn-form-add btn-primary"
                                                        @click="onAddElement(localContacts)"
                                                        :disabled="cheEmptyContacts">
                                                        <font-awesome-icon :icon="['fas', 'plus']" />
                                                    </button>
                                                </label>
                                            </div>
                                            <div class="w-100 row no-space">
                                                <div v-if="localContacts.length>0" v-for="(contact, index) in localContacts" :key="index" 
                                                    class="col-6 pt-0">
                                                    <div class="input-wrapper">
                                                        <input type="text" class="form-control" 
                                                            v-model="localContacts[index]" />
                                                        <button class="btn-delete-input">
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
                                            <label for="provenance" class="text-gray-500">Provenance</label>
                                            <div class="w-100 d-flex">
                                                <input type="text" class="form-control custom-entry-input" 
                                                    id="schema"
                                                    placeholder="https://provenance.org/Community" 
                                                    v-model="state._provenance" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="form-card__row__box">
                                    <div class="col-12">
                                        <div class="form-group">
                                            <label for="schema" class="text-gray-500">Schema</label>
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
                                                    <span class="label-text text-gray-500">
                                                        Keywords
                                                    </span>
                                                    <button class="btn-form-add btn-primary"
                                                        @click="onAddElement(localKeywords)"
                                                        :disabled="checkEmptyKeywords">
                                                        <font-awesome-icon :icon="['fas', 'plus']" />
                                                    </button>
                                                </label>
                                            </div>
                                            <div class="w-100 row no-space">
                                                <div v-if="localKeywords.length>0" v-for="(keys, index) in localKeywords" :key="index"
                                                    class="col-6 pt-0">
                                                    <div class="input-wrapper">
                                                        <input type="text" class="form-control" 
                                                            v-model="localKeywords[index]" />
                                                        <button class="btn-delete-input">
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
import { Community } from "@/types/communities";
import { CommunityStatusLabels } from '@/constants/community_const';
import { useRouter } from "vue-router";
import CustomSubtitle from "@/components/Common/CustomSubtitle.vue";
import type { FormSubmitEvent } from '#ui/types'
import * as v from "valibot";

const router = useRouter();
const { data } = useAuth();
const token: string = data?.value.accessToken;

const state = ref({
    acronym: '',
    status: '',
    name: '',
    description: '',
    _provenance: '',
    _schema: ''
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

// Default value is active?
const localStatus = ref({
    value: "active",
    label: "Active"
});
let localContacts = ref<string[]>([]);
let localLinks = ref<string[]>([]);
let localKeywords = ref<string[]>([]);

const checkEmptyLinks = computed(() => {
    return localLinks.value.some((link: string) => link === '');
});

const cheEmptyContacts = computed(() => {
    return localContacts.value.some((contact: string) => contact === '');
});

const checkEmptyKeywords = computed(() => {
    return localKeywords.value.some((keyword: string) => keyword === '');
});

async function onSubmitCommunity(event: FormSubmitEvent<Schema>) {
    event.preventDefault();

    const result = v.safeParse(schema, state.value);
    if (result.success) {
        const response = await createCommunity();
        /* TODO */
    } else {
        errors.value = result.error.issues.map(issue => issue.message);
    }
}

async function createCommunity() {
    const body = [{
        _id: "OEBC998",
        _schema: "https://www.elixir-europe.org/excelerate/WP2/json-schemas/1.0/Community",
        name: state.name,
        acronym: state.acronym,
        status: state.status,
        community_contact_ids: ["Salvador.Capella-Gutierrez"],
        description: state.description,
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

        console.log(response);

        const data = await response.json();
        console.log('Respuesta exitosa:', data);
    } catch (error) {
        console.error("Error fetching communities data:", error);
    }
}


function goBack() {
    router.push("/dashboard/communities");
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
                grid-template-columns: auto auto;
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
</style>