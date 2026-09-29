<template>
  <div class="tool-page">
  <BreadcrumbsBar :breadcrumbs-array="routeArray" />

  <div class="container-fluid">
    <div class="row">
      <!-- SideBar -->
      <div class="col-12 col-lg-3 d-none d-lg-block">
        <ToolSidebar v-if="hasTool" :items="sections" :active-id="activeSectionId" />
      </div>

      <!-- Content -->
      <div class="col-12 col-lg-7">
        <div v-if="loading">
          <USkeleton class="h-96" />
        </div>
        <div v-else-if="hasTool">
          <div class="mb-4">
            <EntryIntro
              :name="tool.label || tool.name"
              :description="tool.description || ''"
              :type="tool.type"
              :version="tool.version || []"
              :webpage="tool.webpage || []"
              :sources-labels="tool.sourcesLabels || {}"
            />
          </div>

          <section
            v-for="section in sections"
            :id="section.id"
            :key="section.id"
            class="tool-section card card-body mb-4"
          >
            <h2 class="h4 fw-bold mb-3">{{ section.title }}</h2>
            <!-- TODO (paso 8): componente real de cada sección -->
            <p class="text-muted mb-0">Contenido de {{ section.title }} pendiente.</p>
          </section>
        </div>
      </div>

      <div class="col-12 col-lg-2">
        <FAIRScores v-if="hasTool" :fairsoft="tool.fairsoft" />
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { navigateTo, createError, showError } from '#app';
import BreadcrumbsBar from '@/components/Common/BreadcrumbsBar.vue';
import EntryIntro from '@/components/Tools/ToolEntry/EntryIntro.vue';
import FAIRScores from '@/components/Tools/ToolEntry/FAIR/FAIRScores.vue'
import ToolSidebar from '@/components/Tools/ToolEntry/ToolSidebar.vue';
import { TOOL_SECTIONS } from '@/utils/toolSections';
import { useToolEntryStore } from '@/stores/tool_entry';

const route = useRoute();
const toolEntryStore = useToolEntryStore();

const sections = computed(() => TOOL_SECTIONS); // si no lo tienes ya
const activeSectionId = ref<string | null>(null);

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

function updateActiveSection() {
  const triggerLine = 100; // línea imaginaria cerca de arriba de la pantalla
  let current: string | null = null;

  for (const section of sections.value) {
    const el = document.getElementById(section.id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= triggerLine) {
      current = section.id;
    }
  }

  activeSectionId.value = current;
  console.log('activeSectionId:', current); // TEMPORAL, lo quitamos al final
}

onMounted(() => {
  window.addEventListener('scroll', updateActiveSection, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActiveSection);
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

.tool-page {
  --tool-sticky-top: 90px; /* altura de tu header + breadcrumbs */
}

.tool-section {
  min-height: 200px;
  scroll-margin-top: var(--tool-sticky-top);
}

@media (min-width: 960px) {
  .tool-layout {
    grid-template-columns: 220px minmax(0, 1fr);
    align-items: start;
  }
}
</style>
