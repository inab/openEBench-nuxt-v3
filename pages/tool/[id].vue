<template>
  <div class="tool h-100">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />

    <div class="tool_item container">
      <div v-if="loading">Loading...</div>

      <template v-else>
        <h1>{{ tool?.label || tool?.name }}</h1>
        <p>{{ tool?.description }}</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import BreadcrumbsBar from '@/components/Common/BreadcrumbsBar.vue';
import { useToolStore } from '@/stores/tool';

const route = useRoute();
const toolStore = useToolStore();

const tool = computed(() => {
  const slug = decodeURIComponent(String(route.params.id));

  return toolStore.tools.find((item) => slug.endsWith(`-${item.id}`));
});

const loading = computed(() => toolStore.loading);

const routeArray = computed(() => [
  {
    label: 'Tools',
    route: '/tool',
    isActualRoute: false,
  },
  {
    label: tool.value?.label || tool.value?.name || '',
    isActualRoute: true,
  },
]);

onMounted(async () => {
  if (!toolStore.tools.length) {
    await toolStore.fetchTools();
  }
});
</script>
