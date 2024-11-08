<template>
  <div>
  <NuxtLayout :name="layout">
    <template #data>
      <div class="p-4">
        <div class="row my-4">
          <h5 class="">Explore Data Integration at the Software Observatory</h5>
        </div>
        <div class="row my-4">
          <div class="col-6">
            <p style="line-height: 1.9" class="mb-0 mt-0">
              Our system periodically pulls metadata from
            <strong>eight diverse sources</strong>, enriched further with dynamic
            data on repository activity, website availability, and trends in
            publication citations. As each piece of metadata flows into our
            system, it undergoes a meticulous harmonization process, ensuring
            uniformity and relevance across varying data types and sources.
            <br /><br />
            On this page, you can <strong>Visualize the Integration</strong>: dive
            into our enriched database and see firsthand the scope of each
            source's contribution, the comprehensive depth of metadata, and the
            overlaps that characterize our dataset.
            </p>
          </div>
          <div class="col-6">
            <img src="/images/observatory/observatory_illustration_5.svg"
            alt="Illustration_5"
            class="illustration5" />
          </div>

        </div>

        <!-- collectionSelector -->
        <div class="row mt-4">
          <div  class="col-2"></div>
          <div class="col-8">
            <collectionSelector/>
          </div>
          <div class="col-2"></div>
        </div>
        
        <!-- MainCards -->
        <div class="bg-neutral-100 my-4">
          <MainCards/>
        </div>

        <!-- Plots -->
        <div class="row justify-center mt-4">

          <!-- 1  -->
          <div class="col-12">
            <div class="my-4 p-4 max-full bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <h5 class="text-center mt-6 mb-4">
                Consolidated Research Software (meta)data
              </h5>
              <div class="row">
                <div class="col-lg-9 col-12">
                  <!-- v-if -->
                  <USkeleton v-if="store.unLoaded.features" class="h-52 mb-3 mx-10"/>
                  <USkeleton v-if="store.unLoaded.features" class="h-7 w-80 rounded-xl mb-5 mx-10" />
                  <!-- v-else -->
                    <PlotOverview v-else />
                </div>
                <div class="col-lg-3 col-12">
                  <p class="mb-2">
                    <span class="text-primaryOeb-600 text-base"
                      >Features obtained from the different software metadata
                      sources and total number of instances for which each feature
                      exists in the dataset.</span>
                  </p>
                  <p class="mb-5">
                    Dots (green: primary sources, red: secondary sources, blue:
                    OpenEbench) show the availability of such features in the
                    indicated sources. <br />
                    Bars indicate the actual number of retrieved metadata items.
                    Variation of the amounts is a consequence of the lack of
                    completeness of metadata annotation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 2 -->
            <div class="col-12">
            <div class="my-4 p-4 max-full bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <h5 class="text-center mt-6 mb-4">
                Instances Coverage
              </h5>
              <div class="row">
                <div class="col-lg-8 col-12">
                  <!-- v-if -->
                  <USkeleton v-if="store.unLoaded.coverageSources" class="h-52 mb-3 mx-10"/>
                  <USkeleton v-if="store.unLoaded.coverageSources" class="h-7 w-80 rounded-xl mb-5 mx-10" />
                  <!-- v-else -->
                    <PlotSources v-else :small="isSmallViewport" />
                </div>
                <div class="col-lg-3 col-12">
                  <p class="mb-2">
                    <span class="text-primaryOeb-600 text-base"
                      >Cumulative distribution of number of sources where individual
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
            <div class="col-6">
              <div class="pb-5 my-4 p-4 max-full bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <h5 class="text-center mt-6 mb-4">
                  (Meta)data Completeness
                </h5>
                <div class="row">
                  <div class="col-12">
                    <!-- v-if -->
                    <USkeleton v-if="store.unLoaded.completeness" class="h-52 mb-3 mx-10"/>
                    <USkeleton v-if="store.unLoaded.completeness" class="h-7 w-80 rounded-xl mb-5 mx-10" />
                    <!-- v-else -->
                    <CompletenessPlot v-else />
                  </div>
                  <div class="col-12">
                    <p class="mb-2">
                      <span class="text-primaryOeb-600 text-base"
                        >Distribution of number of features collected on individual
                        instances.</span>
                    </p>
                    <p class="mb-5">
                      The higher the number of features for an instance, the more
                      information gathered about that instance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          <!-- 4 -->
          <div class="col-6">
            <div class="my-4 p-4 max-full bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <h5 class="text-center mt-6 mb-4">
                Types Of Software
              </h5>
              <div class="row">
                <div class="col-12">
                  <!-- v-if -->
                  <USkeleton v-if="store.unLoaded.types" class="h-52 mb-3 mx-10"/>
                  <USkeleton v-if="store.unLoaded.types" class="h-7 w-80 rounded-xl mb-5 mx-10" />
                  <!-- v-else -->
                    <PlotTypes v-else />
                </div>
                <div class="col-12">
                  <p class="mb-2">
                    <span class="text-primaryOeb-600 text-base"
                      >Distribution of the types of instances in the
                      collection.</span>
                  </p>
                  <p class="mb-5">
                    Research Software may be implemented or accessed in different
                    ways via web interface, REST API, command line, workflow, etc.
                    Current types captured are (<i
                    >cmd, web, db, app, lib, ontology, workflow, plugin, sparql,
                      soap, script, rest, workbench, suite</i
                    >)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </NuxtLayout>
</div>
</template>
  
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useData } from '@/stores/observatory/data.js';
import collectionSelector from "@/components/Observatory/CollectionSelector.vue"
import MainCards from "@/components/Observatory/data/CountCards/MainCards.vue"
import PlotOverview from "@/components/Observatory/data/PlotOverview.vue"
import PlotSources from "@/components/Observatory/data/PlotSources.vue"
import PlotTypes from "@/components/Observatory/data/PlotTypes.vue"
import CompletenessPlot from "@/components/Observatory/data/CompletenessPlot.vue"

// Layout
const layout = 'observatory'
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
.illustration5{
  width: 80%;
}

p {
  line-height: 22px;
  font-size: 14px;
}
</style>