<template>
  <div class="row mx-1 mt-2">
    <USelectMenu
      v-model="selectedType"
      :items="typeItems"
      :multiple="false"
      class="mt-2 border-1 rounded-md px-3 focus-within:ring-primaryOeb-500 focus-within:border-primaryOeb-500 focus-within:text-primaryOeb-500"
      bordered="false"
      @update:model-value="changeValue"
    >
      <template #default="{ modelValue }">
        {{ formatOption(modelValue) }}
      </template>
      <template #item-label="{ item }">
        {{ formatOption(item) }}
      </template>
    </USelectMenu>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useMetadataStore } from '~~/stores/observatory/evaluation/metadata';

// Props
const props = defineProps({
  initialSelectedType: {
    type: [String, Array],
    required: false,
  },
  field: {
    type: String,
    required: true,
  },
});

// Store
const metadataStore = useMetadataStore();

// Reactive variables
const selectedType = ref(normalizeType(props.initialSelectedType));
const typeItems = [
  'cmd',
  'web',
  'api',
  'lib',
  'workflow',
  'soap',
  'db',
  'suite',
];

// Methods
const changeValue = () => {
  const payload = {
    field: props.field,
    value: selectedType.value ? [selectedType.value] : [],
  };
  metadataStore.updateSelectorEntry(payload); // Usando el método definido en Pinia
};

// Watcher para sincronizar cambios en initialSelectedType
watch(
  () => props.initialSelectedType,
  (newVal) => {
    selectedType.value = normalizeType(newVal);
  }
);

function normalizeType(value) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

// Formatear la opción a mayúsculas
const formatOption = (option) => {
  return option ? String(option).toUpperCase() : '';
};
</script>

<style scoped>
/* Usamos una regla más específica para el dropdown del select */
:deep(.u-select-dropdown) {
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important; 
}

/* Asegúrate de que el select también no tenga borde si es necesario */
:deep(.u-select) {
  border: none !important;
}

.text-body-2 {
	font-size: 0.875rem;
	line-height: 1.25rem;
	color: var(--color-gray-500);
}
</style>