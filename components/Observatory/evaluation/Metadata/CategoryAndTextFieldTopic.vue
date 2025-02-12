<template>
  <div class="row mx-1 mt-1">
		<!-- This sets the vocabulary used -->
    <div class="col-2">
      <span>{{ vocabularyLabel }}</span>
      <USelectMenu
        v-model="selectVocabulary"
        :options="acceptedVocabularies"
        :label="vocabularyLabel"
        class="border-1 rounded-md px-0"
        @change="changeValue"
      >
        <template #selected="{ option }">
          {{ option }}
        </template>
        <template class="mt-2 border-none" #option="{ option }">
          <div class="text-caption ">
            {{ option }}
          </div>
        </template>
      </USelectMenu>
			<!----------------------------------->
    </div>
		<!-- If vocabulary is NOT CUSTOM -->
    <div v-if="!customVocabulary" class="col-4">
      <span>{{ textLabel }}</span>
      <USelectMenu
        v-model="model"
        :options="comboboxItems"
        :label="textLabel"
        class="border-1 rounded-md px-0"
        @input="changeValue"
        @change="changeValue"
      >
        <template #selected="{ option }">
          {{ option }}
        </template>
        <template class="mt-2 border-none" #option="{ option }">
          <div class="text-caption ">
            {{ option }}
          </div>
        </template>
      </USelectMenu>
    </div>

    <div v-if="!customVocabulary" class="col-6">
      <span :class="{ 'text-red-500': uriErrorMessage }">{{ textLabel }}</span>
      <UInput
        v-model="modelURI"
        label="URI"
        class="border-1 rounded-md px-0 text-sm"
        :class="{ 'border-red-500': uriErrorMessage }"
        @input="onURIChange"
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

      <span class="text-xs ps-1 mt-2" :class="{ 'text-red-500': uriErrorMessage }">
        {{ uriErrorMessage }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';

const metadataStore = useMetadataStore();

// PROPS
const props = defineProps<{
  item: any;  // Cambié `Array` por `any` ya que `item` parece ser un objeto
  id: number;
  field: string;
  index: number;
  vocabularyLabel: string;
  typeLabel?: string;
  textLabel?: string;
  acceptedVocabularies?: string[];
}>();

// Define los eventos que el componente puede emitir
const emit = defineEmits(['remove']);

// Method to emit the ‘remove’ event
const emitRemove = () => {
  emit('remove', props.index);
};

const model = ref('');
const selectVocabulary = ref('');
const modelURICustom = ref('');
const modelURI = ref('');
const edamReversed = ref('');
const uriErrorMessage = ref('');

// Obtener datos del store usando `computed`
const vocabulariesItems = computed(() => metadataStore.getVocabulariesItems);

// Computed properties
const customVocabulary = computed(() => {
  return !props.acceptedVocabularies?.includes(selectVocabulary.value);
});

const comboboxItems = computed(() => {
  if (props.acceptedVocabularies?.includes(selectVocabulary.value)) {
    return vocabulariesItems.value?.[selectVocabulary.value]?.[props.typeLabel ?? ''];
  }
  return [];
});

onMounted(() => {
  selectVocabulary.value = props.item.vocabulary;
  model.value = props.item.term;
  modelURI.value = props.item.url;
});


// Methods
// ----------------------------------------------------------------
const validateURI = (uri: string): boolean => {
  const uriPattern =
    /^(https?:\/\/)?([a-z\d.-]+)\.([a-z]{2,6})([/\w .-]*)*\/?$/;
  return uriPattern.test(url);
};

const onURIChange = () => {
  if (validateURI(modelURI.value)) {
    uriErrorMessage.value = ''; // Limpiar mensaje de error si la URI es válida
    changeValue();
  } else {
    uriErrorMessage.value = 'Please enter a valid URI';
  }
};

const clearTerm = () => {
  model.value = '';
  modelURI.value = '';
  modelURICustom.value = '';
  changeValue();
};

const changeValue = () => {
  console.log('changeValue');
  let newValue;

  if (customVocabulary.value) {
    newValue = {
      id: props.id,
      term: {
        term: model.value,
        uri: modelURI.value,
        vocabulary: selectVocabulary.value,
      },
    };
  } else if (selectVocabulary.value === 'EDAM') {
    modelURI.value = edamReversed.value?.[props.typeLabel ?? '']?.[model.value] || '';
    newValue = {
      id: props.id,
      term: {
        term: model.value,
        uri: modelURI.value,
        vocabulary: selectVocabulary.value,
      },
    };
  } else {
    newValue = {
      id: props.id,
      term: {
        term: model.value,
        uri: modelURI.value,
        vocabulary: selectVocabulary.value,
      },
    };
  }

  if (newValue) {
    emit('change', { index: props.index, value: newValue });
    console.log('emitting change', { index: props.index, value: newValue });
  }
};


</script>
