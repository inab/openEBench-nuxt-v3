<template>
  <div class="community-event-challenge">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">
      <div class="w-100">
        <div class="community-event-challenge__title">
          <h2 class="text-primaryOeb-500">
            <div class="w-100">
              OEB Challenge Code: {{ challengeId }}
              <span class="title-name"
                ><i>( {{ challengeData?.name }} )</i></span
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
          Communities in OpenEBench create focused challenges within their
          benchmarking events. Each challenge centers around a specific
          category, utilizing predefined reference datasets and evaluation
          metrics to compare tools, pipelines, services, or products. These
          tailored competitions drive innovation and allow for in-depth analysis
          of performance within specific domains.
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
import CommunityEventChallenge from "@/components/Dashboard/entries/events/challenges/ChallengeEventChallenge.vue";

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
    route: `/dashboard/projects_communities/${communityId}`,
  },
  {
    label: `Event ${eventId}`,
    isActualRoute: false,
    route: `/dashboard/projects_communities/${communityId}/events/${eventId}`,
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
