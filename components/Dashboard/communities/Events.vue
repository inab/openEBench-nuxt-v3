<template>
    <div class="user-events">
        <!-- skeleton -->
        <div class="">
            <div class="space-y-2">
                <USkeleton class="h-4 w-100" />
                <USkeleton class="h-4 w-75" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useUser } from "@/stores/user";
import { privileges } from '@/constants/privileges'

const runtimeConfig = useRuntimeConfig();
const { data } = useAuth();
const userStore = useUser();
const userPrivileges: Array<any> = userStore.getUserCommunitiesRoles;
const token: string = data?.value.accessToken;
const loadingTable = ref<boolean>(true);
const page = ref<Number>(1);
const pageCount = ref<Number>(10);
const pageFrom = computed(() => (Number(page.value) - 1) * Number(pageCount.value) + 1);
const pageTo = computed(() =>
  Math.min(Number(page.value) * Number(pageCount.value), Number(totalPages.value)),
);

const props = defineProps<{
  communityObj: object;
}>();

const fetchUserCommunitiesEvents = async (token: string) => {
 
};

onMounted(() => {
  fetchUserCommunitiesEvents(token);
});
</script>