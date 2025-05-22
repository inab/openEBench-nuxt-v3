<template>
  <UModal v-model="dialogPRok" 
    prevent-close 
    :ui="{width:'w-96',overlay:{background:'bg-zinc-800/50'}}"
  >
    <div class="px-4 py-3">
      <div class="row flex justify-center">
        <div class="col-2">
          <UIcon name="i-heroicons-check-circle " class="w-8 h-8 bg-green-500 my-2" />
        </div>
      </div>
      <div class="row flex justify-center">
        <div class="col-12">
          <h6 class="text-center my-2">Pull Request Created</h6>
        </div>
        <div class="col-2 flex justify-center">
          <UButton 
            color="gray"
            variant="ghost"
            @click="openPRinGH()" 
            class="mt-3 px-3 text-black bg-gray-100"
            :ui="{color: { gray: {ghost:'hover:bg-gray-200'}}}"
          >
            See in repository
          </UButton>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-2 flex justify-end">
        <UButton 
          color="green"
          variant="soft"
          @click="close" 
          class="mt-2"
        >
          Close
        </UButton>
      </div>
    </div>
  </UModal>

</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useExport } from '@/stores/observatory/evaluation/export';
const exportStore = useExport();

const dialogPRok = computed (() => exportStore.getDialogPRok)
const okURL = computed (() => exportStore.getOkURL)

// Methods
const close = () => {
  exportStore.updateDialogPRok(false)
}
const openPRinGH = () => {
  if (!okURL.value) {
    console.error('okURL no está definido o es nulo');
    return;
  }

  window.open(okURL.value, '_blank');
};


</script>