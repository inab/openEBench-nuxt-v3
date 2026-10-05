<template>
  <UModal
    v-model:open="dialogPRfail"
    :close="false"
    :ui="{ content: 'w-96', overlay: 'bg-zinc-800/50' }"
  >
    <template #content>
      <div class="px-4 py-3">
        <div class="row mb-2">
          <h6>Making Pull Request</h6>
        </div>
        <div class="row">
          <UAlert
            color="red"
            variant="outline"
            title="ERROR"
            :description="failMessage || 'Something went wrong while making the pull request.'"
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
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useExport } from '~~/stores/observatory/evaluation/export';
const exportStore = useExport();

const dialogPRfail = computed({
  get: () => exportStore.getDialogPRfail,
  set: (value: boolean) => exportStore.updateDialogPRfail(value),
});
const failMessage = computed (() => exportStore.getFailMessage)

// Methods
const close = () => {
  exportStore.updateDialogPRfail(false)
}
</script>