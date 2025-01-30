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
                :fields="metadataFields[metadataKeys[index]]"
						    :field_names="metadataFieldNames[metadataKeys[index]]"
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

      <!-- Contents -->
      <template #item="{ item }">

        <!-- Content 0. Identity -->
        <div v-if="item.label == '0. Identity'" class="p-4">
          <div class="mt-0 ml-3 d-flex flex-row justify-space-between">
            <!-- Name -->
            <MetaField
              title="Name"
              field="label"
              value-type=""
              n_cols="4"
              :increasable="false"
            >
              <template #inputField>
                <FormField
                  field="label"
                  :increasable="false"
                  :item="toolMetadata.label[0]"
                  :text-class="nameTextClass()"
                />
              </template>
            </MetaField>

            <!-- Type -->
            <MetaField
              title="Type of Software"
              field="type"
              value-type=""
              n_cols="3"
              :increasable="false"
            >
              <template #inputField>
                <SelectorType
                  field="type"
                  :initialSelectedType="toolMetadata.type"
                />
              </template>
            </MetaField>

            <!-- Version -->
            <MetaField
              title="Version"
              field="version"
              value-type=""
              n_cols="4"
              :increasable="false"
            >
              <template #inputField>
                <VersionCombo
                  field="version"
                  :initialSelectedVersion="toolMetadata.version"
									:versions="toolMetadata.other_versions"
                />
              </template>
            </MetaField>
          </div>

          <div class="mt-0 ml-3.5 d-flex">
            <!-- Description -->
            <MetaTextArea
              title="Description"
              field="description"
              :value="toolMetadata.description"
              n_cols="col-8">
            </MetaTextArea>
            <!-- Alert -->
            <div v-if="toolMetadata.description.length > 1 > 0" class="col-3 mt-4 pt-1.5 me-3">
              <UAlert
                :ui="{gap:'gap-2', shadow: 'shadow-md'}"
                icon="mdi-alert-circle"
                color="sky"
                variant="soft"
                description="Only the first description will appear in the exported
									metadata."
                class="p-2 text-gray-900"
              />
            </div>
          </div>

          <div class="mt-3 ml-3.5 d-flex">
            <!-- Webpage -->
            <MetaFieldURLField
              title="Webpage"
              :value="toolMetadata.webpage"
              field="webpage"
							value-type="string"
							n_cols="col-8"
							label="URL"
							increasable="true"
            />

            <!-- Alert -->
            <div v-if="toolMetadata.webpage.length > 1 > 0" class="col-3 mt-4 pt-1.5 me-3">
              <UAlert
                :ui="{gap:'gap-2', shadow: 'shadow-md'}"
                icon="mdi-alert-circle"
                color="sky"
                variant="soft"
                description="Only the first URL will appear in the exported
									metadata."
                class="p-2 text-gray-900"
              />
            </div>
          </div>
        </div>

        <!-- Content 1. Accessibility / License -->
        <div v-if="item.label == '1. Accessibility / License'" class="p-4">
          <div class="mt-0 ml-3 d-flex flex-row justify-space-between">
            <!-- License  -->
             <MetaFieldLicense
              title="License"
              :value="toolMetadata.license"
              field="license"
              :increasable="true"
             />
          </div>
        </div>

        <!-- Content 2. Documentation -->
        <div v-if="item.label == '2. Documentation'" class="p-4">

        </div>

        <!-- Content 3. Test data -->
        <div v-if="item.label == '3. Test data'" class="p-4">

        </div>

        <!-- Content 4. Interoperability -->
        <div v-if="item.label == '4. Interoperability'" class="p-4">

        </div>

        <!-- Content 5. Versioning -->
        <div v-if="item.label == '5. Versioning'" class="p-4">

        </div>

        <!-- Content 6. Reproducibility -->
        <div v-if="item.label == '6. Reproducibility'" class="p-4">

        </div>

        <!-- Content 7. Recognition -->
        <div v-if="item.label == '7. Recognition'" class="p-4">

        </div>
        <!-- Borrar al terminar -->
        <div>
          <p class="italic text-gray-900 dark:text-white text-center">
            {{ item.label }}
          </p>
        </div>
      </template>
    </UAccordion>
    <!-- Buttons -->
    <div class="flex justify-between mt-5">
      <UButton variant="ghost" color="red" @click="stepperStore.cancelSteps">
        Cancel
      </UButton>
      <div class="text-right">
        <UButton class="mr-2" color="gray" variant="ghost" size="md" :ui="{color:{gray:{ghost:'text-gray-900 hover:bg-gray-100'}},}" @click="goBack">
          Back
        </UButton>

        <UButton class=" bg-primaryOeb-500" variant="solid" size="md" 
          :ui="{color:{variant:{solid:'hover:bg-{blue}-500'}}}"
          @click="submitMetadata">
            Continue
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';
import { useResultStore } from '@/stores/observatory/evaluation/results';
import { useStepperStore } from '@/stores/observatory/evaluation/index';
import MetaField from "./Metafield.vue";
import MetaTextArea from "./MetaTextArea.vue";
import MetaFieldURLField from "./MetaFieldURLField.vue";
import MetaFieldLicense from "./MetaFieldLicense.vue";
import FormField from './FormField.vue';
import SelectorType from './SelectorType.vue';
import VersionCombo from './VersionCombo.vue';
import MetaRegistriesCombo from './MetaRegistriesCombo.vue';


const metadataStore = useMetadataStore();
const resultsStore = useResultStore();
const stepperStore = useStepperStore();

import PanelHeader from "./PanelHeader.vue";
import { value } from "valibot";

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
// Crear una lista de claves
const metadataKeys = Object.keys(metadataFields);

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
  return ["text-body", "mt-2"];
};
</script>
<style scoped></style>
