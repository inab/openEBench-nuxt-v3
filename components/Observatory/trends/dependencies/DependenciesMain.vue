<template>
    <div class="relative">
      <!-- Options Button -->
      <PlotWOptions v-if="checkData.value" class="copy-icon" :items="dialogItems" :currentCollection="current_collection" />
  
      <!-- Header -->
      <div class="mt-4 mb-0">
        <h6 class="text-center text-2xl font-semibold">Dependencies</h6>

        <div class="flex flex-wrap lg:flex-nowrap lg:h-full mt-4"> <!-- Left Column: Description -->

          <div class="lg:w-1/5 flex items-center lg:h-full ml-8 p-2"> <!-- Loader -->
            <USkeleton v-if="isDependenciesCountLoading" class="h-full w-full" />
              <!-- Card with Percentage -->
              <div v-else
                  class="text-center bg-orange-100 rounded flex flex-col justify-center items-center p-3.5">
                  <p class="text-4xl mb-1">{{ percentage.toFixed(1) }}%</p>
                  <p class="font-light mb-0">
                      of software state their <span class="font-bold">dependencies</span>
                  </p>
              </div>
          </div>
           <!-- Right Column: Stats Card -->
          <div class="flex-1 lg:w-4/5  flex flex-col justify-left lg:h-full mr-8 p-2">
              <p style="line-height: 1.8" class="card-content-vs  text-sm text-gray-700">
                Software packages often depend on other tools or libraries to function properly.
                Analyzing these dependencies helps us understand tool interoperability and reusability,
                supporting the <span class="highlight">Reusability</span> and
          <span class="highlight">Interoperability</span> principles of FAIR.
              </p>
              <p style="line-height: 1.8" class="card-content-vs  text-sm text-gray-700 mt-2">
                Dependencies also give insight into popular ecosystems and shared technical stacks in Life Sciences software.
              </p>
          </div>

         
        </div>
      </div>
  
      <div class="mt-0 mb-2">
        <div v-if="isDependenciesLoading">
          <USkeleton class="h-52 mb-3 mx-10" />
        </div>
        <div v-else>
          <DependenciesPlot v-if="checkData.value" :data="dependenciesData.data" />
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
  const isDependenciesLoading = computed(() => trendsStore.unLoaded.dependencies);
  const isDependenciesCountLoading = computed(() => trendsStore.unLoaded.dependenciesCount )
  const percentage = computed(() =>  trendsStore.DependenciesCount.data.percentage*100)

  const checkData = ref(false);
  
  // On mount, trigger data load
  onMounted(async () => {
    trendsStore.getDependencies();
    trendsStore.getDependenciesCount();
    checkData.value = computed(() => dependenciesData !== []);
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