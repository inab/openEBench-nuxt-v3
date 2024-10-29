<template>
  <div class="my-4">
    <div class="p-4 max-w-4xl bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <h6 class="text-primaryOeb-500 text-center mb-2">
        Collections
      </h6>
      <p class="mb-1 text-base text-center">
				Select a collection below to view the trends of the software associated
				to a specific project/organization
			</p>
      <!-- Slides -->
      <Carousel
        :items-to-show="5"
        :wrap-around="false"
        :transition="500"
        class="my-3"
      >
        <Slide
          v-for="(slide, index) in collections"
          :key="index"
        >
          <div class="carousel__item mt-3">
            <button 
              class="uppercase bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full dark:bg-gray-700 dark:text-gray-300"
              :class="{ 'bg-primaryOeb-500 text-white': selectedCollection === index }"
              @click="setCollection(index)"
              >
              {{ slide.title }}
            </button>
          </div>
        </Slide>

        <template #addons>
          <Navigation
            prev-class="carousel__prev" 
            next-class="carousel__next" 
          />
        </template>
      </Carousel>

      <!-- Selected collection details -->
      <div v-if="selectedCollection !== null" class="max-w-7xl p-3 mt-4 bg-gray-50 rounded-lg">
        <div class="flex justify-between items-center">
          <div class="col-10">
            <h6 class="text-lg font-bold text-primaryOeb-500">
              {{ collections[selectedCollection].title }}
            </h6>
            <p class="text-sm text-gray-600 ">{{ collections[selectedCollection].subtitle }}</p>
            <p class="text-sm">{{ collections[selectedCollection].description }}</p>
          </div>
          <div class="col-2">
            <img
              :src="getImagePath(collections[selectedCollection].image)"
              alt="Collection Image"
              class="rounded-lg collection-image"
            />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useObservatory } from "@/stores/observatory/index.js";
import { useFairness } from "@/stores/observatory/fairness";
import { useTrends } from "@/stores/observatory/trends";
import { useData } from "@/stores/observatory/data";

// Store
const observatoryStore = useObservatory();
const fairnessStore = useFairness();
const trendsStore = useTrends();
const dataStore = useData();

// Collections
const collections = observatoryStore.getCollections;
const selectedCollection = ref(null);

function setCollection(index) {
  if (selectedCollection.value !== index) {
    selectedCollection.value = index;

    // Change the current collection 
    const collectionId = collections[selectedCollection.value].id;
    observatoryStore.changeCurrentCollection(collectionId);

    triggerDataRefresh();
  } else {
    // Reset the current collection
    selectedCollection.value = null;
    observatoryStore.changeCurrentCollection('tools');
    triggerDataRefresh();
  }
}

// Método para refrescar los datos de la colección seleccionada
function triggerDataRefresh() {
  // Llamadas a la API para actualizar los datos
  // fairnessStore.getFAIRscores();
  // trendsStore.getLicensesSunburst();
  // trendsStore.getLicensesOpenSource();
  // trendsStore.getSemanticVersioning();
  // trendsStore.getVersionControlCount();
  // trendsStore.getVersionControlRepositories();
  // trendsStore.getPublications();
  dataStore.getCountsPerSource();
  dataStore.getTotalCount();
  // dataStore.getFeatures();
  // dataStore.getCoverageSources();
  // dataStore.getCompleteness();
  // dataStore.getTypes();
}

// Image Path
function getImagePath(image) {
  return new URL(`/assets/images/collections/${image}`, import.meta.url).href;
}

</script>

<style scoped>
.carousel__prev, .carousel__next {
  background-color: white !important;
  top: 30% !important;
  margin: 0 0 !important;
}

.collection-image{
  width: 60%;
  margin: 0 auto;
}
</style>