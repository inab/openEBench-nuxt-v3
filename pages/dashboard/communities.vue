<template>
  <div class="dashboard">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">
      <div>
        <div v-if="status == 'authenticated'">
          {{  userStore.getUserCommunitiesRoles }}

          <div class="">
            <div class="text-primaryOeb-500 border-slate-200 border-b mb-3">
              <h2>Communities</h2>
            </div>
            <div class="dashboard__description text-gray-500">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. 
            </div>
          </div>
          <div class="dashboard-tabs">
            <UTabs 
            :items="items"
            :ui="{ wrapper: 'items-center gap-4'}">
              <template #communities="{ item }">
                <div v-if="item.key === 'communities'">
                  <Communities
                    :is-loading-data="isLoadingData"
                    />
                </div>
              </template>
            </UTabs>
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
import { ref, computed, onMounted } from 'vue';
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import { useUser } from "@/stores/user.ts";
import Communities from '@/components/Dashboard/communities/Communities.vue';
import { privileges } from '@/constants/privileges';

const userStore = useUser();
const { data, status } = useAuth();
const isLoadingData = ref(true);
const runtimeConfig = useRuntimeConfig();
const communitiesData = computed(() => userStore.getUserCommunities);
const userPrivileges: Array<string> = computed(() => userStore.getUserCommunitiesRoles);
const token: string = data?.value.accessToken;

const items = [{
  key: 'communities',
  slot: 'communities',
  label: 'Communities',
  icon: 'i-heroicons-table-cells-16-solid',
}, {
  key: "all_tools",
  slot: "all_tools",
  label: 'All tools',
  icon: 'i-heroicons-eye-dropper'
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

const fetchUserCommunities = async (token: string): Promise<void> => {
    try {
      let comData = [];
      if (userStore.getUserCommunities && Object.keys(userStore.getUserCommunities).length > 0) {
        comData = userStore.getUserCommunities;
      } else {
        comData = await userStore.fetchCommunities(token);
      }
      isLoadingData.value = false;
      
  } catch (error) {
      console.error("Error fetching communities data:", error);
  }
}

function formatCommunityData() {
  return communitiesData.value.map((community: Community) => {
    return {
      _id: community._id,
      name: community.acronym,
      logo: community.links.filter((link: any) => link.comment === "@logo")[0].uri,
      links: community.links,
      status: community.status,
      community_contact: community.community_contact_ids.map((contact: string) => {
          return contact.replace(/\./g, " ");
      }).join(", "),
      to: `${runtimeConfig.public.BASE_URL}/benchmarking/${community._id}`,
      privileges: community.privileges,
      actions: community.actions || [],
    }
  });
}

function setCommunityPrivileges(data: Community[]): Community[] {
  data.forEach((community: Community) => {
    community.actions = [];
    community.privileges = "None";
    if (userPrivileges.value.length > 0) {
      userPrivileges.value.some((value: { role: string; community: string }) => {
        if (value.role === 'owner' && value.community === community._id) {
          community.actions = privileges.owner;
          community.privileges = 'Owner';
          return true; // Stop iteration
        } else if (value.role === 'manager' && value.community === community._id) {
          community.actions = privileges.manager;
          community.privileges = 'Manager';
          return true; // Stop iteration
        } else {
          community.actions = privileges.anyone;
          community.privileges = 'anyone';
          return false; // Continue iteration
        }
      });
    }
  });

  return data; // Return the modified data array
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