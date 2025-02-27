<template>
<div class="container mx-auto p-4">
  <form @submit.prevent="submitURL">
    <!-- Input Section -->
    <div class="row justify-center mb-4 relative">
      <div class="col-10">
        <div class="form-group relative flex items-center">

          <!-- Attach File Icon -->
          <span class="left-0 mr-2 flex items-center">
            <UIcon
              name="i-heroicons-link-20-solid"
              :class="iconClasses"
            />
          </span>

          <!-- Input Field with Floating Label -->
          <input
            id="metadataFile-url"
            v-model="url"
            type="text"
            :class="inputClasses"
            placeholder=""
            @input="validateInput"
            @blur="validateInput"
            @focus="handleFocus"
          />

          <!-- Floating Label -->
          <label for="metadataFile-url" :class="labelClasses"> 
            Link to metadata file
          </label>

          <!-- Clear Button -->
          <button
            v-if="url"
            type="button"
            class="clear-btn absolute right-4 top-1/2 mt-1 transform -translate-y-1/2"
            @click="clearLink"
          >
            <UIcon
              name="i-heroicons-x-circle-20-solid"
              :class="clearButtonClasses"
            />
          </button>
        </div>

        <!-- Error Message -->
        <div class="text-xs text-red-500 mt-1 ml-11" v-if="showError">{{ errorMessage }}</div>

        <!-- Example Links -->
        <span class="text-sm text-gray-500 italic ml-11">
          Examples:
          <span v-for="(item, i) in exampleValues" :key="i">
            <a href="#" @click.prevent="inputExample(item.URL)">{{ item.title }}</a>
            <span v-if="i < exampleValues.length - 1">, </span>
          </span>
        </span>

      </div>
    </div>

    <!-- Form Action Buttons -->
    <div class="row justify-center">
      <div class="col-10 text-right">
        <UButton class="mr-2" color="gray" variant="ghost" size="md" 
          :ui="{color:{gray:{ghost:'text-gray-900 hover:bg-gray-100'}},}" 
          @click="goBack">
          Back
        </UButton>
        <UButton class="bg-primaryOeb-500" variant="solid" size="md" 
        :ui="{color:{variant:{solid:'hover:bg-{blue}-500'}}}"
        :disabled="!url || showError"
        @click="submitURL">
          Continue
        </UButton>
        
      </div>
    </div>

    <!-- Dialogs -->
    <DialogAppInstall
      :initialDialogAppInstall="dialogInstallApp"
      :title="installDialogParameters.title"
      :text="installDialogParameters.text"
      @cancel="cancel"
      @ready="submitURL"
    />
  </form>
</div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import DialogAppInstall from '@/components/Observatory/evaluation/GitHub/DialogAppInstall.vue';
import { useFileStore } from '@/stores/observatory/evaluation/file';
import { useStepperStore } from '@/stores/observatory/evaluation/index';

const fileStore = useFileStore();

const dialogInstallApp = computed(() => fileStore.getDialogInstallApp);
const test = computed(() => fileStore.getTest);
const installationID = computed(() => fileStore.getInstallationID);


// Validation State
const showError = ref(false);
const isFocused = ref(false);
const url = ref('');
const errorMessage = ref('');
const exampleValues = ref([
  { title: 'oeb-visualizations',  
    URL: 'https://raw.githubusercontent.com/inab/oeb-visualizations/refs/heads/main/metadata.jsonld',
  },
]);
const installDialogParameters = ref(
  { title: 'Unable to access the file.',
    text: 'Let the FAIRsoft Evaluator access the requested repositories content by grantting the <a>OpenEBench FAIRsoft Evaluator GitHub App</a> the necessary permissions.',
  },
);

// Input Validation
const validateInput = () => {
  const pattern = /^(https?:\/\/)?(www\.)?github\.[a-z]+\/[^/]+\/[^/]+\/?$/i;
  if (url.value === '') {
    showError.value = true;
    errorMessage.value = 'Required.';
  } else if (!pattern.test(url.value)) {
    showError.value = true;
    errorMessage.value = 'Please enter a valid link.';
  } else {
    showError.value = false;
    errorMessage.value = '';
  }
};

// UI State / Clases
const iconClasses = computed(() => {
  let baseClasses = 'text-2xl text-gray-500';

  if (showError.value) {
    return `${baseClasses} text-red-500`;
  }

  if (url.value.trim() !== '') {
    return `${baseClasses} text-gray-500`;
  }

  if (isFocused.value) {
    return `${baseClasses} text-primaryOeb-500`;
  }
  return `${baseClasses} text-gray-500`;
});

const inputClasses = computed(() => [
  'block px-3 py-3 w-full text-sm text-gray-900 bg-transparent rounded-md border outline-none appearance-none dark:text-white dark:bg-gray-900 peer',
  {
    'focus:ring-1 focus:ring-primaryOeb-600 focus:outline-none dark:focus:border-primaryOeb-500': !showError.value,
    'border-1 invalidInput dark:border-red-600': showError.value,
  },
]);

const labelClasses = computed(() => [
  'absolute ml-10 text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-12 origin-[0] bg-white dark:bg-gray-900 px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4',
  { 'peer-focus:text-primaryOeb-600 peer-focus:dark:text-primaryOeb-500': !showError.value, 'text-red-500': showError.value },
]);

const clearButtonClasses = computed(() => [
  'text-2xl',
  { 'text-red-500': showError.value, 'text-gray-500': !showError.value },
]);

// Methods
const handleFocus = () => { isFocused.value = true; };

const clearLink = () => { 
  url.value = ''; 
  errorMessage.value = 'Required.';
  isFocused.value = false;
};

const inputExample = (URL: string) => { 
  url.value = URL; 
  showError.value = false; 
};

// Method by download File
const submitURL = async () => {
  fileStore.downloadFile({url: url.value})
  // Complete steps
  completeStep()
}

const cancel = () => {
  fileStore.updateDialogInstallApp(false)
  fileStore.updateDialogParseMetadata(false)
}

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

<style>
.invalidInput{
  border-color: red !important;
}
</style>