<template>
  <div class="row mx-1 mt-3">
		<!-- This sets the vocabulary used -->
    <div class="col-2 relative" 
      @focusin="isFocused = true"
      @focusout="isFocused = false">
      <!-- Etiqueta flotante -->
      <label class="floatingLabel absolute top-[-10px] bg-white text-xs ms-2" 
      :class="{ 'text-primaryOeb-500': isFocused }">
        {{ vocabularyLabel }}
      </label>

      <!-- Select con bordes dinámicos -->
      <USelectMenu
        v-model="selectVocabulary"
        :options="acceptedVocabularies"
        placeholder=""
        class="border rounded-md w-full peer"
        :class="selectClasses"
      >
        <template #selected="{ option }">
          {{ option }}
        </template>
        <template #option="{ option }">
          <div class="text-caption">
            {{ option }}
          </div>
        </template>
      </USelectMenu>
    </div>

    <!-- --------------------------- -->
		<!-- If vocabulary is NOT CUSTOM -->
    <div v-if="!customVocabulary" class="col-4 relative"
      @focusin="isFocusedSelect = true"
      @focusout="isFocusedSelect = false">
      <span class="floatingLabel absolute top-[-10px] bg-white text-xs ms-2 px-1 "
      :class="{ 'text-primaryOeb-500': isFocusedSelect }">
        {{ textLabel }}
      </span>
      <USelectMenu
        v-model="model"
        :options="comboboxItems"
        placeholder=""
        class="border rounded-md px-0 w-full peer"
        :class="{ 'border-primaryOeb-500 ring-1 ring-primaryOeb-500': isFocusedSelect }"
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
    <div v-if="!customVocabulary" class="col-5 ml-1">
      <UInput
        v-model="modelURI"
        placeholder=""
        :ui="{ base: 'peer' }"
        class="relative border-1 rounded-md px-0 text-sm"
        :class="{
          'border-red-500 ring-red-500': uriErrorMessage, // If error → Red
          ' focus-within:ring-primaryOeb-500 focus-within:border-primaryOeb-500 focus-within:text-primaryOeb-500': !uriErrorMessage // If NO error → Blue
        }"
        @update:modelValue="onURIChange"
      >
        <!-- Floating Label -->
        <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-dimmed) text-xs px-1.5 transition-all peer-focus:-top-2.5 
          peer-focus:text-xs peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5"
        >
          <span class="inline-flex bg-white px-1" :class="{ 'text-red-500': uriErrorMessage }">URI</span>
        </label>
        <UButton
          color="gray"
          variant="solid"
          :ui="{ rounded: 'rounded-full' }"
          class="p-1.5 mx-3 absolute right-[-55px] top-0.5"
          @click="emitRemove" 
        >
          <UIcon name="i-heroicons-x-circle-20-solid" class="bg-gray-400" />
        </UButton>
      </UInput>

      <span class="text-xs ps-1 mt-2" :class="{ 'text-red-500': uriErrorMessage }">
        {{ uriErrorMessage }}
      </span>
    </div>

    <!-- --------------------------- -->
		<!-- If vocabulary is CUSTOM -->
    <div v-if="customVocabulary" class="col-4">
      <UInput
        v-model="model"
        placeholder="" 
        :ui="{ base: 'peer' }"
        class="border-1 rounded-md px-0 text-sm focus-within:ring-1 focus-within:ring-primaryOeb-500 focus-within:text-primaryOeb-500"
      >
        <!-- Floating Label -->
        <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-dimmed) text-xs px-1.5 transition-all peer-focus:-top-2.5 
          peer-focus:text-xs peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5"
        >
          <span class="inline-flex bg-white px-1">{{ textLabel }}</span>
        </label>
      </UInput>
    </div>
    <div v-if="customVocabulary" class="col-5 ml-1">
      <UInput
        v-model="modelURI"
        placeholder=""
        :ui="{ base: 'peer' }"
        :disabled="!customVocabulary"
        class="border-1 rounded-md px-0 text-sm"
        :class="{
          'border-red-500 ring-red-500': uriErrorMessage, // If error → Red
          ' focus-within:ring-primaryOeb-500 focus-within:border-primaryOeb-500 focus-within:text-primaryOeb-500': !uriErrorMessage // If NO error → Blue
        }"
        @update:modelValue="onURIChange"
        >
        <!-- Floating Label -->
        <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-dimmed) text-xs px-1.5 transition-all peer-focus:-top-2.5 
          peer-focus:text-xs peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5"
        >
          <span class="inline-flex bg-white px-1" :class="{ 'text-red-500': uriErrorMessage }">URI</span>
        </label>
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
import { EDAMreversed } from './EDAM_forFE_reversed.js';

const metadataStore = useMetadataStore();

// PROPS
const props = defineProps<{
  item: any; 
  id: number;
  field: string;
  index: number;
  vocabularyLabel: string;
  typeLabel?: string;
  textLabel?: string;
  acceptedVocabularies?: string[];
}>();

// Method to emit the ‘remove’ event
const emit = defineEmits(['remove']);
const emitRemove = () => {
  emit('remove', props.index);
};

const model = ref('');
const selectVocabulary = ref('');
const modelURICustom = ref('');
const modelURI = ref('');
const edamReversed = ref(EDAMreversed);
const uriErrorMessage = ref('');
const isFocused = ref(false);
const isFocusedSelect = ref(false);


// Dynamic classes
const selectClasses = computed(() => [
  "outline-none border-gray-300",
  {
    "border-primaryOeb-500 ring-1 ring-primaryOeb-500": isFocused.value, 
  }
]);

// Get data from the store
const vocabulariesItems = computed(() => metadataStore.getVocabulariesItems);
// Computed properties
const customVocabulary = computed(() => {
  return !props.acceptedVocabularies?.includes(selectVocabulary.value);
});

const comboboxItems = computed(() => {
  // console.log(selectVocabulary.value)
  if (props.acceptedVocabularies.includes(selectVocabulary.value)) {
    return vocabulariesItems.value[selectVocabulary.value][props.typeLabel];
  }
  return [];
});

onMounted(() => {
  selectVocabulary.value = props.item.vocabulary;
  model.value = props.item.term;
  modelURI.value = props.item.uri;
});


// Methods
// ----------------------------------------------------------------
const validateURI = (uri: string): boolean => {
  const uriPattern =
    /^(https?:\/\/)?([a-z\d.-]+)\.([a-z]{2,6})([/\w .-]*)*\/?$/;
  return uriPattern.test(uri);
};

const onURIChange = () => {
  if (!modelURI.value) {
    uriErrorMessage.value = 'Please enter a valid URI';
  } else if (validateURI(modelURI.value)) {
    uriErrorMessage.value = '';
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
<style scoped>
.floatingLabel{
  z-index: 1;
  transition: all 0.2s ease-in-out;
}

.truncated-label {
  display: block; /* Asegura que la etiqueta ocupe todo el ancho */
  max-width: 60%; /* Limita el ancho para que no sobrepase su contenedor */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

</style>
