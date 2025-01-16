<template>
  <div class="row mx-1">
    <USelectMenu
      v-model="selectedType"
      :options="typeItems"
      class="mt-2 border-1 rounded-md px-0"
      bordered="false"
      @update:model-value="changeValue"
    >
      <template #selected="{ option }">
        {{ formatOption(option) }}
      </template>
      <template class="mt-2 border-none" #option="{ option }">
        <div class="text-caption ">
          {{ formatOption(option) }}
        </div>
      </template>
    </USelectMenu>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';

// Props
const props = defineProps({
  initialSelectedType: {
    type: String,
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
const selectedType = ref(props.initialSelectedType);
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
    value: selectedType.value,
  };
  metadataStore.updateSelectorEntry(payload); // Usando el método definido en Pinia
};

// Watcher para sincronizar cambios en initialSelectedType
watch(
  () => props.initialSelectedType,
  (newVal) => {
    selectedType.value = newVal;
  }
);

// Formatear la opción a mayúsculas
const formatOption = (option) => {
  return option ? String(option).toUpperCase() : '';
};
</script>

<style scoped>
/* Usamos una regla más específica para el dropdown del select */
::v-deep .u-select-dropdown {
  border: none !important; /* Elimina el borde */
  box-shadow: none !important; /* Elimina la sombra */
  padding: 0 !important; /* Elimina cualquier padding extra */
}

/* Asegúrate de que el select también no tenga borde si es necesario */
::v-deep .u-select {
  border: none !important;
}

.text-caption {
  @apply text-sm text-gray-500;
}
</style>