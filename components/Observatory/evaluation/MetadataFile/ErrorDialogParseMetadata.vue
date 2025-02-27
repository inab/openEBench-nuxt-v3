<template>
  <div>
    <UModal v-model="errorDialogParseMetadata">
      <div class="p-4">
        <div class="pt-3 pb-3 pl-2 pr-2">
          <h6 class="mt-0 pt-0 text-h6"> Error </h6>
          <div class="mt-3">
            <div class="text-sm text-gray-500">
              {{ errorProgressText }}
            </div>
          </div>

          <div class="flex justify-end mt-4">
            <UButton label="Cancel" color="text-red-500" variant="ghost" size="md" 
            :ui="{color:{gray:{ghost:'text-gray-900 hover:bg-gray-100'}},}" 
            @click="cancelParse" />
          </div>
        </div>
      </div>
    </UModal>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useFileStore } from '@/stores/observatory/evaluation/file';
const fileStore = useFileStore();

// Obtain states in a reactive manner
const { errorDialogParseMetadata, errorProgressText } = storeToRefs(fileStore);

// Method to cancel parsing
const cancelParse = () => {
  fileStore.cancelParse();
};
</script>