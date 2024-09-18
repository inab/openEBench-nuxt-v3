<template>
  <div class="container ms-3" :class="n_cols">
    <div class="d-flex align-items-center mt-2">
      <HeaderAvatar
        :field="field"
        :field_name="title"
        :disabled_tooltip="true"
      />
      <span class="text-body title ms-2">{{ title }}</span>
    </div>
    
    <UCheckbox 
      v-model="localItem" 
      :color="color"
      class="mt-3 mx-4 animated-checkbox"
      @update:model-value="changeValue"
    >
      <template #label>
        <span class="ms-1">{{ label }}</span>
      </template>
    </UCheckbox>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import HeaderAvatar from "@/components/Observatory/evaluation/Metadata/HeaderAvatar.vue";
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';

const metadataStore = useMetadataStore();

// PROPS
const props = defineProps<{ 
  title: string,
  field: string,
  label: string,
  n_cols: string,
  color: string,
  item: boolean,
}>();

const emit = defineEmits(['update:item']);

// Local copy of the value prop
const localItem = ref(props.item);

// Watch for external changes to keep in sync
watch(() => props.item, (newVal) => {
  localItem.value = newVal;
});

// Emit changes when the checkbox is toggled
const changeValue = () => {
  const payload = {
    field: props.field,
    value: localItem.value,
  };
  metadataStore.changeBooleanEntry(payload);
  emit('update:item', localItem.value);
};
</script>

<style scoped>
.title {
  font-size: 1rem !important;
  color: #0b579f !important;
}

:deep(input[type="checkbox"]) {
  transition: transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out;
}

:deep(input[type="checkbox"]:hover) {
  animation: ripple 0.5s linear;
}

:deep(input[type="checkbox"]:checked) {
  transform: scale(1.1);
}

/* Efecto de onda */
@keyframes ripple {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  100% {
    box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
  }
}
</style>
