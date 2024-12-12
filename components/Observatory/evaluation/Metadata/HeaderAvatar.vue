<template>
  <UTooltip :disabled="disabled_tooltip" 
    :text="field_name" class="text-right rtl:text-left" 
    :ui="{ background: 'bg-black bg-opacity-50', color: 'text-white',
      transition: {enterActiveClass: 'transition ease-out duration-300', leaveActiveClass: 'transition ease-in duration-150',}
    }"
  >
    <UIcon
      :name="metaState ? 'i-heroicons-check-circle-20-solid' : 'i-heroicons-minus-circle-20-solid'"
      class="w-5 h-5 ms-auto bg-gray-500"
      :class="[metaState ? 'bg-green-500' : 'bg-gray-300']"
    />
  </UTooltip>

</template>
<script setup lang="ts">
import { computed } from "vue";
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';
const metadataStore = useMetadataStore();

// PROPS
const props = defineProps<{
  field: String,
  field_name: String,
  disabled_tooltip:{
    type: Boolean,
    default: false,
	  required: false,
  },
}>();

// Computed
const toolMetadata = computed(() => metadataStore.getToolMetadata);
const metaState = true // Cambia esto dinámicamente según tu lógica

// Methods
const getMetadataState = (field)=> {

}

</script>
<style scoped>
</style>