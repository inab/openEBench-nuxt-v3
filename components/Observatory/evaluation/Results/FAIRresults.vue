<template>
  <div class="my-5">
    <div v-if="data != true" class="flex flex-wrap content-around">
      <div class="col-6 py-3 px-5">
        <USkeleton class="h-64 w-full" />
      </div>
      <div class="col-6 py-3 px-5">
        <USkeleton class="h-64 w-full" />
      </div>
      <div class="col-6 py-3 px-5">
        <USkeleton class="h-64 w-full" />
      </div>
      <div class="col-6 py-3 px-5">
        <USkeleton class="h-64 w-full" />
      </div>
    </div>
    <div v-else class="flex flex-wrap content-around">
      <div class="col-6 py-3 px-4">
        <ResultsCardExpansible
          title="Fidability"
          color="#fabe69"
          :items="itemsFindability"
          :indicatorsLabel="labelsFindability"  
        />
      </div>
      <div class="col-6 py-3 px-4">
        <ResultsCardExpansible
          title="Accessibility"
          color="#5C6BC0"
          :items="itemsAccessibility"
          :indicatorsLabel="labelsAccessibility" 
        />
      </div>
      <div class="col-6 py-3 px-4">
        <ResultsCardExpansible
          title="Interoperability"
          color="#fabe69"
          :items="itemsInteroperability"
          :indicatorsLabel="labelsInteroperability"
        />
      </div>
      <div class="col-6 py-3 px-4">
        <ResultsCardExpansible
          title="Reusability"
          color="#5C6BC0"
          :items="itemsReusability"
          :indicatorsLabel="labelsReusability"
        />
      </div>
    </div>

  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useResultStore } from '@/stores/observatory/evaluation/results';
import ResultsCardExpansible from './ResultsCardExpansible.vue';
import { findability, accessibility, interoperability, reusability } from './indicatorsTableItems';

// Store
const resultsStore = useResultStore();

// Definir los datos como `ref`
const itemsFindability = ref(findability);
const labelsFindability = ref(['F1', 'F2', 'F3']);
const itemsAccessibility = ref(accessibility);
const labelsAccessibility = ref(['A1', 'A2', 'A3']);
const itemsInteroperability = ref(interoperability);
const labelsInteroperability = ref(['I1', 'I2', 'I3']);
const itemsReusability = ref(reusability);
const labelsReusability = ref(['R1', 'R2', 'R3', 'R4']);

// Check if there are data
const data = computed(() => resultsStore.fAIRIndicatorsTool !== null);

onMounted(() => {
  resultsStore.getFAIRIndicatorsControlScores();
});

</script>