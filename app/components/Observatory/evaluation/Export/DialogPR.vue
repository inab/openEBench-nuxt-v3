<template>
  <UModal
    v-model:open="dialogPR"
    :dismissible="false"
    :close="false"
    :ui="{ content: 'w-96', overlay: 'bg-zinc-800/50' }"
  >
    <template #content>
      <div class="px-4 py-3">
        <h6>Making Pull Request</h6>
        <UProgress animation="carousel" />

        <!-- Actions -->
        <br>
        <div class="row me-3">
          <div class="flex justify-end my-3 ">
            <UButton
              color="gray"
              variant="soft"
              @click="cancelRequest"
              class="px-3 py-2"
            >
              Cancel
            </UButton>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useExport } from '~~/stores/observatory/evaluation/export';
const exportStore = useExport();

const dialogPR = computed({
  get: () => exportStore.getDialogPR,
  set: (value: boolean) => exportStore.updateDialogPR(value),
});

// Methods
const cancelRequest = () => {
  exportStore.cancelRequest()
}

</script>