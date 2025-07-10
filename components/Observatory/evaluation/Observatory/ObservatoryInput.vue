<template>
  <div class="container mx-auto p-4">
    <form @submit.prevent="submitObservatoryTool">
      <div class="row justify-center mb-3">
        <div class="col-10">
          <p class="text-sm">Select a tool from the Software's Observatory Database:</p>
        </div>
      </div>

      <div class="row justify-center mb-4 relative">
        <div class="col-10">
          <div v-if="observatoryStore.loadingAutocomplete" class="form-group w-full items-center">
            <USkeleton class="h-11 w-full rounded-md" />
          </div>

          <div v-else class="form-group relative">
            <!-- Floating Label -->
            <label :class="labelClasses">Tool</label>
            <div class="flex items-center gap-2 mt-2">
        
              <UIcon name="mdi-database" class="text-gray-500 text-2xl" />

              <UInputMenu v-model="selectedTool" :options="visibleToolOptions" placeholder="" searchable
                option-attribute="label" value-attribute="id" @focus="isFocused = true" @blur="handleBlur"
                @change="validateInput" :class="inputMenuClasses">
                <template #option="{ option }">
                  <span v-if="option.id !== 'load-more'">{{ option.label }} [{{ option.type }}]</span>
                  <span v-else class="text-primaryOeb-500 cursor-pointer hover:underline">Load more…</span>
                </template>
              </UInputMenu>
            </div>
          </div>


          <!-- Error Message -->
          <div class="text-xs text-red-500 mt-1 ml-8" v-if="showError">{{ errorMessage }}</div>
        </div>
      </div>

      <div class="row justify-center">
        <div class="col-10 text-right">
          <UButton class="mr-2" color="gray" variant="ghost" size="md" @click="goBack">Back</UButton>
          <UButton class="mr-2 bg-primaryOeb-500" variant="solid" size="md" :disabled="!selectedTool || showError"
            @click="completeStep">
            Continue
          </UButton>
        </div>
      </div>
    </form>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useStepperStore } from '@/stores/observatory/evaluation/index';
import { useObservatoryStore } from '@/stores/observatory/evaluation/observatory';


// Stores
const observatoryStore = useObservatoryStore();
const stepperStore = useStepperStore();
const observatoryTools = computed(() => observatoryStore.ObservatoryToolsNameTypeSources);


// States
const selectedTool = ref('');
const isFocused = ref(false);
const showError = ref(false);
const errorMessage = ref('');

const maxVisible = ref(20); // show first N items

const visibleToolOptions = computed(() => {
  const base = (observatoryTools.value ?? []).slice(0, maxVisible.value);
  if (observatoryTools.value && observatoryTools.value.length > maxVisible.value) {
    return [...base, { id: 'load-more', label: 'Load more…' }];
  }
  return base;
});


onMounted(async () => {
  await observatoryStore.getObservatoryToolsNameTypeSources();
});

// Watch selection to keep label up when an option is chosen
watch(selectedTool, (newValue) => {
  if (newValue) isFocused.value = true;
});

// Blur handler (only hides label if no tool is selected)
const handleBlur = () => {
  if (!selectedTool.value) isFocused.value = false;
};

// Validation
const validateInput = () => {
  showError.value = !selectedTool.value;
  errorMessage.value = showError.value ? 'Please select a tool.' : '';
};

// Styling Computed Properties
const labelClasses = computed(() => [
  'absolute left-9 top-2 text-sm text-gray-500 dark:text-gray-400 transition-all bg-white dark:bg-gray-900 px-1 z-10',
  {
    'text-primaryOeb-600 transform scale-75 -translate-y-5 left-9': isFocused.value || selectedTool.value,
    'top-3 scale-100': !isFocused.value && !selectedTool.value,
    'text-red-500': showError.value,
  },
]);

const inputMenuClasses = computed(() => [
  'peer w-full rounded-md border text-sm px-3 py-2 pl-10',
  {
    'border-red-500': showError.value,
    'border-gray-300 dark:border-gray-700': !showError.value,
    'focus:ring-1 focus:ring-primaryOeb-600 dark:focus:ring-primaryOeb-500': true,
  },
]);


const iconClasses = computed(() => 'text-2xl text-gray-500');

// Navigation Methods
const goBack = () => stepperStore.goBack(1);
const completeStep = () => stepperStore.completeStep(1);
</script>

<style scoped>
/* Optional custom styling */
</style>
