<template>
  <div class="dashboard-community-event-edit">
    <div class="w-100 container">
      <div v-if="isLoadingData" class="">
        <div class="space-y-2">
          <USkeleton class="dashboard-community-edit__skeleton__small" />
          <USkeleton class="dashboard-community-edit__skeleton__big" />
        </div>
      </div>
      <div v-else class="dashboard-community-event-edit__content">
        <div class="w-100">
          <UTabs :items="items">
            <template #icon="{ item, selected }">
              <UIcon
                :name="item.icon"
                class="w-4 h-4 flex-shrink-0 me-2"
                :class="[
                  selected &&
                    'text-secondaryOeb-500 dark:text-secondaryOeb-400',
                ]"
              />
            </template>
            <template #item="{ item }">
              <div v-if="item.key === 'summary'">
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
                            v-model="eventData.name"
                            type="text"
                            class="form-control"
                            :disabled="!eventPrivileges.update || isView"
                          />
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="form-group">
                          <label for="orig_id">Orig ID</label>
                          <input
                            id="orig_id"
                            v-model="eventData.orig_id"
                            type="text"
                            class="form-control"
                            :disabled="!eventPrivileges.update || isView"
                          />
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="form-group">
                          <label for="url">URL</label>
                          <input
                            id="url"
                            v-model="eventData.url"
                            type="text"
                            class="form-control"
                            :disabled="!eventPrivileges.update || isView"
                          />
                        </div>
                      </div>
                      <div class="col-12">
                        <div class="form-group">
                          <label for="schema">Schema</label>
                          <input
                            id="schema"
                            v-model="eventData._schema"
                            type="text"
                            class="form-control"
                            :disabled="!eventPrivileges.update || isView"
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
                                      !eventPrivileges.update ||
                                      isView ||
                                      checkEmptyReferences
                                    "
                                    @click="onAddElement(localReferences)"
                                  >
                                    <font-awesome-icon
                                      :icon="['fas', 'plus']"
                                    />
                                  </button>
                                </label>
                              </div>
                              <div class="w-100 row no-space">
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
                                        !eventPrivileges.update || isView
                                      "
                                    />
                                    <button
                                      v-if="eventPrivileges.update && !isView"
                                      class="btn-delete-input"
                                    >
                                      <font-awesome-icon
                                        :icon="['far', 'trash-can']"
                                      />
                                    </button>
                                  </div>
                                </div>
                                <div v-else class="col-12 pt-0">
                                  <div
                                    class="w-100 empty-elements text-slate-400"
                                  >
                                    <span
                                      >There are no reference associated with
                                      this event</span
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
                                      !eventPrivileges.update ||
                                      isView ||
                                      checkEmptyContacts
                                    "
                                    @click="onAddElement(localContacts)"
                                  >
                                    <font-awesome-icon
                                      :icon="['fas', 'plus']"
                                    />
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
                                        !eventPrivileges.update || isView
                                      "
                                    />
                                    <button
                                      v-if="eventPrivileges.update && !isView"
                                      class="btn-delete-input"
                                    >
                                      <font-awesome-icon
                                        :icon="['far', 'trash-can']"
                                      />
                                    </button>
                                  </div>
                                </div>
                                <div v-else class="col-12 pt-0">
                                  <div
                                    class="w-100 empty-elements text-slate-400"
                                  >
                                    <span
                                      >There are no contacts associated with
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
                      <UButton
                        type="button"
                        variant="secondary"
                        @click="goBack"
                      >
                        Cancel
                      </UButton>
                      <UButton
                        v-if="eventPrivileges.update && !isView"
                        type="submit"
                        :disabled="!eventPrivileges.update || isView"
                      >
                        Submit
                      </UButton>
                    </div>
                  </div>
                </UForm>
              </div>
              <div v-if="item.key === 'challenges'">
                <div>
                  <EventChallengesList
                    :challenges="challenges"
                    :is-loading-challenges="isLoadinChallenges"
                    :commmunity-privileges="eventPrivileges"
                    :event-id="id"
                    :community-id="communityId"
                  />
                </div>
              </div>
            </template>
          </UTabs>
        </div>
      </div>
    </div>
    <CustomDialog :is-dialog-open="isDialogOpened" @modal-close="dialogShow">
      <template #header>
        {{ dialogTitle }}
      </template>
      <template #content>
        {{ dialogText }}
      </template>
      <template #footer>
        <template v-if="dialogType && dialogType === 'yesno'">
          <button
            type="button"
            class="btn-primary"
            @click="isDialogOpened = false"
          >
            No
          </button>
          <button
            type="button"
            class="btn-primary"
            @click="isDialogOpened = false"
          >
            Yes
          </button>
        </template>
        <template v-else>
          <button
            type="button"
            class="btn-primary"
            @click="isDialogOpened = false"
          >
            Cancel
          </button>
        </template>
      </template>
    </CustomDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { Event } from "@/types/events";
import type { Challenge } from "@/types/challenge";
import type { CommunityPrivilegeActions } from "@/constants/privileges";
import EventChallengesList from "@/components/Dashboard/entries/events/EventChallengesList.vue";
import CustomDialog from "@/components/Common/CustomDialog.vue";
import * as v from "valibot";

const router = useRouter();
const { data } = useAuth();
const token: string = data?.value.accessToken;

const props = defineProps<{
  id: string;
  communityId: string;
  eventObj: Event | null;
  isLoadingData: boolean;
  isView: boolean;
  eventPrivileges: CommunityPrivilegeActions;
  challenges: Array<Challenge>;
  isLoadinChallenges: boolean;
}>();

const dialogTitle = ref("");
const dialogType = ref("yesno");
const isDialogOpened = ref(false);
const dialogText = ref("");

const items = [
  {
    key: "summary",
    label: "Event Data",
    icon: "i-heroicons-document-chart-bar",
  },
  {
    key: "challenges",
    label: "Challenges",
    icon: "i-heroicons-calendar-date-range-16-solid",
  },
];

const state = ref({
  _id: "",
  name: "",
  community_id: "",
  bench_contact_ids: "",
  dates: {
    benchmark_start: "",
    benchmark_stop: "",
  },
  orig_id: "",
  _schema: "",
  references: [],
});

const schema = v.object({
  _id: v.string(),
  name: v.string(),
  community_id: v.string(),
  bench_contact_ids: v.string(),
  dates: v.string(),
  orig_id: v.string(),
  _schema: v.string(),
});

const eventData = computed(() => {
  state.value = {
    _id: String(props.eventObj?._id || ""),
    name: props.eventObj?.name || "",
    community_id: props.eventObj?.community_id || "",
    bench_contact_ids: props.eventObj?.bench_contact_ids?.join(", ") || "",
    dates: props.eventObj?.dates || { benchmark_start: "", benchmark_stop: "" },
    orig_id: props.eventObj?.orig_id || "",
    _schema: props.eventObj?._schema || "",
    references: props.eventObj?.references || [],
  };
  return props.eventObj;
});

const localReferences = ref<string[]>([]);
if (props.eventObj && props.eventObj.references) {
  localReferences.value = props.eventObj.references;
}

const localContacts = ref<string[]>([]);
if (props.eventObj && props.eventObj.bench_contact_ids) {
  localContacts.value =
    props.eventObj.bench_contact_ids.map((contact: string) => {
      return contact.replace(/\./g, " ");
    }) || [];
}

function onAddElement(array: []) {
  array.push("");
}

function onDeleteElement(index: number, element: string[]) {
  console.log(element[index]);
  if (element[index] === "") {
    element.splice(index, 1);
  } else {
    dialogText.value = "Are you sure you want to delete this element?";
    dialogTitle.value = "Delete Element";
    isDialogOpened.value = true;
  }
}

function dialogShow() {
  console.log("dialogShow!!!!");
}

function onSubmitCommunityEvent() {
  console.log("submitting...");
}

const checkEmptyContacts = computed(() => {
  return localContacts.value.some((contact: string) => contact === "");
});

const checkEmptyReferences = computed(() => {
  return localReferences.value.some((keyword: string) => keyword === "");
});

function goBack() {
  console.log("going back");
  router.push(`/dashboard/communities/${state.value.community_id}`);
}
</script>

<style scoped lang="scss">
.dashboard-community-event-edit {
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
        .content-box {
          border: 1px solid rgba(233, 236, 239);
        }
      }
    }
    &__box {
      padding: 10px 20px;
      border: 1px solid rgba(233, 236, 239);
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
