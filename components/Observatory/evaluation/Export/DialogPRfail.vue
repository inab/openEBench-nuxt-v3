<template>
  <UModal 
    v-model="dialogPRfail" 
    prevent-close 
    :ui="{width:'w-96',overlay:{background:'bg-zinc-800/50'}}"
  >
    <div class="px-4 py-3">
      <div class="row">
        <h6>Making Pull Request</h6>
      </div>
      <div class="row">
        <UAlert
          color="red"
          variant="outline"
          title="ERROR"
          description="Something went wrong while making the pull request."
        />
      </div>

      <!-- Actions -->
      <div class="mt-2">
        <UButton 
          color="gray"
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

const dialogPRfail = computed (() => exportStore.getDialogPRfail)
const failMessage = computed (() => exportStore.getFailMessage)

// Methods
const close = () => {
  exportStore.updateDialogPRfail(false)
}
</script>