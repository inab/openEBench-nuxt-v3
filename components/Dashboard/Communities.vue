<template>
    <div class="user_communities">
        <div class="user_communities__header">
            Communities List
        </div>
        <div class="user_communities__body">
            <div class="user_communities__body__table">
                <UTable  
                    :columns="columns" 
                    :rows="formatCommunityData()">
                    <template #to-data="{ row }">
                        <NuxtLink 
                        :to="to"
                        class="text-primaryOeb-500">
                            <font-awesome-icon :icon="['fas', 'link']" />
                            Go to
                        </NuxtLink>
                    </template>
                </UTable>/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUser } from "@/stores/user";

const runtimeConfig = useRuntimeConfig();
const { data } = useAuth();
const userStore = useUser();

const communitiesData = ref([]);

const token = data?.value.accessToken;

const columns = [{
  key: 'community_name',
  label: 'COMMUNITY NAME'
},
{
    key: "community_contact",
    label: "CONTACTS"
},{
  key: 'status',
  label: 'STATUS'
}, {
  key: 'actions',
  label: 'ACTIONS'
}, {
    key: "to",
    label: "LINKS"
},{
  key: 'events',
  label: 'EVENTS'
}]

const fetchUserCommunities = async(token) => {
    try {
        if (userStore.getUserCommunities && Object.keys(userStore.getUserCommunities).length > 0) {
            console.log("already stored")
            communitiesData.value = userStore.getUserCommunities;
        } else {
            communitiesData.value = await userStore.fetchCommunities(token);
        }
        formatCommunityData()
    } catch (error) {
        console.error("Error fetching communities data:", error);
    }
}

function formatCommunityData() {
    return communitiesData.value.map((community) => {
        return {
            _id: community._id,
            community_name: community.acronym,
            logo: community.logo,
            links: community.links,
            status: community.status,
            community_contact: community.community_contact_ids.map((contact) => {
                return contact.replaceAll(".", " ");
            }).join(", "),
            to: `${runtimeConfig.public.BASE_URL}/benchmarking/${community._id}`
        }
    });
    console.log(data)
}

onMounted(() => {
  fetchUserCommunities(token);
});
</script>