<template>
  <div class="dashboard">
    <BreadcrumbsBar />
    <div class="w-100 container">
      <div>
        <div v-if="status == 'authenticated'">
          {{  userStore.getUserCommunitiesRoles }}

          <div class="">
            <div class="text-primaryOeb-500 border-slate-200 border-b mb-3">
              <h2>Dashboard</h2>
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
                  <Communities />
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
import { ref } from "vue";
import { useUser } from "@/stores/user";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import Communities from "@/components/Dashboard/Communities.vue";

const runtimeConfig = useRuntimeConfig();
const { status, data } = useAuth();
const userStore = useUser();
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
const token = data?.value.accessToken;
const privileges = ref(null)
console.log(data.value)
console.log("token: ", token)

// TO update
await fetch(
  `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}/query/privileges`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
  },
).then((response) => response.json())
.then((data) => {
  console.log("data: ", data)
  userStore.setUserCommunitiesRoles(data)
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