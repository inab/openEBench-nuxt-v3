<template>
    <div class="relative">
        <!-- Options Button -->
        <PlotWOptions class="copy-icon" :items="dialogItems" :currentCollection="current_collection" />
        <!-- Versioning  Header -->
        <div class="text-center mt-4">
            <h6 class="text-2xl font-semibold">Versioning</h6>
            <p class="text-sm mt-4 text-gray-700">
                Following a specific set of rules for naming software releases allows its
                inequivocal identification, which increases its
                <span class="highlight">Findability</span>,
                <span class="highlight">Reusability</span> and guarantees the
                <span class="highlight">Reproducibility</span> of research results.
            </p>
        </div>
        <div>
            <div v-if="isSemanticVersioningLoading">
                <USkeleton class="h-52 mb-3 mx-10" />
            </div>
            <VersioningPlot v-else :labels="dataVersioningLabels" :values="dataVersioningValues" />
        </div>
        <p class="mt-4 mb-2 ml-8">
            <span class="text-sm highlight"> Software using semantic versioning</span>
        </p>
        <!-- Alert -->
        <div class="flex items-center mt-8 mx-4 p-2 border-l-4 rounded border-blue-700">
            <!-- Icon -->
            <UIcon name="i-material-symbols-menu-book-rounded" class="w-7 h-7 icon" />
            <!-- Text -->
            <div>
                <span class=" ml-4 text-sm ">
                    Specification of Semantic Versioning
                    <a href="https://github.com/semver/semver" target="_blank" class="underline hover:text-blue-900">
                        here
                    </a>
                </span>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, computed } from 'vue';
import VersioningPlot from './VersioningPlot.vue';
import { useTrends } from '@/stores/observatory/trends';
import { useObservatory } from '@/stores/observatory/index.js';
import PlotWOptions from '~/components/Observatory/PlotWOptions.vue';
import { embedCodes } from '~/components/Observatory/visualizations/embedCodes.js';
// Store
const store = useTrends();
const observatoryStore = useObservatory();
const dialogItems = [embedCodes.versioningPie];

// Computed Properties
const current_collection = computed(() => observatoryStore.currentCollection);

const dataVersioningLabels = computed(() => store.SemanticVersioning.data.labels);
const dataVersioningValues = computed(() => store.SemanticVersioning.data.values || []);

// Loading States
const isSemanticVersioningLoading = computed(() => store.Loaded.semanticVersioning);


// Fetch Data on Mount
onBeforeMount(async () => {
    await store.getSemanticVersioning();
});

</script>

<style scoped>
#plot {
    padding: 0%;
    margin: 0%;
}

#plot .modebar {
    display: none !important;
}

.highlight {
    color: #001752f8;
    font-weight: 500;
}

.copy-icon {
    position: absolute;
    top: 5px;
    right: 10px;
}

.flex .icon {
    width: 24px;
    height: 24px;
}

.border-blue-700 {
    --tw-border-opacity: 1;
    border-color: #001752f8;
}

.icon {
    color: #001752f8;
}

a {
    color: #0b579f;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
    color: #6a98c4;
}
</style>