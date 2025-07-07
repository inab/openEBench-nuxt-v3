<template>
  <div class="mb-2 pb-2">
    <h4 class="fw-bold mb-3">Documentation Types & Formats</h4>
    <p class="mb-4">Overview of documentation types and their availability in different formats across the collection.</p>
    <DocumentationPlot :data="documentation" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useTrends } from '../../../../stores/observatory/trends.js';
import DocumentationPlot from './DocumentationPlot.vue';

const trends = useTrends();

onMounted(async () => {
  await trends.getDocumentation();
});

const documentation = computed(() => trends.Documentation.data);

</script>

<script lang="ts">
export default {
  name: 'DocumentationMain'
};
</script>
