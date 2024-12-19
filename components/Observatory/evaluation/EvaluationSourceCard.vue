<template>
  <div class="shadow-md pt-6 pb-4 d-flex flex-column justify-space-between"
    min-height="320"
    max-height="320"
    min-width="230"
    max-width="320">
    <div class="flex items-center flex-col">
      <div class="my-4 relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-400 rounded-full dark:bg-gray-600">
        <UIcon :name="icon" class="text-white text-2xl" />
      </div>
      <div class="font-medium text-base">
        {{ title }}
      </div>
      <div>
        <p class="mt-3 text-center text-sm" v-html="description"></p>
      </div>
      <div>
        <UButton class="mt-4 mr-2 bg-primaryOeb-500" variant="solid" size="md" 
          :ui="{color:{variant:{solid:'hover:bg-{blue}-500'}}}"
          @click="selectSource">
            Select
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStepperStore } from '@/stores/observatory/evaluation/index';

// PROPS
const props = defineProps<{
  title: String,
  description: String,
  source: String,
  icon: String,
}>();

const stepperStore = useStepperStore();

function selectSource() {
  stepperStore.handleSourceSelected(props.source);
}
</script>
