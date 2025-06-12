<template>
  <div class="container px-5 mb-4">
    <div class="row">
      <UAlert class="py-4">
        <template #icon>
          <div class="bg-gray-100 w-16 h-16 rounded-full flex justify-center flex-wrap content-center">
            <UIcon :name="alert.icon" class="w-10 h-10 text-gray-400"/>
          </div>
        </template>
        <template #title>
          {{ alert.title }}
        </template>
        <template #description>
          <UDivider class="mb-4"/>

          <div class="row">
            <div class="col-10">
              {{  alert.description }}
            </div>
            <div class="col-2">
              <UButton class="bg-primaryOeb-600 px-3" @click="openDialog()"> {{ alert.iconText }}</UButton>
            </div>
          </div>

        </template>
      </UAlert>
    </div>
    <!--  -->

    <!-- Detailed results -->
  <div v-if="dialog" @click.self="closeDialog" 
    class="fixed z-30 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex center-text items-center justify-center">
    <div :class="['relative mx-auto p-4 border w-11/12 md:w-2/3 shadow-lg rounded-md bg-white', dialogAnimation] ">
      <h5 class="mb-4">Preview and Edit</h5>
      <UTextarea 
        color="primary" 
        variant="outline"
        autoresize
        v-model="jsonContent"
        resize
        class="border-1 textTextarea rounded-md border-primaryOeb-500 max-h-[50vh] overflow-y-auto mb-3"
      >
      
      </UTextarea>

      <!-- Actions -->
      <div class="flex justify-end gap-x-4">
        <UButton class="px-3" color="red" variant="soft" @click="discardChanges()"> Discard Changes</UButton>
        <UButton class="px-3" color="green" variant="soft" @click="saveJson()"> Save and Close</UButton>
      </div>
            
    </div>
  </div>

  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';

const metadataStore = useMetadataStore();
const props = defineProps<{
  metadata: object;
}>();

const alert = ref({
  title: 'Preview and Edit',
  id: 'preview',
  icon: 'i-mdi-eye-check-outline',
  description: 'Preview the metadata in JSON-LD format.',
  iconText: 'Preview',
});

const dialog = ref(false);
const dialogAnimation = ref('an1');
const jsonContent = ref(JSON.stringify(props.metadata, null, 2));

// Synchronise jsonContent with metadata when it changes
watch(() => props.metadata, (newValue) => {
  jsonContent.value = JSON.stringify(newValue, null, 2);
}, { deep: true });

const openDialog = () => {
  dialog.value = true;
};

const closeDialog = () => {
  dialogAnimation.value = 'an2';
  setTimeout(() => {
    dialog.value = false;
    dialogAnimation.value = 'an1';
  }, 10);
}

watch(dialog, (newValue) => {
  if (newValue) {
    dialogAnimation.value = 'an1';
  }
});

const discardChanges = () => {
  jsonContent.value = JSON.stringify(props.metadata, null, 2);
  dialog.value = false;
};

const saveJson = () => {
  try {
    const parsedJson = JSON.parse(jsonContent.value);
    metadataStore.updateToolMetadataJSONLD(parsedJson)
    dialog.value = false;
  } catch (error) {
    console.error('Invalid JSON format:', error);
  }
};
</script>
<style scoped>
.textTextarea {
  line-height: 0.9;
  font-size: 0.75rem; 
  font-family: monospace;
}

.an1 {
  animation: animationup 0.5s ease 0s 1 normal forwards;
}

@keyframes animationup {
  0% {
    transform: scale(0.5);
  }

  100% {
    transform: scale(1);
  }
}

.an2 {
  animation: animationDown 0.5s ease 0s 1 normal forwards;
}

@keyframes animationDown {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}
</style>