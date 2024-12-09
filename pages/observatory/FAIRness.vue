<template>
  <div>
    <NuxtLayout :name="layout">
      <template #fairness>
        <div class="p-4">
          <div class="row my-4">
            <div class="col-8">
              <h3 class="mb-3">FAIRsoft Indicator Scoreboard</h3>
              <p style="line-height: 1.9" class="mb-0 mt-0">
                This page brings to light the <strong>collective insights</strong>
                from our FAIRsoft indicators, providing a clear snapshot of trends and scores across various software.
                <br>
              </p>
              <p style="line-height: 1.5" class="mb-0 mt-0">
                <strong>Deep Dive:</strong>
                Each FAIRsoft indicator is explained in detail
                <a href="https://inab.github.io/FAIRsoft_indicators/" target="_blank">here.</a>
              </p>
            </div>
            <!-- Alert -->
            <div class="col-4">
              <UAlert v-if="showAlert" :close-button="closeButtonOptions" @close="handleClose" color="sky"
                variant="soft" :ui="{ shadow: 'shadow-md', padding: 'p-3', gap: 'gap-0' }">

                <template #description>
                  <span class="text-black"><b>Looking for a personalized analysis? 🤔</b></span><br>
                  <span class="text-slate-900 text-xs">
                    Head over to the <NuxtLink to="./Evaluation">
                      <strong>FAIRsoft Evaluator</strong>
                    </NuxtLink>, where you can assess individual tools and really drill down into the specifics.
                  </span>
                </template>
              </UAlert>
            </div>
          </div>
          <!-- collectionSelector -->
          <div class="row mt-4">
            <div class="col-2"></div>
            <div class="col-8">
              <collectionSelector />
            </div>
            <div class="col-2"></div>
          </div>

          <!-- Plots -->
          <div class="row justify-center mt-4">

            <!-- 1  -->
            <div class="col-12">
              <div
                class="my-4 p-4 max-full bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <PlotWOptions class="copy-icon" :items="dialogItemsFindability"
                  :currentCollection="current_collection" />
                <h6 class="text-center mt-4 text-2xl font-semibold">
                  Findability
                </h6>
                <div class="row">
                  <div class="col-12">
                    <!-- Loader -->
                    <USkeleton v-if="storeFairness.unLoaded.FAIRscores" class="h-52 mb-3 mx-10" />
                    <USkeleton v-if="storeFairness.unLoaded.FAIRscores" class="h-7 w-80 rounded-xl mb-5 mx-10" />
                    <!-- Plot -->
                    <BubbleChart v-else div_id="findability" :collection="current_collection"
                      :collection_scores="fair_scores.F.fair_scores" :indicators_labels="fair_scores.F.labels"
                      :control_scores="control_fair_scores.F.fair_scores" :collection_colors="colors"
                      :collection_colors_lines="colors_lines" />
                  </div>
                </div>
              </div>
            </div>

            <!-- 2  -->
            <div class="col-12">
              <div
                class="my-4 p-4 max-full bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <PlotWOptions class="copy-icon" :items="dialogItemsAccessibility"
                  :currentCollection="current_collection" />
                <h6 class="text-center mt-4 text-2xl font-semibold"> Accessibility </h6>
                <div class="row">
                  <div class="col-12">
                    <!-- Loader -->
                    <USkeleton v-if="storeFairness.unLoaded.FAIRscores" class="h-52 mb-3 mx-10" />
                    <USkeleton v-if="storeFairness.unLoaded.FAIRscores" class="h-7 w-80 rounded-xl mb-5 mx-10" />
                    <!-- Plot -->
                    <BubbleChart v-else div_id="accessibility" :collection="current_collection"
                      :collection_scores="fair_scores.A.fair_scores" :indicators_labels="fair_scores.A.labels"
                      :control_scores="control_fair_scores.A.fair_scores" :collection_colors="colors"
                      :collection_colors_lines="colors_lines" />

                  </div>
                </div>
              </div>
            </div>

            <!-- 3 -->
            <div class="col-12">
              <div
                class="my-4 p-4 max-full bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <PlotWOptions class="copy-icon" :items="dialogItemsInteroperability"
                  :currentCollection="current_collection" />
                <h6 class="text-center mt-4 text-2xl font-semibold"> Interoperability </h6>
                <div class="row">
                  <div class="col-12">
                    <!-- Loader -->
                    <USkeleton v-if="storeFairness.unLoaded.FAIRscores" class="h-52 mb-3 mx-10" />
                    <USkeleton v-if="storeFairness.unLoaded.FAIRscores" class="h-7 w-80 rounded-xl mb-5 mx-10" />
                    <!-- Plot -->
                    <BubbleChart v-else div_id="interoperability" :collection="current_collection"
                      :collection_scores="fair_scores.I.fair_scores" :indicators_labels="fair_scores.I.labels"
                      :control_scores="control_fair_scores.I.fair_scores" :collection_colors="colors"
                      :collection_colors_lines="colors_lines" />

                  </div>
                </div>
              </div>
            </div>

            <!-- 4 -->
            <div class="col-12">
              <div
                class="my-4 p-4 max-full bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <PlotWOptions class="copy-icon" :items="dialogItemsReusability"
                  :currentCollection="current_collection" />
                <h6 class="text-center mt-4 text-2xl font-semibold"> Reusability </h6>
                <div class="row">
                  <div class="col-12">
                    <!-- Loader -->
                    <USkeleton v-if="storeFairness.unLoaded.FAIRscores" class="h-52 mb-3 mx-10" />
                    <USkeleton v-if="storeFairness.unLoaded.FAIRscores" class="h-7 w-80 rounded-xl mb-5 mx-10" />
                    <!-- Plot -->
                    <BubbleChart v-else div_id="reusability" :collection="current_collection"
                      :collection_scores="fair_scores.R.fair_scores" :indicators_labels="fair_scores.R.labels"
                      :control_scores="control_fair_scores.R.fair_scores" :collection_colors="colors"
                      :collection_colors_lines="colors_lines" />

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
import { ref, computed, onMounted } from 'vue';
import { useFairness } from '@/stores/observatory/fairness';
import { useObservatory } from '@/stores/observatory/index.js';
import collectionSelector from "@/components/Observatory/CollectionSelector.vue";
import BubbleChart from "@/components/Observatory/fairness/BubbleChart.vue";
import PlotWOptions from '@/components/Observatory/PlotWOptions.vue';
import { embedCodes } from '@/components/Observatory/visualizations/embedCodes.js'
// Layout
const layout = 'observatory';

// Store Data
const storeFairness = useFairness();
const observatoryStore = useObservatory();

// Fetch Data on Mount
onMounted(async () => {
  await storeFairness.getFAIRscores();
  await storeFairness.getControlFAIRscores();

});


// Constantes
const dialogItemsFindability = [embedCodes.findabilityBubble]
const dialogItemsAccessibility = [embedCodes.accessibilityBubble]
const dialogItemsInteroperability = [embedCodes.interoperabilityBubble]
const dialogItemsReusability = [embedCodes.reusabilityBubble]

const fair_scores = computed(() => storeFairness.fairScores);
const control_fair_scores = computed(() => storeFairness.controlFAIRscores);
const current_collection = computed(() => observatoryStore.currentCollection);
const colors = ['#5da4d6', '#ff900e', '#2ca065', '#bd86f0']
const colors_lines = ['#0075c7', '#995302', '#046b37', '#5e3d7d']

// Estado para controlar la visibilidad de la alerta 
const showAlert = ref(true);
const closeButtonOptions = { icon: 'i-heroicons-x-circle-16-solid', color: 'gray', variant: 'link', padded: false };

// Método para manejar el cierre de la alerta 
function handleClose() { showAlert.value = false; }
</script>

<style scoped>
.copy-icon {
  float: inline-end;
  margin-top: -23px;
  margin-right: -20px;
}

a {
  color: #0b579f;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
  color: #6a98c4;
}
</style>