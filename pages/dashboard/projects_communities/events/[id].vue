<template>
  <div class="dashboard-community-event-edit">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">
      <div class="">
        <div class="dashboard-community-event-edit__title">
          <h2 class="text-primaryOeb-500">
            <div class="w-100">
              OEB Event Code: {{ eventId }}
              <span class="title-name"
                ><i>( {{ communityDataEvent?.name }} )</i></span
              >
            </div>
          </h2>
          <div class="w-100 d-flex justify-content-end">
            <NuxtLink
              class="btn-primary hover_effect mr-1 header-button"
              :to="`/benchmarking/${communityId}`"
            >
              View Community
            </NuxtLink>
            <NuxtLink
              class="btn-primary hover_effect header-button"
              :to="`/benchmarking/${communityId}?event=${eventId}`"
            >
              View Event
            </NuxtLink>
          </div>
        </div>
        <div class="community-event-challenge__description text-gray-500 pb-4">
          Communities in OpenEBench host time-bound benchmarking events focused
          on specific areas of software performance evaluation. These events
          bring together participants to compare tools, pipelines, services, or
          products using predefined datasets and assessment metrics. Through
          collaborative competition, communities drive innovation and foster a
          shared understanding of performance capabilities within their chosen
          domains.
        </div>
      </div>
      <div class="w-100">
        <CommunityEvent
          :id="eventId"
          :community-id="communityId"
          :event-obj="communityDataEvent"
          :event-privileges="eventPrivileges"
          :is-loading-data="isLoadingData"
          :is-view="isView"
          :challenges="eventChallenge"
          :is-loadin-challenges="isLoadinChallenges"
          :tab-index="tabIndex"
          :event-contacts="eventContacts"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import type { Event } from "@/types/events";
import type { Challenge } from "@/types/challenge";
import { useUser } from "@/stores/user.ts";
import { privileges } from "@/constants/privileges";
import CommunityEvent from "@/components/Dashboard/entries/events/CommunityEvent.vue";

definePageMeta({
  middleware: "auth",
  auth: {
    authenticatedOnly: true,
    navigateUnauthenticatedTo: "/login-required",
  },
});

const userStore = useUser();
const { data, status } = useAuth();
const route = useRoute();
const isLoadingData = ref(true);
const isLoadinChallenges = ref(true);
const tabIndex: Ref<string> = ref(route.query.challenges ? "1" : "0");
const eventContacts = ref(); 

if (status.value !== "authenticated") {
  await navigateTo("/login-required");
}

const token: string = data?.value.accessToken;
const eventId: string = route.params.id;
const communityId: string = route.params.community_id;
const routeName = ref<string>("");
const runtimeConfig = useRuntimeConfig();
const userPrivileges: Array<string> = computed(
  () => userStore.getUserCommunitiesRoles,
);

const communityDataEvent = ref<Event>(null);
const eventChallenge = ref<Array<Challenge>>(null);

const isView = computed(() => {
  return (
    userPrivileges.value.filter((privilege) => privilege.event === eventId)
      .role === "Owner"
  );
});

if (userPrivileges.value.length == 0) {
  userStore.setUserCommunitiesRoles(data.value.oeb_roles);
}

const eventPrivileges = computed(() => {
  const isAdmin = userPrivileges.value.some(
    (privilege) => privilege.role === "admin",
  );

  if (isAdmin) {
    return privileges.admin.event;
  }
  const privilege = userPrivileges.value.find((privilege) => {
    return privilege.community === communityId;
  });
  return privilege ? privileges[privilege.role].event : privileges.anyone.event;
});

const fetchUserCommunitiesEvents = async (token: string): Promise<void> => {
  try {
    const response = await fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/BenchmarkingEvent/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      },
    );

    const data = await response.json();
    communityDataEvent.value = data;
    isLoadingData.value = false;
    const communityResponse = await fetchCommunityEventsChallenges(
      token,
      eventId,
    );
    eventChallenge.value = communityResponse;

    const communityContacts = await fetchCommunityContacts(
      token,
      String(eventId),
    );
  } catch (error) {
    console.error("Error fetching communities data: ", error);
  }
};

const fetchCommunityEventsChallenges = async (
  token: string,
  event: string,
): Promise<void> => {
  try {
    const eventChallengeResponse = await userStore.fetchCommunitiesChallenge(
      token,
      event,
    );
    const data = await eventChallengeResponse;
    isLoadinChallenges.value = false;
    return data;
  } catch (error) {
    console.error("Error fetching challenges data: ", error);
  }
};

const routeArray: Array = ref([
  { label: "Dashboard", isActualRoute: false, route: "/dashboard" },
  {
    label: `Community ${communityId}`,
    isActualRoute: false,
    route: `/dashboard/projects_communities/${communityId}`,
  },
  {
    label: `Event ${eventId}`,
    isActualRoute: true,
  },
]);

const fetchCommunityContacts = async (
  toke: string,
  communityId: string,
): Promise<void> => {
  try {
    const contactsResponse = await fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}query/contacts/${communityId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        method: "GET",
      },
    );

    const data = await contactsResponse.json();

    const managers = Array.isArray(data.manager) ? data.manager : [];
    const owners = Array.isArray(data.owner) ? data.owner : [];

    const uniqueManagers = [...new Set(managers)];
    const uniqueOwners = [...new Set(owners)];

    const contacts = [
      ...uniqueManagers.map((orcid) => ({ orcid, role: "manager" })),
      ...uniqueOwners.map((orcid) => ({ orcid, role: "owner" })),
    ];
    eventContacts.value = contacts;
  } catch (error) {
    console.error("Error fetching communities data:", error);
  }
};

onMounted(() => {
  fetchUserCommunitiesEvents(token);
});
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
      .span-title {
        display: flex;
        gap: 10px;
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
}
.title-name {
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 10px;
}

.header-button {
  padding: 5px 10px;
  font-size: 14px;
  text-decoration: none;
  margin-bottom: 5px;
}
</style>
