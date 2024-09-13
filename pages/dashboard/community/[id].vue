<template>
    <div class="user-communities-edit">
        <div class="user-communities-edit__body">
            {{ userStore.getUserCommunitiesRoles }}
            {{ communityPrivileges}}
            <div class="user-communities-edit__body__table">
                <CommunityEdit
                    :loading-data="loadingData"
                    :community-obj="communityData"
                    :commmunity-privileges="communityPrivileges"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import CommunityEdit from "@/components/Dashboard/communities/CommunityEdit.vue";
import { useUser } from "@/stores/user.ts";
import { privileges } from '@/constants/privileges';

const runtimeConfig = useRuntimeConfig();
const { data } = useAuth();
const route = useRoute();
const communityId: string = route.params.id;
const loadingData = ref<boolean>(true);
const token: string = data?.value.accessToken;
const userStore = useUser();

const userPrivileges: Array<string> = computed(() => userStore.getUserCommunitiesRoles);
if(userPrivileges.value.length == 0) {
    userStore.setUserCommunitiesRoles(data.value.oeb_roles)
}

let communityData = ref<any>(null);
const communityPrivileges = computed(() => {
    const privilege = userPrivileges.value.find((privilege) => {
        return privilege.community === communityId;
    });
    return privilege ? privileges[privilege.role].community : privileges.anyone.community;
});

const fetchUserCommunity = async (token: string): Promise<void> => {
    try {
        await fetch(
            `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Community/${communityId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                method: "GET",
            },
        )
            .then((response) => response.json())
            .then((data) => {
                loadingData.value = false;
                communityData.value = data;
            });
    } catch (error) {
        console.error("Error fetching communities data:", error);
    }
}

if(userStore.getUserCommunitiesRoles.length == 0) {
        userStore.fetchUserPrivileges(token).then(() => {
    });
}


onMounted(() => {
  fetchUserCommunity(token);
});
</script>