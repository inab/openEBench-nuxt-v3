<template>
  <div class="user-communities-edit">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="user-communities-edit__body">
      <div class="user-communities-edit__body__table">
        <CommunityEdit
          :id="communityId"
          :loading-data="loadingData"
          :community-obj="communityData"
          :commmunity-privileges="communityPrivileges"
          :is-view="isView ? true : false"
          :events="communityEvents"
          :is-loading-events="isLoadingEvents"
          :privileges-type="privilegesType"
          :tab-index="tabIndex"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import CommunityEdit from "@/components/Dashboard/entries/CommunityEdit.vue";
import { useUser } from "@/stores/user.ts";
import { privileges } from "@/constants/privileges";
import type { Community } from "@/types/communities";
import type { Event } from "@/types/events";
import parseDataURL from "data-urls";
import { labelToName, decode } from "whatwg-encoding";

definePageMeta({
  middleware: "auth",
  auth: {
    authenticatedOnly: true,
    navigateUnauthenticatedTo: "/login-required",
  },
});

const runtimeConfig = useRuntimeConfig();
const { data } = useAuth();
const route = useRoute();
const communityId: string = route.params.id;
const tabIndex: Ref<string> = ref(route.query.events ? "1" : "0");
const loadingData = ref<boolean>(true);
const token: string = data?.value.accessToken;
const userStore = useUser();
const routeName = ref<string>("");
const isLoadingEvents = ref<boolean>(true);
const isAdmin = ref<boolean>(false);

const isView = computed(() => {
  const isAdmin = userPrivileges.value.filter(
    (privilege) => privilege.role === "admin",
  );
  if (isAdmin.length > 0) {
    return false;
  }
  return (
    userPrivileges.value.filter(
      (privilege) => privilege.community === communityId,
    ).role === "Owner"
  );
});

const userPrivileges: Array<string> = computed(
  () => userStore.getUserCommunitiesRoles,
);
if (userPrivileges.value.length == 0) {
  userStore.setUserCommunitiesRoles(data.value.oeb_roles);
}

const communityData = ref<Community>(null);
const communityPrivileges = computed(() => {
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

const privilegesType = computed(() => {
  const privilege = userPrivileges.value.find((privilege) => {
    return privilege.community === communityId;
  });
  return privilege
    ? privilege.role.charAt(0).toUpperCase() + privilege.role.slice(1)
    : "None";
});

const communityEvents = ref<Array<Event>>(null);

const routeArray: Array = ref([
  { label: "Dashboard", isActualRoute: false, route: "/dashboard" },
  {
    label: "Projects & Communities",
    isActualRoute: false,
    route: "/dashboard/projects_communities",
  },
  {
    label: computed(() => routeName.value),
    isActualRoute: true,
  },
]);

const fetchUserCommunity = async (token: string): Promise<void> => {
  try {
    const response = await fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Community/${communityId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      },
    );

    const data = await response.json();
    loadingData.value = false;
    if (data._metadata && data._metadata["project:summary"]) {
      const dataURL = parseDataURL(data._metadata["project:summary"]);
      const encodingName = labelToName(
        dataURL.mimeType.parameters.get("charset") || "utf-8",
      );
      const decodedSummary = decode(dataURL.body, encodingName);
      data._metadata.project_summary = decodedSummary;
    }

    communityData.value = data;
    routeName.value = `Community ${communityData.value?.acronym}`;

    const eventResponse = await fetchUserCommunitiesEvents(
      token,
      String(communityData.value._id),
    );
    communityEvents.value = eventResponse;
  } catch (error) {
    console.error("Error fetching communities data:", error);
  }
};

const fetchUserCommunitiesEvents = async (
  token: string,
  communityId: string,
): Promise<void> => {
  try {
    const communityEventResponse = await userStore.fetchCommunitiesEvents(
      token,
      communityId,
    );
    const data = await communityEventResponse;
    isLoadingEvents.value = false;
    return data;
  } catch (error) {
    console.error("Error fetching communities events data:", error);
  }
};

if (userStore.getUserCommunitiesRoles.length == 0) {
  userStore.fetchUserPrivileges(token).then(() => {
    // TDOO: Add the user privileges to the store
  });
}

onMounted(async () => {
  try {
    await fetchUserCommunity(token);
  } catch (error) {
    console.error("Error fetching communities data:", error);
  }
});
</script>
