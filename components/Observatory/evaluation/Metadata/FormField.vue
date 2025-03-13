<template>
  <div class="row mx-1 mt-2">
    <UInput
    v-model="model" 
    :label="label"
    :ui="{ base: 'peer' }"
    class="focus-within:ring-1 focus-within:ring-primaryOeb-500 focus-within:text-primaryOeb-500"
		:class="['border-1 rounded-md px-0', ...textClass]"
      @input="changeValue">
    
      <template #append>
        <button
          v-if="increasable"
          class="btn btn-outline-secondary3"
          @click="$emit('remove', index)"
        >
          <NUIcon name="mdi-close-circle" class="text-gray-500 text-sm"></NUIcon>
        </button>
      </template>
    </UInput>

  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';

const metadataStore = useMetadataStore();

// Props
const props = defineProps({
  item: {
    type: String,
    default: '',
  },
  index: {
    type: Number,
    default: 0,
  },
  id: {
    type: Number,
    default: 0,
  },
  increasable: {
    type: Boolean,
    default: true,
  },
  field: {
    type: String,
    default: '',
  },
  textClass: {
    type: Array,
    default: () => ['text-sm'],
  },
  label: {
    type: String,
    default: '',
  },
});

// State and logic
const model = ref('');

// onMounted
onMounted(() => {
  model.value = props.item;
});

// Methods
const changeValue = () => {
  const newValue = {
    id: props.id,
    term: model.value,
  };
  const payload = {
    field: props.field,
    index: props.index,
    value: newValue,
  };
  metadataStore.changeEntry(payload);

};
</script>