<template>
  <div class="community-contribute">
    <BreadcrumbsBar :breadcrumbs-array="breadcrumbs" />
    <div class="w-100 container">
      <ContributeForm v-bind="formProps" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
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

const communityId = computed(() => {
  const id = route.params.community_id;
  return typeof id === "string" ? id : undefined;
});

const formProps = computed(() =>
  communityId.value ? { community: communityId.value } : {},
);

const breadcrumbs = computed(() => {
  const baseCrumbs = [
    { label: "Dashboard", isActualRoute: false, route: "/dashboard" },
  ];

  const currentCrumb = { label: "Contribute", isActualRoute: true };

  if (!communityId.value) {
    return [...baseCrumbs, currentCrumb];
  }

  return [
    ...baseCrumbs,
    {
      label: `Community ${communityId.value}`,
      to: `/dashboard/projects_communities/${communityId.value}`,
    },
    currentCrumb,
  ];
});
</script>
