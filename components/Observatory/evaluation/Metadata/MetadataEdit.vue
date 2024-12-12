<template>
  <div class="container px-5 my-5">
    <UAccordion :items="items" :ui="{ wrapper: 'flex flex-col w-full' }" class="shadow-md">
      <template #default="{ item, index, open }">
        <UButton
          color="gray"
          variant="ghost"
          class="border-b border-gray-200 dark:border-gray-700"
          :ui="{ rounded: 'rounded-none', padding: { sm: 'p-4' } }"
        >
          <span class="truncate font-semibold ms-3">{{ item.label }}</span>

          <template #trailing>
            <div class="flex items-center ms-auto space-x-2">
              <!-- Iconos de PanelHeader -->
              <PanelHeader
                :fields="metadataFields.identity"
						    :field_names="metadataFieldNames.identity"
                :visible_ticks="visibleTicks(index)"
              />
              <!-- Chevron Icon -->
              <UIcon
                name="i-heroicons-chevron-right-20-solid"
                class="w-5 h-5 transform transition-transform duration-200 ms-4"
                :class="[open && 'rotate-90']"
              />
            </div>
          </template>
        </UButton>
      </template>
    </UAccordion>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';
import { useResultStore } from '@/stores/observatory/evaluation/results';
import { useStepperStore } from '@/stores/observatory/evaluation/index';

const metadataStore = useMetadataStore();
const resultsStore = useResultStore();
const stepperStore = useStepperStore();

import PanelHeader from "./PanelHeader.vue";

const items = [
  { label: "0. Identity" },
  { label: "1. Accessibility / License" },
  { label: "2. Documentation" },
  { label: "3. Test data" },
  { label: "4. Interoperability" },
  { label: "5. Versioning" },
  { label: "6. Reproducibility" },
  { label: "7. Recognition" },
];
const versionControl = ref(false);
const openPanels = ref<number[]>([]);
const selectedType = '';
const selectedVersion = '';
const registries = [
  'Conda',
  'DockerHub',
  'PyPI',
  'CRAN',
  'Bioconductor',
  'SourceForge',
  'Galaxy Toolshed',
  'bio.tools',
  'npm',
  'CPAN',
  'RubyGems',
  'DockerHub',
  'BioContainers',
];
const eInfrastructures = ['Galaxy instance (free)'];
const metadataFieldNames = {
  identity: ['name', 'type', 'version', 'description', 'webpage'],
  accessibility: [
    'license',
    'registries',
    'e-infrastructures',
    'source code',
    'other download links',
    'registration not mandatory',
    'api library',
  ],
  documentation: [
    'documentation',
    'topics / domains of application',
    'operations / functions performed by the tool',
  ],
  testing: ['test data'],
  interoperability: ['input data formats', 'output data formats'],
  versioning: ['repository'],
  reproducibility: ['dependencies', 'operating system'],
  recognition: ['associated publication', 'authors / developers'],
}
const metadataFields = {
  identity: ['label', 'type', 'version', 'description', 'webpage'],
  accessibility: [
    'license',
    'registries',
    'e_infrastructures',
    'src',
    'links',
    'registration_not_mandatory',
    'api_lib',
  ],
  documentation: ['documentation', 'topics', 'operations'],
  testing: ['test'],
  interoperability: ['input', 'output'],
  versioning: ['repository'],
  reproducibility: ['dependencies', 'os'],
  recognition: ['publication', 'authors'],
}

// Computed
const toolMetadata = computed(() => metadataStore.getToolMetadata);
const output = computed(() => toolMetadata.value.output);
const input = computed(() => toolMetadata.value.input);

// Watch
watch(versionControl, (newVal) => {
  const payload = {
    field: 'version_control',
    value: newVal,
  };

  // Despachar acción al store
  metadataStore.changeBooleanEntry(payload);
});

// onMounted
onMounted(() => {
  // Populate vocabularies
  metadataStore.fetchVocabulariesItems();

  // Dispatch getting SPDX licenses
  metadataStore.fetchSPDXLicenses();

  // Set version control
  versionControl.value = initialVersionControl();
});

// Methods
const visibleTicks = (i: number) => {
  return !openPanels.value.includes(i);
};

const initialVersionControl = () => {
  if (toolMetadata.value.repository.length > 0) {
    const term = toolMetadata.value.repository[0].term;
    return /github|gitlab|bitbucket/.test(term);
  }
  return false;
};

const submitMetadata = () => {
  metadataStore.submitVersionControl(versionControl.value);
  resultsStore.evaluateToolByMetadata(toolMetadata.value);
  metadataStore.transformToJSONLD();
  metadataStore.transformToCFF();
  stepperStore.completeStep(2);
};

const goBack = () => {
  metadataStore.updateLoadedMetadata(false);
  metadataStore.updateToolsMetadata({});
  const currentStepIndex = 2; // Actualiza con el índice del paso actual
  stepperStore.goBack(currentStepIndex);
};

const cancel = () => {
  metadataStore.updateLoadedMetadata(false);
  metadataStore.updateToolsMetadata({});
  stepperStore.goBack(0);
};

const nameTextClass = () => {
  return ["text-body", "mt-3"];
};
</script>
<style scoped></style>
