<template>
  <div class="dashboard">
    <div class="w-100 container">
      <div class="dashboard__header">
        <div class="dashboard__header__title">
          <h2 class="text-primaryOeb-500">{{ getGreeting() }}</h2>
        </div>
        <div class="dashboard__header__description text-gray-500">
          Welcome to the OpenEBench Dashboard! Here you can monitor, optimize
          and administer your applications in real-time with an intuitive
          interface that allows you to explore various indicators and metrics
          for improving efficiency. Don't hesitate to navigate through the
          functions and options of the control panel to make OpenEBench a
          valuable tool for your projects.
        </div>
      </div>
      <div class="dashboard__body row mb-5">
        <div class="col-4">
          <UCard
            class="dashboard__body__card"
            :ui="{
              header: {
                base: '',
                background: '',
                padding: 'px-4 py-3 sm:px-6',
              },
            }"
          >
            <template #header>
              <div
                class="dashboard__body__card__header d-flex justify-content-between"
              >
                Create Submission
              </div>
            </template>
            <div class="row">
              <div class="col-6">
                <img
                  src="assets/images/dashboard/submission.jpg"
                  alt="User submissions"
                  class=""
                />
              </div>
              <div class="col-6 col-separator">
                <div class="">
                  Explore your submitted content, check approvals, and find
                  resources for future contributions.
                </div>
                <div class="dashboard__body__card__link">
                  <button class="ripple custom-button-primary">
                    <NuxtLink to="/dashboard/submission" class="dashboard-link"
                      >Create submission</NuxtLink
                    >
                  </button>
                </div>
              </div>
            </div>
          </UCard>
        </div>
        <div class="col-4">
          <UCard
            class="dashboard__body__card"
            :ui="{
              header: {
                base: '',
                background: '',
                padding: 'px-4 py-3 sm:px-6',
              },
            }"
          >
            <template #header>
              <div
                class="dashboard__body__card__header d-flex justify-content-between"
              >
                Your submissions list
              </div>
            </template>
            <div class="row">
              <div class="col-6">
                <img
                  src="assets/images/dashboard/contribute.jpg"
                  alt="User submissions"
                  class=""
                />
              </div>
              <div class="col-6 col-separator">
                <div class="">
                  Explore your submitted content, check approvals, and find
                  resources for future contributions.
                </div>
                <div class="dashboard__body__card__link">
                  <button class="ripple custom-button-primary">
                    <NuxtLink
                      to="/dashboard/submission-list"
                      class="dashboard-link"
                      >View submission</NuxtLink
                    >
                  </button>
                </div>
              </div>
            </div>
          </UCard>
        </div>
        <div class="col-4">
          <UCard
            class="dashboard__body__card"
            :ui="{
              header: {
                base: '',
                background: '',
                padding: 'px-4 py-3 sm:px-6',
              },
            }"
          >
            <template #header>
              <div
                class="dashboard__body__card__header d-flex justify-content-between"
              >
                Contribute to a community
              </div>
            </template>
            <div class="row">
              <div class="col-6">
                <img
                  src="assets/images/dashboard/contribute_2.jpg"
                  alt="User contribute"
                  class=""
                />
              </div>
              <div class="col-6 col-separator">
                <div class="">
                  Become an active contributor! Apply to join a community and
                  help drive innovation in software evaluation.
                </div>
                <div class="dashboard__body__card__link">
                  <button class="ripple custom-button-primary">
                    <NuxtLink to="/dashboard/contribute" class="dashboard-link"
                      >Contribute</NuxtLink
                    >
                  </button>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
      <div class="dashboard__body row mb-5">
        <div class="col-6">
          <UCard
            class="dashboard__body__card"
            :ui="{
              header: {
                base: '',
                background: '',
                padding: 'px-4 py-3 sm:px-6',
              },
            }"
          >
            <template #header>
              <div
                class="dashboard__body__card__header d-flex justify-content-between"
              >
                Communities
                <span class="text-gray-500">Total: {{ totalCommunities }}</span>
              </div>
            </template>
            <div class="row">
              <div class="col-6">
                <img
                  src="assets/images/dashboard/entries.png"
                  alt="User profile picture"
                  class=""
                />
              </div>
              <div class="col-6 col-separator">
                <div class="">
                  Here you can find information about the communities you are
                  part of, as well as the tools available to you.
                </div>
                <div class="dashboard__body__card__link">
                  <button class="ripple custom-button-primary">
                    <NuxtLink
                      to="/dashboard/projects_communities"
                      class="dashboard-link"
                      >Projects & Communities</NuxtLink
                    >
                  </button>
                </div>
              </div>
            </div>
          </UCard>
        </div>
        <div class="col-6">
          <UCard
            class="dashboard__body__card"
            :ui="{
              header: {
                base: '',
                background: '',
                padding: 'px-4 py-3 sm:px-6',
              },
            }"
          >
            <template #header>
              <div
                class="dashboard__body__card__header d-flex justify-content-between"
              >
                Communications
                <span class="text-gray-500">Total: 2</span>
              </div>
            </template>
            <div class="row">
              <div class="col-6">
                <img
                  src="assets/images/dashboard/notifications.jpg"
                  alt="User notification"
                  class=""
                />
              </div>
              <div class="col-6 col-separator">
                <div class="">
                  Here you can find information about your communications,
                  including available tools and channels to stay connected.
                </div>
                <div class="dashboard__body__card__link">
                  <button class="ripple custom-button-primary">
                    <NuxtLink
                      to="/dashboard/communications"
                      class="dashboard-link"
                      >See Communications</NuxtLink
                    >
                  </button>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
      <div class="dashboard__body row">
        <div class="col-12">
          <UCard
            class="dashboard__body__card"
            :ui="{
              header: {
                base: '',
                background: '',
                padding: 'px-4 py-3 sm:px-6',
              },
            }"
          >
            <template #header>
              <div
                class="dashboard__body__card__header d-flex justify-content-between"
              >
                Metrics
                <span class="text-gray-500">Total: {{ totalMetrics }}</span>
              </div>
            </template>
            <div class="w-100">
              <div class="row">
                <div class="col-7 row">
                  <div class="col-6">
                    <img
                      src="assets/images/dashboard/22821946_Na_Dec_02.jpg"
                      alt="User profile picture"
                      class=""
                    />
                  </div>
                  <div class="col-6">
                    <div class="w-100">
                      <div class="">
                        Here you can find information about the communities you
                        are part of and the tools you have access to.
                      </div>
                    </div>
                    <div class="dashboard__body__card__link">
                      <button class="ripple custom-button-primary mr-2">
                        <NuxtLink
                          to="/dashboard/metrics/plots"
                          class="dashboard-link"
                          >Plots Playground</NuxtLink
                        >
                      </button>
                      <button class="ripple custom-button-primary">
                        <NuxtLink to="/dashboard/metrics" class="dashboard-link"
                          >Explore Metrics</NuxtLink
                        >
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-5">
                  <div class="row">
                    <div class="col-6 card-row">
                      <div class="card-row-wrapper">
                        <div class="card-plot-title">
                          <h3>Bar plots</h3>
                          <div class="card-plot-title-sub">
                            <span>{{ metricsByType[0].total }} plots</span>
                            <div class="card-plot-img">
                              <BarSvg />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-6 card-row">
                      <div class="card-row-wrapper">
                        <div class="card-plot-title">
                          <h3>Scatter plot</h3>
                          <div class="card-plot-title-sub">
                            <span>{{ metricsByType[1].total }} plots</span>
                            <div class="card-plot-img">
                              <ScatterSvg />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-6 card-row">
                      <div class="card-row-wrapper">
                        <div class="card-plot-title">
                          <h3>Line plot</h3>
                          <div class="card-plot-title-sub">
                            <span>{{ metricsByType[2].total }} plots</span>
                            <div class="card-plot-img">
                              <LineSvg />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-6 card-row">
                      <div class="card-row-wrapper">
                        <div class="card-plot-title">
                          <h3>Box plot</h3>
                          <div class="card-plot-title-sub">
                            <span>{{ metricsByType[3].total }} plots</span>
                            <div class="card-plot-img">
                              <BoxSvg />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import { useUser } from "@/stores/user.ts";

import BarSvg from "../../public/images/plots/bar-chart.svg?component";
import ScatterSvg from "../../public/images/plots/scatter-chart.svg?component";
import LineSvg from "../../public/images/plots/line-chart.svg?component";
import BoxSvg from "../../public/images/plots/box-chart.svg?component";

definePageMeta({
  middleware: "auth",
  auth: {
    authenticatedOnly: true,
    navigateUnauthenticatedTo: "/login-required",
  },
});

defineExpose({
  countTotalMetrics,
});

const { data, status } = useAuth();
const userStore = useUser();
const runtimeConfig = useRuntimeConfig();
const totalMetrics = ref(0);
const totalTools = ref(0);
const totalCommunities = ref(0);
const totalContacts = ref(0);
const metricsByType = ref([
  { name: "Bar Plot", total: 0 },
  { name: "Scatter Plot", total: 0 },
  { name: "Line Plot", total: 0 },
  { name: "Box Plot Plot", total: 0 },
]);

const communitiesByStatus = ref<Record<string, number>>({});
const token = computed(() => data.value?.accessToken || "");

const userName = computed(() => {
  return data.value && data.value.statusCode != "404"
    ? data.value.user.name
    : "";
});

if (status.value == "authenticated") {
  const privileges: Array<string> = computed(() => {
    return userStore.getUserCommunitiesRoles.map(
      (role: { role: string }) => role.role,
    );
  });

  if (privileges.value && privileges.value.length === 0) {
    userStore.setUserCommunitiesRoles(data.value.oeb_roles);
  }
} else {
  userName.value = "";
}

async function countTotalMetrics() {
  try {
    const response = await $fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Metrics`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
          Accept: "application/json",
        },
        method: "GET",
      },
    );

    const data = await response;
    totalMetrics.value = data.length;
    await getMetricsByType(data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function countTotalTools() {
  try {
    const response = await $fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Tool`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
          Accept: "application/json",
        },
        method: "GET",
      },
    );

    const data = await response;
    totalTools.value = data.length;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function countTotalCommunities() {
  try {
    const response = await $fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Community`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
          Accept: "application/json",
        },
        method: "GET",
      },
    );

    const data = await response;
    console.log(data);
    totalCommunities.value = data.length;
    const grouped = data.reduce((acc: Record<string, number>, community) => {
      const status = community.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    communitiesByStatus.value = grouped;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function countTotalContacts() {
  try {
    const response = await $fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Contact`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
          Accept: "application/json",
        },
        method: "GET",
      },
    );

    const data = await response;
    totalContacts.value = data.length;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getMetricsByType(metrics) {
  const typeMap = {
    visualization: "Bar Plot",
    optimization: "Scatter Plot",
    visualizationBox: "Box Plot",
    visualizationLine: "Line Plot",
  };

  metrics.forEach((metric) => {
    if (
      metric.representation_hints &&
      metric.representation_hints.visualization
    ) {
      const type = metricsByType.value.filter(
        (item) => item.name === typeMap.visualization,
      );
      type[0].total += 1;
    } else if (
      metric.representation_hints &&
      metric.representation_hints.optimization
    ) {
      const type = metricsByType.value.filter(
        (item) => item.name === typeMap.optimization,
      );
      type[0].total += 1;
    }
  });
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${userName.value}`;
  else if (hour < 18) return `Good afternoon, ${userName.value}`;
  else return `Good evening, ${userName.value}`;
}

onMounted(async () => {
  if (token.value) {
    countTotalMetrics();
    countTotalTools();
    countTotalCommunities();
    countTotalContacts();
  }
});

watch(
  token,
  (newValue) => {
    if (newValue) {
      countTotalCommunities();
      countTotalContacts();
      countTotalTools();
      countTotalMetrics();
    }
  },
  { immediate: true },
);
</script>

<style lang="scss">
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
      box-shadow:
        rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
        rgba(0, 0, 0, 0.08) 0px 0px 0px 1px !important;
      min-height: 320px;
      display: flex;
      flex-direction: column;
      transition: transform 0.4s;
      &__header {
        font-size: 20px;
        font-weight: 600;
        color: theme("colors.primary.500");
        & span {
          font-size: 18px;
          font-weight: 500;
          color: theme("colors.gray.500");
        }
      }
      &__link {
        padding-top: 25px;
        display: flex;
        justify-content: end;
      }
      & img {
        max-height: 150px;
      }
      &:hover {
        transform: scale(1.05);
      }
    }
  }
  .col-separator {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
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
      &:hover .dashboard-link {
        color: theme("colors.primary.500");
      }
    }
  }
  .card-plot-title {
    width: 100%;
    h3 {
      font-size: 14px;
    }
  }
  .card-plot-title-sub {
    font-size: 16px;
    font-weight: 600;
    color: theme("colors.primary.500");
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 30px;
    padding: 5px 10px;
  }
  .card-plot-img {
    display: flex;
    justify-content: center;
    align-content: center;
    svg {
      width: 30px;
      height: 30px;
    }
  }
  .card-row {
    text-align: center;
    padding: 5px 10px;
    margin-bottom: 5px;
  }
  .card-row-wrapper {
    box-shadow:
      rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
      rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 5px 10px;
    height: 100%;
  }
}
</style>
