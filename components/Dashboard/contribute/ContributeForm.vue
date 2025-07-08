<template>
  <div class="dashboard-community-edit">
    <div class="dashboard-community-edit-header">
      <div class="dashboard-community-edit-header__title">
        <h2 class="text-primaryOeb-500">
          <div class="w-100">Contribute form</div>
        </h2>
      </div>
      <div class="dashboard__description">
        <div class="dashboard__description__image">
          <img
            src="assets/images/dashboard/contribute_2.jpg"
            alt="metrics"
            class="metrics__body__img"
          />
        </div>
        <div class="dashboard__description__text">
          Your input is invaluable to us. Whether it's an idea, suggestion, or
          direct contribution, your effort helps us grow and improve. Please
          take a moment to fill out this form. Every submission—big or small—is
          appreciated and carefully reviewed.
        </div>
      </div>
    </div>

    <CustomSubtitle text="Formulary" size="20px" />
    <UForm :state="state" class="space-y-4" @submit="onSubmitContribute">
      <div class="row row-spacing">
        <UFormGroup
          label="Your name"
          name="name"
          class="col-6 mt-0 input-row-group"
        >
          <UInput
            v-model="state.userName"
            disabled
            color="gray"
            variant="outline"
            class="custom-input custom-entry-input"
            placeholder="Your name"
          />
        </UFormGroup>
        <UFormGroup
          label="Your email"
          name="email"
          class="col-6 mt-0 input-row-group"
        >
          <UInput
            v-model="state.userEmail"
            disabled
            color="gray"
            variant="outline"
            class="custom-input custom-entry-input"
            placeholder="Your email"
          />
        </UFormGroup>
      </div>

      <div class="row row-spacing">
        <UFormGroup
          label="Type of request"
          name="requestType"
          class="col-6 input-row-group"
        >
          <USelect
            v-model="state.requestType"
            class="selector custom-entry-input"
            :options="requestOptions"
            option-attribute="label"
            value-attribute="value"
            @change="handleRequestTypeChange"
          />
        </UFormGroup>
      </div>

      <template v-if="state.requestType === 'roleUpgrade'">
        <div class="row row-spacing flex">
          <UFormGroup
            label="Community"
            name="community"
            class="col-6 input-row-group"
          >
            <USelect
              v-model="state.community"
              class="selector custom-entry-input"
              :options="communities"
              :loading="loadingCommunity"
              option-attribute="label"
              value-attribute="value"
              :disabled="!!requestCommunity"
              @change="handleCommunityChange"
            />
          </UFormGroup>

          <div
            v-if="!loadingEvent && eventsList.length > 0"
            class="col-6 input-row-group"
          >
            <UFormGroup label="Benchmarking event" name="event">
              <USelect
                v-model="selectedEvent"
                class="selector custom-entry-input"
                :loading="loadingEvent"
                :options="eventsList"
                option-attribute="label"
                value-attribute="value"
                @change="handleEventChange"
              />
            </UFormGroup>
          </div>
          <div v-else-if="loadingEvent" class="col-6 input-row-group">
            <i>Loading events...</i>
            <div class="space-y-2">
              <USkeleton class="h-[40px] w-[450px]" />
            </div>
          </div>
          <div v-else></div>
        </div>
      </template>

      <div class="row row-spacing">
        <div class="col-12 typeOptions row-spacing">
          <div class="form-group">
            <label for="subject" class="text-gray-700">
              Subject <span class="text-red-400 required">*</span>
            </label>
            <div class="w-100">
              <input
                id="subject"
                v-model="state.subject"
                type="text"
                class="form-control custom-entry-input"
                placeholder="Subject"
              />
            </div>
          </div>
        </div>
        <div class="col-12 typeOptions">
          <div class="form-group">
            <label for="details" class="text-gray-700">
              Message details <span class="text-red-400 required">*</span>
            </label>
            <div class="w-100">
              <ckeditor
                v-model="description"
                :editor="ClassicEditor"
                :config="config"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="row row-spacing">
        <div class="col-12 typeOptions d-flex">
          <UCheckbox v-model="isAcceptedTerms" />
          <label class="pl-2 terms">
            I Accept terms of use.
            <span class="text-primaryOeb-500" @click="openModal"
              >View terms of use</span
            >
          </label>
        </div>
      </div>

      <div class="w-100">
        <div v-if="oks" class="ok-response">
          <div class="alert alert-success text-center">
            {{ oks }}
          </div>
        </div>
      </div>
      <div class="w-100">
        <div v-if="errors.length > 0" class="errors">
          <div class="alert alert-danger text-center">
            {{ getErrors }}
          </div>
        </div>
      </div>
      <div class="w-100">
        <div v-if="submiting" class="submiting-response">
          <div class="alert alert-dark text-center">Submiting form</div>
        </div>
      </div>

      <div class="row row-spacing-footer">
        <div class="form-footer">
          <UButton type="button" color="white" variant="solid" @click="goReset">
            Reset
          </UButton>
          <UButton type="submit" :disabled="!isAcceptedTerms">Submit</UButton>
        </div>
      </div>
    </UForm>

    <CustomModal :is-open="isModalOpen" width="700" @modal-close="closeModal">
      <template #header>
        <div class="modal-title">{{ modalTitle }}</div>
        <button
          class="modal-close"
          aria-label="Close modal"
          @click="closeModal"
        >
          <UIcon name="i-heroicons-x-mark-16-solid" />
        </button>
      </template>
      <template #content>
        {{ modalText }}
      </template>
    </CustomModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useCommunities } from "@/stores/communities";
import CustomSubtitle from "@/components/Common/CustomSubtitle.vue";
import CustomModal from "@/components/Common/CustomModal.vue";
import { ClassicEditor, Essentials, Paragraph, Bold } from "ckeditor5";
import { Ckeditor } from "@ckeditor/ckeditor5-vue";
import "ckeditor5/ckeditor5.css";

const config = computed(() => ({
  licenseKey: "GPL",
  plugins: [Essentials, Paragraph, Bold],
  toolbar: ["undo", "redo", "|", "heading", "|", "bold"],
}));

const runtimeConfig = useRuntimeConfig();
const { status, data } = useAuth();
const token = computed(() => data?.value?.accessToken || "");

const props = defineProps<{
  communityId?: string;
}>();

const requestCommunity = computed(() => props.communityId);
const communities = ref<Array<{ label: string; value: string }>>([]);
const communitiesStore = useCommunities();
const loadingCommunity = ref(false);
const eventsList = ref<Array<{ label: string; value: string }>>([]);
const selectedEvent = ref("");
const loadingEvent = ref(false);
const description = ref("");
const isAcceptedTerms = ref(false);
const isModalOpen = ref(false);
const oks = ref<string>("");
const errors = ref<string[]>([]);
const submiting = ref<boolean>(false);
const modalTitle = "Terms of use";
const modalText = "Modal text";

const requestOptions = [
  { label: "Register a new community", value: "community" },
  { label: "Request to become contributor", value: "roleUpgrade" },
  { label: "Request data publication", value: "publish_datasets" },
];

const state = ref({
  userName: "",
  userEmail: "",
  requestType: requestOptions[0].value,
  community: requestCommunity.value || "",
  event: "",
  subject: "",
  details: "",
});

const subjectTextUpgrade = ref("Request to upgrade role for ##userfullname##");
const detailsTextUpgrade = ref(`
  Dear user,</br></br>
  The user ##userfullname## would like to upgrade its role to contributor.</br>
  Community: <strong>##communityfullname##.</strong></br>
  BenchmarkingEvent: <strong>##eventfullname##.</strong></br>
  If you agree on that, please update the corresponding data (tool, role and contact) in OpenEBench database.</br>
  Regards,</br>
  OEB team.
`);

async function fetchUserInfo() {
  if (status.value === "authenticated" && token.value) {
    try {
      const response = await fetch(
        `${runtimeConfig.public.KEYCLOAK_HOST}/auth/realms/${runtimeConfig.public.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
        {
          headers: { Authorization: `Bearer ${token.value}` },
          method: "GET",
        },
      );

      if (response.ok) {
        const responseData = await response.json();
        state.value.userName = `${responseData.given_name} ${responseData.family_name}`;
        state.value.userEmail = responseData.email;
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }
}

function handleRequestTypeChange(selectedType: string) {
  if (selectedType === "roleUpgrade") {
    fetchCommunities();
  } else {
    state.value.community = requestCommunity.value || "";
    eventsList.value = [];
    selectedEvent.value = "";
  }
}

const getErrors = computed(() => errors.value.join(", "));

async function fetchCommunities() {
  loadingCommunity.value = true;
  try {
    const communityObj =
      communitiesStore.getCommunities?.length > 0
        ? communitiesStore.getCommunities
        : await communitiesStore.requestCommunitiesData();

    communities.value = communityObj.map((item) => ({
      label: `${item._id} - ${item.name}`,
      value: item._id,
    }));

    if (requestCommunity.value) {
      state.value.community = requestCommunity.value;
    } else {
      state.value.community = communities.value[0].value;
    }
    await fetchUserCommunitiesEvents(state.value.community);
  } catch (error) {
    console.error("Error fetching communities:", error);
  } finally {
    loadingCommunity.value = false;
  }
}

async function fetchUserCommunitiesEvents(communityId: string) {
  if (!token.value) return;

  loadingEvent.value = true;
  try {
    const response = await fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/BenchmarkingEvent`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
          Accept: "application/json",
        },
        method: "GET",
      },
    );

    let data = await response.json();
    data = data.filter((event: any) => event.community_id === communityId);

    eventsList.value = data.map((item) => ({
      label: `${item._id} - ${item.name}`,
      value: item._id,
    }));

    selectedEvent.value = eventsList.value[0]?.value || "";

    updateDescriptionText();
  } catch (error) {
    console.error("Error fetching events:", error);
  } finally {
    loadingEvent.value = false;
  }
}

async function handleCommunityChange() {
  eventsList.value = [];
  await fetchUserCommunitiesEvents(state.value.community);
}

async function handleEventChange() {
  updateDescriptionText();
}

function updateDescriptionText() {
  const details = detailsTextUpgrade.value
    .replaceAll("##userfullname##", state.value.userName)
    .replaceAll(
      "##communityfullname##",
      getCommunityById(state.value.community) || "Selected community",
    )
    .replaceAll(
      "##eventfullname##",
      eventsList.value.length > 0
        ? getEventById(selectedEvent.value)
        : "All events",
    );

  description.value = details;
}

function getCommunityById(communityId: string): string {
  return communities.value.find((c) => c.value === communityId)?.label || "";
}

function getEventById(eventId: string): string {
  return eventsList.value.find((e) => e.value === eventId)?.label || "";
}

function goReset() {
  state.value.requestType = requestOptions[0].value;
  state.value.subject = "";
  description.value = "";
  eventsList.value = [];
  if (!requestCommunity.value) {
    state.value.community = "";
  }
}

async function onSubmitContribute() {
  errors.value = [];
  oks.value = "";
  submiting.value = true;
  if (state.value.subject === "") {
    errors.value.push("Subject cannot be empty");
  } else if (description.value === "") {
    errors.value.push("Message details cannot be empty");
  } else {
    const body: Record<string, any> = {
      name: state.value.userName,
      email: state.value.userEmail,
      requestType: state.value.requestType,
      subject: state.value.subject,
      details: description.value,
    };

    if (state.value.community) {
      body.community = state.value.community;
    }

    if (selectedEvent.value) {
      body.event = selectedEvent.value;
    }

    try {
      const { data, error } = await useFetch("/api/email/mailer", {
        method: "POST",
        body: { message: body },
      });

      submiting.value = false;

      if (error.value) {
        errors.value.push(`Fetch error: ${error.value.message || error.value}`);
        return;
      }

      if (data.value?.success === false) {
        errors.value.push(`Server error: ${data.value.error}`);
        return;
      }

      const msg = "Form submitted successfully";
      await showOkMessage(msg);
    } catch (error) {
      errors.value.push(`Server error: ${data.value.error}`);
      submiting.value = false;
    }
  }
}

async function showOkMessage(msg: string) {
  oks.value = msg;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      oks.value = "";
      resolve("done");
    }, 5000);
  });
}

function openModal() {
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

onMounted(() => {
  fetchUserInfo();
  if (requestCommunity.value) {
    state.value.requestType = "roleUpgrade";
    fetchCommunities();
  }
});
</script>

<style scoped lang="scss">
.dashboard-community-edit-header {
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
}
.dashboard__description {
  display: flex;
  padding-bottom: 50px;
  &__image {
    margin-right: 40px;
    img {
      max-height: 400px;
    }
  }
  &__text {
    font-size: 16px;
    line-height: 1.5;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.row-spacing {
  padding-bottom: 20px;
}
.row-spacing-footer {
  padding-bottom: 20px;
  padding-top: 50px;
  .form-footer {
    display: flex;
    justify-content: end;
  }
}
.form-group label {
  font-size: 14px;
}
.terms span {
  text-decoration: underline;
  cursor: pointer;
}
</style>
