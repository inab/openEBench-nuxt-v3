<template>
  <div class="row mx-1">
    <UInputMenu
      v-model="selectedVersion"
      v-model:query="selectedVersion"
      :options="versions"
      persistent-hint
      class="text-body-2 mt-2 border-1 rounded-md px-0"
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
const selectedVersion = ref(props.initialSelectedVersion);
const versions = ref([...props.versions]);
const errorMessage = ref(""); // Mensaje de error reactivo

// Watcher para sincronizar cambios en initialSelectedVersion
watch(
  () => props.initialSelectedVersion,
  (newVal) => {
    selectedVersion.value = newVal;
  }
);

// Methods
const isValidVersion = (version) => {
  const versionRegex = /^\d+\.\d+\.\d+$/;
  return versionRegex.test(version) && version.trim() !== '';
};

const addValueIfNotExists = () => {
  if (isValidVersion(selectedVersion.value)) {
    if (!versions.value.includes(selectedVersion.value)) {
      versions.value.push(selectedVersion.value);
      errorMessage.value = ""; // Limpiar el mensaje de error si el valor es válido
    }
    changeValue();
  } else {
    errorMessage.value = "Invalid version format. Use '1.0.0'."
  }
};

// Nuevo método para manejar el evento blur
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

// Sincronizar al montar el componente
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
