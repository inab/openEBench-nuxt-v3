<template>
  <div class="dashboard">
    <div class="w-100 container">
      <div class="dashboard__header">
        <div class="dashboard__header__title">
          <h2 class="text-primaryOeb-500">Dashboard</h2>
        </div>
        <div class="dashboard__header__description text-gray-500">
          Welcome <span data-testid="name">{{ data.name }}</span
          >to the OpenEBench Dashboard.
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
                padding: 'px-2 py-3 sm:px-6',
              },
            }"
          >
            <template #header>
              <div class="dashboard__body__card__header">Metrics</div>
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
                    <div class="">
                      Total metrics: <span>{{ totalMetrics }}</span>
                    </div>
                    <div class="">
                      Here you can find information about the communities you
                      are part of and the tools you have access to.
                    </div>
                  </div>
                  <div class="dashboard__body__card__link">
                    <button class="ripple custom-button-primary">
                      <NuxtLink to="/dashboard/entries" class="dashboard-link"
                        >Explore Metrics</NuxtLink
                      >
                    </button>
                  </div>
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
                padding: 'px-2 py-3 sm:px-6',
              },
            }"
          >
            <template #header>
              <div class="dashboard__body__card__header">Metrics stats</div>
            </template>
            <div class="">
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
                      <h3>Radar plot</h3>
                      <div class="card-plot-title-sub">
                        <span>{{ metricsByType[3].total }} plots</span>
                        <div class="card-plot-img">
                          <RadarSvg />
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
      <div class="dashboard__body row">
        <div class="col-4">
          <UCard
            class="dashboard__body__card"
            :ui="{
              header: {
                base: '',
                background: '',
                padding: 'px-2 py-3 sm:px-6',
              },
            }"
          >
            <template #header>
              <div class="dashboard__body__card__header">Entries</div>
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
                    Here you can find information about the communities you are
                    part of and the tools you have access to.
                  </div>
                  <div class="dashboard__body__card__link">
                    <button class="ripple custom-button-primary">
                      <NuxtLink to="/dashboard/entries" class="dashboard-link"
                        >Entries</NuxtLink
                      >
                    </button>
                  </div>
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
                padding: 'px-2 py-3 sm:px-6',
              },
            }"
          >
            <template #header>
              <div class="dashboard__body__card__header">Contacts</div>
            </template>

            <div class="">
              <div class="row">
                <div class="col-6">
                  <img
                    src="assets/images/dashboard/contacts.jpg"
                    alt="User profile picture"
                    class=""
                  />
                </div>
                <div class="col-6">
                  <div class="">
                    Here you can find information about the communities you are
                    part of and the tools you have access to.
                  </div>
                  <div class="dashboard__body__card__link">
                    <button class="ripple custom-button-primary">
                      <NuxtLink to="/dashboard/contacts" class="dashboard-link"
                        >Contacts</NuxtLink
                      >
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
      <div class=""></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useUser } from "@/stores/user.ts";

import BarSvg from "../../public/images/plots/bar-chart.svg?component";
import ScatterSvg from "../../public/images/plots/scatter-chart.svg?component";
import LineSvg from "../../public/images/plots/line-chart.svg?component";
import RadarSvg from "../../public/images/plots/radar-chart.svg?component";

definePageMeta({
  middleware: "auth",
  auth: {
    authenticatedOnly: true, // Solo permite acceso a usuarios autenticados
    navigateUnauthenticatedTo: "/login-required", // Redirige a los no autenticados
  },
});

const { data, status } = useAuth();
const userStore = useUser();
const runtimeConfig = useRuntimeConfig();
const totalMetrics = ref(0);
const totalTools = ref(0);
const metricsByType = ref([
  { name: "Bar Plot", total: 0 },
  { name: "Scatter Plot", total: 0 },
  { name: "Line Plot", total: 0 },
  { name: "Radar Plot", total: 0 },
]);

let token: string | undefined;
if (data.value) {
  token = data.value.accessToken;
}

const userName = computed(() => {
  return data.value && data.value.statusCode != "404" ? data.value.name : "";
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

await countTotalMetrics();
async function countTotalMetrics() {
  try {
    const response = await $fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Metrics`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        method: "GET",
      },
    );

    const data = await response;
    totalMetrics.value = data.length;
    await getMetricsByType(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

await countTotalTools();
async function countTotalTools() {
  try {
    const response = await $fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Tool`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
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

async function getMetricsByType(metrics) {
  metrics.forEach((metric) => {
    if (
      metric.representation_hints &&
      metric.representation_hints.visualization
    ) {
      const type = metricsByType.value.filter(
        (item) => item.name === "Bar Plot",
      );
      type[0].total += 1;
    } else if (
      metric.representation_hints &&
      metric.representation_hints.optimization
    ) {
      const type = metricsByType.value.filter(
        (item) => item.name === "Scatter Plot",
      );
      type[0].total += 1;
    } else if (
      metric.representation_hints &&
      metric.representation_hints.visualization
    ) {
      const type = metricsByType.value.filter(
        (item) => item.name === "Line Plot",
      );
      type[0].total += 1;
    }
  });

  console.log(metricsByType.value);
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
      box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px !important;
      height: 100%;
      display: flex;
      flex-direction: column;
      &__header {
        font-size: 20px;
        font-weight: 600;
        color: theme("colors.primary.500");
      }
      &__link {
        padding-top: 15px;
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
    box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 5px 10px;
    height: 100%;
  }
}
</style>
