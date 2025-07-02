<template>
  <div>
    <div class="content p-4">
      <div class="row my-4">
        <h3 class="fw-bold">Data integration at the Software Observatory</h3>
      </div>
      
      <!-- collectionSelector -->
      <div class="row mt-4">
        <div class="col-2"></div>
        <div class="col-8">
          <collectionSelector />
        </div>
        <div class="col-2"></div>
      </div>

      <!-- MainCards -->
      <div class="bg-neutral-100 my-4">
        <MainCards />
      </div>

      <!-- Plots -->
      <div class="row justify-center mt-4">

        <!-- 1  -->
        <div class="col-12">
          <div
            class="my-4 p-4 max-full bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <h5 class="text-center mt-6 mb-4 text-2xl font-semibold">
              Consolidated Research Software (meta)data
            </h5>
            <div class="row">
              <div class="col-lg-9 col-12">
                <!-- v-if -->
                <USkeleton v-if="store.unLoaded.features" class="h-52 mb-3 mx-10" />
                <USkeleton v-if="store.unLoaded.features" class="h-7 w-80 rounded-xl mb-5 mx-10" />
                <!-- v-else -->
                <PlotOverview v-else />
              </div>
              <div class="col-lg-3 col-12">
                <p class="m3-2">
                  <span class="text-primaryOeb-600 text-base">Features obtained from the different software metadata
									  sources and total number of software for which each feature
									  exists in the dataset.
                  </span>
                </p>
                <p class="mb-5">
                  Colored dots indicate the presence of each metadata feature in
                  the corresponding source. <br />
                  Bars represent the actual number of retrieved metadata records
                  per feature. Differences in counts reflect variation in the
                  completeness of metadata annotations across sources.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 2 -->
        <div class="col-12">
          <div
            class="my-4 p-4 max-full bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <h5 class="text-center mt-6 mb-4 text-2xl font-semibold">
              Instances Coverage
            </h5>
            <div class="row">
              <div class="col-lg-8 col-12">
                <!-- v-if -->
                <USkeleton v-if="store.unLoaded.coverageSources" class="h-52 mb-3 mx-10" />
                <USkeleton v-if="store.unLoaded.coverageSources" class="h-7 w-80 rounded-xl mb-5 mx-10" />
                <!-- v-else -->
                <PlotSources v-else :small="isSmallViewport" />
              </div>
              <div class="col-lg-3 col-12">
                <p class="mb-2">
                  <span class="text-primaryOeb-600 text-base">Cumulative distribution of number of sources where
                    individual
                    instances are found (yellow).</span>
                </p>
                <p class="mb-5">
                  Stacked bars represent the contribution of each source in terms
                  of number of metadata entries. Sources used to discover software
                  and build an initial collection of instances are coloured in
                  shades of green, while those used to further enrich the initial
                  collection are depicted in shades of red. OpenEBench, as an
                  exception, is coloured in red while belonging to the latter
                  category.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 3 -->
        <div class="col-6 d-flex">
          <div
            class="pb-5 my-4 p-4 w-100 bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 d-flex flex-column">
            <h5 class="text-center mt-6 mb-4 text-2xl font-semibold">
              (Meta)data Completeness
            </h5>
            <div class="row flex-grow-1">
              <div class="col-12">
                <USkeleton v-if="store.unLoaded.completeness" class="h-52 mb-3 mx-10" />
                <USkeleton v-if="store.unLoaded.completeness" class="h-7 w-80 rounded-xl mb-5 mx-10" />
                <CompletenessPlot v-else />
              </div>
              <div class="col-12 flex-grow-1">
                <p class="mb-2 mt-2">
                  <span class="text-primaryOeb-600 text-base">Distribution of number of features collected on individual
                    instances.</span>
                </p>
                <p class="mb-2">
                  The higher the number of features for an instance, the more
                  information gathered about that instance.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 4 -->
        <div class="col-6 d-flex">
          <div
            class="pb-5 my-4 p-4 w-100 bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 d-flex flex-column">
            <h5 class="text-center mt-6 mb-4 text-2xl font-semibold">
              Types Of Software
            </h5>
            <div class="row flex-grow-1">
              <div class="col-12">
                <USkeleton v-if="store.unLoaded.types" class="h-52 mb-3 mx-10" />
                <USkeleton v-if="store.unLoaded.types" class="h-7 w-80 rounded-xl mb-5 mx-10" />
                <PlotTypes v-else />
              </div>
              <div class="col-12 flex-grow-1">
                <p class="mb-2 mt-2">
                  <span class="text-primaryOeb-600 text-base">Distribution of the types of instances in the
                    collection.</span>
                </p>
                <p class="mb-2">
                  Research Software may be implemented or accessed in different
                  ways via web interface, REST API, command line, workflow, etc.
                  Current types captured are (<i>cmd, web, db, app, lib, ontology, workflow, plugin, sparql,
                    soap, script, rest, workbench, suite</i>).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useData } from '@/stores/observatory/data.js';
import collectionSelector from "@/components/Observatory/CollectionSelector.vue"
import MainCards from "./CountCards/MainCards.vue"
import PlotOverview from "./PlotOverview.vue"
import PlotSources from "./PlotSources.vue"
import PlotTypes from "./PlotTypes.vue"
import CompletenessPlot from "./CompletenessPlot.vue"

// Store Data
const store = useData();

store.getCountsPerSource();
store.getTotalCount();
store.getFeatures();
store.getCoverageSources();
store.getCompleteness();
store.getTypes();

const isSmallViewport = ref(false);
const checkViewportSize = () => {
  isSmallViewport.value = window.innerWidth <= 600;
};
onMounted(() => {
  checkViewportSize();
  window.addEventListener('resize', checkViewportSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkViewportSize);
});
</script>

<style scoped>
.content {
  margin-top: 20px;
}

.illustration5 {
  width: 80%;
}

p {
  line-height: 22px;
}
</style>