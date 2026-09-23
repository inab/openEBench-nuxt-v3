<template>
  <div class="metrics-plots">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">
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
          <template #plots>
            <div class="accordion_metrics__body">
              <div class="dashboard__description text-gray-500">
                <div class="dashboard__description__image">
                  <img
                    src="assets/images/dashboard/Charts-pana.png"
                    alt="metrics"
                    class="metrics__body__img"
                  />
                  <div class="hidden">
                    <a href="https://storyset.com/business"
                      >Business illustrations by Storyset</a
                    >
                  </div>
                </div>
                <div class="dashboard__description__text">
                  <div class="dashboard__description__text__extension">
                    Communities in OpenEBench leverage powerful visualization
                    tools to present benchmarking results in clear and
                    insightful ways. These interactive plots enable users to
                    explore performance trends, compare tool effectiveness
                    across different datasets, and gain valuable insights into
                    software capabilities.
                  </div>

                  <div class="dashboard__description__text__extension">
                    <p>
                      The plots available in OpenEBench include bar plots,
                      scatter plots, box plots, radar plots, and line plots.
                      Each plot type offers unique advantages for visualizing
                      and interpreting benchmarking data, allowing users to
                      tailor their analysis to specific research questions or
                      performance evaluation needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UAccordion>
        <div class="metrics__body pt-4">
          <div class="metric-filter d-flex justify-content-start">
            <div class="metric-filter__col col-3 d-flex">
              <label for="plotType" class="form-label">Select Plot Type:</label>
              <USelect
                v-model="plotSelected"
                :options="plotTypes"
                option-attribute="name"
                class="custom-select-input"
                size="xl"
              />
            </div>
          </div>
          <div class="dashboard-tabs pt-4">
            <Plots :type-selected="plotSelected" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import Plots from "@/components/Dashboard/metrics/plots/Plots.vue";
import { useRoute } from "vue-router";

definePageMeta({
  middleware: "auth",
  auth: {
    authenticatedOnly: true,
    navigateUnauthenticatedTo: "/login-required",
  },
});

const { data, status } = useAuth();
const route = useRoute();
const plotTypes = [
  {
    name: "Bar Plot",
    value: "bar-plot",
  },
  {
    name: "Scatter Plot",
    value: "2D-plot",
  },
  {
    name: "Box Plot",
    value: "box-plot",
  },
  {
    name: "Radar Plot",
    value: "radar-plot",
  },
  {
    name: "Line Plot",
    value: "line-plot",
  },
];
const plotSelected = ref(route.query.plot ?? plotTypes[0].value);

if (plotSelected.value == "scatter") {
  plotSelected.value = "2D-plot";
} else if (plotSelected.value == "bar") {
  plotSelected.value = "bar-plot";
}

const HEADER_ITEM = [
  {
    label: "Plots",
    defaultOpen: true,
    slot: "plots",
  },
];

const routeArray: Array = [
  { label: "Dashboard", isActualRoute: false, route: "/dashboard" },
  { label: "Metrics", isActualRoute: false, route: "/dashboard/metrics" },
  { label: "Plots", isActualRoute: true },
];
</script>

<style lang="scss" scoped>
.dashboard__description {
  display: flex;
  &__image {
    margin-right: 40px;
    img {
      max-height: 500px;
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
.dashboard__description__text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.metric-filter__col {
  align-items: center;
  label {
    padding-right: 30px;
    min-width: 150px;
  }
  .custom-select-input {
    min-width: 170px;
  }
}
</style>
