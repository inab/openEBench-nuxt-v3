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
            src="assets/images/dashboard/contribute.jpg"
            alt="metrics"
            class="metrics__body__img"
          />
        </div>
        <div class="dashboard__description__text">
          Your input is invaluable to us. Whether it’s an idea, suggestion, or
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
      <div v-if="state.requestType === 'roleUpgrade'" class="row row-spacing">
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
            disabled
          />
        </UFormGroup>
        <UFormGroup
          label="Benchmarking event"
          name="event"
          class="col-6 input-row-group"
        >
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
      <div class="row row-spacing">
        <div class="col-12 typeOptions row-spacing">
          <div class="form-group">
            <label for="subject" class="text-gray-700">
              Subject
              <span class="text-red-400 required">*</span>
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
              Message details
              <span class="text-red-400 required">*</span>
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
        <div class="row row-spacing-footer">
          <div class="form-footer">
            <UButton
              type="button"
              color="white"
              variant="solid"
              @click="goReset"
            >
              Reset
            </UButton>
            <UButton type="submit"> Submit </UButton>
          </div>
        </div>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useCommunities } from "@/stores/communities";
import CustomSubtitle from "@/components/Common/CustomSubtitle.vue";
import { ClassicEditor, Essentials, Paragraph, Bold } from "ckeditor5";
import { Ckeditor } from "@ckeditor/ckeditor5-vue";
import "ckeditor5/ckeditor5.css";
const config = computed(() => {
  return {
    licenseKey: "GPL",
    plugins: [Essentials, Paragraph, Bold],
    toolbar: ["undo", "redo", "|", "heading", "|", "bold"],
  };
});

const runtimeConfig = useRuntimeConfig();
const { status, data } = useAuth();
const token: string = data?.value.accessToken;

const props = defineProps<{
  communityId: string;
}>();

const requestCommunity = computed(() => props.communityId);

const requestOptions = [
  { label: "Register a new community", value: "community" },
  { label: "Request to become contributor", value: "roleUpgrade" },
  { label: "Request data publication", value: "publish_datasets" },
];

const communities: Ref<any> = ref([]);
const communitiesStore = useCommunities();
const loadingCommunity = ref(false);
const eventsList: Ref<any> = ref([]);
const selectedEvent = ref("");
const loadingEvent = ref(false);
const description = ref("");

const subjectTextUpgrade = ref("Request to upgrade role for ##userfullname##");
const detailsTextUpgrade = ref(
  "Dear user,</br></br>" +
    "The user ##userfullname## would like to upgrade its role to contributor.</br>" +
    "Community: <strong>##communityfullname##.</strong></br>" +
    "BenchmarkingEvent: <strong>##eventfullname##.</strong></br>" +
    "If you agree on that, please update the corresponding data (tool, role and contact) in OpenEBench database.</br>" +
    "Regards,</br>" +
    "OEB team.",
);

const state = ref({
  userName: "",
  userEmail: "",
  requestType: requestOptions[0].value,
  community: requestCommunity,
  event: "",
  subject: "",
  details: "",
});

const fetchUserInfo = async () => {
  if (status.value === "authenticated") {
    try {
      const token = data?.value.accessToken;

      const response = await fetch(
        `${runtimeConfig.public.KEYCLOAK_HOST}/auth/realms/${runtimeConfig.public.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "GET",
        },
      );

      if (response.ok) {
        const responseData = await response.json();
        state.value.userName =
          responseData.given_name + " " + responseData.family_name;
        state.value.userEmail = responseData.email;
      } else {
        console.error(
          "Error al obtener la información del usuario:",
          response.status,
          await response.text(),
        );
      }
    } catch (error) {
      console.error("Error en la solicitud de información de usuario:", error);
    }
  }
};

function handleRequestTypeChange(selectedType: string) {
  if (selectedType === "roleUpgrade") {
    fetchCommunities();
  }
}

function handleEventChange(selectedEvent: string) {
  state.value.subject = subjectTextUpgrade.value.replaceAll(
    "##eventfullname##",
    state.value.event,
  );
}

async function fetchCommunities() {
  loadingCommunity.value = true;
  let communityObj = [];
  try {
    if (
      communitiesStore.getCommunities &&
      Object.keys(communitiesStore.getCommunities).length > 0
    ) {
      communityObj = communitiesStore.getCommunities;
    } else {
      communityObj = await communitiesStore.requestCommunitiesData();
    }
  } catch (error) {
    console.log("some error");
  } finally {
    const communityArray = communityObj.map((item) => {
      return {
        label: item._id + " - " + item.name,
        value: item._id,
      };
    });
    loadingCommunity.value = false;
    communities.value = communityArray;
    state.value.subject = subjectTextUpgrade.value.replaceAll(
      "##userfullname##",
      state.value.userName,
    );
    fetchUserCommunitiesEvents(requestCommunity.value);
  }
}

const fetchUserCommunitiesEvents = async (
  communityId: string,
): Promise<void> => {
  try {
    loadingEvent.value = true;
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

    const eventsArray = data.map((item) => {
      return {
        label: item._id + " - " + item.name,
        value: item._id,
      };
    });
    loadingEvent.value = false;
    eventsList.value = eventsArray;
    selectedEvent.value = eventsArray.length > 0 ? eventsArray[0].value : null;

    let details = detailsTextUpgrade.value;

    details = details.replaceAll("##userfullname##", state.value.userName);

    details = details.replaceAll(
      "##communityfullname##",
      getCommunityById(state.value.community),
    );

    details = details.replaceAll(
      "##eventfullname##",
      getEventById(selectedEvent.value),
    );

    description.value = details;
  } catch (error) {
    console.error("Error fetching communities data: ", error);
  }
};

function getCommunityById(communityId: string): string {
  return communities.value.find(
    (community: any) => community.value === communityId,
  ).label;
}

function getEventById(eventId: string): string {
  return eventsList.value.find((event: any) => event.value === eventId).label;
}

function goReset() {
  eventsList.value = [];
  state.value.requestType = requestOptions[0].value;
  state.value.subject = "";
  description.value = "";
}

function onSubmitContribute() {
  console.log("submiting ....")
}

onMounted(fetchUserInfo);
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
  padding-top: 80px;
}
.form-group label {
  font-size: 14px;
}
</style>
