<template>
  <div class="flex flex-wrap">
    <div class="w-full md:w-[48%] gap-8">
    <FormatsPlot  v-if="checkData.value" :data="inputFormatsData" />
    <p class="mt-2 text-center mb-2 ml-8">
        <span class="text-sm highlight">
          Caption of formats plot 1
        </span>
      </p>
    </div>
    <div class="w-full md:w-[48%]">
    <FormatsPlot v-if="checkData.value" :data="outputFormatsData" />
    <p class="mt-2 text-center mb-2 ml-8">
        <span class="text-sm highlight">
          Caption of formats plot 2
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useTrends } from '../../../../stores/observatory/trends.js'
import FormatsPlot from './FormatsPlot.vue'
import { useObservatory } from '@/stores/observatory/index.js';
import { embedCodes } from '~/components/Observatory/visualizations/embedCodes.js';


const trends = useTrends()
const observatoryStore = useObservatory();

const dialogItems = [embedCodes.dependencies]; // Define in `embedCodes.js`
const current_collection = computed(() => observatoryStore.currentCollection);


const inputFormatsData = computed(() => trends.InputFormats.data)
const outputFormatsData = computed(() => trends.OutputFormats.data)

const checkData = ref(false);


onMounted(async () => {
  await trends.getInputFormats();
  await trends.getOutputFormats();

  checkData.value = computed(() => inputFormatsData != {} )
})

</script>

<script>
export default {
  name: 'FormatsMain'
};
</script>