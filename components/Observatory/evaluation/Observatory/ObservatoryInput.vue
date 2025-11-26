<template>
  <div class="container mx-auto p-4">
    <form @submit.prevent="submitObservatoryTool">
      <div class="row justify-center mb-3">
        <div class="col-10">
          <p class="text-sm">Select a tool from the Software's Observatory Database:</p>
        </div>
      </div>

      <div class="row justify-center mb-4 relative">
        <div class="col-10">
          <div v-if="observatoryStore.loadingAutocomplete" class="form-group w-full items-center">
            <USkeleton class="h-12 w-full rounded-md" />
          </div>

          <div v-else class="form-group relative">
            <label :class="labelClasses">Tool</label>
            <div class="flex items-center gap-2 mt-2">
              <UIcon name="mdi-database" class="text-gray-500 text-2xl" :class="iconClass" />

              <USelectMenu
                v-model="selectedTool"
                v-model:query="searchQuery"
                :options="filteredVisibleOptions"
                option-attribute="label"
                clear-search-on-close
                searchable
                :popper="{ offsetSkid: 8 }"
                @focus="onFocus"
                :onClose="handleClose"

                class="peer w-full flex items-center h-12 max-h-12 rounded-md border-1 text-sm px-2 pl-10 focus-within:ring-primaryOeb-500 focus-within:border-primaryOeb-500 focus-within:text-primaryOeb-500"
              >
                <template #label>
                  <UBadge v-if="selectedTool" variant="solid" class="bg-blue-100 text-black">
                    <template #trailing>
                      <span>{{ selectedTool.label }}</span>
                      <!-- Siguiente cambio -->
                      <!-- Si hay array types -->
                      <template v-if="Array.isArray(selectedTool.types) && selectedTool.types.length">
                        <UBadge
                          v-for="(t, i) in selectedTool.types"
                          :key="i"
                          variant="solid"
                          class="bg-white text-black font-light text-uppercase ml-1"
                        >
                          {{ t }}
                        </UBadge>
                      </template>

                      <!-- Si NO hay types, usar type actual -->
                      <UBadge
                        v-else-if="selectedTool.type"
                        variant="solid"
                        class="bg-white text-black font-light text-uppercase ml-1"
                      >
                        {{ selectedTool.type }}
                      </UBadge>

                    </template>
                  </UBadge>

                </template>

                <!-- Option rendering -->
                <template #option="{ option }">
                  <UBadge variant="solid" class="bg-blue-100 text-black">
                    <template #trailing>
                      <span>{{ option.label }}</span>
                      <!-- Siguiente cambio -->
                      <!-- Si hay array types -->
                      <template v-if="Array.isArray(option.types) && option.types.length">
                        <UBadge
                          v-for="(t, i) in option.types"
                          :key="i"
                          variant="solid"
                          class="bg-white text-black font-light text-uppercase ml-1"
                        >
                          {{ t }}
                        </UBadge>
                      </template>

                      <!-- Si NO hay types, usar type -->
                      <UBadge
                        v-else-if="option.type"
                        variant="solid"
                        class="bg-white text-black font-light text-uppercase ml-1"
                      >
                        {{ option.type }}
                      </UBadge>

                    </template>
                  </UBadge>
                </template>

                
                <template #trailing>              
                  <!-- Chevron icon -->
                  <UIcon
                    name="i-heroicons-chevron-down-20-solid"
                    class="w-5 h-5 transition-transform transition-colors"
                    :class="[
                      isFocused ? 'text-primaryOeb-500 rotate-180' : 'text-gray-400 rotate-0'
                    ]"
                  />
                </template>
              </USelectMenu>
                  
              <!-- Clear selection button -->
              <UButton
                v-if="selectedTool"
                color="white" variant="solid"
                @click.stop="selectedTool = null"
                class="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600"
              >
                <UIcon name="i-heroicons-x-circle-16-solid" class="w-5 h-5" />
              </UButton>

            </div>
          </div>
        </div>
      </div>

      <!-- Buttons next steps -->
      <div class="row justify-center">
        <div class="col-10 text-right">
          <UButton class="mr-2" color="gray" variant="ghost" size="md" @click="goBack">Back</UButton>
          <UButton
            class="mr-2 bg-primaryOeb-500"
            variant="solid"
            size="md"
            :disabled="!selectedTool"
            @click="submitObservatoryTool"
          >
            Continue
          </UButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useStepperStore } from '@/stores/observatory/evaluation/index';
import { useObservatoryStore } from '@/stores/observatory/evaluation/observatory';

const observatoryStore = useObservatoryStore();
const stepperStore = useStepperStore();
const observatoryTools = computed(() => observatoryStore.ObservatoryToolsNameTypeSources || []);

const CHUNK = 20;
const COOLDOWN_MS = 250;

const selectedTool = ref<any | null>(null);
const selectedToolLabel = computed(() => {
  return selectedTool.value?.name || '';
});
const selectedToolType = computed(() => {
  // Nuevo sistema (array)
  // if (Array.isArray(selectedTool.value?.types)) return selectedTool.value.types;
  
  // TODO: eliminar cuando type deje de existir
  return selectedTool.value?.type || '';
});

const searchQuery = ref('');
const maxVisible = ref(CHUNK);
const isFocused = ref(false);
let loadingMore = false;

const allFilteredBySearch = computed(() => {
  const all = observatoryTools.value ?? [];
  const q = (searchQuery.value || '').trim().toLowerCase();
  if (!q) return all;
  return all.filter((opt: any) => {
    const label = (opt.label ?? opt.name ?? '').toString().toLowerCase();
    const type = (opt.type ?? '').toString().toLowerCase();
    return label.includes(q) || type.includes(q);
  });
});

const filteredVisibleOptions = computed(() => {
  return allFilteredBySearch.value.slice(0, maxVisible.value);
});

// Carga inicial
onMounted(async () => {
  await observatoryStore.getObservatoryToolsNameTypeSources();
});

// Infinite scroll
let menuElement: HTMLElement | null = null;
let observer: MutationObserver | null = null;
let scrollHandler: ((e: Event) => void) | null = null;
let inputListenerCleanup: (() => void) | null = null;

const selectorsToTry = [
  '.u-input-menu-panel',
  '.u-input-menu__panel',
  '.u-input-menu-panel__wrapper',
  '.u-select__menu',
  '.u-menu-panel',
  '[role="listbox"]',
  '[role="menu"]',
];

const findExistingPanel = (): HTMLElement | null => {
  for (const sel of selectorsToTry) {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (el) return el;
  }
  return document.querySelector('div[role="listbox"], div[role="menu"]') as HTMLElement | null;
};

const attachScrollToMenu = (el: HTMLElement) => {
  if (!el) return;
  detachScrollFromMenu();

  scrollHandler = () => {
    if (loadingMore) return;
    if (!el) return;
    const nearBottom = el.scrollTop + el.clientHeight >= (el.scrollHeight - 60);
    if (nearBottom) {
      const total = allFilteredBySearch.value.length;
      if (maxVisible.value >= total) return;
      loadingMore = true;
      maxVisible.value = Math.min(total, maxVisible.value + CHUNK);
      setTimeout(() => {
        loadingMore = false;
      }, COOLDOWN_MS);
    }
  };

  el.addEventListener('scroll', scrollHandler, { passive: true });
  menuElement = el;
};

const detachScrollFromMenu = () => {
  if (menuElement && scrollHandler) {
    menuElement.removeEventListener('scroll', scrollHandler);
  }
  menuElement = null;
  scrollHandler = null;
};

const startObservingForPanel = () => {
  if (observer) return;
  observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const n of Array.from(m.addedNodes)) {
        if (!(n instanceof HTMLElement)) continue;
        if (n.matches && selectorsToTry.some(s => n.matches?.(s))) {
          nextTick(() => attachScrollToMenu(n as HTMLElement));
          return;
        }
        if (n.querySelector && n.querySelector('[role="listbox"], [role="menu"], .u-input-menu__panel, .u-input-menu-panel')) {
          const panel = (n.querySelector('[role="listbox"]') as HTMLElement)
                      || (n.querySelector('.u-input-menu__panel') as HTMLElement)
                      || (n as HTMLElement);
          if (panel) {
            nextTick(() => attachScrollToMenu(panel));
            return;
          }
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
};

// Focus & Blur
const onFocus = async () => {
  isFocused.value = true;
  await nextTick();
  const existing = findExistingPanel();
  if (existing) attachScrollToMenu(existing);
  startObservingForPanel();
  await nextTick();
};
const handleClose = () => {
  isFocused.value = false;
};


watch(searchQuery, () => {
  maxVisible.value = CHUNK;
});

// ------------------ Navegación / UI helpers ------------------
const goBack = () => stepperStore.goBack(1);
const submitObservatoryTool = async () => {
  if (!selectedTool.value) return;

  const payload = {
    name: selectedToolLabel.value,
    // Siguiente cambio.
    // Despues tendre que eliminar esta linea porque el endpoint solo recibira el name.
    type: selectedToolType.value,
  };

  // Get metadata
  await observatoryStore.fetchToolMetadata(payload);

  // Proceed to the next step
  stepperStore.completeStep(1);
};


// Dynamic classes
const labelClasses = computed(() => {
  let base = 'absolute left-9 transition-all bg-white dark:bg-gray-900 px-1 z-10';

  if (isFocused.value) {
    return [
      base,
      'top-2 text-sm text-primaryOeb-600 transform scale-75 -translate-y-5'
    ];
  } else if (selectedTool.value) {
    return [
      base,
      'top-2 text-sm text-gray-500 transform scale-75 -translate-y-5'
    ];
  } else {
    return [
      base,
      'top-3 text-base text-gray-500 scale-100'
    ];
  }
});

const iconClass = computed(() => [
  'text-gray-500 transition-colors',
  { 'text-primaryOeb-500': isFocused.value }
]);
</script>

<style>
.clearButton{
  position: absolute;
  transform: translateX(-80px);
}

.u-input-menu input {
  caret-color: black; /* cursor visible */
}
</style>