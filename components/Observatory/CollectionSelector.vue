<template>
  <div class="my-4">
    <div class="p-4 max-w-full bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <h6 class="text-primaryOeb-500 uppercase text-sm text-center mb-2">Collections</h6>
      <p class="mb-1 text-sm text-center">
        Select a collection below to view the trends of the software associated with a specific project/organization.
      </p>

      <!-- Carousel -->
      <div class="relative">
        <Carousel :items-to-show="5" :wrap-around="false" :snap-align="'center'" :transition="500" :scrollPerPage="true"
          class="my-3 relative px-4 md:px-8 custom-carousel">
          <Slide v-for="(slide, index) in collections" :key="index">
            <div class="carousel__item mt-3 mx-1">
              <button
                class="uppercase bg-gray-100 text-gray-800 text-sm font-medium px-4 py-2 rounded-full dark:bg-gray-700 dark:text-gray-300 transition-all duration-200 ease-in-out"
                :class="{ 'bg-primaryOeb-500 text-white': selectedCollection === index }" @click="setCollection(index)"
                ref="buttons" :style="{ width: 'auto', display: 'inline-block', whiteSpace: 'nowrap' }">
                {{ slide.title }}
              </button>
            </div>
          </Slide>

          <!-- Navigation Arrows -->
          <template #addons>
            <Navigation prev-class="carousel__prev" next-class="carousel__next" />
          </template>


        </Carousel>
      </div>

      <!-- Selected collection details with transition effect -->
      <transition name="slide">
        <div v-if="selectedCollection !== null"
          class="max-w-7xl p-3 mt-4 bg-gray-50 rounded-lg transition-all transform">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="w-full md:w-3/4">
              <h6 class="text-lg font-bold text-primaryOeb-500">
                <a :href="collections[selectedCollection].homepage" target="_blank">{{
                  collections[selectedCollection].title }}</a>
              </h6>
              <p class="text-sm font-medium">{{ collections[selectedCollection].subtitle }}</p>
              <p class="text-sm text-gray-600 text-justify">{{ collections[selectedCollection].description }}</p>
            </div>
            <div class="w-full md:w-1/4 mt-4 md:mt-0 ml-0 md:ml-20">
              <a target="_blank" :href="collections[selectedCollection].homepage"><img
                  :src="getImagePath(collections[selectedCollection].image)" alt="Collection Image"
                  class="rounded-lg collection-image transition-transform duration-500 ease-in-out" /></a>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useObservatory } from '@/stores/observatory/index.js';
import { useFairness } from '@/stores/observatory/fairness';
import { useTrends } from '@/stores/observatory/trends';
import { useData } from '@/stores/observatory/data';

// Store
const observatoryStore = useObservatory();
const fairnessStore = useFairness();
const trendsStore = useTrends();
const dataStore = useData();

// Collections
const collections = observatoryStore.getCollections;
const selectedCollection = ref<number | null>(null);

// Auto-scroll logic
function scrollToButton(index: number) {
  const buttons = document.querySelectorAll('.carousel__item button');
  if (buttons[index]) {
    buttons[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}



function setCollection(index: number) {
  if (selectedCollection.value !== index) {
    selectedCollection.value = index;

    // Change the current collection
    const collectionId = collections[selectedCollection.value].id;
    observatoryStore.changeCurrentCollection(collectionId);

    triggerDataRefresh();

    // Auto-scroll to the button
    scrollToButton(index);
  } else {
    // Reset the current collection
    selectedCollection.value = null;
    observatoryStore.changeCurrentCollection('tools');
    triggerDataRefresh();
  }
}

// Watch to trigger auto-scroll on selection near edges
watch(selectedCollection, (newIndex) => {
  if (newIndex !== null) {
    scrollToButton(newIndex);
  }
});

// Refresh data for the selected collection
function triggerDataRefresh() {
  // API calls to refresh data
  fairnessStore.getFAIRscores();
  trendsStore.getLicensesSunburst();
  trendsStore.getLicensesOpenSource();
  trendsStore.getSemanticVersioning();
  trendsStore.getVersionControlCount();
  trendsStore.getVersionControlRepositories();
  trendsStore.getPublications();
  dataStore.getCountsPerSource();
  dataStore.getTotalCount();
  dataStore.getFeatures();
  dataStore.getCoverageSources();
  dataStore.getCompleteness();
  dataStore.getTypes();
}

function getImagePath(image: string) {
  return new URL(`/assets/images/collections/${image}`, import.meta.url).href;
}
</script>

<style scoped>
.carousel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

::v-deep .carousel__viewport {
  overflow: hidden !important;
  margin-right: 20px !important;
  margin-left: 20px !important;
  max-width: 100%;
  white-space: nowrap;
}

.carousel__prev,
.carousel__next {
  background-color: white !important;
  top: 50% !important;
  margin: 0 20px !important;
  /* Added margin to separate from buttons */
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.carousel__prev:hover,
.carousel__next:hover {
  background-color: #e2e8f0;
}


.carousel__item {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;

}

.carousel__slide {
  width: auto !important;
}

.carousel__track {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  overflow-x: hidden;
  max-width: 100%;
  position: relative;
}

.carousel__item button {
  transition: transform 0.2s, background-color 0.3s;
  white-space: nowrap;
  width: auto !important;
  display: inline-block;
}

.carousel__item button:hover {
  transform: scale(1.05);
}

::v-deep .carousel__next--disabled, ::v-deep .carousel__prev--disabled {
  cursor: not-allowed !important;
  opacity: 0.5;
}



/* Transition Effects */
.slide-enter-from {
  opacity: 0;
  transform: translateY(-60px);
}

.slide-enter-active {
  transition: all 0.3s ease;
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-60px);
}

.slide-leave-active {
  transition: all 0.3s ease;
}

.collection-image {
  width: 100%;
  max-width: 100px;
  /* Adjusted size for smaller screens */
  transition: transform 0.3s ease;
}

.collection-image:hover {
  transform: scale(1.05);
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
