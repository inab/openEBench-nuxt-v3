<template>
  <div class="row mx-1">
    <UInputMenu
      v-model="selectedVersion"
      v-model:query="selectedVersion"
      :options="versions"
      persistent-hint
      class="text-body-2 mt-2 border-1 rounded-md px-0"
      :inputClass="inputClass"
      @blur="addValueIfNotExists"
      @keypress.enter="addValueIfNotExists"
    />
    <span class="text-xs ps-1 mt-2">Select/introduce the version this metadata applies to</span>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';

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

// Store
const metadataStore = useMetadataStore();

// Reactive variables
const selectedVersion = ref(props.initialSelectedVersion);
const versions = ref([...props.versions]);

// Watcher para sincronizar cambios en initialSelectedVersion
watch(
  () => props.initialSelectedVersion,
  (newVal) => {
    selectedVersion.value = newVal;
  }
);

// Methods
const addValueIfNotExists = () => {
  if (selectedVersion.value && !versions.value.includes(selectedVersion.value)) {
    versions.value.push(selectedVersion.value);
  }
  changeValue();
};

const changeValue = () => {
  const payload = {
    field: props.field,
    value: selectedVersion.value,
  };
  metadataStore.updateSelectorEntry(payload); // Usando el método de Pinia
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
</style>
