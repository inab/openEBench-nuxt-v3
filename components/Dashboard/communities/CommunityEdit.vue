<template>
  <div class="dashboard-community-edit">
    <div class="w-100 container">
      <div class="dashboard-community-edit__title">
        <h2 class="text-primaryOeb-500">
          Edit Community : <i>{{ id }}</i>
        </h2>
      </div>
      <div v-if="loadingData" class="">
        <div class="space-y-2">
          <USkeleton class="dashboard-community-edit__skeleton__small" />
          <USkeleton class="dashboard-community-edit__skeleton__big" />
        </div>
      </div>
      <div v-else class="dashboard-community-edit__content">
        <div class="">
          <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmitCommunity"
          >
            <div class="row">
              <div class="col-8">
                <div class="form-group">
                  <label for="acronym">Acronym</label>
                  <input
                    id="acronym"
                    v-model="communityData.acronym"
                    type="text"
                    class="form-control"
                    :disabled="!commmunityPrivileges.update || isView"
                  />
                </div>
              </div>
              <div class="col-4">
                <div class="form-group">
                  <label for="status">Status</label>
                  <USelectMenu
                    v-model="localStatus.value"
                    :options="CommunityStatusLabels"
                    :disabled="!commmunityPrivileges.update || isView"
                    :color="commmunityPrivileges.update ? 'white' : 'gray'"
                    @change="onChangeStatus"
                  >
                    <template #label>
                      <span
                        :class="`status-${localStatus.value}__option inline-block h-2 w-2 flex-shrink-0 rounded-full`"
                        aria-hidden="true"
                      />
                      <span class="truncate">{{ localStatus.label }}</span>
                    </template>
                    <template #option="{ option: item }">
                      <span
                        class="h-2 w-2 rounded-full"
                        :class="`status-${item?.value}__option`"
                      ></span>
                      <span>{{ item.label }}</span>
                    </template>
                  </USelectMenu>
                </div>
              </div>
              <div class="col-12">
                <div class="form-group">
                  <label for="description">Name</label>
                  <input
                    id="name"
                    v-model="communityData.name"
                    type="text"
                    class="form-control"
                    :disabled="!commmunityPrivileges.update || isView"
                  />
                </div>
              </div>
              <div class="col-12">
                <div class="form-group">
                  <label for="description">Description</label>
                  <textarea
                    id="description"
                    v-model="communityData.description"
                    class="form-control"
                    rows="10"
                    :disabled="!commmunityPrivileges.update || isView"
                  >
                  </textarea>
                </div>
              </div>
            </div>
            <CustomSubtitle text="Data" />
            <div class="row">
              <div class="col-6">
                <div class="form-group">
                  <div class="w-100">
                    <label for="contacts" class="form-group-row">
                      <span class="label-text text-gray-500"> Links </span>
                      <button
                        class="btn-form-add btn-primary"
                        :disabled="
                          !commmunityPrivileges.update ||
                          isView ||
                          checkEmptyLinks
                        "
                        @click="onAddElement(localLinks)"
                      >
                        <font-awesome-icon :icon="['fas', 'plus']" />
                      </button>
                    </label>
                  </div>
                  <div class="w-100 row">
                    <div
                      v-for="(link, index) in localLinks"
                      :key="link"
                      class="col-12 d-flex pl-0"
                    >
                      <div class="input-wrapper big d-flex">
                        <span>{{ index + 1 }}.</span>
                        <input
                          id="link"
                          v-model="localLinks[index]"
                          type="text"
                          class="form-control"
                          :disabled="!commmunityPrivileges.update || isView"
                        />
                        <button class="btn-delete-input">
                          <font-awesome-icon :icon="['far', 'trash-can']" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label for="provenance">Provenance</label>
                  <template v-if="communityData._provenance">
                    <div class="w-100 d-flex">
                      <a :href="`mailto:${communityData._provenance}`">{{
                        communityData._provenance
                      }}</a>
                    </div>
                  </template>
                  <template v-else>
                    <div class="w-100 d-flex">-</div>
                  </template>
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label for="schema">Schema</label>
                  <div class="w-100 d-flex">
                    <input
                      id="schema"
                      v-model="communityData._schema"
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <div class="w-100">
                    <label for="contacts" class="form-group-row">
                      <span class="label-text text-gray-500"> Contacts </span>
                      <button
                        class="btn-form-add btn-primary"
                        :disabled="
                          !commmunityPrivileges.update ||
                          isView ||
                          cheEmptyContacts
                        "
                        @click="onAddElement(localContacts)"
                      >
                        <font-awesome-icon :icon="['fas', 'plus']" />
                      </button>
                    </label>
                  </div>
                  <div class="w-100 row">
                    <div
                      v-for="(contact, index) in localContacts"
                      :key="index"
                      class="col-6 pt-0"
                    >
                      <div class="input-wrapper">
                        <input
                          v-model="localContacts[index]"
                          type="text"
                          class="form-control"
                          :disabled="!commmunityPrivileges.update || isView"
                        />
                        <button class="btn-delete-input">
                          <font-awesome-icon :icon="['far', 'trash-can']" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="form-group">
                  <div class="w-100">
                    <label for="contacts" class="form-group-row">
                      <span class="label-text text-gray-500"> Keywords </span>
                      <button
                        class="btn-form-add btn-primary"
                        :disabled="
                          !commmunityPrivileges.update ||
                          isView ||
                          checkEmptyKeywords
                        "
                        @click="onAddElement(localKeywords)"
                      >
                        <font-awesome-icon :icon="['fas', 'plus']" />
                      </button>
                    </label>
                  </div>
                  <div class="w-100 row">
                    <div
                      v-for="(keys, index) in localKeywords"
                      :key="index"
                      class="col-3 pt-0"
                    >
                      <div class="input-wrapper">
                        <input
                          v-model="localKeywords[index]"
                          type="text"
                          class="form-control"
                          :disabled="!commmunityPrivileges.update || isView"
                        />
                        <button class="btn-delete-input">
                          <font-awesome-icon :icon="['far', 'trash-can']" />
                        </button>
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
                  v-if="commmunityPrivileges.update && !isView"
                  type="submit"
                  :disabled="!commmunityPrivileges.update || isView"
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
import type { Community } from "@/types/communities";
import {
  CommunityStatusLabels,
  CommunityStatusColors,
} from "@/constants/community_const";
import CustomSubtitle from "@/components/Common/CustomSubtitle.vue";
import type { CommunityPrivilegeActions } from "@/constants/privileges";
import { useRouter } from "vue-router";
import type { FormSubmitEvent } from "#ui/types";
import * as v from "valibot";

const router = useRouter();
const runtimeConfig = useRuntimeConfig();
const { data } = useAuth();
const token: string = data?.value.accessToken;

const props = defineProps<{
  id: string;
  communityObj: Community | null;
  loadingData: boolean;
  commmunityPrivileges: CommunityPrivilegeActions;
  isView: boolean;
}>();

const state = ref({
  acronym: "",
  status: "",
  name: "",
  description: "",
});

const schema = v.object({
  acronym: v.pipe(v.string()),
  status: v.pipe(v.string()),
  name: v.pipe(v.string()),
  description: v.pipe(v.string()),
});

const errors = ref<string[]>([]);

const communityData = computed(() => {
  state.value = {
    acronym: props.communityObj.acronym,
    status: props.communityObj.status,
    name: props.communityObj.name,
    description: props.communityObj.description,
  };
  return props.communityObj;
});

const localStatus = ref({
  value: "",
  label: "",
});
if (props.communityObj && typeof props.communityObj.status === "string") {
  localStatus.value.value =
    props.communityObj.status.charAt(0).toUpperCase() +
    props.communityObj.status.slice(1);
}

const localContacts = ref<string[]>([]);
if (props.communityObj && props.communityObj.community_contact_ids) {
  localContacts.value =
    props.communityObj.community_contact_ids.map((contact: string) => {
      return contact.replace(/\./g, " ");
    }) || [];
}

const localLinks = ref<string[]>([]);
if (props.communityObj && props.communityObj.links) {
  localLinks.value = props.communityObj.links
    .filter((link: { comment?: string }) => {
      return !link.comment || link.comment !== "@logo";
    })
    .map((link: { uri: string }) => link.uri)
    .filter((uri: string | undefined): uri is string => uri !== undefined);
}

const localKeywords = ref<string[]>([]);
if (props.communityObj && props.communityObj.keywords) {
  localKeywords.value = props.communityObj.keywords;
}

const checkEmptyLinks = computed(() => {
  return localLinks.value.some((link: string) => link === "");
});

const cheEmptyContacts = computed(() => {
  return localContacts.value.some((contact: string) => contact === "");
});

const checkEmptyKeywords = computed(() => {
  return localKeywords.value.some((keyword: string) => keyword === "");
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
    errors.value = result.error.issues.map((issue) => issue.message);
  }
}

async function updateCommunity() {
  const body = {
    acronym: state.value.acronym,
    status: state.value.status,
    name: state.value.name,
    description: state.value.description,
  };

  console.log("updating ocommunity");
  console.log(body)
  console.log(JSON.stringify(body));

  //return false;

  try {
    await fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Community/${props.communityObj._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(body),
      },
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        return data;
      });
  } catch (error) {
    console.error("Error fetching communities data:", error);
  }
}

function onChangeStatus(newStatus: string) {
  localStatus.value.value = newStatus.value;
  localStatus.value.label = newStatus.label;
}

function onAddElement(array: string[]) {
  array.push("");
}

watch(
  () => props.communityObj,
  (newVal) => {
    if (newVal && typeof newVal.status === "string") {
      localStatus.value.label =
        newVal.status.charAt(0).toUpperCase() + newVal.status.slice(1);
      localStatus.value.value = newVal.status;
    }
    if (newVal && newVal.links) {
      localLinks.value = newVal.links
        .filter((link: { comment?: string }) => {
          return !link.comment || link.comment !== "@logo";
        })
        .map((link: { uri: string }) => link.uri)
        .filter((uri: string | undefined): uri is string => uri !== undefined);
    }
    if (newVal && newVal.community_contact_ids) {
      localContacts.value =
        newVal.community_contact_ids.map((contact: string) => {
          return contact.replace(/\./g, " ");
        }) || [];
    }
    if (newVal && newVal.keywords) {
      localKeywords.value = newVal.keywords;
    }
  },
  { immediate: true },
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
    background-color: rgba(233, 236, 239);
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
    }
  }
}
</style>
