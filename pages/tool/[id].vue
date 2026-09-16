<template>
  <BreadcrumbsBar :breadcrumbs-array="routeArray" />

  <div class="container-fluid">
    <div class="row">

      <!-- SideBar -->
      <div class="col-3">
          <ul>
            <li>kgkfdnkglf</li>
          </ul>
        </div>

      <!-- Content -->
      <div class="col-7">
        <div v-if="loading">
          <USkeleton class="h-96" />
        </div>
        <div v-else>
          <!-- Introduccion de la tool -->
          <EntryIntro
            v-if="tool"
            :name="tool.label || tool.name"
            :description="tool.description || ''"
            :type="tool.type"
            :version="tool.version || []"
            :webpage="tool.webpage || []"
            :sources-labels="tool.sourcesLabels || {}"
          />
        </div>

      </div>

      <div class="col-2">
        <h2>FAIRsoft scores</h2>
      </div>

    </div>
    
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import BreadcrumbsBar from '@/components/Common/BreadcrumbsBar.vue';
import EntryIntro from '@/components/Tools/ToolEntry/EntryIntro.vue';
import { useToolStore } from '@/stores/tool';

const route = useRoute();
const toolStore = useToolStore();

// Tool la obtengo de tool_Entry

const tool = computed(() => {
  const slug = decodeURIComponent(String(route.params.id));

  return toolStore.tools.find((item) => slug.endsWith(`-${item.id}`));
});

const loading = computed(() => toolStore.loading.initialSearch);

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
    await toolStore.initialSearch();
  }
});
</script>

<style scoped>
.tool-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.tool-sidebar {
  min-width: 0;
}

.tool-content {
  min-width: 0;
}

@media (min-width: 960px) {
  .tool-layout {
    grid-template-columns: 220px minmax(0, 1fr);
    align-items: start;
  }
}
</style>