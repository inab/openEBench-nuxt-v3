<template>
  <div class="container px-5 mb-4">
    <div class="row">
      <UAlert class="py-4">
        <template #icon>
          <div class="bg-gray-100 w-16 h-16 rounded-full flex justify-center flex-wrap content-center">
            <UIcon :name="getFromBoxStatic('icon')" class="w-10 h-10 text-gray-400"/>
          </div>
        </template>

        <template #title>
          {{ getFromBoxStatic('title') }}
        </template>
        
        <template #description>
          <UDivider class="mb-4"/>

          <!-- Expad -->
          <div class="row">

            <!--  -->
            <UAccordion :items="ExpandITEM">
              <template #default="{ item, open }">
                <UButton
                  color="gray"
                  variant="ghost"
                  class="hover:bg-white font-normal ps-0"
                  :ui="{ rounded: 'rounded-none' }"
                >
                <span class="text-left text-xs text-gray-700" v-html="getFromBoxStatic('description')" >
                </span>

                  <template #trailing>
                    <UIcon
                      name="i-heroicons-chevron-down-20-solid"
                      class="transform transition-transform duration-200 h-16 w-16 text-primaryOeb-500"
                      :class="[open && 'rotate-180']"
                    />
                  </template>
                </UButton>
              </template>

              <template #details>
                <div class="row me-3">
                  <div class="col-12 my-3 text-sm leading-4 text-gray-900">
                    Enter details:
                  </div>
                  <div class="col-3">
                    <UInput
                      v-model="owner"
                      placeholder="" 
                      :ui="{ base: 'peer' }"
                      class="border-1 rounded-md px-0 text-sm"
                      :class="{
                        'border-red-500 ring-red-500': !owner, // If error → Red
                        ' focus-within:ring-primaryOeb-500 focus-within:border-primaryOeb-500 focus-within:text-primaryOeb-500': owner // If NO error → Blue
                      }"
                    >
                      <!-- Floating Label -->
                      <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-dimmed) text-xs px-1.5 transition-all peer-focus:-top-2.5 
                        peer-focus:text-xs peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5"
                      >
                        <span class="inline-flex bg-white px-1" :class="{ 'text-red-500': !owner }">Owner</span>
                      </label>
                    </UInput>
                  </div>
                  <div class="col-3">
                    <UInput
                      v-model="repo"
                      placeholder="" 
                      :ui="{ base: 'peer' }"
                      class="border-1 rounded-md px-0 text-sm"
                      :class="{
                        'border-red-500 ring-red-500': !repo, // If error → Red
                        ' focus-within:ring-primaryOeb-500 focus-within:border-primaryOeb-500 focus-within:text-primaryOeb-500': repo // If NO error → Blue
                      }"
                    >
                      <!-- Floating Label -->
                      <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-dimmed) text-xs px-1.5 transition-all peer-focus:-top-2.5 
                        peer-focus:text-xs peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5"
                      >
                        <span class="inline-flex bg-white px-1" :class="{ 'text-red-500': !repo }">Repository</span>
                      </label>
                    </UInput>
                  </div>
                  <div class="col-2">
                    <UInput
                      v-model="branch"
                      placeholder="" 
                      :ui="{ base: 'peer' }"
                      class="border-1 rounded-md px-0 text-sm"
                      :class="{
                        'border-red-500 ring-red-500': !branch, // If error → Red
                        ' focus-within:ring-primaryOeb-500 focus-within:border-primaryOeb-500 focus-within:text-primaryOeb-500': branch // If NO error → Blue
                      }"
                    >
                      <!-- Floating Label -->
                      <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-dimmed) text-xs px-1.5 transition-all peer-focus:-top-2.5 
                        peer-focus:text-xs peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5"
                      >
                        <span class="inline-flex bg-white px-1" :class="{ 'text-red-500': !branch }">Target branch</span>
                      </label>
                    </UInput>
                  </div>
                  <div class="col-4">
                    <UInput
                      v-model="filename"
                      placeholder="" 
                      :ui="{ base: 'peer' }"
                      class="border-1 rounded-md px-0 text-sm"
                      :class="{
                        'border-red-500 ring-red-500': !filename, // If error → Red
                        ' focus-within:ring-primaryOeb-500 focus-within:border-primaryOeb-500 focus-within:text-primaryOeb-500': filename // If NO error → Blue
                      }"
                    >
                      <!-- Floating Label -->
                      <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-dimmed) text-xs px-1.5 transition-all peer-focus:-top-2.5 
                        peer-focus:text-xs peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5"
                      >
                        <span class="inline-flex bg-white px-1" :class="{ 'text-red-500': !filename }">File name</span>
                      </label>
                    </UInput>
                  </div>

                </div>
                <div class="row me-3">
                  <div class="flex justify-end my-3 ">
                    <UButton 
                      color="green" 
                      @click="makeRequest()" 
                      :disabled="invalid" 
                      class="px-3 py-2"
                    >
                      Make request
                    </UButton>
                  </div>
                </div>
              </template>
            </UAccordion>

          </div>
        </template>
      </UAlert>
    </div>

    <DialogAppInstall
      :initialDialogAppInstall="dialogAppInstall"
			:title="installDialogParameters.title"
			:text="installDialogParameters.text"
			:installationUrl="installDialogParameters.installationURL"
			@cancel="cancel"
    />

    <DialogPR />
		<DialogPRok />
		<DialogPRfail />

  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useGithub } from '@/stores/observatory/evaluation/github';
import { useExport } from '@/stores/observatory/evaluation/export';
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';
import DialogAppInstall from '~/components/Observatory/evaluation/GitHub/DialogAppInstall.vue'
import DialogPR from './DialogPR.vue';
import DialogPRok from './DialogPRok.vue';
import DialogPRfail from './DialogPRfail.vue';

const githubStore = useGithub();
const exportStore = useExport();
const metadataStore = useMetadataStore();


const ExpandITEM = [
  {
    label: "option1",
    defaultOpen: false,
    slot: "details",
  },
];

const props = defineProps<{
  content: object;
  type: string;
}>();

const boxStatic = ref({
  citation: {
    title: 'Make Pull Request in GitHub Repository',
    icon: 'mdi-source-pull',
    description:
      '<span class="text-sm font-medium leading-6 text-black">Make a pull request to add the citation file in the repository of the software.</span><br> A new branch will be created from the target branch and the citation file (in CFF format) will be added to it. This new branch will be called "evaluator-1". If this branch already exists, the new branch will be called "evaluator-2", "evaluator-3", and so on. A pull request will be made to merge the new branch with the target branch.',
    iconText: 'Make Request',
  },
  metadata: {
    title: 'Make Pull Request in GitHub Repository',
    icon: 'mdi-source-pull',
    description:
      '<span class="text-sm font-medium leading-6 text-black">Make a pull request to add the metadata in the repository of the software.</span><br>A new branch will be created from the target branch and the metadata file (in JSON-LD format) will be added to it. This new branch will be called "evaluator-1". If this branch already exists, the new branch will be called "evaluator-2", "evaluator-3", and so on. A pull request will be made to merge the new branch with the target branch.',
    iconText: 'Make Request',
  },
});
const dialog = ref(true);
const owner = ref('');
const repo = ref('');
const branch = ref('main');
const filename = ref('');


const installDialogParameters = ref({
  installationURL:
    'https://github.com/apps/metadata-updater-for-fairsoft/installations/select_target',
  title: 'Unable to create a pull request',
  text: 'Let the FAIRsoft Evaluator create a branch, create a citation file and make a pull request in the repository by granting the <a href="https://github.com/apps/metadata-updater-for-fairsoft" target="_blank">Metadata Updater for FAIRsoft GitHub App</a> the necessary permissions.',
});

// Conmputed
const initialRepository = computed(() => githubStore.getRepository)
const installationID = computed (() => githubStore.getUpdaterInstallationID)
const dialogAppInstall = computed (() => exportStore.getDialogAppInstall)
const name = computed(() => metadataStore.getToolName)

const invalid = computed(() => {
  return owner.value === '' || repo.value === '';
});

const pullRequest = computed(() => ({
  citation: {
    title: `Citation for ${name.value}`,
    message: `Citation (\`${filename.value}\`) generated by [Metadata Updater for FAIRsoft](https://github.com/apps/metadata-updater-for-fairsoft) added.`,
  },
  metadata: {
    title: `Description of ${name.value}`,
    message: `Metadata (\`${filename.value}\`) generated by [Metadata Updater for FAIRsoft](https://github.com/apps/metadata-updater-for-fairsoft) added.`,
  },
}));

// OnMounted
onMounted(() => {
  repo.value = initialRepository.value.repo;
  owner.value = initialRepository.value.owner;

  if (props.type === 'metadata') {
    filename.value = `${name.value}.metadata.json`;
  } else if (props.type === 'citation') {
    filename.value = 'CITATION.cff';
  }
});

// Methods
const getFromBoxStatic = (param) => {
  return boxStatic.value[props.type][param]
}

const buildRepositoryURL = () => {
  return `https://github.com/${owner.value}/${repo.value}`;
}

const cancel = () => {
  exportStore.cancelRequest()
}

const toString = (object) => {
  /*
  Transform a JSON object to a base64 string
  */
  if (props.type === 'metadata') {
    return JSON.stringify(object, null, 2);
  } else {
    return object;
  }
}

const makeRequest = async () => {
  /*
  This function is called when the user clicks on the "Make request" button.
  It checks if the app is installed in the repository and if so,
  it makes a request to the backend to pull the data from the repository.
  If it is not installed, it opens a dialog to install it.
  */

  // 1. Check if the app is installed in the repository
  // 1.1 Open dialog to show progress
  exportStore.updateDialogPR(true)

  // 1.2 Get installation ID
  const repository = {
    owner: owner.value,
    repo: repo.value,
  };

  await githubStore.getExtractorInstallationID(repository);

	// 2. If the app is installed, make the request
  if (installationID.value) {
    console.log(props.content)
    const payload = {
      owner: owner.value,
      repo: repo.value,
      branch: branch.value,
      filename: filename.value,
      content: toString(props.content),
      title: pullRequest.value[props.type].title,
      message: pullRequest.value[props.type].message,
      installationID: installationID.value,
    };

    await exportStore.makePullRequest(payload)

  }else{
		// 3. If the app is not installed, open dialog to install it
    exportStore.updateDialogAppInstall(true)
    exportStore.updateDialogPR(false)
  }
}
</script>
<style scoped>
/* Puedes agregar más estilos si lo necesitas */
.border-red-500 {
  border-color: #f87171 !important;
}
</style>