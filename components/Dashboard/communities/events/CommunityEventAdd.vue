<template>
    <div class="dashboard-community-event-add">
        <div class="w-100 container">
            <div class="dashboard-community-event-addt__title">
                <h2 class="text-primaryOeb-500 ">
                    <span class="">Add New Event</span>
                </h2>
            </div>
            <div class="dashboard-community-event-add__content">
                <div class="w-100">
                    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmitCommunityEvent">
                        <div class="w-100 form-card">
                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="name">Name</label>
                                        <input type="text" class="form-control custom-entry-input" id="name" 
                                            v-model="state.name"
                                            placeholder="Event name"
                                            :disabled="!eventPrivileges.event.create" />
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="form-group">
                                        <label for="orig_id">Orig ID</label>
                                        <input type="text" class="form-control custom-entry-input" id="orig_id" 
                                            v-model="state.orig_id"
                                            placeholder="Orig ID"
                                            :disabled="!eventPrivileges.event.create" />
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="form-group">
                                        <label for="url">URL</label>
                                        <input type="text" class="form-control custom-entry-input" id="url" 
                                            v-model="state.url"
                                            placeholder="URL"
                                            :disabled="!eventPrivileges.event.create" />
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="schema">Schema</label>
                                        <input type="text" class="form-control custom-entry-input" id="schema" 
                                            v-model="state._schema"
                                            placeholder="Schema"
                                            :disabled="!eventPrivileges.event.create" />
                                    </div>
                                </div>
                            </div>
                            <div class="w-100">
                                <div class="row">
                                    <div class="col-6">
                                        <div class="form-card__row__box">
                                            <div class="form-group">
                                                <div class="w-100">
                                                    <label for="contacts"
                                                        class="form-group-row">
                                                        <span class="label-text">
                                                            References
                                                        </span>
                                                        <button class="btn-form-add btn-primary"
                                                            type="button"
                                                            @click="onAddElement(localReferences)"
                                                            :disabled="!eventPrivileges.event.create || checkEmptyReferences">
                                                            <font-awesome-icon :icon="['fas', 'plus']" />
                                                        </button>
                                                    </label>
                                                </div>
                                                <div class="w-100 row no-space">
                                                    <div v-if="localReferences.length>0" v-for="(reference, index) in localReferences" :key="index" 
                                                        class="col-12 pt-0 pb-1">
                                                        <div class="input-wrapper">
                                                            <input type="text" class="form-control" 
                                                                v-model="localReferences[index]" 
                                                                :disabled="!eventPrivileges.event.create" />
                                                            <button class="btn-delete-input"
                                                                type="button"
                                                                v-if="eventPrivileges.event.create">
                                                                <font-awesome-icon :icon="['far', 'trash-can']" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div class="col-12 pt-0" v-else>
                                                        <div class="w-100 empty-elements text-slate-400">
                                                            <span>There are no reference associated with this event</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-card__row__box">
                                            <div class="form-group">
                                                <div class="w-100">
                                                    <label for="contacts"
                                                        class="form-group-row">
                                                        <span class="label-text">
                                                            Contacts
                                                        </span>
                                                        <button class="btn-form-add btn-primary"
                                                            type="button"
                                                            @click="onAddElement(localContacts)"
                                                            :disabled="!eventPrivileges.event.create || cheEmptyContacts">
                                                            <font-awesome-icon :icon="['fas', 'plus']" />
                                                        </button>
                                                    </label>
                                                </div>
                                                <div class="w-100 row no-space">
                                                    <div v-if="localContacts.length>0" v-for="(contact, index) in localContacts" :key="index" 
                                                        class="col-12 pt-0 pb-1">
                                                        <div class="input-wrapper">
                                                            <input type="text" class="form-control" 
                                                                v-model="localContacts[index]" 
                                                                :disabled="!eventPrivileges.event.create" />
                                                            <button class="btn-delete-input"
                                                                v-if="eventPrivileges.event.create"
                                                                type="button">
                                                                <font-awesome-icon :icon="['far', 'trash-can']" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div class="col-12 pt-0" v-else>
                                                        <div class="w-100 empty-elements text-slate-400">
                                                            <span>There are no contacts associated with this event</span>
                                                        </div>
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
                                    :disabled="!eventPrivileges.event.create"
                                    v-if="eventPrivileges.event.create">
                                    Submit
                                </UButton>
                            </div>
                        </div>
                    </UForm>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { CommunityPrivilegeActions } from '@/constants/privileges';
import type { FormSubmitEvent } from '#ui/types'
import * as v from "valibot";

const router = useRouter();
const { data } = useAuth();
const token: string = data?.value.accessToken;

const props = defineProps<{
    eventPrivileges: CommunityPrivilegeActions
}>();

const state = ref({
    _id: '',
    name: '',
    community_id: '',
    bench_contact_ids: '',
    dates: '',
    orig_id: '',
    _schema: '',
    references: [],
    url: '',
});

const schema = v.object({
    _id: v.pipe(v.string()),
    name: v.pipe(v.string()),
    community_id: v.pipe(v.string()),
    bench_contact_ids: v.pipe(v.string()),
    dates: v.pipe(v.string()),
    orig_id: v.pipe(v.string()),
    _schema: v.pipe(v.string()),
    url: v.pipe(v.string()),
});

let localReferences = ref<string[]>([]);
let localContacts = ref<string[]>([]);

function onAddElement(array: string[]) {
    console.log(array);
    array.push('');
}

const cheEmptyContacts = computed(() => {
    return localContacts.value.some((contact: string) => contact === '');
});

const checkEmptyReferences = computed(() => {
    return localReferences.value.some((keyword: string) => keyword === '');
});

function goBack() {
    console.log("going back");
    router.push(`/dashboard/communities/${state.value.community_id}`);
}

function onSubmitCommunityEvent(event: FormSubmitEvent) {
    console.log("submitting...");
    console.log(event);
}

</script>

<style scoped lang="scss">
.dashboard-community-event-add {
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
                &.no-space {
                    padding: 0;
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
            grid-template-columns: auto auto;
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
                .content-box {
                    border: 1px solid rgba(233,236,239);
                }
            }
        }
        &__box {
            padding: 10px 20px;
            border: 1px solid rgba(233,236,239);
            background-color: white;
            &:last-child {
                width: 100%;
                grid-column: span 2;
            }
        }
    }
    .custom-entry-input::placeholder {
        opacity: 0.5;
        color: rgba(0, 0, 0, 0.3);
    }
}
</style>