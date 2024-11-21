<template>
  <div class="shadow-md pt-6 pb-4 d-flex flex-column justify-space-between"
    min-height="320"
    max-height="320"
    min-width="230"
    max-width="320">

    <div class="flex items-center flex-col">
      <div class="my-4 relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-400 rounded-full dark:bg-gray-600">
        <UIcon :name="icon" class="text-white text-2xl" />
      </div>
      <div class="font-medium text-base">
        {{ title }}
      </div>
      <div>
        <p class="mt-3 text-center text-sm" v-html="description"></p>
      </div>
      <div>
        <button class="btn btn-primary mr-2 px-3 py-1 shadow-md" @click="selectSource">Select</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// PROPS
const props = defineProps<{
  title: String,
  description: String,
  source: String,
  icon: String,
}>();

const emit = defineEmits(['sourceSelected']);

function selectSource() {
  // Emitir el evento para avanzar al siguiente paso
  emit('sourceSelected', props.source);
}
</script>
