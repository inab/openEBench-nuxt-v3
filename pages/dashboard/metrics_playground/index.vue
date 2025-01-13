<template>
  <div class="metrics-playground">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">

    </div>
  </div>
</template>

<script setup lang="ts">
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";

definePageMeta({
  middleware: "auth",
  auth: {
    authenticatedOnly: true,
    navigateUnauthenticatedTo: "/login-required",
  },
});

const routeArray: Array = [
  { label: "Dashboard", isActualRoute: false, route: "/dashboard" },
  { label: "Metrics Playground", isActualRoute: true },
];
</script>