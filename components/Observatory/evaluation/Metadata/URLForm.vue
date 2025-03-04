<template>
  <div class="row mx-0">
    <UInput
      v-model="localValue"
      :label="label"
      :placeholder="label"
      class="border-1 rounded-md px-0 text-sm"
      :error-messages="urlErrorMessage"
      @input="onURLChange"
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
</template>

<script setup lang="ts">
import { ref } from 'vue';

// PROPS
const props = defineProps<{
  value: string; 
  label: string; 
  field: string;
  index: number; 
  id: number; 
}>();

// Define los eventos que el componente puede emitir
const emit = defineEmits(['remove', 'update']);

// Variables locales reactivas
const localValue = ref(props.value); // Copia local del valor
const urlErrorMessage = ref(''); // Mensaje de error para validación del URL

// Método para validar el formato de URL
const validateURL = (url: string): boolean => {
  const urlPattern =
    /^(https?:\/\/)?([a-z\d.-]+)\.([a-z]{2,6})([/\w .-]*)*\/?$/;
  return urlPattern.test(url);
};

// Método para manejar el cambio en el input y validar el URL
const onURLChange = () => {
  if (validateURL(localValue.value)) {
    urlErrorMessage.value = ''; // Limpia el mensaje de error si el URL es válido
    emit('update', {
      index: props.index,
      value: { id: props.id, term: localValue.value },
    });
  } else {
    urlErrorMessage.value = 'Please enter a valid URL'; // Muestra error si no es válido
  }
};

// Método para emitir el evento 'remove'
const emitRemove = () => {
  emit('remove', props.index); // Emite el índice del elemento a eliminar
};
</script>
