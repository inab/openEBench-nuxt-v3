// stores/useStepperStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useStepperStore = defineStore('stepper', () => {
  const steps = ref([
    { title: "Select the source of the software's metadata", completed: false, active: true },
    { title: 'Introduce software to evaluate', completed: false, active: false },
    { title: 'Edit the metadata if needed', completed: false, active: false },
    { title: 'Results', completed: false, active: false },
  ]);

  const selectedSource = ref('');

  const completeStep = (index) => {
    steps.value[index].completed = true;
    if (index < steps.value.length - 1) {
      steps.value[index].active = false;
      steps.value[index + 1].active = true;
    }
  };

  const goBack = (index) => {
    if (index > 0) {
      steps.value[index].active = false;
      steps.value[index - 1].completed = false;
      steps.value[index - 1].active = true;
    }
  };

  const cancelSteps = () => {
    steps.value.forEach((step, index) => {
      step.completed = false;
      step.active = index === 0;
    });
  };

  const handleSourceSelected = (source) => {
    selectedSource.value = source;
    completeStep(0); // Avanzar al siguiente paso
  };

  return { steps, selectedSource, completeStep, goBack, cancelSteps, handleSourceSelected };
});
