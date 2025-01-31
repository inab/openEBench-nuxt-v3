<template>
  <div class="dashboard">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">
      <div>
        <div v-if="status == 'authenticated'">
          <UAccordion :items="HEADER_ITEM">
            <template #item="{ item }">
              <div class="dashboard__header__title">
                <h2 class="text-primaryOeb-500">{{ item.label }}</h2>
              </div>
            </template>
            <template #default="{ item, open }">
              <UButton
                color="primary"
                variant="ghost"
                class="border-b border-slate-200 dark:border-gray-700 community-collapse-btn"
                :ui="{ rounded: 'rounded-none' }"
              >
                <div class="primary label-btn">
                  <h2>{{ item.label }}</h2>
                </div>
                <template #trailing>
                  <UIcon
                    name="i-heroicons-chevron-right-20-solid"
                    class="transform transition-transform duration-200"
                    :class="[open && 'rotate-90']"
                  />
                </template>
              </UButton>
            </template>
            <template #projects>
              <div class="accordion_metrics__body">
                <div class="dashboard__description text-gray-500">
                  <div class="dashboard__description__image">
                    <img
                      src="assets/images/dashboard/22821946_Na_Dec_02.jpg"
                      alt="metrics"
                      class="metrics__body__img"
                    />
                  </div>
                  <div class="dashboard__description__text">
                    <div class="w-100">
                      This section features a collection of projects and
                      communities centered around OpenEBench applications.
                      Explore ongoing initiatives, contribute your expertise, or
                      start your own project to collaborate with other users and
                      advance the development of OpenEBench.
                    </div>
                    <div
                      v-if="isAdmin"
                      class="w-100 d-flex justify-content-end pt-5"
                    >
                      <NuxtLink
                        id="dashboard-create-community"
                        to="/dashboard/projects_communities/add"
                        class="btn custom-btn btn-primary mb-2 small"
                        title="Create new community"
                      >
                        <font-awesome-icon :icon="['fas', 'plus']" />
                        Create New Entry
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </UAccordion>
          <div class="dashboard-tabs">
            <Communities :is-loading-data="isLoadingData" :is-admin="isAdmin" />
          </div>
        </div>
        <div v-else class="">Not authenticated</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import { useUser } from "@/stores/user.ts";
import Communities from "@/components/Dashboard/entries/Communities.vue";

definePageMeta({
  middleware: "auth",
  auth: {
    authenticatedOnly: true,
    navigateUnauthenticatedTo: "/login-required",
  },
});

const userStore = useUser();
const { data, status } = useAuth();
const isLoadingData = ref(true);
const HEADER_ITEM = [
  {
    label: "Projects & Communities",
    defaultOpen: true,
    slot: "projects",
  },
];

const token = computed(() => data.value?.accessToken || ""); // ← Ahora reacciona a cambios en `data.value`

const routeArray: Array = [
  { label: "Dashboard", isActualRoute: false, route: "/dashboard" },
  { label: "Projects & communities", isActualRoute: true },
];

if (userStore.getUserCommunitiesRoles.length == 0) {
  userStore.setUserCommunitiesRoles(data.value.oeb_roles);
}

const isAdmin = computed(() => {
  const roles = userStore.getUserCommunitiesRoles;
  return roles.filter((role) => role.role == "admin").length > 0;
});

const fetchUserCommunities = async (token: string): Promise<void> => {
  try {
    await userStore.fetchCommunities(token);
    isLoadingData.value = false;
  } catch (error) {
    console.error("Error fetching communities data:", error);
  }
};

onMounted(() => {
  if (token.value) {
    fetchUserCommunities(token.value);
  } else {
    console.error("Token is undefined");
  }
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
    padding-top: 5px;
  }
}

.dashboard__description {
  display: flex;
  &__image {
    margin-right: 40px;
    img {
      max-height: 400px;
    }
  }
  &__text {
    font-size: 16px;
    line-height: 1.5;
  }
}

.community-collapse-btn {
  padding: 0;
  display: flex;
  justify-content: space-between;
  &:hover {
    background-color: white;
  }
  span {
    font-size: 30px;
  }
}
</style>
