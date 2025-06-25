<template>
    <div class="relative">
      <!-- Options Button -->
      <PlotWOptions v-if="checkData.value" class="copy-icon" :items="dialogItems" :currentCollection="current_collection" />
  
      <!-- Header -->
      <div class="text-center mt-4">
        <h6 class="text-2xl font-semibold">Dependencies</h6>
        <p class="card-content-vs text-sm mt-4 text-gray-700" style="line-height: 1.8">
          Software packages often depend on other tools or libraries to function properly.
          Analyzing these dependencies helps us understand tool interoperability and reusability,
          supporting the <span class="highlight">Reusability</span> and
          <span class="highlight">Interoperability</span> principles of FAIR.
          <br />
          Dependencies also give insight into popular ecosystems and shared technical stacks in Life Sciences software.
        </p>
      </div>
  
      <div class="mt-4 mb-2">
        <div v-if="isDependenciesLoading">
          <USkeleton class="h-52 mb-3 mx-10" />
        </div>
        <div v-else>
          <DependenciesPlot v-if="checkData.value" :data="dependenciesData" />
          <noDataAvailable info="dependencies" v-else />
        </div>
      </div>
  
      <p class="mt-2 text-center mb-2 ml-8">
        <span class="text-sm highlight">
          Top dependencies used in research software tools in the Life Sciences.
        </span>
      </p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, computed, ref } from 'vue';
  import { useTrends } from '@/stores/observatory/trends';
  import { useObservatory } from '@/stores/observatory/index.js';
  
  import DependenciesPlot from './DependenciesPlot.vue';
  import PlotWOptions from '~/components/Observatory/PlotWOptions.vue';
  import noDataAvailable from '@/layouts/noDataAvailableImg.vue';
  import { embedCodes } from '~/components/Observatory/visualizations/embedCodes.js';
  
  const trendsStore = useTrends();
  const observatoryStore = useObservatory();
  
  const dialogItems = [embedCodes.dependencies]; // Define in `embedCodes.js`
  const current_collection = computed(() => observatoryStore.currentCollection);
  
  // Data
  const dependenciesData = computed(() => trendsStore.Dependencies || []);
  const isDependenciesLoading = computed(() => trendsStore.Loaded.dependencies);
  
  const checkData = ref(false);
  
  // On mount, trigger data load
  onMounted(async () => {
    await trendsStore.getDependencies();
    checkData.value = computed(() => dependenciesData.value.length > 0);
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
  </style>