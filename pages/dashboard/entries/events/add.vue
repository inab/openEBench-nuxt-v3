<template>
  <div class="dashboard-community-event-add">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="dashboard-community-event-add__body">
      <CommunityEventAdd
        :event-privileges="eventPrivileges"
        :community-id="communityId"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import CommunityEventAdd from "@/components/Dashboard/entries/events/CommunityEventAdd.vue";
import { useUser } from "@/stores/user.ts";
import { privileges } from "@/constants/privileges";

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
const communityId: string = route.params.community_id;

const userPrivileges: Array<string> = computed(
  () => userStore.getUserCommunitiesRoles,
);
if (userPrivileges.value.length == 0) {
  userStore.setUserCommunitiesRoles(data.value.oeb_roles);
}

const eventPrivileges = computed(() => {
  const isAdmin = userPrivileges.value.filter(
    (privilege) => privilege.role === "admin",
  );
  
  if (isAdmin.length > 0) {
    return privileges.admin;
  }
  const privilege = userPrivileges.value.find((privilege) => {
    return privilege.community === communityId;
  });
  return privilege ? privileges[privilege.role] : privileges.anyone;
});

const dialogTitle = ref("");
const dialogType = ref("yesno");
const isDialogOpened = ref(false);
const dialogText = ref("");

const errors = ref<string[]>([]);

const routeArray: Array = ref([
  { label: "Dashboard", isActualRoute: false, route: "/dashboard" },
  {
    label: "Entries",
    isActualRoute: false,
    route: "/dashboard/entries",
  },
  {
    label: `Communitiy ${communityId}`,
    isActualRoute: false,
    route: `/dashboard/entries/${communityId}`,
  },
  {
    label: "New event",
    isActualRoute: true,
  },
]);
</script>
