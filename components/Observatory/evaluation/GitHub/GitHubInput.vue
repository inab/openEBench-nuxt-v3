<template>
  <div class="container mx-auto p-4">
    <form @submit.prevent="submitGitHubLink">
      <!-- Form Section -->
      <div class="row justify-center mb-3">
        <div class="col-10">
          <p class="text-sm">Introduce the URL of the GitHub repository of the software:</p>
        </div>
      </div>

      <!-- Input Section -->
      <div class="row justify-center mb-4 relative">
        <div class="col-10">
          <div class="form-group relative flex items-center">
            <!-- GitHub Icon -->
            <span class="left-0 mr-2 flex items-center">
              <UIcon
                name="mdi-github"
                :class="iconClasses"
              />
            </span>

            <!-- Input Field with Floating Label -->
            <input
              id="github-url"
              v-model="value"
              type="text"
              :class="inputClasses"
              placeholder=""
              @input="validateInput"
              @blur="validateInput"
              @focus="handleFocus"
            />

            <!-- Floating Label -->
            <label for="github-url" :class="labelClasses"> 
              Link to GitHub repository
            </label>

            <!-- Clear Button -->
            <button
              v-if="value"
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
          <UButton class="mr-2" color="gray" variant="ghost" size="md" :ui="{color:{gray:{ghost:'text-gray-900 hover:bg-gray-100'}},}" @click="goBack">
            Back
          </UButton>
          <UButton class="bg-primaryOeb-500" variant="solid" size="md" 
          :ui="{color:{variant:{solid:'hover:bg-{blue}-500'}}}"
          :disabled="!value || showError"
          @click="submitGitHubLink">
            Continue
          </UButton>
          
        </div>
      </div>
    </form>

    <!-- Dialogs -->
    <DialogAppInstall
      :initialDialogAppInstall="dialogAppInstall"
      :title="installDialogParameters.title"
      :text="installDialogParameters.text"
      :installationUrl="installDialogParameters.installationURL"
      @cancel="cancel"
      @ready="fetchMetadata"
    />

    <!-- Modal Importing metadata -->
    <DialogImportMetadata />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DialogAppInstall from './DialogAppInstall.vue';
import DialogImportMetadata from './DialogImportMetadata.vue';
import { useStepperStore } from '@/stores/observatory/evaluation/index';
import { useGithub } from '@/stores/observatory/evaluation/github';


const githubStore = useGithub();

// Props and data setup
const value = ref('');
const exampleValues = ref([
  { title: 'oeb-visualizations', URL: 'https://github.com/inab/oeb-visualizations' },
]);

const installDialogParameters = ref({
  installationURL: 'https://github.com/apps/metadata-extractor-for-fairsoft/installations/select_target',
  title: "Unable to access repository's metadata.",
  text: 'Let the FAIRsoft Evaluator access the requested repositories metadata by granting the <a href="https://github.com/apps/metadata-extractor-for-fairsoft" target="_blank">Metadata Extractor for FAIRsoft GitHub App</a> the necessary permissions.',
});

const dialogAppInstall = computed(() => githubStore.getDialogAppInstall);

// Validation State
const showError = ref(false);
const errorMessage = ref('');

// Focus Management
const isFocused = ref(false);

// Input Validation
const validateInput = () => {
  const pattern = /^(https?:\/\/)?(www\.)?github\.[a-z]+\/[^/]+\/[^/]+\/?$/i;
  if (value.value === '') {
    showError.value = true;
    errorMessage.value = 'Required.';
  } else if (!pattern.test(value.value)) {
    showError.value = true;
    errorMessage.value = 'Please enter a valid GitHub repository link.';
  } else {
    showError.value = false;
    errorMessage.value = '';
  }
};

// UI State
const iconClasses = computed(() => {
  let baseClasses = 'text-2xl text-gray-500';

  if (showError.value) {
    return `${baseClasses} text-red-500`;
  }

  if (value.value.trim() !== '') {
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
  value.value = ''; 
  errorMessage.value = 'Required.'; 
  isFocused.value = false;
};

const cancel = () => {
  githubStore.cancelImport();
};
const inputExample = (URL: string) => { 
  value.value = URL; 
  showError.value = false; 
};
const fetchMetadata = async () => {
  const payload = {
    installationID: githubStore.getInstallationID,
    repo: githubStore.repository.repo,
    owner: githubStore.repository.owner,
  };
  await githubStore.fetchGitHubMeta(payload);
};

const submitGitHubLink = async () => {
  validateInput();
  if (!showError.value) {
    const owner = value.value.split('/')[3];
    const repo = value.value.split('/')[4].split('.git')[0];

    // 1. Check if the app is installed
    githubStore.updateRepository({ owner, repo });

    // 1.1 Open dialog to show progress
    githubStore.updateDialogImportMetadata(true);

    // 1.2 Get installation ID
    await githubStore.getExtractorInstallationID(githubStore.getRepository);

    // 2. If it is installed, fetch metadata
    if (githubStore.getInstallationID) {
      await fetchMetadata();

      // 2.1 If all ok, complete step
      completeStep();
    } else {
      // 3. If it is not installed, open dialog to install it
      githubStore.updateDialogImportMetadata(false);
      githubStore.updateDialogAppInstall(true);
    }
  }
};

const stepperStore = useStepperStore();
const goBack = () => {
  const currentStepIndex = 1; // Actualiza con el índice del paso actual
  stepperStore.goBack(currentStepIndex);
};
const completeStep = () => {
  const currentStepIndex = 1; // Actualiza con el índice del paso actual
  stepperStore.completeStep(currentStepIndex);
};
</script>
