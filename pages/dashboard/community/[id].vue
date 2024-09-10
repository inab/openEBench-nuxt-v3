<template>
    <div class="user-communities-edit">
        <div>This is community</div>
        <div class="user-communities-edit__body">
            <div class="user-communities-edit__body__header">

            </div>
            <div class="user-communities-edit__body__table">
                <!-- <CommunityEdit
                    :community-obj="communityData" 
                /> -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import CommunityEdit from "@/components/Dashboard/communities/CommunityEdit.vue";

const runtimeConfig = useRuntimeConfig();
const { data } = useAuth();
const route = useRoute();
const communityId: string = route.params.id;
const loadingTable = ref<boolean>(true);
const token: string = data?.value.accessToken;
const page = ref<Number>(1);
const pageCount = ref<Number>(10);
const pageFrom = computed(() => (Number(page.value) - 1) * Number(pageCount.value) + 1);
const pageTo = computed(() =>
  Math.min(Number(page.value) * Number(pageCount.value), Number(totalPages.value)),
);
let _total = 0;
const totalPages = computed(() => {
    return _total;
});
let communityData = ref<any>(null);

const fetchUserCommunity = async (token: string): Promise<void> => {
    try {
        await fetch(
            `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/community/${communityId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                method: "GET",
            },
        )
            .then((response) => response.json())
            .then((data) => {
                _total = data.total;
                loadingTable.value = false;
                communityData.value = data;
            });
    } catch (error) {
        console.error("Error fetching communities data:", error);
    }
}

onMounted(() => {
  fetchUserCommunity(token);
});
</script>