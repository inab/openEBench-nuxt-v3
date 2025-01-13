<template>
  <div class="dashboard-metrics-add">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">
      <div class="w-100">
        <div class="community-event-challenge__title">
          <h2 class="text-primaryOeb-500">
            <span class="">Add New Metric to Challenge</span>
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
        <AddMetric :contacts-data="contactsData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AddMetric from "@/components/Dashboard/entries/events/challenges/metrics/AddMetric.vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import { useUser } from "@/stores/user.ts";

definePageMeta({
  middleware: "auth",
  auth: {
    authenticatedOnly: true,
    navigateUnauthenticatedTo: "/login-required",
  },
});

const route = useRoute();
const userStore = useUser();
const { data } = useAuth();
const token: string = data?.value.accessToken;
const contactsData = ref<string[]>([]);
const eventId: string = route.params.event_id;
const communityId: string = route.params.community_id;
const challengeId: string = route.params.id;
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
    label: `challenge ${challengeId}`,
    isActualRoute: false,
    route: `/dashboard/projects_communities/${communityId}/events/${eventId}/challenges/${challengeId}`,
  },
  {
    label: "New Metric",
    isActualRoute: true,
  },
]);

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
