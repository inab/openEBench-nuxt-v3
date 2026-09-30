<template>
  <div class="tool-page">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />

    <ToolBrief
      v-if="hasTool"
      v-show="showToolBrief"
      :name="tool.label || tool.name"
      :type="tool.type"
      :version="tool.version || []"
      :webpage="tool.webpage || []"
      :sources-labels="tool.sourcesLabels || {}"
    />

    <div class="container-fluid">
      <div class="row">

        <!-- SideBar -->
        <div class="col-12 col-lg-3 d-none d-lg-block">
          <ToolSidebar
            v-if="hasTool"
            :items="sections"
            :active-id="activeSectionId"
          />
        </div>

        <!-- Content -->
        <div class="col-12 col-lg-7">
          <div v-if="loading">
            <USkeleton class="h-96" />
          </div>

          <div v-else-if="hasTool">
            <div class="mb-4">
              <EntryIntro
                ref="entryIntroRef"
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
              <h2 class="h4 fw-bold mb-3">
                {{ section.title }}
              </h2>

              <p class="text-muted mb-0">
                Contenido de {{ section.title }} pendiente.
              </p>
            </section>
          </div>
        </div>

        <!-- FAIR -->
        <div class="col-12 col-lg-2">
          <FAIRScores
            v-if="hasTool"
            :fairsoft="tool.fairsoft"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';

import { navigateTo, createError, showError } from '#app';

import BreadcrumbsBar from '@/components/Common/BreadcrumbsBar.vue';
import EntryIntro from '@/components/Tools/ToolEntry/EntryIntro.vue';
import ToolBrief from '@/components/Tools/ToolEntry/ToolBrief.vue';
import FAIRScores from '@/components/Tools/ToolEntry/FAIR/FAIRScores.vue';
import ToolSidebar from '@/components/Tools/ToolEntry/ToolSidebar.vue';

import { TOOL_SECTIONS } from '@/utils/toolSections';
import { useToolEntryStore } from '@/stores/tool_entry';

const route = useRoute();
const toolEntryStore = useToolEntryStore();

const sections = computed(() => TOOL_SECTIONS);

const activeSectionId = ref<string | null>(null);

const entryIntroRef = ref<HTMLElement | null>(null);
const showToolBrief = ref(false);

let entryIntroObserver: IntersectionObserver | null = null;

const tool = computed(() => toolEntryStore.Tool);
const loading = computed(() => toolEntryStore.Loading);

const hasTool = computed(() =>
  Boolean(tool.value?.label || tool.value?.name)
);

const routeArray = computed(() => [
  {
    label: 'Tools',
    route: '/tool',
    isActualRoute: false,
  },
  {
    label:
      (Array.isArray(tool.value?.label)
        ? tool.value.label[0]
        : tool.value?.label) ||
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

async function loadTool(toolParam: string) {
  const lastDash = toolParam.lastIndexOf('-');
  const tail =
    lastDash !== -1
      ? toolParam.slice(lastDash + 1)
      : '';

  if (!OBJECT_ID_RE.test(tail)) {
    const id = await toolEntryStore.resolveToolId({
      name: toolParam,
      source: 'biotools',
    });

    if (id) {
      await navigateTo(`/tool/${toolParam}-${id}`, {
        replace: true,
      });
    } else {
      showError(
        createError({
          statusCode: 404,
          statusMessage: 'Tool not found',
        })
      );
    }

    return;
  }

  const toolId = tail;
  const toolName = toolParam.slice(0, lastDash);

  let found;

  try {
    found = await toolEntryStore.retrieveTool({
      name: toolName,
      id: toolId,
    });
  } catch (e: unknown) {
    showError(
      createError({
        statusCode: getErrorStatus(e),
        statusMessage: 'Unable to load this tool',
      })
    );

    return;
  }

  if (found === false) {
    showError(
      createError({
        statusCode: 404,
        statusMessage: 'Tool not found',
      })
    );
  }
}

function setupEntryIntroObserver() {
  if (!entryIntroRef.value) return;

  entryIntroObserver?.disconnect();

  entryIntroObserver = new IntersectionObserver(
    ([entry]) => {
      showToolBrief.value = !entry.isIntersecting;
    },
    {
      root: null,
      rootMargin: '-64px 0px 0px 0px',
      threshold: 0,
    }
  );

  entryIntroObserver.observe(entryIntroRef.value);
}

function updateActiveSection() {
  const triggerLine = 100;
  let current: string | null = null;

  for (const section of sections.value) {
    const el = document.getElementById(section.id);

    if (!el) continue;

    if (el.getBoundingClientRect().top <= triggerLine) {
      current = section.id;
    }
  }

  activeSectionId.value = current;
}

onMounted(async () => {
  await loadTool(
    decodeURIComponent(String(route.params.id))
  );

  await nextTick();

  setupEntryIntroObserver();
  updateActiveSection();

  window.addEventListener(
    'scroll',
    updateActiveSection,
    { passive: true }
  );
});

watch(
  () => route.params.id,
  async (newId) => {
    if (!newId) return;

    showToolBrief.value = false;

    await loadTool(
      decodeURIComponent(String(newId))
    );

    await nextTick();

    setupEntryIntroObserver();
    updateActiveSection();
  }
);

onBeforeUnmount(() => {
  window.removeEventListener(
    'scroll',
    updateActiveSection
  );

  entryIntroObserver?.disconnect();
  entryIntroObserver = null;
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
