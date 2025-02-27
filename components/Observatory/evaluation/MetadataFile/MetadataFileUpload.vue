<template>
  <form @submit.prevent="submitFile">
    <!-- Input Section -->
    <div class="row justify-center mb-4 relative">
      <div class="col-10">
        <div class="relative flex items-center">
          <!-- Attach File Icon -->
          <span class="left-0 mr-2 flex items-center">
            <UIcon
              name="i-ic-outline-attach-file"
              :class="iconClasses"
            />
          </span>

          <!-- File Input (invisible) -->
          <input
            id="uploadFile"
            type="file"
            class="hidden"
            :class="inputClasses"
            accept=".json,.jsonld"
            @change="handleFileUpload"
            ref="fileInput"
          />
          
          <!-- Custom Button -->
          <div
            :class="inputClasses"
            @click="triggerFileInput"
            class="w-full text-sm px-4 py-3 cursor-pointer flex items-center"
          >

            <!-- File Selection Display -->
            <UBadge v-if="fileName" color="gray" variant="soft">{{ fileName }}</UBadge>
            <span v-else>Select your metadata file</span>
          </div>

            <!-- Clear Button -->
            <button
              v-if="fileName"
              type="button"
              class="clear-btn absolute right-4 top-1/2 mt-1 transform -translate-y-1/2"
              @click="clearFile"
            >
              <UIcon
                name="i-heroicons-x-circle-20-solid"
                :class="clearButtonClasses"
              />
            </button>
        </div>
        <!-- Error Message -->
        <div class="text-xs text-red-500 mt-1 ml-11" v-if="showError">
          {{ errorMessage }}
        </div>

      </div>
    </div>

    <!-- Form Action Buttons -->
    <div class="row justify-center">
      <div class="col-10 text-right">
        <UButton class="mr-2" color="gray" variant="ghost" size="md" :ui="{color:{gray:{ghost:'text-gray-900 hover:bg-gray-100'}},}" @click="goBack">
          Back
        </UButton>
        <UButton class="bg-primaryOeb-500" variant="solid" size="md" 
        :ui="{color:{variant:{solid:'hover:bg-{blue}-500'}}}"
        :disabled="!file || showError"
        @click="submitFile">
          Continue
        </UButton>
      </div>
    </div>
  </form>

</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFileStore } from '@/stores/observatory/evaluation/file';
import { useStepperStore } from '@/stores/observatory/evaluation/index';

const fileStore = useFileStore();

// Validation State
const file = ref<File | null>(null);
const fileName = ref<string | null>(null);
const showError = ref(false);
const errorMessage = ref('');
const fileInput = ref<HTMLInputElement | null>(null);

const value = ref('');
const isFocused = ref(false);

// UI State / Clases
const iconClasses = computed(() => {
  let baseClasses = 'text-2xl text-gray-500';

  if (showError.value) {
    return `${baseClasses} text-red-500`;
  }

  if (value.value.trim() !== '') {
    return `${baseClasses} text-gray-500`;
  }

  if (file.value) {
    return `${baseClasses} text-primaryOeb-500`;
  }
  return `${baseClasses} text-gray-500`;
});
const inputClasses = computed(() => [
  'block px-3 py-3 w-full text-sm text-gray-900 bg-transparent rounded-md border outline-none appearance-none dark:text-white dark:bg-gray-900 peer border-gray-500',
  {
    'invalidFile': showError.value,
    'validFile': file.value && !showError.value,
  },
]);


const clearButtonClasses = computed(() => [
  'text-2xl',
  { 'text-red-500': showError.value, 'text-gray-500': !showError.value },
]);

const clearFile = () => { 
  file.value = null;
  fileName.value = null;
  showError.value = true;
  errorMessage.value = 'Required.'; 
  isFocused.value = false;

  // Resetear el input eliminándolo del DOM y volviéndolo a crear
  if (fileInput.value) {
    fileInput.value.value = ""; // Resetea el input para permitir seleccionar el mismo archivo
  }
};

// Activar input al hacer clic en el contenedor
const triggerFileInput = () => {
  fileInput.value?.click();
};

// Manejo del archivo
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  
  if (!input.files || input.files.length === 0) {
    showError.value = true;
    errorMessage.value = "Required.";
    file.value = null;
    fileName.value = null;
    return;
  }
  const selectedFile = input.files[0];

  // Aditional Validation: avoid empty folders (type: empty) and check extension·
  const validExtensions = ["json", "jsonld"];
  const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
  
  if (!selectedFile.type || !fileExtension || !validExtensions.includes(fileExtension)) {
    showError.value = true;
    errorMessage.value = "Invalid file type. Please select a .json or .jsonld file.";
    file.value = null;
    fileName.value = null;
    return;
  }

  // If everything is correct, store the file
  file.value = selectedFile;
  fileName.value = selectedFile.name;
  showError.value = false;
};

const submitFile = () => {
  if (!file.value) {
    showError.value = true;
    errorMessage.value = 'Please select a file before submitting.';
    return;
  }
  fileStore.parseMetadataFile(file.value)

  // IF ALL OK, COMPLETE STEP
  completeStep();
};

// Stepper
const stepperStore = useStepperStore();
const goBack = () => {
  const currentStepIndex = 1; // Update with the index of the current step
  stepperStore.goBack(currentStepIndex);
};
const completeStep = () => {
  const currentStepIndex = 1; // Update with the index of the current step
  stepperStore.completeStep(currentStepIndex);
};

</script>
<style scoped>
.invalidFile {
  border-color: #dc2626 !important;
}

.validFile {
  border-color: #094987 !important;
}
</style>