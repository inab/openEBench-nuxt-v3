<template>
    <div class="relative">
        <!-- Options Button -->
        <PlotWOptions  v-if="versionControlVisible" class="copy-icon" :items="dialogItems" :currentCollection="current_collection" />

        <!-- Header Section -->
        <div class="text-center mt-4">
            <div class="flex flex-wrap lg:flex-nowrap lg:h-full"> <!-- Left Column: Description -->
                <div class="flex-1 lg:w-3/4  flex flex-col justify-center lg:h-full">
                    <h6 class="text-2xl font-semibold text-center lg:text-left ">
                        Repositories and Version Control
                    </h6>
                    <p class="text-sm text-gray-700 mt-2 card-content-vs leading-relaxed text-center lg:text-left">
                        Making software available through any of the main software repositories makes it more <span
                        class="highlight">Findable</span> and <span class="highlight">Accessible</span>.
                    </p>
                    <p class="text-sm text-gray-700 mb-2 card-content-vs leading-relaxed text-center lg:text-left">
                        Version control offers a standardized record of source code changes, making it easier to be
                        <span class="highlight">Reused</span>.
                    </p>
                </div>

                <!-- Right Column: Stats Card -->
                <div class="lg:w-1/4 flex items-center lg:h-full ml-5"> <!-- Loader -->
                    <USkeleton v-if="isversionControlCountLoading" class="h-full w-full" />

                    <!-- Card with Percentage -->
                    <div v-else
                        class="text-center bg-orange-100 rounded flex flex-col justify-center items-center p-2.5">
                        <p class="text-4xl mb-1">{{ percentage.toFixed(1) }}%</p>
                        <p class="font-light mb-0">
                            of software use <span class="font-bold">version control</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Plot Section -->
        <div v-if="versionControlVisible" class="row justify-center mt-4 ">
            <div class="col-lg-10 col-md-12">
                <USkeleton v-if="isversionControlRepositoriesLoading" class="mb-5 mx-auto" />
                <VersionControlPlot v-else :x-values="x" :y-values="y" />
            </div>
            <div class="col-lg-11">
                <p class="mt-8 ml-6 mb-0 text-center">
                    <span class="text-sm highlight">
                        Software available on four major platforms for distribution and development.
                    </span>
                </p>
            </div>
        </div>
        <div v-else>
            <noDataAvailable class="mt-8" info=""></noDataAvailable>
        </div>
    </div>
</template>


<script setup lang="ts">
import { onBeforeMount, computed } from 'vue';
import { useTrends } from '@/stores/observatory/trends';
import VersionControlPlot from './VersionControlPlot.vue';
import { useObservatory } from '@/stores/observatory/index';
import noDataAvailable from "@/layouts/noDataAvailableImg.vue";
import PlotWOptions from '~/components/Observatory/PlotWOptions.vue';
import { embedCodes } from '~/components/Observatory/visualizations/embedCodes.js';

// Stores
const trendsStore = useTrends();
const observatoryStore = useObservatory();

// Static Data
const dialogItems = [embedCodes.versionControl];

// Computed Properties
const current_collection = computed(() => observatoryStore.currentCollection);
const control_counts = computed(() => trendsStore.VersionControlCount.data);
const data_vc = computed(() => trendsStore.VersionControlRepositories.data);

// Loading States
const isversionControlCountLoading = computed(() => trendsStore.Loaded.versionControlCount);
const isversionControlRepositoriesLoading = computed(() => trendsStore.Loaded.versionControlRepositories);

// Derived Values
const x = computed(() => Object.values(data_vc.value || {}));
const y = computed(() => Object.keys(data_vc.value || {}));
const percentage = computed(() => {
    const counts = control_counts.value || { 'version control': 0, 'no version control': 0 };
    const total = counts['version control'] + counts['no version control'];
    return total > 0 ? (counts['version control'] / total) * 100 : 0;
});

// Methods
const versionControlVisible = computed(() => control_counts.value?.['version control'] > 0);

// Fetch Data on Mount
onBeforeMount(async () => {
    await trendsStore.getVersionControlCount();
    await trendsStore.getVersionControlRepositories();
});
</script>

<style scoped>
.card-content-vs {
    font-size: 0.9em !important;
    width: 95%;
    margin: auto;
}

.copy-icon {
    position: absolute;
    top: 5px;
    right: 10px;
}

.highlight {
    color: #001752f8;
    font-weight: 500;
}

.bg-yellow-400 {
    --tw-bg-opacity: 1;
    background-color: #F5A131 !important;
}

/* .card-adjustment {
    margin-top: 5px;;
    padding: 15px;
    padding-bottom: 0px;
}

.percentage {
    font-size: 43px;
    line-height: 22px;
    padding-top: 10px;
}


.cardtext {
    font-size: 18px;
    line-height: 25px;
} */
</style>