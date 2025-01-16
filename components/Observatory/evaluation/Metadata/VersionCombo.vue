<template>
  <div class="row">
    <USelectMenu
      searchable
      v-model="selectedVersion"
      :options="versions"
      persistent-hint
      class="text-body-2 mt-2"
      @update:model-value="changeValue"
      small-chips
      deletable-chips
    />
    <span class="text-xs">Select/introduce the version this metadata applies to</span>
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
});

// Store
const metadataStore = useMetadataStore();

// Reactive variables
const selectedVersion = ref(props.initialSelectedVersion);

// Watcher para sincronizar cambios en initialSelectedVersion
watch(
  () => props.initialSelectedVersion,
  (newVal) => {
    selectedVersion.value = newVal;
  }
);

// Methods
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
  