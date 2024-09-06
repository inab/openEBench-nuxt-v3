<!-- pages/dashboard.vue -->
<template>
  <div class="dashboard">
    <div class="w-100 container">
      <div>
        <div v-if="status == 'authenticated'">
          <div class="">
            <h2>Dashboard</h2>
            {{  userStore.getUserCommunitiesRoles }}
          </div>
          <div class="">
            <UTabs 
            :items="items" 
            orientation="vertical" 
            :ui="{ wrapper: 'flex items-center gap-4', list: { width: 'w-48' } }">
              <template #communities>
                <Communities />
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
import { ref, onMounted } from "vue";
import { useUser } from "@/stores/user";
import Profile from "@/components/Dashboard/Profile.vue";
import Communities from "@/components/Dashboard/Communities.vue";

const { status, data } = useAuth();
const userStore = useUser();

const items = [{
  label: 'Profile',
  icon: 'i-heroicons-information-circle',
  content: 'This is the content shown for Tab1'
}, {
  label: 'Communities',
  icon: 'i-heroicons-arrow-down-tray',
  content: 'And, this is the content for Tab2',
  slot: "communities"
}, {
  label: 'All tools',
  icon: 'i-heroicons-eye-dropper',
  content: 'Finally, this is the content for Tab3'
}]

const token = data?.value.accessToken;
console.log(data.value)
const response = await fetch(
  "https://dev2-openebench.bsc.es/api/scientific/query/privileges",
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
}
</style>
