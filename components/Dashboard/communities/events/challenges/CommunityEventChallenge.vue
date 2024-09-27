<template>
    <div class="dashboard-community-event-challenge-edit">
        <div class="w-100 container">
            <div class="w-100" v-if="isLoadingData">
                <div class="space-y-2">
                    <USkeleton class="dashboard-community-edit__skeleton__small" />
                    <USkeleton class="dashboard-community-edit__skeleton__big" />
                </div>
            </div>
            <div class="dashboard-community-event-challenge-edit__content" v-else>
                <div class="w-100">
                    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmitCommunityEvent">
                        <div class="w-100 form-card">
                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="name">Name</label>
                                        <input type="text" class="form-control" id="name" v-model="challengeData.name"
                                            :disabled="!challengePrivileges.update || isView" />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    <div class="form-group">
                                        <label for="acronym">Acronym</label>
                                        <input type="text" class="form-control" id="acronym" v-model="challengeData.acronym"
                                            :disabled="!challengePrivileges.update || isView" />
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="form-group">
                                        <label for="acronym">Orig ID</label>
                                        <input type="text" class="form-control" id="acronym" v-model="challengeData.orig_id"
                                            :disabled="!challengePrivileges.update || isView" />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    <div class="form-group">
                                        <label for="dates">dates</label>
                                        <input type="text" class="form-control" id="dates" v-model="challengeData.dates.benchmark_start"
                                            :disabled="!challengePrivileges.update || isView" />
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="form-group">
                                        <label for="benchmarking_event_id">Benchmarking Event Id</label>
                                        <input type="text" class="form-control" id="benchmarking_event_id" v-model="challengeData.benchmarking_event_id"
                                            disabled />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="_schema">Schema</label>
                                        <input type="text" class="form-control" id="_schema" v-model="challengeData._schema"
                                            :disabled="!challengePrivileges.update || isView" />
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
                                                            @click="onAddElement(localReferences)"
                                                            :disabled="!challengePrivileges.update || isView || checkEmptyReferences">
                                                            <font-awesome-icon :icon="['fas', 'plus']" />
                                                        </button>
                                                    </label>
                                                </div>
                                                <div class="w-100 row no-space">
                                                    {{  localReferences }}
                                                    <div v-if="localReferences.length>0" v-for="(reference, index) in localReferences" :key="index" 
                                                        class="col-12 pt-0 pb-1">
                                                        <div class="input-wrapper">
                                                            <input type="text" class="form-control" 
                                                                v-model="localReferences[index]" 
                                                                :disabled="!challengePrivileges.update || isView" />
                                                            <button class="btn-delete-input"
                                                                v-if="challengePrivileges.update && !isView">
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
                                                            @click="onAddElement(localContacts)"
                                                            :disabled="!challengePrivileges.update || isView || checkEmptyContacts">
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
                                                                :disabled="!challengePrivileges.update || isView" />
                                                            <button class="btn-delete-input"
                                                                v-if="challengePrivileges.update && !isView">
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
                                <div class="row">
                                    <div class="col-12">
                                        <div class="form-card__row__box">
                                            <div class="form-group">
                                                <div class="w-100">
                                                    <label for="contacts"
                                                        class="form-group-row">
                                                        <span class="label-text">
                                                            Metrics References
                                                        </span>
                                                        <button class="btn-form-add btn-primary"
                                                            @click="onAddElement(localMetricsCategories)"
                                                            :disabled="!challengePrivileges.update || isView || checkEmptyReferences">
                                                            <font-awesome-icon :icon="['fas', 'plus']" />
                                                        </button>
                                                    </label>
                                                </div>
                                                <div class="w-100 row no-space">
                                                    <div v-if="localMetricsCategories.length>0" v-for="(metrics, index) in localMetricsCategories" :key="index" 
                                                        class="col-12 pt-0 pb-1">
                                                        <div class="input-wrapper">
                                                            <div class="w-100 d-block">
                                                                <input type="text" class="form-control" 
                                                                    v-model="localMetricsCategories[index].category" 
                                                                    :disabled="!challengePrivileges.update || isView" />
                                                                <textarea type="text" class="form-control" 
                                                                    v-model="localMetricsCategories[index].description" 
                                                                    :disabled="!challengePrivileges.update || isView">
                                                                </textarea>
                                                            </div>
                                                            <button class="btn-delete-input"
                                                                v-if="challengePrivileges.update && !isView">
                                                                <font-awesome-icon :icon="['far', 'trash-can']" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div class="col-12 pt-0" v-else>
                                                        <div class="w-100 empty-elements text-slate-400">
                                                            <span>There are no metrics reference associated with this event</span>
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
                                    :disabled="!challengePrivileges.update || isView"
                                    v-if="challengePrivileges.update && !isView">
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
    import { computed, ref, watch } from "vue";
    import { Challenge, ChallengeDates } from "@/types/challenge";
    import { CommunityPrivilegeActions } from '@/constants/privileges';
    import CustomDialog from "@/components/Common/CustomDialog.vue";
    import * as v from "valibot";

    const router = useRouter();
    const { data } = useAuth();

    const props = defineProps<{
        id: string,
        communityId: string,
        eventId: string,
        isLoadingData: boolean,
        isView: boolean,
        challengePrivileges: CommunityPrivilegeActions,
        challengeObj: Challenge,
    }>();

    let dialogTitle = ref("");
    let dialogType = ref("yesno");
    let isDialogOpened = ref(false);
    let dialogText = ref("");

    console.log(props.challengeObj);

    const state = ref({
        name: '',
        acronym: '',
        _schema: '',
        benchmarking_event_id: '',
        challenge_contact_ids: [],
        dates: {
            benchmark_start: '',
            benchmark_stop: ''
        },
        url: '',
        orig_id: '',
        references: [],
        metrics_categories: [],
    });

    const schema = v.object({
        name: v.string(),
        acronym: v.string(),
        _schema: v.string(),
        url: v.string(),
        orig_id: v.string(),
    });

    const challengeData = computed(() => {
        state.value = {
            name: props.challengeObj?.name || '',
            acronym: props.challengeObj?.acronym || '',
            _schema: props.challengeObj?._schema || '',
            benchmarking_event_id: props.challengeObj?.benchmarking_event_id || '',
            challenge_contact_ids: props.challengeObj?.challenge_contact_ids || [],
            dates: {
                benchmark_start: props.challengeObj?.dates?.benchmark_start || '',
                benchmark_stop: props.challengeObj?.dates?.benchmark_stop || ''
            },
            url: props.challengeObj?.url || '',
            orig_id: props.challengeObj?.orig_id || '',
            references: props.challengeObj?.references || [],
            metrics_categories: props.challengeObj?.metrics_categories || [],
        }

        return state.value;
    })

    let localReferences = ref<string[]>([]);
    if (props.challengeObj && props.challengeObj.references) {
        localReferences.value = props.challengeObj.references;
    }

    let localMetricsCategories = ref<string[]>([]);
    if (props.challengeObj && props.challengeObj.metrics_categories) {
        localMetricsCategories.value = props.challengeObj.metrics_categories;
    }

    let localContacts = ref<string[]>([]);
    if (props.challengeObj && props.challengeObj.challenge_contact_ids) {
        localContacts.value = props.challengeObj.challenge_contact_ids.map((contact: string) => {
        return contact.replace(/\./g, " ");
    }) || [];
}

function onAddElement(array: []) {
    array.push('');
}

const checkEmptyContacts = computed(() => {
    return localContacts.value.some((contact: string) => contact === '');
});

const checkEmptyReferences = computed(() => {
    return localReferences.value.some((keyword: string) => keyword === '');
});

const checkEmptyMetricsCategories = computed(() => {
    return localMetricsCategories.value.some((category: string) => category === '');
});

function goBack() {
    router.push(`/dashboard/communities/${props.communityId}/events/${props.eventId}/challenges`);
}

watch(
    () => props.challengeObj,
    (newVal) => {
        if (newVal && newVal.references) {
            localReferences.value = newVal.references;
        }
        if (newVal && newVal.challenge_contact_ids) {
            localContacts.value = newVal.challenge_contact_ids.map((contact: string) => {
                return contact.replace(/\./g, " ");
            }) || [];
        }
        if (newVal && newVal.metrics_categories) {
            localMetricsCategories.value = newVal.metrics_categories;
        }
    },
    { immediate: true }
);
</script>

<style scoped lang="scss">
    .dashboard-community-event-challenge-edit {
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
                }
            }
        }
        .custom-entry-input::placeholder {
            opacity: 0.5;
            color: rgba(0, 0, 0, 0.3);
        }
    }
</style>