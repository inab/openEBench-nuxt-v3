<template>
  <h1>Metadata File Input</h1>

  <div class="row justify-center">
    <div class="col-10 text-right">
      <UButton class="mr-2" color="gray" variant="ghost" size="md" :ui="{color:{gray:{ghost:'text-gray-900 hover:bg-gray-100'}},}" @click="goBack">
        Back
      </UButton>

      <UButton class="mr-2 bg-primaryOeb-500" variant="solid" size="md" 
        :ui="{color:{variant:{solid:'hover:bg-{blue}-500'}}}"
        :disabled="!value || showError"
        @click="completeStep">
          Continue
      </UButton>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStepperStore } from '@/stores/observatory/evaluation/index';

const stepperStore = useStepperStore();

// Validation State
const showError = ref(false);
const errorMessage = ref('');


// Methods
const goBack = () => {
  const currentStepIndex = 1; // Actualiza con el índice del paso actual
  stepperStore.goBack(currentStepIndex);
};
const completeStep = () => {
  const currentStepIndex = 1; // Actualiza con el índice del paso actual
  stepperStore.completeStep(currentStepIndex);
};
</script>