<template>
  <div class="container mx-auto p-4">
    <UTabs :items="items" class="w-full" :ui="{list:{tab:{active:'text-primaryOeb-500'}}}">

    <template #item="{ item }">
      <UCard :ui="{shadow: 'shadow-none', divide: 'divide-none', body:{padding:'py-0 sm:p-2'}, header: {padding:'py-3'}}">
        <!-- Icon -->
        <template #icon="{ item, selected }">
          <span class="text-primaryOeb-500">{{ item.label }}</span>
          <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0 me-2 " :class="[selected && 'text-primaryOeb-500 bg-primaryOeb-500 dark:text-primary-400']" />
        </template>

        <!-- Header -->
        <template #header>
          <p class="mt-1 text-sm dark:text-gray-400">
            {{ item.description }}
          </p>
        </template>

        <!-- Content -->
        <div v-if="item.key === 'upload file'">
          <MetadataFileUpload/>
        </div>
        <div v-else-if="item.key === 'enter url'" class="space-y-3">
          <MetadataFileURL/>
        </div>
      </UCard>
    </template>
  </UTabs>

  <DialogParseMetadata />
  <ErrorDialogParseMetadata />

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import MetadataFileUpload from './MetadataFileUpload.vue'
import MetadataFileURL from './MetadataFileURL.vue'
import DialogParseMetadata from './DialogParseMetadata.vue'
import ErrorDialogParseMetadata from './ErrorDialogParseMetadata.vue'


// Item for tabs
const items = [{
  key: 'upload file',
  label: 'Upload File',
  icon: 'i-material-symbols-upload-2-rounded',
  description: 'Select a file from your computer to upload:'
}, {
  key: 'enter url',
  label: 'Enter Url',
  icon: 'i-ic-twotone-insert-link',
  description: 'Enter the URL of the metadata file:'
}]

</script>