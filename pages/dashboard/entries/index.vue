<template>
  <div class="dashboard">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">
      <div>
        <div v-if="status == 'authenticated'">
          <div class="">
            <div class="text-primaryOeb-500 border-slate-200 border-b mb-3">
                <div class="flex justify-content-between gap-3" v-if="userStore.getUserCommunitiesRoles && isAdmin">
                  <h2>Entries</h2>
                  <NuxtLink to="/dashboard/entries/add"
                    class="btn custom-btn btn-primary mb-2"
                    title="Create new community">
                    Create New Entry
                </NuxtLink>
              </div>
            </div>
            <div class="dashboard__description text-gray-500">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. 
            </div>
          </div>
          <div class="dashboard-tabs">
            <CustomSubtitle
              text="Entries List"
              size="22px"
            />
            <div class="dashboard__description text-gray-500">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. 
            </div>
            <Communities
              :is-loading-data="isLoadingData"
              />
          </div>
        </div>
        <div class="" v-else>
          Not authenticated
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import { useUser } from "@/stores/user.ts";
import Communities from '@/components/Dashboard/entries/Communities.vue';
import CustomSubtitle from '@/components/Common/CustomSubtitle.vue';

definePageMeta({
  middleware: 'auth',
  auth: {
    authenticatedOnly: true,
    navigateUnauthenticatedTo: '/login-required'
  }
})

const userStore = useUser();
const { data, status } = useAuth();
const isLoadingData = ref(true);
const token: string = data?.value.accessToken;

const items = [{
  key: 'entries',
  slot: 'entries',
  label: 'Entries',
  icon: 'i-heroicons-table-cells-16-solid',
}]

const routeArray: Array = [
  { label: "Dashboard", 
    isActualRoute: false,
    route: "/dashboard",
  },
  { label: "Communities", 
    isActualRoute: true
  },
];

if(userStore.getUserCommunitiesRoles.length == 0) {
  userStore.setUserCommunitiesRoles(data.value.oeb_roles);
}

const isAdmin = computed(() => {
    return userStore.getUserCommunitiesRoles.filter((role: string) => {
        return role.role == "admin";
    }).length > 0;   
});

const fetchUserCommunities = async (token: string): Promise<void> => {
    try {
      let comData = [];
      if (userStore.getUserCommunities && Object.keys(userStore.getUserCommunities).length > 0) {
        comData = userStore.getUserCommunities;
      } else {
        comData = await userStore.fetchCommunities(token);
      }
      isLoadingData.value = false;
      console.log("Communities data:", comData);
      
  } catch (error) {
      console.error("Error fetching communities data:", error);
  }
}

onMounted(() => {
  fetchUserCommunities(token);
});

</script>

<style lang="scss" scoped>
.dashboard {
  .container {
    padding: 1rem;
  }
  &__title {
    padding-bottom: 50px;
    padding-top: 20px;
    h2 {
      border-color: rgb(226, 232, 240, 1);
      border-bottom-width: 1px;
    }
  }
  .dashboard-tabs {
    padding-top: 40px;
  }
}
</style>