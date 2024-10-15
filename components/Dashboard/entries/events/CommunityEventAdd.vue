<template>
  <div class="dashboard-community-event-add">
    <div class="w-100 container">
      <div class="dashboard-community-event-addt__title">
        <h2 class="text-primaryOeb-500">
          <span class="">New Event</span>
        </h2>
      </div>
      <div class="dashboard-community-event-add__content">
        <div class="w-100">
          <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmitCommunityEvent"
          >
            <div class="w-100 form-card">
              <div class="row justify-content-between">
                <div class="col-4 typeOptions">
                  <div class="form-group">
                    <label for="id">
                      ID
                      <span class="text-red-400 required">*</span>
                    </label>
                    <div class="w-100">
                      <input
                        id="id"
                        v-model="state._id"
                        type="text"
                        class="form-control custom-entry-input"
                        placeholder="Event id"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-4 typeOptions">
                  <div class="form-group">
                    <label for="id">
                      Community ID
                      <span class="text-red-400 required">*</span>
                    </label>
                    <div class="w-100">
                      <input
                        id="id"
                        v-model="state.community_id"
                        type="text"
                        class="form-control custom-entry-input"
                        placeholder="Community id"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="form-group">
                    <label for="name">Name</label>
                    <input
                      id="name"
                      v-model="state.name"
                      type="text"
                      class="form-control custom-entry-input"
                      placeholder="Event name"
                      :disabled="!eventPrivileges.event.create"
                    />
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-group">
                    <label for="orig_id">Orig ID</label>
                    <input
                      id="orig_id"
                      v-model="state.orig_id"
                      type="text"
                      class="form-control custom-entry-input"
                      placeholder="Orig ID"
                      :disabled="!eventPrivileges.event.create"
                    />
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-group">
                    <label for="url">URL</label>
                    <input
                      id="url"
                      v-model="state.url"
                      type="text"
                      class="form-control custom-entry-input"
                      placeholder="URL"
                      :disabled="!eventPrivileges.event.create"
                    />
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-group">
                    <label for="schema">
                      Schema
                      <span class="text-red-400 required">*</span>
                    </label>
                    <input
                      id="schema"
                      v-model="state._schema"
                      type="text"
                      class="form-control custom-entry-input"
                      placeholder="https://schema.org/Community"
                      :disabled="!eventPrivileges.event.create"
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
                              type="button"
                              :disabled="
                                !eventPrivileges.event.create ||
                                checkEmptyReferences
                              "
                              @click="onAddElement(localReferences)"
                            >
                              <font-awesome-icon :icon="['fas', 'plus']" />
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
                                :disabled="!eventPrivileges.event.create"
                              />
                              <button
                                v-if="eventPrivileges.event.create"
                                class="btn-delete-input"
                                type="button"
                                @click="onDeleteElement(index, localReferences)"
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
                            <span class="label-text">
                              Contacts
                              <span class="text-red-400 required">*</span>
                            </span>
                            <button
                              class="btn-form-add btn-primary"
                              type="button"
                              :disabled="
                                !eventPrivileges.event.create ||
                                cheEmptyContacts
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
                            ref="items"
                            class="col-12 pt-0"
                          >
                            <div class="input-wrapper big d-flex">
                              <USelectMenu
                                :ref="`contact_${index}`"
                                v-model="localContacts[index]"
                                class="w-full lg:w-100"
                                searchable
                                selected-icon="i-heroicons-check-16-solid"
                                placeholder="Select a contact"
                                :options="contactsData"
                                value-attribute="id"
                                option-attribute="name"
                              >
                              </USelectMenu>
                              <button
                                class="btn-delete-input"
                                type="button"
                                @click="onDeleteElement(index, localContacts)"
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
              </div>
              <div class="w-100">
                <div v-if="oks" class="ok-response">
                  <div class="alert alert-success text-center">
                    {{ oks }}
                  </div>
                </div>
              </div>
              <div v-if="errors.length > 0" class="errors">
                <div class="alert alert-danger">
                  {{ getErrors }}
                </div>
              </div>
              <div class="form-footer">
                <UButton type="button" variant="secondary" @click="goBack">
                  Cancel
                </UButton>
                <UButton
                  v-if="eventPrivileges.event.create"
                  type="submit"
                  :disabled="!eventPrivileges.event.create"
                >
                  Submit
                </UButton>
              </div>
            </div>
          </UForm>
        </div>
      </div>
    </div>
    <CustomDialog
      :is-dialog-open="isDialogOpened"
      :width="400"
      @modal-close="dialogShow"
    >
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
            class="btn-dialog bg-slate-50"
            @click="isDialogOpened = false"
          >
            No
          </button>
          <button
            type="button"
            class="btn-dialog btn-primary btn-ok"
            @click="deleteElement"
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
import { computed, ref, onMounted } from "vue";
import { useUser } from "@/stores/user.ts";
import type { CommunityPrivilegeActions } from "@/constants/privileges";
import CustomDialog from "@/components/Common/CustomDialog.vue";
import type { FormSubmitEvent } from "#ui/types";
import * as v from "valibot";

const router = useRouter();
const userStore = useUser();
const { data } = useAuth();
const token: string = data?.value.accessToken;

const props = defineProps<{
  eventPrivileges: CommunityPrivilegeActions;
  communityId: string;
}>();

const state = ref({
  _id: "",
  name: "",
  community_id: props.communityId,
  bench_contact_ids: "",
  dates: "",
  orig_id: "",
  _schema:
    "https://www.elixir-europe.org/excelerate/WP2/json-schemas/1.0/BenchmarkingEvent",
  references: [],
  url: "",
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

const dialogTitle = ref("");
const dialogType = ref("yesno");
const isDialogOpened = ref(false);
const dialogText = ref("");
const dialogElement = ref<{ element: string[]; index: number } | null>(null);
const elementToDelete = ref({
  index: null as number | null,
  element: [] as string[],
});

const errors = ref<string[]>([]);
const oks = ref<string>("");
const localReferences = ref<string[]>([]);
const localContacts = ref<string[]>([]);
const contactsData = ref<string[]>([]);

function onAddElement(array: string[]) {
  console.log(array);
  array.push("");
}

const cheEmptyContacts = computed(() => {
  return localContacts.value.some((contact: string) => contact === "");
});

const checkEmptyReferences = computed(() => {
  return localReferences.value.some((keyword: string) => keyword === "");
});

function goBack() {
  router.push(`/dashboard/communities/${state.value.community_id}`);
}

const getErrors = computed(() => errors.value.join(", "));

function onSubmitCommunityEvent(event: FormSubmitEvent) {
  console.log("submitting...");
  console.log(event);
}

function onDeleteElement(index: number, element: string[]) {
  dialogElement.value = null;

  console.log("deleting element", index, element);

  if (element[index] === "") {
    element.splice(index, 1);
    restartElementToDelete();
  } else {
    dialogElement.value = {
      element: element,
      index: index,
    };
    dialogText.value = "Are you sure you want to delete this element?";
    dialogTitle.value = "Delete Element";
    isDialogOpened.value = true;
    elementToDelete.value = {
      index: index,
      element: element,
    };
  }
}

function restartElementToDelete() {
  elementToDelete.value = {
    index: null,
    element: [],
  };
}

function deleteElement() {
  if (elementToDelete.value.index !== null) {
    elementToDelete.value.element.splice(elementToDelete.value.index, 1);
    isDialogOpened.value = false;
  }
}

function dialogShow() {
  console.log("dialogShow!!!!");
}

const fetchContacts = async (token: string): Promise<void> => {
  try {
    if (userStore.getContactsList && userStore.getContactsList.length > 0) {
      contactsData.value = userStore.getContactsList;
    } else {
      contactsData.value = await userStore.fetchContacts(token);
    }
  } catch (error) {
    console.error("Error fetching contacts data:", error);
  }
};

onMounted(() => {
  fetchContacts(token);
});
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
