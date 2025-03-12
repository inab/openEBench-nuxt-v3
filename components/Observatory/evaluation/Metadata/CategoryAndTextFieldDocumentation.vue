<template>
  <div class="row mx-1 mt-4">
    <!-- Type -->
  <div class="col-4 relative" 
    @focusin="isFocusedSelect = true"
    @focusout="isFocusedSelect = false"
  >
    <span class="floatingLabel absolute top-[-10px] bg-white text-xs ms-2 px-1 "
    :class="{ 'text-primaryOeb-500': isFocusedSelect }">
    {{ vocabularyLabel }}</span>
    <USelectMenu
      v-model="selectCategory"
      :options="categoryItems"
      :label="vocabularyLabel"
      placeholder=""
      class="border rounded-md px-0 w-full peer"
      :class="{ 'border-primaryOeb-500 ring-1 ring-primaryOeb-500': isFocusedSelect }"
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

  <!-- URL -->
  <div class="col-7">
    <UInput
      v-model="model"
      placeholder=""
      :ui="{ base: 'peer' }"
      class="border-1 rounded-md px-0 text-sm"
      :class="{
        'border-red-500 ring-red-500': urlErrorMessage, // If error → Red
        ' focus-within:ring-primaryOeb-500 focus-within:border-primaryOeb-500 focus-within:text-primaryOeb-500': !urlErrorMessage // If NO error → Blue
      }"
      @update:modelValue="onInputChange"
    >
      <!-- Floating Label -->
      <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-dimmed) text-xs px-1.5 transition-all peer-focus:-top-2.5 
        peer-focus:text-xs peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5"
      >
        <span class="inline-flex bg-white px-1" :class="{ 'text-red-500': urlErrorMessage }">
          {{ textLabel }}
        </span>
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
const isFocusedSelect = ref(false);

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
<style scoped>
.floatingLabel{
  z-index: 1;
  transition: all 0.2s ease-in-out;
}
</style>