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
                    :isView="isView ? true : false"
                    :events="communityEvents"
                    :isLoadingEvents="isLoadingEvents"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import CommunityEdit from "@/components/Dashboard/communities/CommunityEdit.vue";
import { useUser } from "@/stores/user.ts";
import { privileges } from '@/constants/privileges';
import { Community } from "@/types/communities";
import { Event } from "@/types/events";


definePageMeta({
    middleware: 'auth',
    auth: {
        authenticatedOnly: true,
        navigateUnauthenticatedTo: '/login-required'
    }
})

const runtimeConfig = useRuntimeConfig();
const { data } = useAuth();
const route = useRoute();
const communityId: string = route.params.id;
const loadingData = ref<boolean>(true);
const token: string = data?.value.accessToken;
const userStore = useUser();
const routeName = ref<string>("");
const isLoadingEvents = ref<boolean>(true);

const isView = computed(() => {
    return userPrivileges.value.filter((privilege) => privilege.community === communityId).role === "Owner";
});

const userPrivileges: Array<string> = computed(() => userStore.getUserCommunitiesRoles);
if(userPrivileges.value.length == 0) {
    userStore.setUserCommunitiesRoles(data.value.oeb_roles)
}

let communityData = ref<Community>(null);
const communityPrivileges = computed(() => {
    const privilege = userPrivileges.value.find((privilege) => {
        return privilege.community === communityId;
    });
    return privilege ? privileges[privilege.role] : privileges.anyone;
});

let communityEvents = ref<Array<Event>>(null);

const routeArray: Array = ref([
  { label: "Dashboard", 
    isActualRoute: false,
    route: "/dashboard",
  },
  { label: "Communities", 
    isActualRoute: false,
    route: "/dashboard/communities",
  },
  {
    label: computed(() => routeName.value),
    isActualRoute: true,
  }
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
        communityData.value = data;
        routeName.value = `Community ${communityData.value?.acronym}`;

        const eventResponse = await fetchUserCommunitiesEvents(token, String(communityData.value._id));
        communityEvents.value = eventResponse;
    } catch (error) {
        console.error("Error fetching communities data:", error);
    }
}

const fetchUserCommunitiesEvents = async (token: string, communityId: string): Promise<void> => {
    try {
        const communityEventResponse = await userStore.fetchCommunitiesEvents(token, communityId);
        const data = await communityEventResponse;
        isLoadingEvents.value = false;
        return data;
    } catch (error) {
        console.error("Error fetching communities events data:", error);
    }
}

if(userStore.getUserCommunitiesRoles.length == 0) {
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