<template>
  <div class="dashboard-community-event-edit">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">
      <div class="">
        <div class="dashboard-community-event-edit__title">
          <h2 class="text-primaryOeb-500">
            <span class=""
              >Community Event : <i>{{ eventId }} </i></span
            >
            <span class="span-title">
              <NuxtLink
                class="btn-primary hover_effect"
                :to="`/benchmarking/${communityId}`"
              >
                View Community
              </NuxtLink>
              <NuxtLink
                class="btn-primary hover_effect"
                :to="`/benchmarking/${communityId}?event=${eventId}`"
              >
                View Event
              </NuxtLink>
            </span>
          </h2>
        </div>
        <div class="dashboard-community-events__description text-gray-500">
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters, as opposed to using 'Content here, content here', making it
          look like readable English.
        </div>
      </div>
      <div class="">
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
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import { useUser } from "@/stores/user.ts";
import { privileges } from "@/constants/privileges";
import CommunityEvent from "@/components/Dashboard/entries/events/CommunityEvent.vue";
import type { Event } from "@/types/events";
import type { Challenge } from "@/types/challenge";

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
  const isAdmin = userPrivileges.value.filter(
    (privilege) => privilege.role === "admin",
  );
  if (isAdmin.length > 0) {
    return privileges.admin;
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
    const communityResponse = await fetchCommunityChallengers(token, eventId);
    eventChallenge.value = communityResponse;
  } catch (error) {
    console.error("Error fetching communities data: ", error);
  }
};

const fetchCommunityChallengers = async (
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
    route: `/dashboard/entries/${communityId}`,
  },
  {
    label: `Event ${eventId}`,
    isActualRoute: true,
  },
]);

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
</style>
