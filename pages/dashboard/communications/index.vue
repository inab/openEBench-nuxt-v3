<template>
  <div class="dashboard-communications">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">
      <img
        src="assets/images/dashboard/under-construction.jpg"
        alt="Contacts image"
        class="metrics__body__img"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
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
  { label: "Communications", isActualRoute: true },
];
</script>

<style lang="scss" scoped>
  .dashboard-communications {
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    img {
      max-height: 400px;
    }
  }
</style>