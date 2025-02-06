<template>
  <div class="container mx-0">
    <div class="d-flex mb-2">
      <HeaderAvatar
        :field="field"
        :field_name="title"
        :disabled_tooltip="true"
      />
      <span class="text-body title">{{ title }}</span>
    </div>

    <div class="row ms-1 mt-1">
      <!-- Registries / Package managers -->
      <div>
        <USelectMenu
          v-model="selectedItem"
          :options="registries"
          multiple
          class="border-0 px-0 select-menu border-bottom"
          @update:model-value="changeValue"
        >
          <template #label>
            <div class="d-flex flex-wrap gap-x-1 min-height">
              <UBadge
                v-for="(item, index) in selectedItem"
                :key="index"
                :ui="{ rounded: 'rounded-full' }"
                size="xs"
                variant="solid"
                color="gray"
                class="py-0.5 my-0.5 bg-gray-200 border-0 ring-transparent"
              >
                {{ item }}
                <UButton
                  icon="i-heroicons-x-mark"
                  size="xxs"
                  variant="solid"
                  :ui="{ rounded: 'rounded-full' }"
                  class="p-0 ms-1 bg-gray-500 text-white"
                  color="black"
                  @click.stop="removeItem(item)"
                />
              </UBadge>
            </div>
          </template>

          <template #option="{ option, active }">
            <div class="flex items-center gap-2">
              <UCheckbox
                v-model="selectedStates[option]"
                :checked="selectedStates[option]"
                :class="{'text-primary-500': active}"
                class="pointer-events-none me-2"
              />
              <span>{{ option }}</span>
            </div>
          </template>

        </USelectMenu>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import HeaderAvatar from "@/components/Observatory/evaluation/Metadata/HeaderAvatar.vue";
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';

const metadataStore = useMetadataStore();

// PROPS
const props = defineProps<{
  title: String,
  field: String,
  selected: Array,
  registries: Array,
}>();

const selectedItem = ref([...props.selected]);

// Crear un objeto para almacenar el estado de selección de cada opción
const selectedStates = ref<{ [key: string]: boolean }>({});

// Inicializar los estados de selección según las opciones seleccionadas
watch(selectedItem, (newValue) => {
  // Inicializamos los estados de las opciones seleccionadas
  selectedStates.value = newValue.reduce((acc, item) => {
    acc[item] = true; // Marcamos como true las opciones seleccionadas
    return acc;
  }, {});
  changeValue();
});

// Méthods
const changeValue = () => {
  const payload = {
    field: props.field,
    value: selectedItem.value,
  };
  metadataStore.updateSelectorEntry(payload);
};

// Eliminar la opción del estado
const removeItem = (item: string) => {
  selectedItem.value = selectedItem.value.filter(i => i !== item);
  delete selectedStates.value[item]; 
  changeValue();
};
</script>

<style scoped>
.title {
  font-size: 1rem !important;
  color: #0b579f !important;
}

.select-menu {
  min-height: 40px; /* Ajusta el tamaño mínimo del USelectMenu */
  display: flex;
  align-items: center;
}

.border-bottom{
  border-bottom: 1px solid !important;
}

.min-height {
  min-height: 24px; /* Asegura que el contenedor tenga altura aunque no haya chips */
  display: flex;
  align-items: center;
}

/* Ocultar el icono de selección por defecto en USelectMenu */
::v-deep li[data-headlessui-state="selected"] .iconify,
::v-deep li[data-headlessui-state="active selected"]:hover .iconify,
::v-deep li[data-headlessui-state="selected"]:hover .iconify {
  display: none !important;
}
</style>
