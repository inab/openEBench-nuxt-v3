<template>
  <div class="relative">
    <!-- Options Button -->
    <PlotWOptions v-if="checkData.value" class="copy-icon" :items="dialogItems" :currentCollection="current_collection" />
    
    <!-- Header -->
    <div class="text-center mt-4 mb-0">
        <h6 class="text-2xl font-semibold">Documentation</h6>
        <p class="card-content-vs text-sm mt-4 text-gray-700" style="line-height: 1.8">
          Documentation plays a crucial role in making software understandable, installable, and usable by others.
          Evaluating the presence and type of documentation—such as READMEs, user guides, or API references—helps assess a tool’s <span class="highlight">Findability</span>, <span class="highlight">Accessibility</span>, and <span class="highlight">Reusability</span>.
          <br />
          Good documentation is a cornerstone of FAIR and Open Science practices, enabling transparent use, adaptation, and integration of software across research contexts.
        </p>
    </div>

    <div class="mt-0 mb-2">
        <div v-if="isDocumentationLoading">
          <USkeleton class="h-52 mb-3 mx-10" />
        </div>
        <div v-else>
          <DocumentationPlot v-if="checkData.value" :data="documentationData" />
          <noDataAvailable info="documentation" v-else />
        </div>
      </div>
      <p class="mt-2 text-center mb-2 ml-8">
        <span class="text-sm highlight">
          Overview of documentation types and their availability in different formats across the collection.
        </span>
      </p>
    </div>

</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useTrends } from '../../../../stores/observatory/trends.js';
import { useObservatory } from '@/stores/observatory/index.js';

import DocumentationPlot from './DocumentationPlot.vue';
import PlotWOptions from '~/components/Observatory/PlotWOptions.vue';
import noDataAvailable from '@/layouts/noDataAvailableImg.vue';
import { embedCodes } from '~/components/Observatory/visualizations/embedCodes.js';

const trends = useTrends();
const observatoryStore = useObservatory();

const dialogItems = [embedCodes.dependencies]; // Define in `embedCodes.js`
const current_collection = computed(() => observatoryStore.currentCollection);

// Data 
const documentationData = computed(() => trends.Documentation.data);
const isDocumentationLoading = computed(() => trends.unLoaded.documentation);

const checkData = ref(false);

onMounted(async () => {
  await trends.getDocumentation();
  checkData.value = computed(() => documentationData !== []);
});


</script>

<script lang="ts">
export default {
  name: 'DocumentationMain'
};
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
</style>