<template>
    <div class="dashboar-community-events">
        <BreadcrumbsBar :breadcrumbs-array="routeArray" />
        <div class="w-100 container">
            <div class="">
                <div class="text-primaryOeb-500 border-slate-200 border-b mb-3">
                    <h2>Community Events</h2>
                </div>
                <div class="dashboar-community-events__description text-gray-500">
                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. 
                </div>
            </div>
            <div class="">
                <Events
                    :is-loading-data="isLoadingData"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import { useUser } from "@/stores/user.ts";
import Events from '@/components/Dashboard/communities/events/Events.vue';
import { useRouter } from "vue-router";

definePageMeta({
    middleware: 'auth',
    auth: {
        authenticatedOnly: true,
        navigateUnauthenticatedTo: '/login-required'
    }
})

const userStore = useUser();
const { data, status } = useAuth();
const router = useRouter();
const isLoadingData = ref(true);

if (status.value !== 'authenticated') {
    await navigateTo('/login-required'); 
}

const token: string = data?.value.accessToken;
const communityId: string = route.params.id;

const userPrivileges: Array<string> = computed(() => userStore.getUserCommunitiesRoles);
if(userPrivileges.value.length == 0) {
    userStore.setUserCommunitiesRoles(data.value.oeb_roles)
}

const fetchUserCommunities = async (token: string): Promise<void> => {
    try {
        if (userStore.getUserCommunitiesEvents && Object.keys(userStore.getUserCommunitiesEvents).length > 0
            && userStore.getUserCommunitiesEvents.community == communityId) {
                userStore.getUserCommunitiesEvents;
        } else {
            await userStore.fetchCommunitiesEvents(token, communityId);
        }
        isLoadingData.value = false;
    } catch (error) {
        console.error("Error fetching communities data: ", error);
    }
}

const routeArray: Array = ref([
  { label: "Dashboard", 
    isActualRoute: false,
    route: "/dashboard",
  },
  { label: "Communities", 
    isActualRoute: false,
    route: "/dashboard/communities",
  },
  { label: communityId, 
    isActualRoute: false,
    route: `/dashboard/communities/${communityId}`,
  },
  {
    label: "Events",
    isActualRoute: true,
  }
]);

onMounted(() => {
  fetchUserCommunities(token);
});
</script>