<template>
  <div class="dashboard">
    <div class="w-100 container">
      <div class="dashboard__header">
        <div class="dashboard__header__title">
          <h2 class="text-primaryOeb-500">Dashboard</h2>
        </div>
        <div class="dashboard__header__description text-gray-500">
          Welcome {{ userName }} to the OpenEBench Dashboard. 
        </div>
      </div>
      <div class="dashboard__body row">
        <UCard class="dashboard__body__card col-6"
        :ui="{
          header: {
            base: '',
            background: '',
            padding: 'px-2 py-3 sm:px-6',
          },
        }">
          <template #header>
            <div class="dashboard__body__card__header">
              Communities
            </div>
          </template>
      
          <div class="">
            <div class="row">
              <div class="col-6">
                <img
                  src="assets/images/dashboard/22821946_Na_Dec_02.jpg"
                  alt="User profile picture"
                  class=""
                />
              </div>
              <div class="col-6">
                <div class="">
                  Here you can find information about the communities you are part of and the tools you have access to.
                </div>
                <div class="dashboard__body__card__link">
                  <button class="ripple custom-button-primary">
                    <NuxtLink to="/dashboard/communities" class="dashboard-link">Communities</NuxtLink>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUser } from "@/stores/user.ts";

const { data } = useAuth();
const userStore = useUser();
const userName = computed(() => data.value.user.name);
const privileges: Array<string> = computed(() => userStore.getUserCommunitiesRoles);

if(privileges.value.length == 0) {
  userStore.setUserCommunitiesRoles(data.value.oeb_roles)
}
</script>

<style lang="scss" scoped>
.dashboard {
  .container {
    padding: 1rem;
  }
  &__header {
    &__title {
      padding-bottom: 20px;
      padding-top: 20px;
      h2 {
        border-color: rgb(226, 232, 240, 1);
        border-bottom-width: 1px;
      }
    }
    &__description {
      padding-bottom: 50px;
      font-size: 16px;
    }
  }
  &__body {
    &__card {
      &__header {
        font-size: 20px;
        font-weight: 600;
        color: theme("colors.primary.500");
      }
      &__link {
        padding-top: 15px;
      }
      &:hover {
        transform: scale(1.05);
      }
    }
  }
  
  .custom-button-primary {
    border-radius: 20px;
    background-color: theme("colors.primary.500");
    padding: 10px 20px;
    cursor: pointer;
    transition: 0.5s;
    font-size: 15px;
    .dashboard-link {
      color: white;
      text-decoration: none;
      &:hover {
        color: theme("colors.primary.500");
      }
    }
    &:hover {
      border: 1px solid #0b579f;
      background-color: white;
      color: theme("colors.primary.500");
    }
  }
}
</style>
