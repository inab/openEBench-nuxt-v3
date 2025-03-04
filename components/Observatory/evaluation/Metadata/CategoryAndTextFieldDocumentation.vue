<template>
  <div class="row mx-1 mt-1">
  <div class="col-4">
    <span class="ml-0.5">{{ vocabularyLabel }}</span>
    <USelectMenu
      v-model="selectCategory"
      :options="categoryItems"
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
  </div>


  <!-- MIRA EL INPUT DEL PRIMER PASO Y COPIA LOS ESTILOS. -->

  <div class="col-7">
    <span class="ml-0.5" :class="{ 'text-red-500': urlErrorMessage }">{{ textLabel }}</span>
    <UInput
      v-model="model"
      :label="textLabel"
      class="border-1 rounded-md px-0 text-sm"
      :class="{ 'border-red-500': urlErrorMessage }"
      @input="onInputChange"
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

    <span class="text-xs ps-1 mt-2" :class="{ 'text-red-500': urlErrorMessage }">
      {{ urlErrorMessage }}
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
  item: any,
  field: string,
  id: string,
  index: number,
  vocabularyLabel: string,
  typeLabel: string,
  textLabel: string,
}>();

// Define los eventos que el componente puede emitir
const emit = defineEmits(['remove']);

const selectCategory = ref(null)
const model = ref('')
const urlErrorMessage = ref('')
const categoryItems = [
    'general',
    'readme',
    'tutorial',
    'FAQs',
    'examples of use cases',
    'installation guide',
    'build instructions',
    'API specification',
    'release policy',
    'contribution policy',
    'other',
]

onMounted(() => {
  selectCategory.value = props.item.type
  model.value = props.item.url
});

// Methods
const validateURL = (url: string): boolean => {
  const urlPattern =
    /^(https?:\/\/)?([a-z\d.-]+)\.([a-z]{2,6})([/\w .-]*)*\/?$/;
  return urlPattern.test(url);
};

const onInputChange = () => {
  if (validateURL(model.value)){
    urlErrorMessage.value = '';
    changeValue()
  }else{
    urlErrorMessage.value = 'Please enter a valid URL';
  }
}

const changeValue = () => {
  const newValue = {
    id: props.id,
    term: {
      type: selectCategory.value,
      url: model.value
    }
  };
  const payload = {
    field: props.field,
    index: props.index,
    value: newValue,
  };

  metadataStore.changeEntry(payload);
}

// Method to emit the ‘remove’ event
const emitRemove = () => {
  emit('remove', props.index);
};
</script>