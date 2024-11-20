<template>
  <div class="dashboard-contacts-add">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />

    <div class="w-100 container">
      <div class="text-primaryOeb-500 border-slate-200 border-b mb-3">
        <div class="flex justify-content-between gap-3">
          <h2>New Contact</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";

const routeArray: Array = [
  { label: "Dashboard", isActualRoute: false, route: "/dashboard" },
  {
    label: `Contacts`,
    isActualRoute: false,
    route: `/dashboard/contacts`,
  },
  { label: "New Contact", isActualRoute: true },
];
</script>
