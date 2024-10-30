<template>
  <div class="container px-3 pb-4">
    <!-- loading -->
    <div v-if="store.unLoaded.countsPerSource">
      <div class="flex flex-wrap justify-around items-center">
        <div class="my-4 " v-for="card in 8" :key="card">
          <div class="source-card pt-3 px-3 rounded-sm">
            <USkeleton class="loading-card" :ui="{ rounded: 'rounded-xl' }"/>
          </div>
        </div>
      </div>
    </div>
    <!-- Source -->
    <div v-else>
      <div class="flex flex-wrap justify-around items-center">
        <div class="mt-4" 
          v-for="card in cardsC" :key="cards_info[card.source.title]">
          <div class="py-1 bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <SourceCard
              :title="cards_info[card.source].title"
              :count="card.count"
              :label="cards_info[card.source].label"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Total -->
    <div class="row mt-5">
      <div class="col-4"></div>
      <div class="col-4 flex items-center justify-center">
        <TotalCard :count="totalC" />
      </div>
      <div class="col-4 flex items-center justify-center pt-2">
        <p class="card-caption-side">{{ mainCardCaption }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, onMounted } from 'vue';
import { useData } from '@/stores/observatory/data.js';
import SourceCard from '@/components/Observatory/data/CountCards/SourceCard.vue';
import TotalCard from '@/components/Observatory/data/CountCards/TotalCard.vue';

// STORE
const store = useData();

// Call the actions to load the data when mounting the component
onMounted(() => {
  store.getTotalCount();
  store.getCountsPerSource();

});

// Computed
const totalC = computed(() => store.totalCount);
const cardsC = computed(() => store.countsPerSource);


// Cards Info
const cards_info = reactive({
  biotools: {
    title: 'Bio.tools',
    flex: 3,
    label: 'elixir',
  },
  bioconda: {
    title: 'Bioconda',
    flex: 3,
    label: 'bioconda',
  },
  galaxy: {
    title: 'GalaxyEU',
    flex: 3,
    label: 'galaxy',
  },
  bioconductor: {
    title: 'Bioconductor',
    flex: 3,
    label: 'bioconductor',
  },
  toolshed: {
    title: 'Galaxy Toolshed',
    flex: 3,
    label: 'galaxy',
  },
  sourceforge: {
    title: 'SourceForge',
    flex: 3,
    label: 'sourceforge',
  },
  github: {
    title: 'GitHub',
    flex: 3,
    label: 'github',
  },
  bitbucket: {
    title: 'BitBucket',
    flex: 3,
    label: 'bitbucket',
  },
  opeb_metrics: {
    title: 'OpenEBench',
    flex: 3,
    label: 'OEB',
  },
});

const mainCardCaption = "Count of metadata instances collected from various sources. 'Total' refers to the cumulative number of sources included in the Software Observatory's integrated collection.";
</script>

<style scoped>
.source-card {
  margin: auto;
  padding: auto;
  width: 90%;
  width: 13em;
  height: 4em;
  background-color: white;
}

.loading-card {
  height: 45%;
  width: 50%;
  display: inline-block;
}

.card-caption-side {
  width: 80%;
  text-align: justify;
  color: #334155;
  line-height: 22px;
  font-size: 14px;
}

.card-caption-b {
  width: 80%;
  text-align: center;
  margin: auto;
}
</style>
