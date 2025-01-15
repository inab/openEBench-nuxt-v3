<template>
  <div class="community-event-challenge">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">
      <div class="w-100">
        <div class="community-event-challenge__title">
          <h2 class="text-primaryOeb-500">
            <span class="">New Challenge </span>
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
        <CommunityEventChallengeAdd
          :community-id="communityId"
          :event-id="eventId"
          :challenge-privileges="challengePrivileges"
          :is-view="isView"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import { useUser } from "@/stores/user.ts";
import { privileges } from "@/constants/privileges";
import CommunityEventChallengeAdd from "@/components/Dashboard/entries/events/challenges/CommunityEventChallengeAdd.vue";
import type { ComputedRef } from "vue";

definePageMeta({
  middleware: "auth",
  auth: {
    authenticatedOnly: true,
    navigateUnauthenticatedTo: "/login-required",
  },
});

const route = useRoute();
const { data } = useAuth();
const communityId: string = route.params.community_id;
const eventId: string = route.params.event_id;
const userStore = useUser();
const userPrivileges: ComputedRef<Array<{ role: string; community: string }>> =
  computed(() => userStore.getUserCommunitiesRoles);

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
    label: "Entries",
    isActualRoute: false,
    route: "/dashboard/projects_communities",
  },
  {
    label: `Communitiy ${communityId}`,
    isActualRoute: false,
    route: `/dashboard/projects_communities/${communityId}`,
  },
  {
    label: `events ${eventId}`,
    isActualRoute: false,
    route: `/dashboard/projects_communities/${communityId}/events/${eventId}`,
  },
  {
    label: "New Challenge",
    isActualRoute: true,
  },
]);
</script>
