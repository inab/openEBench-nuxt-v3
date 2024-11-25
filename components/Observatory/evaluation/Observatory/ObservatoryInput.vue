<template>
  <h1>Observatory Input</h1>

  <div class="row justify-center">
    <div class="col-10 text-right">
      <button type="button" class="btn btn-secondary mr-2" @click="goBack">Back</button>
      <button
        type="submit"
        class="btn btn-primary"
        @click="completeStep"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStepperStore } from '@/stores/observatory/evaluation/index';

const stepperStore = useStepperStore();

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