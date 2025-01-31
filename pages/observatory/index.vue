<template>
    <div>
        <BreadcrumbsBar :breadcrumbs-array="breadcrumbs" />
        <div class="container">
            <UTabs v-model="activeTabIndex" :items="tabsItems" class="w-full"
                :ui="{ list: { tab: { active: 'text-primaryOeb-500' } } }">
                <!-- Tab Headers -->
                <template #default="{ item, index, selected }">
                    <div class="flex items-center gap-2 relative truncate"
                        @click="setActiveTab(index)">
                        <span>{{ item.label }}</span>
                        <span v-if="selected"
                            class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
                    </div>
                </template>


                <!-- Tab Contents -->
                <template #trends>
                    <div class="custom-tab">
                        <Trends />
                    </div>
                </template>
                <template #fairness>
                    <div class="custom-tab">
                        <FairnessScoreboard />
                    </div>
                </template>
                <template #fairsoft>
                    <div class="custom-tab">
                        <FAIRsoftEvaluator />
                    </div>
                </template>
                <template #data>
                    <div class="custom-tab">
                        <Data />
                    </div>
                </template>
                <template #about>
                    <div class="custom-tab">
                        <About />
                    </div>
                </template>
            </UTabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import tabsItems from "@/components/Header/HeaderMenu/subMenuEntriesObservatory.js";
import { activeTabIndex } from '@/components/Common/state.js';
import BreadcrumbsBar from '@/components/Common/BreadcrumbsBar.vue';
import Trends from '@/components/Observatory/trends/Trends.vue';
import FairnessScoreboard from '@/components/Observatory/fairness/FAIRness.vue';
import FAIRsoftEvaluator from '@/components/Observatory/evaluation/Evaluation.vue';
import Data from '@/components/Observatory/data/Data.vue';
import About from '@/components/Observatory/About.vue';



// Breadcrumbs
const breadcrumbs = ref([
    { label: "Observatory", isActualRoute: true },
    { label: tabsItems[activeTabIndex.value].label, isActualRoute: true },
]);

watch(activeTabIndex, (newIndex) => {
    breadcrumbs.value = [
        { label: "Observatory", isActualRoute: true },
        { label: tabsItems[newIndex]?.label || "Default", isActualRoute: true },
    ];
});

// Set active tab
function setActiveTab(index: number) {
    activeTabIndex.value = index; 
}

onMounted(() => {
    setActiveTab(activeTabIndex.value);

});
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