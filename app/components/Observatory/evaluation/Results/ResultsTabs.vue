<template>
  <div class="container px-5 my-5">
    <UTabs :items="items" class="w-full" :ui="{list:{tab:{active:'text-primaryOeb-500'}}}" >
    <template #item="{ item }">
      <div v-if="item.component === 'FAIRresults'">
        <FAIRresults/>
      </div>
      <div v-else-if="item.component === 'MetadataActions'">
        <MetadataActions/>
      </div>
      <div v-else-if="item.component === 'CitationActions'">
        <CitationActions/>
      </div>
    </template>      
    </UTabs>
  </div>
</template>
<script setup lang="ts">
import FAIRresults from './FAIRresults.vue';
import MetadataActions from './MetadataActions.vue';
import CitationActions from './CitationActions.vue';

// Item for tabs
const items = [
  {
    label: 'FAIRsoft Indicators',
    component: 'FAIRresults',
  }, 
  {
    label: 'Metadata',
    component: 'MetadataActions',
  },
  {
    label: 'Citation',
    component: 'CitationActions',
  }
]

</script>