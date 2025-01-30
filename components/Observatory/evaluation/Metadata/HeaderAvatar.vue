<template>
  <UTooltip :style="{ pointerEvents: disabled_tooltip ? 'none' : 'auto' }" 
    :text="field_name" class="text-right rtl:text-left" 
    :ui="{ background: 'bg-black bg-opacity-50', color: 'text-white',
      transition: {enterActiveClass: 'transition ease-out duration-300', leaveActiveClass: 'transition ease-in duration-150',}
    }"
  >
    <UIcon
      :name="metaState ? 'i-heroicons-check-circle-20-solid' : 'i-heroicons-minus-circle-20-solid'"
      class="w-5 h-5 ms-auto bg-gray-400 mx-2"
      :class="[metaState ? 'bg-green-500' : 'bg-gray-400']"
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
const metaState = computed(() => getMetadataState(props.field));

// Methods
const getMetadataState = (field)=> {
  let state = false;
  switch (typeof toolMetadata.value[field]) {
    case 'boolean': {
      state = toolMetadata.value[field];
      break;
    }

    case 'string': {
      state = toolMetadata.value[field];
      break;
    }

    case 'object': {
      const array = Array.isArray(toolMetadata.value[field]);
      if (array) {
        if (toolMetadata.value[field].length > 0){
          state = !!toolMetadata.value[field][0];
        }else{
					state = false;
        }
      }else{
        console.log(
          'Unknown type of field',
          field,
          typeof toolMetadata.value[field],
          toolMetadata.value[field]
        );
      }
        break;
    }

    default:
      console.log (
        'Unknown type of field',
        field,
        typeof toolMetadata.value[field],
        toolMetadata.value[field]
      );
  }
  return state;
}

</script>
<style scoped>
</style>