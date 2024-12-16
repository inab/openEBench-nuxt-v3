<template>
  <div>
    <BreadcrumbsBar />
    <div class="container">
      <UTabs 
        :items="tabsItems" 
        class="w-full" 
        :ui="{ list: { tab: { active: 'text-primaryOeb-500' } } }"
        :defaultIndex="activeTabIndex"
      >
        <template #default="{ item, index, selected }">
          <div class="flex items-center gap-2 relative truncate w-full" @click="setActiveTab(index, item.path)">
            <span>{{ item.label }}</span>
            <span v-if="selected"
              class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
          </div>
        </template>

        <!-- Slots para el contenido -->
        <template #trends>
          <div class="custom-tab">
            <slot/>
          </div>
        </template>
        <template #fairness>
          <div class="custom-tab">
            <slot/>
          </div>
        </template>
        <template #fairsoft>
          <div class="custom-tab">
            <slot/>
          </div>
        </template>
        <template #data>
          <div class="custom-tab">
            <slot/>
          </div>
        </template>
        <template #about>
          <div class="custom-tab">
            <slot/>
          </div>
        </template>
      </UTabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";

const router = useRouter();
const route = useRoute();

const tabsItems = [
  {
    label: "Trends",
    icon: "i-charm-chart-line",
    slot: "trends",
    path: "/observatory/Trends"
  },
  {
    label: "FAIRness Scoreboard",
    icon: "i-charm-disc",
    slot: "fairness",
    path: "/observatory/FAIRness"
  },
  {
    label: "FAIRsoft Evaluator",
    icon: "i-cil-check-circle",
    slot: "fairsoft",
    path: "/observatory/Evaluation"
  },
  {
    label: "Data",
    icon: "i-dashicons-database",
    slot: "data",
    path: "/observatory/Data"
  },
  {
    label: "About",
    icon: "i-zondicons-information-solid",
    slot: "about",
    path: "/observatory/About"
  },
];


const activeTabIndex = ref(0);
function setActiveTab(index:number, path:string) {
  activeTabIndex.value = index; 
  router.push(path);
}

watch(route, (newRoute) => {
  activeTabIndex.value = tabsItems.findIndex(item => item.path === newRoute.path);
});

activeTabIndex.value = tabsItems.findIndex(item => item.path === route.path);

</script>

<style scoped>
.nuxt-link-active {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
}

.custom-tab {
  border: 1px solid rgba(243, 244, 246);
  border-radius: 0.5rem;
}
</style>
