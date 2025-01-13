<template>
  <div class="user-communities-add">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="user-communities-add__body">
      <CommunityAdd />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import CommunityAdd from "@/components/Dashboard/entries/CommunityAdd.vue";
import { useUser } from "@/stores/user.ts";

definePageMeta({
  middleware: "auth",
  auth: {
    authenticatedOnly: true,
    navigateUnauthenticatedTo: "/login-required",
  },
});

const userStore = useUser();
const { data } = useAuth();

const userPrivileges: Array<string> = computed(
  () => userStore.getUserCommunitiesRoles,
);
if (userPrivileges.value.length == 0) {
  userStore.setUserCommunitiesRoles(data.value.oeb_roles);
}

const routeArray: Array = ref([
  { label: "Dashboard", isActualRoute: false, route: "/dashboard" },
  { label: "Projects & communities", isActualRoute: false, route: "/dashboard/projects_communities" },
  {
    label: "Entry Add",
    isActualRoute: true,
  },
]);
</script>

<style scoped lang="scss"></style>
