<template>
  <div class="row mx-1 mt-3">
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
    <div v-if="!customVocabulary" class="col-4 relative mx-2"
      @focusin="isFocusedSelect = true"
      @focusout="isFocusedSelect = false"
      >
      <span class="floatingLabel absolute top-[-9px] bg-white text-xs ms-2 px-1 "
        :class="{ 'text-primaryOeb-500': isFocusedSelect }">
        Data Format
      </span>
      <USelectMenu
        v-model="model"
        :options="comboboxItemsFormat"
        placeholder=""
        class="border rounded-md px-0 w-full peer"
        :class="{ 'border-primaryOeb-500 ring-1 ring-primaryOeb-500': isFocusedSelect }"
      >
      </USelectMenu>
    </div>
    <div v-if="!customVocabulary" class="col-5 relative focus-within:text-primaryOeb-500">
      <span class="floatingLabel absolute top-[-9px] bg-white text-xs ms-2 px-1 "
      :class="{ 'text-red-500': uriErrorMessage }">
        URL
      </span>
      <UInput
        v-model="modelURI"
        placeholder=""
        :ui="{ base: 'peer' }"
        class="relative border-1 rounded-md px-0 text-sm"
        :class="{
          'border-red-500 ring-red-500': uriErrorMessage, // If error → Red
          ' focus-within:ring-primaryOeb-500 focus-within:border-primaryOeb-500 focus-within:text-primaryOeb-500': !uriErrorMessage // If NO error → Blue
        }"
        @update:modelValue="onURLChange"
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

		<!----------------------------------->
    <div v-if="customVocabulary" class="col-4 relative focus-within:text-primaryOeb-500">
      <span class="floatingLabel absolute top-[-9px] bg-white text-xs ms-2 px-1 "
      >
      Data Format
      </span>
      <UInput
        v-model="model"
        placeholder=""
        :ui="{ base: 'peer' }"
        class="border-1 rounded-md px-0 text-sm focus-within:ring-1 focus-within:ring-primaryOeb-500 focus-within:text-primaryOeb-500"
      >
      </UInput>
    </div>
    <div v-if="customVocabulary" class="col-5 relative focus-within:text-primaryOeb-500">
      <span class="floatingLabel absolute top-[-9px] bg-white text-xs ms-2 px-1 "
      :class="{ 'text-red-500': uriErrorMessage }">
        URL
      </span>
      <UInput
        v-model="modelURI"
        placeholder=""
        :ui="{ base: 'peer' }"
        class="border-1 rounded-md px-0 text-sm"
        :class="{
          'border-red-500 ring-red-500': uriErrorMessage, // If error → Red
          ' focus-within:ring-primaryOeb-500 focus-within:border-primaryOeb-500 focus-within:text-primaryOeb-500': !uriErrorMessage // If NO error → Blue
        }"
        @update:modelValue="onURLChange"
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
const uriErrorMessage = ref('Invalid URL');
const isFocusedSelect = ref(false);

onMounted(() => {
  initializeData();
});

// REGLA DE VALIDACIÓN PARA URL
const validateURI = (uri: string): boolean => {
  const uriPattern =
    /^(https?:\/\/)?([a-z\d.-]+)\.([a-z]{2,6})([/\w .-]*)*\/?$/;
  return uriPattern.test(uri);
};
const onURLChange = () => {
  if (!modelURI.value) {
    uriErrorMessage.value = 'Invalid URL';
  } else if (validateURI(modelURI.value)) {
    uriErrorMessage.value = '';
    updateStore();
  } else {
    uriErrorMessage.value = 'Invalid URL';
  }
};

// WATCH
watch(modelURI, (newValue) => {
  if (!newValue) {
    uriErrorMessage.value = 'Invalid URL';
  }else{
    uriErrorMessage.value = '';
  }
});

// Watch `selectVocabulary` and run `updateStore`.
watch(selectVocabulary, () => {
  updateStore();
});

watch(model, (newValue) => {
  if (selectVocabulary.value === 'EDAM') {
    modelURI.value = edamReversed.value.format[newValue] || '';
  }
  updateStore();
});

// COMPUTED
const vocabulariesItems = computed(() => metadataStore.getVocabulariesItems);
const customVocabulary = computed(() => {
  return !props.acceptedVocabularies?.includes(selectVocabulary.value);
});
const comboboxItemsFormat = computed(() => {
  if (props.acceptedVocabularies?.includes(selectVocabulary.value)) {
    return vocabulariesItems.value?.[selectVocabulary.value]?.format ?? [];
  }
  return [];
});

// METHODS
// Method to update the store (activated with the watchers)
const updateStore = () => {
  const payload = {
    field: props.field,
    index: props.index,
    value: {
      id: props.index,
      term: {
        term: model.value,
        uri: modelURI.value,
        vocabulary: selectVocabulary.value
      }
    },
  }
  metadataStore.changeEntry(payload);
}
// Method for initialising data
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
<style scoped>
.floatingLabel{
  z-index: 1;
  transition: all 0.2s ease-in-out;
}

</style>