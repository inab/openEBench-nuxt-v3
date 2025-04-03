<template>
  <UModal 
    v-model="dialogPRfail" 
    prevent-close 
    :ui="{width:'w-96',overlay:{background:'bg-zinc-800/50'}}"
  >
    <div class="px-4 py-3">
      <div class="row mb-2">
        <h6>Making Pull Request</h6>
      </div>
      <div class="row">
        <UAlert
          color="red"
          variant="outline"
          title="ERROR"
          description="Something went wrong while making the pull request."
          class="py-2 px-3"
        />
      </div>

      <!-- Actions -->
      <div class="mt-2 flex justify-end">
        <UButton 
          color="gray"
          variant="ghost"
          @click="close" 
          class="mt-2 text-black bg-gray-100"
          :ui="{color: { gray: {ghost:'hover:bg-gray-200'}}}"
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

const dialogPRfail = computed (() => exportStore.getDialogPRfail)
const failMessage = computed (() => exportStore.getFailMessage)

// Methods
const close = () => {
  exportStore.updateDialogPRfail(false)
}
</script>