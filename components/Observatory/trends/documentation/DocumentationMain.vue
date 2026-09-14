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
    <div class=" mt-4">
      <h6 class="text-2xl font-semibold text-center">Documentation</h6>

      <div class="row mt-4">
        <!-- Description -->
        <div class="col-lg-9 col-12">
          <p style="line-height: 1.8" class="card-content-vs text-sm text-gray-700">
            Documentation plays a crucial role in making software understandable,
            installable, and usable by others. Evaluating the presence and type of
            documentation—such as READMEs, user guides, or API references—helps
            assess a tool's
            <span class="highlight">Findability</span>,
            <span class="highlight">Accessibility</span>, and
            <span class="highlight">Reusability</span>.
          </p>

          <p style="line-height: 1.8" class="card-content-vs text-sm text-gray-700 mt-2">
            Good documentation enables transparent use, adaptation, and
            integration of software across research contexts.
          </p>
        </div>

        <!-- Percentage -->
        <div class="col-lg-3 col-12 mt-lg-0">
          <USkeleton
            v-if="isDocumentationCountLoading"
            class="h-40"
          />
          <div v-else class="doc-percentage-card text-center d-flex flex-column justify-content-center align-items-center h-100">
            <span class="doc-percentage">
              {{ percentage.toFixed(1) }}%
            </span>
            <p class="mb-0 mt-2 text-sm">
              of software have
              <span class="fw-semibold">documentation</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Plot -->
    <div class="mt-5 mb-5">
      <div v-if="isDocumentationLoading">
        <USkeleton class="h-80 mb-3 mx-10" />
      </div>

      <div v-else>
        <DocumentationPlot
          v-if="checkData"
          :data="documentationPlotData"
        />

        <noDataAvailable v-else />
      </div>
    </div>

    <p class="text-center mb-2 ml-8">
      <span class="text-sm highlight">
        Overview of documentation types and their availability in different
        formats across the collection
      </span>
    </p>
  </div>
</template>
<script setup lang="ts">
import { onMounted, computed} from 'vue';
import DocumentationPlot from './DocumentationPlot.vue';
import { useTrends } from '@/stores/observatory/trends';
import { useObservatory } from '@/stores/observatory/index.js';
import noDataAvailable from "@/layouts/noDataAvailableImg.vue";
import PlotWOptions from '~/components/Observatory/PlotWOptions.vue';
import { embedCodes } from "~/components/Observatory/visualizations/embedCodes.js";

// Store
const trendsStore = useTrends();
const observatoryStore = useObservatory();

const dialogItems = [embedCodes.documentation];

// Current Collection
const current_collection = computed(() => observatoryStore.currentCollection);

// Get Data
const documentation = computed(() => trendsStore.Documentation);
const documentationCount = computed(() => trendsStore.DocumentationCount);

// Loading States
const isDocumentationLoading = computed(
  () => trendsStore.Loaded.documentation
);
const isDocumentationCountLoading = computed(
  () => trendsStore.Loaded.documentationCount
);

const percentage = computed(() => {
  const pct = documentationCount.value?.data.percentage;

  return typeof pct === "number" ? pct * 100 : 0;
});

const documentationPlotData = computed(() => {
  if (!documentation.value) return {};

  return documentation.value.data
    ? documentation.value.data
    : documentation.value;
});

const checkData = computed(() => {
  const data = documentationPlotData.value;

  if (Array.isArray(data)) {
    return data.length > 0;
  }

  if (data && typeof data === "object") {
    return Object.keys(data).length > 0;
  }

  return false;
});
// Fetch Data on Mount
onMounted(async () => {
  await trendsStore.getDocumentation();
  await trendsStore.getDocumentationCount();
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

.doc-percentage-card {
  border-radius: 8px;
  padding: 0.5rem;
  background: #e4e9f2;
  min-height: 130px;
}

.doc-percentage {
  font-size: 2.4rem;
  line-height: 1;
  font-weight: 600;
}
</style>