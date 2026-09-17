<template>
  <div>
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
              v-if="hasTool"
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { navigateTo, createError, showError } from '#app';
import BreadcrumbsBar from '@/components/Common/BreadcrumbsBar.vue';
import EntryIntro from '@/components/Tools/ToolEntry/EntryIntro.vue';
import { useToolEntryStore } from '@/stores/tool_entry';

const route = useRoute();
const toolEntryStore = useToolEntryStore();

//
const tool = computed(() => toolEntryStore.Tool);
const loading = computed(() => toolEntryStore.Loading);
const hasTool = computed(() => Boolean(tool.value?.label || tool.value?.name));

const routeArray = computed(() => [
  {
    label: 'Tools',
    route: '/tool',
    isActualRoute: false,
  },
  {
    label:
      (Array.isArray(tool.value?.label) ? tool.value.label[0] : tool.value?.label) ||
      tool.value?.name ||
      '',
    isActualRoute: true,
  },
]);

const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

function getErrorStatus(error: unknown) {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'status' in error.response
  ) {
    return Number(error.response.status) || 500;
  }
  return 500;
}

// Función para obtener los datos.
async function loadTool(toolParam: string) {
  const lastDash = toolParam.lastIndexOf('-');
  const tail = lastDash !== -1 ? toolParam.slice(lastDash + 1) : '';

  if (!OBJECT_ID_RE.test(tail)) {
    const id = await toolEntryStore.resolveToolId({ name: toolParam, source: 'biotools' });
    if (id) {
      await navigateTo(`/tool/${toolParam}-${id}`, { replace: true });
    } else {
      showError(createError({ statusCode: 404, statusMessage: 'Tool not found' }));
    }
    return;
  }

  const toolId = tail;
  const toolName = toolParam.slice(0, lastDash);

  let found;
  try {
    found = await toolEntryStore.retrieveTool({ name: toolName, id: toolId });
  } catch (e: unknown) {
    // Solo entra aquí si retrieveTool lanzó una excepción real (red, parseo, etc.)
    showError(
      createError({
        statusCode: getErrorStatus(e),
        statusMessage: 'Unable to load this tool',
      })
    );
    return;
  }

  if (found === false) {
    // Entra aquí si la API respondió pero el tool no existe / no tiene forma válida
    showError(createError({ statusCode: 404, statusMessage: 'Tool not found' }));
  }
}

// onMounted
onMounted(async () => {
  await loadTool(decodeURIComponent(String(route.params.id)));
});

// Watch
watch(
  () => route.params.id,
  (newId) => {
    if (newId) loadTool(decodeURIComponent(String(newId)));
  }
);
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
