<template>
  <div class="community-event-challenge">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">
      <div class="w-100">
        <div class="community-event-challenge__title">
          <h2 class="text-primaryOeb-500">
            <span class=""
              >Challenge : <i>{{ challengeId }} </i></span
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
        <div class="community-event-challenge__description text-gray-500">
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters, as opposed to using 'Content here, content here', making it
          look like readable English.
        </div>
      </div>
      <div class="w-100">
        <CommunityEventChallenge
          :id="challengeId"
          :community-id="communityId"
          :event-id="eventId"
          :challenge-privileges="challengePrivileges"
          :challenge-obj="challengeData"
          :is-view="isView"
          :is-loading-data="isLoadingData"
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
import CommunityEventChallenge from "@/components/Dashboard/entries/events/challenges/CommunityEventChallenge.vue";

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
const userPrivileges: ComputedRef<Array<{ role: string; community: string }>> =
  computed(() => userStore.getUserCommunitiesRoles);

if (status.value !== "authenticated") {
  await navigateTo("/login-required");
}

const token: string = data?.value.accessToken;
const eventId: string = route.params.event_id;
const communityId: string = route.params.community_id;
const challengeId: string = route.params.id;
const routeName = ref<string>("");
const runtimeConfig = useRuntimeConfig();

const challengeData = ref<Challenge>(null);

const isView = computed(() => {
  return (
    userPrivileges.value.filter((privilege) => privilege.event === eventId)
      .role === "Owner"
  );
});
if (userPrivileges.value.length == 0) {
  userStore.setUserCommunitiesRoles(data.value.oeb_roles);
}

const challengePrivileges = computed(() => {
  const isAdmin = userPrivileges.value.filter(
    (privilege) => privilege.role === "admin",
  );
  if (isAdmin.length > 0) {
    return privileges.admin;
  }
  
  const privilege = userPrivileges.value.find((privilege) => {
    return privilege.community === communityId;
  });
  return privilege
    ? privileges[privilege.role].challenge
    : privileges.anyone.challenge;
});

const routeArray: Array = ref([
  { label: "Dashboard", isActualRoute: false, route: "/dashboard" },
  {
    label: `Community ${communityId}`,
    isActualRoute: false,
    route: `/dashboard/communities/${communityId}`,
  },
  {
    label: `Event ${eventId}`,
    isActualRoute: false,
    route: `/dashboard/communities/${communityId}/events/${eventId}`,
  },
  {
    label: `Challenge ${challengeId}`,
    isActualRoute: true,
  },
]);

const eventPrivileges = computed(() => {
  const privilege = userPrivileges.value.find((privilege) => {
    return privilege.community === communityId;
  });
  return privilege
    ? privileges[privilege.role].challenge
    : privileges.anyone.challenge;
});

const fetchUserCommunityEventChallenge = async (
  token: string,
): Promise<void> => {
  try {
    const response = await fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Challenge/${challengeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        method: "GET",
      },
    );

    const data = await response.json();
    console.log(data);
    isLoadingData.value = false;
    challengeData.value = data;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchUserCommunityEventChallenge(token);
});
</script>

<style scoped lang="scss">
.community-event-challenge {
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
