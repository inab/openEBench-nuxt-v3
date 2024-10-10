<template>
  <div class="dashboard-community-event-challenge-edit">
    <div class="w-100 container">
      <div v-if="isLoadingData" class="w-100">
        <div class="space-y-2">
          <USkeleton class="dashboard-community-edit__skeleton__small" />
          <USkeleton class="dashboard-community-edit__skeleton__big" />
        </div>
      </div>
      <div v-else class="dashboard-community-event-challenge-edit__content">
        <div class="w-100">
          <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmitCommunityEvent"
          >
            <div class="w-100 form-card">
              <div class="row">
                <div class="col-12">
                  <div class="form-group">
                    <label for="name">Name</label>
                    <input
                      id="name"
                      v-model="challengeData.name"
                      type="text"
                      class="form-control"
                      :disabled="!challengePrivileges.update || isView"
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <div class="form-group">
                    <label for="acronym">Acronym</label>
                    <input
                      id="acronym"
                      v-model="challengeData.acronym"
                      type="text"
                      class="form-control"
                      :disabled="!challengePrivileges.update || isView"
                    />
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-group">
                    <label for="acronym">Orig ID</label>
                    <input
                      id="acronym"
                      v-model="challengeData.orig_id"
                      type="text"
                      class="form-control"
                      :disabled="!challengePrivileges.update || isView"
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <div class="form-group">
                    <label for="dates">dates</label>
                    <input
                      id="dates"
                      v-model="challengeData.dates.benchmark_start"
                      type="text"
                      class="form-control"
                      :disabled="!challengePrivileges.update || isView"
                    />
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-group">
                    <label for="benchmarking_event_id"
                      >Benchmarking Event Id</label
                    >
                    <input
                      id="benchmarking_event_id"
                      v-model="challengeData.benchmarking_event_id"
                      type="text"
                      class="form-control"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="form-group">
                    <label for="_schema">Schema</label>
                    <input
                      id="_schema"
                      v-model="challengeData._schema"
                      type="text"
                      class="form-control"
                      :disabled="!challengePrivileges.update || isView"
                    />
                  </div>
                </div>
              </div>
              <div class="w-100">
                <div class="row">
                  <div class="col-6">
                    <div class="form-card__row__box">
                      <div class="form-group">
                        <div class="w-100">
                          <label for="contacts" class="form-group-row">
                            <span class="label-text"> References </span>
                            <button
                              class="btn-form-add btn-primary"
                              :disabled="
                                !challengePrivileges.update ||
                                isView ||
                                checkEmptyReferences
                              "
                              @click="onAddElement(localReferences)"
                            >
                              <font-awesome-icon :icon="['fas', 'plus']" />
                            </button>
                          </label>
                        </div>
                        <div class="w-100 row no-space">
                          {{ localReferences }}
                          <div
                            v-for="(reference, index) in localReferences"
                            v-if="localReferences.length > 0"
                            :key="index"
                            class="col-12 pt-0 pb-1"
                          >
                            <div class="input-wrapper">
                              <input
                                v-model="localReferences[index]"
                                type="text"
                                class="form-control"
                                :disabled="
                                  !challengePrivileges.update || isView
                                "
                              />
                              <button
                                v-if="challengePrivileges.update && !isView"
                                class="btn-delete-input"
                              >
                                <font-awesome-icon
                                  :icon="['far', 'trash-can']"
                                />
                              </button>
                            </div>
                          </div>
                          <div v-else class="col-12 pt-0">
                            <div class="w-100 empty-elements text-slate-400">
                              <span
                                >There are no reference associated with this
                                event</span
                              >
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
                          <label for="contacts" class="form-group-row">
                            <span class="label-text"> Contacts </span>
                            <button
                              class="btn-form-add btn-primary"
                              :disabled="
                                !challengePrivileges.update ||
                                isView ||
                                checkEmptyContacts
                              "
                              @click="onAddElement(localContacts)"
                            >
                              <font-awesome-icon :icon="['fas', 'plus']" />
                            </button>
                          </label>
                        </div>
                        <div class="w-100 row no-space">
                          <div
                            v-for="(contact, index) in localContacts"
                            v-if="localContacts.length > 0"
                            :key="index"
                            class="col-12 pt-0 pb-1"
                          >
                            <div class="input-wrapper">
                              <input
                                v-model="localContacts[index]"
                                type="text"
                                class="form-control"
                                :disabled="
                                  !challengePrivileges.update || isView
                                "
                              />
                              <button
                                v-if="challengePrivileges.update && !isView"
                                class="btn-delete-input"
                              >
                                <font-awesome-icon
                                  :icon="['far', 'trash-can']"
                                />
                              </button>
                            </div>
                          </div>
                          <div v-else class="col-12 pt-0">
                            <div class="w-100 empty-elements text-slate-400">
                              <span
                                >There are no contacts associated with this
                                event</span
                              >
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
                          <label for="contacts" class="form-group-row">
                            <span class="label-text"> Metrics References </span>
                            <button
                              class="btn-form-add btn-primary"
                              :disabled="
                                !challengePrivileges.update ||
                                isView ||
                                checkEmptyReferences
                              "
                              @click="onAddElement(localMetricsCategories)"
                            >
                              <font-awesome-icon :icon="['fas', 'plus']" />
                            </button>
                          </label>
                        </div>
                        <div class="w-100 row no-space">
                          <div
                            v-for="(metrics, index) in localMetricsCategories"
                            v-if="localMetricsCategories.length > 0"
                            :key="index"
                            class="col-12 pt-0 pb-1"
                          >
                            <div class="input-wrapper">
                              <div class="w-100 d-block">
                                <input
                                  v-model="
                                    localMetricsCategories[index].category
                                  "
                                  type="text"
                                  class="form-control"
                                  :disabled="
                                    !challengePrivileges.update || isView
                                  "
                                />
                                <textarea
                                  v-model="
                                    localMetricsCategories[index].description
                                  "
                                  type="text"
                                  class="form-control"
                                  :disabled="
                                    !challengePrivileges.update || isView
                                  "
                                >
                                </textarea>
                              </div>
                              <button
                                v-if="challengePrivileges.update && !isView"
                                class="btn-delete-input"
                              >
                                <font-awesome-icon
                                  :icon="['far', 'trash-can']"
                                />
                              </button>
                            </div>
                          </div>
                          <div v-else class="col-12 pt-0">
                            <div class="w-100 empty-elements text-slate-400">
                              <span
                                >There are no metrics reference associated with
                                this event</span
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-footer">
                <UButton type="button" variant="secondary" @click="goBack">
                  Cancel
                </UButton>
                <UButton
                  v-if="challengePrivileges.update && !isView"
                  type="submit"
                  :disabled="!challengePrivileges.update || isView"
                >
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
import type { Challenge } from "@/types/challenge";
import { ChallengeDates } from "@/types/challenge";
import type { CommunityPrivilegeActions } from "@/constants/privileges";
import CustomDialog from "@/components/Common/CustomDialog.vue";
import * as v from "valibot";

const router = useRouter();
const { data } = useAuth();

const props = defineProps<{
  id: string;
  communityId: string;
  eventId: string;
  isLoadingData: boolean;
  isView: boolean;
  challengePrivileges: CommunityPrivilegeActions;
  challengeObj: Challenge;
}>();

const dialogTitle = ref("");
const dialogType = ref("yesno");
const isDialogOpened = ref(false);
const dialogText = ref("");

console.log(props.challengeObj);

const state = ref({
  name: "",
  acronym: "",
  _schema: "",
  benchmarking_event_id: "",
  challenge_contact_ids: [],
  dates: {
    benchmark_start: "",
    benchmark_stop: "",
  },
  url: "",
  orig_id: "",
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
    name: props.challengeObj?.name || "",
    acronym: props.challengeObj?.acronym || "",
    _schema: props.challengeObj?._schema || "",
    benchmarking_event_id: props.challengeObj?.benchmarking_event_id || "",
    challenge_contact_ids: props.challengeObj?.challenge_contact_ids || [],
    dates: {
      benchmark_start: props.challengeObj?.dates?.benchmark_start || "",
      benchmark_stop: props.challengeObj?.dates?.benchmark_stop || "",
    },
    url: props.challengeObj?.url || "",
    orig_id: props.challengeObj?.orig_id || "",
    references: props.challengeObj?.references || [],
    metrics_categories: props.challengeObj?.metrics_categories || [],
  };

  return state.value;
});

const localReferences = ref<string[]>([]);
if (props.challengeObj && props.challengeObj.references) {
  localReferences.value = props.challengeObj.references;
}

const localMetricsCategories = ref<string[]>([]);
if (props.challengeObj && props.challengeObj.metrics_categories) {
  localMetricsCategories.value = props.challengeObj.metrics_categories;
}

const localContacts = ref<string[]>([]);
if (props.challengeObj && props.challengeObj.challenge_contact_ids) {
  localContacts.value =
    props.challengeObj.challenge_contact_ids.map((contact: string) => {
      return contact.replace(/\./g, " ");
    }) || [];
}

function onAddElement(array: []) {
  array.push("");
}

const checkEmptyContacts = computed(() => {
  return localContacts.value.some((contact: string) => contact === "");
});

const checkEmptyReferences = computed(() => {
  return localReferences.value.some((keyword: string) => keyword === "");
});

const checkEmptyMetricsCategories = computed(() => {
  return localMetricsCategories.value.some(
    (category: string) => category === "",
  );
});

function goBack() {
  router.push(
    `/dashboard/communities/${props.communityId}/events/${props.eventId}/challenges`,
  );
}

watch(
  () => props.challengeObj,
  (newVal) => {
    if (newVal && newVal.references) {
      localReferences.value = newVal.references;
    }
    if (newVal && newVal.challenge_contact_ids) {
      localContacts.value =
        newVal.challenge_contact_ids.map((contact: string) => {
          return contact.replace(/\./g, " ");
        }) || [];
    }
    if (newVal && newVal.metrics_categories) {
      localMetricsCategories.value = newVal.metrics_categories;
    }
  },
  { immediate: true },
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
      background-color: rgba(255, 255, 255, 0.8);
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
        .col-6,
        .col-3 {
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
    .btn-form-add.btn-primary {
      padding: 1px 6px;
      height: 28px;
    }
  }
  .form-card {
    padding: 10px 15px;
    border-radius: 5px;
    background-color: rgba(233, 236, 239, 0.2);
    box-shadow:
      rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
      rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
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
        border: 1px solid rgba(233, 236, 239);
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
