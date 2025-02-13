<template>
  <div class="row mx-1 mt-1">
    <!--  -->
    <div class="col-2">
      <span>{{ vocabularyLabel }}</span>
      <USelectMenu
        v-model="selectVocabulary"
        :options="acceptedVocabularies"
        :label="vocabularyLabel"
        class="border-1 rounded-md px-0"
      >
      </USelectMenu>
    </div>
		<!----------------------------------->
    <div v-if="!customVocabulary" cols="4">
      <span>Data Format</span>
      <USelectMenu
        v-model="model"
        :options="comboboxItemsFormat"
        label="Data Format"
        class="border-1 rounded-md px-0"
      >
      </USelectMenu>
    </div>
    <div v-if="!customVocabulary" cols="6">
      <UInput
        v-model="modelURI"
        label="URI"
        class="border-1 rounded-md px-0 text-sm"
      >
        <UButton
          color="gray"
          variant="solid"
          :ui="{ rounded: 'rounded-full' }"
          class="p-1.5 mx-3 absolute right-[-55px] top-0.5"
          @click="emitRemove" 
        >
          <UIcon
            name="i-heroicons-x-circle-20-solid"
            class="bg-gray-400"
          />
        </UButton>
      </UInput>
    </div>

		<!----------------------------------->
    <div v-if="customVocabulary" cols="4">
      <UInput
        v-model="model"
        label="Data Format"
        class="border-1 rounded-md px-0 text-sm"
      >
      </UInput>
    </div>

    <div v-if="customVocabulary" cols="6">
      <UInput
        v-model="modelURI"
        :rules="[urlRule]"
        label="URI"
        class="border-1 rounded-md px-0 text-sm"
      >
        <UButton
          color="gray"
          variant="solid"
          :ui="{ rounded: 'rounded-full' }"
          class="p-1.5 mx-3 absolute right-[-55px] top-0.5"
          @click="emitRemove" 
        >
          <UIcon
            name="i-heroicons-x-circle-20-solid"
            class="bg-gray-400"
          />
        </UButton>
      </UInput>
    </div>

  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';
import { EDAMreversed } from './EDAM_forFE_reversed.js';

const metadataStore = useMetadataStore();

// PROPS
const props = defineProps<{
  item: any;
  field: string;
  index: number;
  vocabularyLabel: string;
  acceptedVocabularies?: string[];
}>();

// EVENTOS
const emit = defineEmits(['remove']);

// ESTADOS
const model = ref('');
const modelURI = ref('');
const selectVocabulary = ref('');
const edamReversed = ref(EDAMreversed);

// REGLA DE VALIDACIÓN PARA URL
const urlRule = (value: string): boolean | string => {
  const urlPattern = /^(https?:\/\/)?([a-z\d.-]+)\.([a-z]{2,6})([/\w .-]*)*\/?$/;
  return urlPattern.test(value) || 'Invalid URL';
};

// GETTER: Obtener los vocabularios desde el store
const vocabulariesItems = computed(() => metadataStore.getVocabulariesItems);

// Computed para verificar si el vocabulario es personalizado
const customVocabulary = computed(() => {
  return !props.acceptedVocabularies?.includes(selectVocabulary.value);
});

// Computed para obtener los items del combobox basados en el vocabulario seleccionado
const comboboxItemsFormat = computed(() => {
  if (props.acceptedVocabularies?.includes(selectVocabulary.value)) {
    return vocabulariesItems.value?.[selectVocabulary.value]?.format ?? [];
  }
  return [];
});

// WATCHERS: Reactividad automática con `watchEffect`
watchEffect(() => {
  if (selectVocabulary.value === 'EDAM' && model.value) {
    modelURI.value = edamReversed.value?.format?.[model.value] || '';
  }
  updateStore();
});

watchEffect(() => {
  updateStore();
});


// Inicializar datos al montar el componente
onMounted(() => {
  initializeData();
});

// METHODS
// Método para actualizar el store (se activa con los watchers)
const updateStore = () => {
  const payload = {
    field: props.field,
    index: props.index,
    value: {
      id: props.index,
      term: {
        term: props.model,
        uri: modelURI.value,
        vocabulary: selectVocabulary.value
      }
    },
  }
  metadataStore.changeEntry(payload);
}
  // Método para inicializar datos
const initializeData = () => {
  selectVocabulary.value = props.item.vocabulary;
	model.value = props.item.term;
  modelURI.value = props.item.uri;
};

// Method to emit the ‘remove’ event
const emitRemove = () => {
  emit('remove', props.index);
};

</script>