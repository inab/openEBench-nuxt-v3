<template>
  <div class="community-event-challenge">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">
      <ContributeForm :community-id="communityId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import ContributeForm from "@/components/Dashboard/contribute/ContributeForm.vue";

definePageMeta({
  middleware: "auth",
  auth: {
    authenticatedOnly: true,
    navigateUnauthenticatedTo: "/login-required",
  },
});
const route = useRoute();
const communityId: string = route.params.id;

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
    label: "Contribute",
    isActualRoute: true,
  },
]);
</script>
