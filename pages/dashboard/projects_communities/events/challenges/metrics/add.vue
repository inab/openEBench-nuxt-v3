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
          Communities in OpenEBench define standardized metrics to ensure fair
          and transparent comparisons during benchmarking events and challenges.
          These carefully selected metrics quantify specific aspects of software
          performance, providing objective measures for evaluating tool
          capabilities and driving innovation across diverse domains.
        </div>
      </div>
      <div class="w-100">
        <AddMetric
          :contacts-data="contactsData"
          :challenge-metrics="challengeMetrics"
          :is-loading-challenge-metrics="isLoadingChallengeMetrics"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { ChallengeMetricCategory } from "@/types/challenge_metric";
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
const challengeMetrics = ref<ChallengeMetricCategory[]>([]);
const isLoadingChallengeMetrics = ref(true);
const runtimeConfig = useRuntimeConfig();
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

const fetchChallengeMetrics = async (token: string): Promise<void> => {
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
    challengeMetrics.value = data.metrics_categories;
    console.log("Challenge metrics data:", challengeMetrics.value);
  } catch (error) {
    console.error("Error fetching challenge metrics data:", error);
  } finally {
    isLoadingChallengeMetrics.value = false;
  }
};

onMounted(() => {
  fetchContacts(token);
  fetchChallengeMetrics(token);
});
</script>
