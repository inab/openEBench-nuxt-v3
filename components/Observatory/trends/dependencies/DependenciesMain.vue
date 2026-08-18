<template>
  <div class="relative">
    <!-- Options Button -->
    <PlotWOptions
      v-if="checkData"
      class="copy-icon"
      :items="dialogItems"
      :currentCollection="current_collection"
    />

    <!-- Header -->
    <div class="mt-4">
      <h6 class="text-2xl font-semibold text-center">Dependencies</h6>

      <div class="row mt-4">
        <!-- Percentage -->
        <div class="col-lg-3 col-12 mb-4 mb-lg-0">
          <USkeleton
            v-if="isDependenciesCountLoading"
            class="h-40"
          />

          <div
            v-else
            class="deps-percentage-card text-center d-flex flex-column justify-content-center align-items-center h-100"
          >
            <span class="deps-percentage">
              {{ percentage.toFixed(1) }}%
            </span>

            <p class="mb-0 mt-2 text-sm">
              of software state their
              <span class="fw-semibold">dependencies</span>
            </p>
          </div>
        </div>

        <!-- Description -->
        <div class="col-lg-9 col-12">
          <p style="line-height: 1.8" class="card-content-vs text-sm text-gray-700">
            Software packages often depend on other tools or libraries to
            function properly. Analyzing these dependencies helps us
            understand tool interoperability and reusability, supporting the
            <span class="highlight">Reusability</span> and
            <span class="highlight">Interoperability</span> principles of
            FAIR.
          </p>

          <p style="line-height: 1.8" class="card-content-vs text-sm text-gray-700 mt-2">
            Dependencies also give insight into popular ecosystems and shared
            technical stacks in Life Sciences software.
          </p>
        </div>
      </div>
    </div>

    <!-- Plot -->
    <div class="mt-5 mb-5">
      <div v-if="isDependenciesLoading">
        <USkeleton class="h-80 mb-3 mx-10" />
      </div>

      <div v-else>
        <DependenciesPlot
          v-if="checkData"
          :data="dependenciesPlotData"
        />

        <noDataAvailable v-else />
      </div>
    </div>

    <p class="text-center mb-2 ml-8">
      <span class="text-sm highlight">
        Top dependencies used in research software tools in the Life Sciences
      </span>
    </p>

    <UAlert
      color="orange"
      variant="soft"
      icon="i-lucide-triangle-alert"
      description="Most upstream sources we aggregate do not provide dependency fields. Missing values reflect source limitations, not developer practices or lack of dependencies."
      class="mt-4"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import DependenciesPlot from "./DependenciesPlot.vue";
import PlotWOptions from "~/components/Observatory/PlotWOptions.vue";
import noDataAvailable from "@/layouts/noDataAvailableImg.vue";
import { useTrends } from '@/stores/observatory/trends';
import { useObservatory } from '@/stores/observatory/index.js';
import { embedCodes } from "~/components/Observatory/visualizations/embedCodes.js";

// Store
const trendsStore = useTrends();
const observatoryStore = useObservatory();

const dialogItems = [embedCodes.dependencies];

// Current Collection
const current_collection = computed(() => observatoryStore.currentCollection);

// Get Data
const dependenciesData = computed(() => trendsStore.Dependencies);
const dependenciesCount = computed(() => trendsStore.DependenciesCount);

// Loading States
const isDependenciesLoading = computed(
  () => trendsStore.Loaded.dependencies
);
const isDependenciesCountLoading = computed(
  () => trendsStore.Loaded.dependenciesCount
);

const percentage = computed(() => {
  const pct = dependenciesCount.value?.data.percentage;

  return typeof pct === "number" ? pct * 100 : 0;
});

const dependenciesPlotData = computed(() => {
  if (!dependenciesData.value) return {};

  return dependenciesData.value.data
    ? dependenciesData.value.data
    : dependenciesData.value;
});

const checkData = computed(() => {
  const data = dependenciesPlotData.value;

  if (Array.isArray(data)) {
    return data.length > 0;
  }

  if (data && typeof data === "object") {
    return Object.keys(data).length > 0;
  }

  return false;
});

onMounted(async () => {
  await trendsStore.getDependencies();
  await trendsStore.getDependenciesCount();
});
</script>

<style scoped>
.highlight {
  color: #001752f8;
  font-weight: 500;
}

.copy-icon {
  position: absolute;
  top: 5px;
  right: 10px;
}

.card-content-vs {
  font-size: 0.9em !important;
  width: 95%;
  margin: auto;
}

.deps-percentage-card {
  border-radius: 8px;
  padding: 0.5rem;
  background: #e4e9f2;
  min-height: 130px;
}

.deps-percentage {
  font-size: 2.4rem;
  line-height: 1;
  font-weight: 600;
}

</style>