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
              <UButton class="bg-primaryOeb-600 px-3" @click="download()"> {{ alert.iconText }}</UButton>
            </div>
          </div>

        </template>
      </UAlert>
    </div>
  </div>

</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';
const metadataStore = useMetadataStore();

const fileName = ref('CITATION.cff');
const alert = ref({
  title: 'Download Citation',
  id: 'download',
  icon: 'i-material-symbols-download-2-rounded',
  description: 'Click "Download" to save the citation file in JSON-LD format to your device.',
  iconText: 'Download',
});

const toolMetadataCFF = computed(() => metadataStore.getToolMetadataCFF);

// Methods
const download = () => {
  const yaml = toolMetadataCFF.value;

  if (!yaml) {
    console.error("No hay contenido YAML para descargar.");
    return;
  }

  const blob = new Blob([yaml], { type: 'text/yaml' });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName.value);
  
  document.body.appendChild(link);
  link.click();
  
  URL.revokeObjectURL(url);
  document.body.removeChild(link);
};
</script>