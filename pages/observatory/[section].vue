<template>
  <div>
    <BreadcrumbsBar :breadcrumbs-array="breadcrumbs" />

    <div class="container">
      <!-- Tabs -->
      <ul class="custom-tabs">
        <li v-for="(tab, index) in tabsItems" :key="tab.label">
          <button
            :class="{ active: activeTabIndex === index }"
            @click="setActiveTab(index)"
          >
            <span class="tab-icon">
              <UIcon :name="tab.icon" class="size-4" />
            </span>
            <span>{{ tab.label }}</span>
          </button>
        </li>
      </ul>

      <!-- Tab Contents -->
      <div class="custom-tab">
        <component :is="currentTabComponent" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'nuxt/app'
import tabsItems from "@/components/Header/HeaderMenu/subMenuEntriesObservatory.js"
import BreadcrumbsBar from '@/components/Common/BreadcrumbsBar.vue'
import Trends from '@/components/Observatory/trends/Trends.vue'
import FairnessScoreboard from '@/components/Observatory/fairness/FAIRness.vue'
import FAIRsoftEvaluator from '@/components/Observatory/evaluation/Evaluation.vue'
import Data from '@/components/Observatory/data/Data.vue'
import About from '@/components/Observatory/About.vue'
import { activeTabIndex } from '@/components/Common/state.js'

const route = useRoute()
const router = useRouter()

// Mapeo tab → componente
const tabComponents = [Trends, FairnessScoreboard, FAIRsoftEvaluator, Data, About]

// --- URL → Tab (cuando cambia la ruta)
watch(() => route.params.section, (section) => {
  const found = tabsItems.find(t => t.path.split("/")[1] === section)

  if (found) {
    activeTabIndex.value = found.index
  } else {
    router.replace("/observatory/Trends")
  }
}, { immediate: true })


// --- Tab → URL (cuando cambia la tab)
watch(activeTabIndex, (newIndex) => {
  const newRoute = `/${tabsItems[newIndex].path}`
  if (route.fullPath !== newRoute) {
    router.replace(newRoute)
  }
})

watch(activeTabIndex, (newIndex) => {
  breadcrumbs.value = [
    { label: "Observatory", isActualRoute: true },
    { label: tabsItems[newIndex]?.label || "Default", isActualRoute: true },
  ]
})

// Change tab
function setActiveTab(index: number) {
  activeTabIndex.value = index
}

// Computed for each tab's content
const currentTabComponent = computed(() => tabComponents[activeTabIndex.value])

// Breadcrumbs
const breadcrumbs = ref([
  { label: "Observatory", isActualRoute: true },
  { label: tabsItems[activeTabIndex.value].label, isActualRoute: true },
])
</script>

<style scoped>
/* Tab container */
.custom-tab {
  border: 1px solid rgba(243, 244, 246);
  border-radius: 0.5rem;
}

.custom-tabs {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  position: relative;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  padding: 0.25rem;
  height: 2.5rem;
  align-items: center;
  width: 100%;
  margin-bottom: 0.5rem;
}

/* Tab buttons */
.custom-tabs button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 2rem;
  padding: 0 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  color: #6b7280;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-out;
  z-index: 10;
}

/* Active tab */
.custom-tabs button:hover {
  color: #0b579f;
}
.custom-tabs button.active {
  color: #0b579f;
  background-color: #ffffff !important;
}

/* Icons within the tab */
.custom-tabs button .tab-icon {
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}
</style>
