<template>
  <div>
  <NuxtLayout :name="layout">
    <template #fairness>
      <div class="p-4">
        <div class="row my-4">
          <div class="col-8">
            <h5 class="mb-3">FAIRsoft Indicator Scoreboard</h5>
            <p style="line-height: 1.9" class="mb-0 mt-0">
              This page brings to light the <strong>collective insights</strong> 
              from our FAIRsoft indicators, providing a clear snapshot of trends and scores across various software. <br>
            </p>
            <p style="line-height: 1.5" class="mb-0 mt-0">
              <strong>Deep Dive:</strong>
              Each FAIRsoft indicator is explained in detail
              <a href="https://inab.github.io/FAIRsoft_indicators/" target="_blank">here.</a>
            </p>
          </div>
          <!-- Alert -->
          <div class="col-4">
            <UAlert v-if="showAlert" :close-button="closeButtonOptions" @close="handleClose"
            color="sky"
            variant="soft" :ui="{shadow:'shadow-md', padding:'p-3', gap: 'gap-0'}"  >

            <template #description >
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
          <div  class="col-2"></div>
          <div class="col-8">
            <collectionSelector/>
          </div>
          <div class="col-2"></div>
        </div>

        <!-- Plots -->
        <div class="row justify-center mt-4">

          <!-- 1  -->
          <div class="col-12">
            <div class="my-4 p-4 max-full bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <h5 class="text-center mt-6 mb-4">
                Findability
              </h5>
              <div class="row">
                <div class="col-12">
                  <!-- Loader -->
                  <USkeleton v-if="storeFairness.unLoaded.FAIRscores" class="h-52 mb-3 mx-10"/>
                  <USkeleton v-if="storeFairness.unLoaded.FAIRscores" class="h-7 w-80 rounded-xl mb-5 mx-10" />
                  <!-- Plot -->
                  <BubbleChart v-else />
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
import { ref } from 'vue';
import { useFairness } from '@/stores/observatory/fairness';
import collectionSelector from "@/components/Observatory/CollectionSelector.vue"
import BubbleChart from "@/components/Observatory/fairness/BubbleChart.vue"


// Layout
const layout = 'observatory'
// Store Data
const storeFairness = useFairness();

storeFairness.getFAIRscores();
storeFairness.getControlFAIRscores();



// Status to control the visibility of the alert 
const showAlert = ref(true);
const closeButtonOptions = { icon: 'i-heroicons-x-circle-16-solid', color: 'gray', variant: 'link', padded: false };

// Method for handling the closure of the alert 
function handleClose() { showAlert.value = false; }
</script>
