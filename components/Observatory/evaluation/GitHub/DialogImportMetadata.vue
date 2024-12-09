<template>
  <div>
    <UModal v-model="githubStore.dialogImportMetadata">
      <div class="p-4">
        {{ githubStore.importError }}
        <div v-if="githubStore.importError" class="pt-3 pb-3 pl-2 pr-2">
          <h6 class="mt-0 pt-0 text-h6">Importing metadata</h6>
          <div class="mt-3">
            <!-- Progress -->
            <UProgress animation="carousel" color="red" size="sm"/>
            <div class="error--text text-body-2 mt-2 flex items-center">
              <UIcon name="mdi-alert" class="text-red-500 mr-2" />
              <span>Something went wrong: {{ githubStore.importProgressText }}</span>
            </div>
          </div>
          <div class="flex justify-end mt-4">
            <UButton label="Close" @click="cancelImport" />
          </div>
        </div>

        <div v-else class="pt-3 pb-3 pl-2 pr-2">
          <h6 class="mt-0 pt-0 text-h6">Importing metadata</h6>
          <div class="mt-3">
            <!-- Progress -->
            <UProgress animation="carousel" :ui="{indicator:{color:'text-primaryOeb-500'}}" size="sm"/>
            <div class="text-sm" style="color: #1565c0">
              {{ githubStore.importProgressText }}
            </div>
          </div>
          <div class="flex justify-end mt-4">
            <UButton label="Cancel" @click="cancelImport" />
          </div>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useGithub } from '@/stores/observatory/evaluation/github';

const githubStore = useGithub();

const cancelImport = () => {
  githubStore.cancelImport();
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
