<template>
  <div class="tool h-100">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />

    <div class="container">
      <h1>Tools</h1>

      <div v-if="loading">Loading...</div>

      <div v-else>
        <div v-for="tool in tools" :key="tool.id" class="mb-3">
          <NuxtLink :to="`/tool/${encodeURIComponent(tool.name)}-${tool.id}`">
            {{ tool.label || tool.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useToolStore } from '@/stores/tool';

import BreadcrumbsBar from '@/components/Common/BreadcrumbsBar.vue';

const toolStore = useToolStore();

const tools = computed(() => toolStore.tools);
const loading = computed(() => toolStore.loading);

onMounted(async () => {
  if (!toolStore.tools.length) {
    await toolStore.fetchTools();
  }
});

definePageMeta({
  layout: 'embed-iframe-full-width',
});

const routeArray = [
  {
    label: 'Tools',
    isActualRoute: true,
  },
];
</script>
