<template>
  <div>
  <NuxtLayout :name="layout">
    <template #trends >
      <div class="p-4">
        <div class="row my-4">
          <h5 class="">FAIRness Trends Analysis</h5>
          <p style="line-height: 1.9" class="mb-2 mt-0">
          Explore trends in key aspects to the FAIRness of research software.
        </p>
        </div>


        <!-- collectionSelector -->
        <div class="row mt-4">
          <div class="col-2"></div>
          <div class="col-8">
            <collectionSelector />
          </div>
          <div class="col-2"></div>
        </div>
        <div id="plot"></div>
      </div>  
    </template>
  </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import collectionSelector from "@/components/Observatory/CollectionSelector.vue"
import Plotly from 'plotly.js-dist';
const layout = 'observatory'


// prueba plotly
onMounted(() => {
  const data = [
    {
      x: ['giraffes', 'orangutans', 'monkeys'],
      y: [20, 14, 23],
      type: 'bar'
    }
  ];
  Plotly.newPlot('plot', data);
});

</script>