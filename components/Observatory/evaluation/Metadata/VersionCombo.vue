<template>
  <div class="row mx-1 mt-2">
    <UInputMenu
      v-model="selectedVersion"
      v-model:query="searchQuery"
      :options="versions"
      persistent-hint
      class="text-body-2 mt-2 border-1 rounded-md px-0 focus-within:ring-primaryOeb-500 focus-within:border-primaryOeb-500 focus-within:text-primaryOeb-500"
      :inputClass="inputClass"
      @blur="handleBlur"
      @keypress.enter="addValueIfNotExists"
    />
    <span class="text-xs ps-1 mt-2">Select/introduce the version this metadata applies to</span>
    <span v-if="errorMessage" class="text-red-500 text-xs ps-1 mt-2">{{ errorMessage }}</span>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';

// Store
const metadataStore = useMetadataStore();

// Props
const props = defineProps({
  initialSelectedVersion: {
    type: String,
    required: false,
  },
  versions: {
    type: Array,
    required: true,
  },
  field: {
    type: String,
    required: true,
  },
  inputClass: {
    type: String,
    default: ''
  }
});

// Reactive variables
const selectedVersion = ref(props.initialSelectedVersion || '');
const searchQuery = ref('');

const versions = ref([...props.versions]);
console.log(versions)
const errorMessage = ref("");

// Watcher para sincronizar cambios en initialSelectedVersion
watch(
  () => props.initialSelectedVersion,
  (newVal) => {
    selectedVersion.value = newVal;
  }
);

// Methods
const isValidVersion = (version) => {
  // Permite formatos: 1, 1.2, 1.2.3
  const versionRegex = /^\d+(\.\d+){0,2}$/;
  return versionRegex.test(version.trim());
};

const addValueIfNotExists = () => {
  if (isValidVersion(selectedVersion.value)) {
    if (!versions.value.includes(selectedVersion.value)) {
      versions.value.push(selectedVersion.value);
      errorMessage.value = ""; // Clear error message if the value is valid
    }
    changeValue();
  } else {
    errorMessage.value = "Invalid version format. Use '1.0.0'."
  }
};

// New method to handle the blur event
const handleBlur = () => {
  if (selectedVersion.value === '' || selectedVersion.value === null || selectedVersion.value === undefined) {
    errorMessage.value = "";
    changeValue();
  } else {
    addValueIfNotExists();
  }
};

const changeValue = () => {
  const payload = {
    field: props.field,
    value: selectedVersion.value,
  };
  metadataStore.updateSelectorEntry(payload);
};

// Synchronise when mounting the component
onMounted(() => {
  changeValue();
});
</script>
  
<style scoped>
.text-body-2 {
  @apply text-sm text-gray-700;
}
.text-red-500 {
  color: red !important;
}
</style>
