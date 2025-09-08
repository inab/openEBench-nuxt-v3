<template>
    <div class="relative">
        <!-- Options Button -->
        <PlotWOptions  v-if="checkData" class="copy-icon" :items="dialogItems"
            :currentCollection="current_collection" />
        <!-- Header -->
        <div class="mt-4">
            <h6 class="text-center text-2xl font-semibold">Publications</h6>
            <div class="flex flex-wrap lg:flex-nowrap lg:h-full mt-4"> <!-- Left Column: Description -->
            
                <div class="lg:w-1/5 flex items-center lg:h-full ml-8 p-2"> <!-- Loader -->
                    <USkeleton v-if="isPublicationsCountLoading" class="h-full w-full" />

                    <!-- Card with Percentage -->
                    <div v-else
                        class="text-center bg-red-50 rounded flex flex-col justify-center items-center p-3.5">
                        <p class="text-4xl mb-1">{{ percentage.toFixed(1) }}%</p>
                        <p class="font-light mb-0">
                            of software have at least one <span class="font-bold">publication</span>
                        </p>
                    </div>
                </div>

                <!-- Right Column: Stats Card -->
                <div class="flex-1 lg:w-4/5  flex flex-col justify-left lg:h-full mr-8 p-2">
                    <p style="line-height: 1.8" class="card-content-vs  text-sm text-gray-700">
                        Publications of software in the form of research papers generally
                        offer a careful description of the software, often including domain of
                        application and usage, contributing to its
                        <span class="highlight">Findability</span>.
                    </p>
                    <p style="line-height: 1.8" class="card-content-vs  text-sm text-gray-700 mt-2">
                        A publication can serve as the reference to credit authors of a
                        software and is the most common way to cite software in research
                        publications.
                    </p>
                </div>
            

            </div>
        </div>
        <div class="mt-4 mb-2">
            <div v-if="isPublicationsLoading">
                <USkeleton class="h-52 mb-3 mx-10" />
            </div>
            <div v-else>
                <PublicationsPlot v-if="data_plot"
                    :tools="data_plot.tools"
					:publications="data_plot.publications"
					:citations="data_plot.citations" />

                <noDataAvailable info="publications" v-else></noDataAvailable>
            </div>

        </div>
        <p class="mt-2 text-center mb-2 ml-8">
            <span class="text-sm  highlight">Number of associated software tools, publications, and citations by
                journal (citations counted over the last 3 years).</span>
        </p>


    </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, setup} from 'vue';
import PublicationsPlot from './PublicationsPlot.vue';
import { useTrends } from '@/stores/observatory/trends';
import { useObservatory } from '@/stores/observatory/index.js';
import noDataAvailable from "@/layouts/noDataAvailableImg.vue";
import PlotWOptions from '~/components/Observatory/PlotWOptions.vue';
import { embedCodes } from '~/components/Observatory/visualizations/embedCodes.js';

// Store
const trendsStore = useTrends();
const observatoryStore = useObservatory();

const dialogItems = [embedCodes.publications];

// Computed Properties
const current_collection = computed(() => observatoryStore.currentCollection);
const data_plot = computed(() => trendsStore.Publications.data);
const percentage = computed(() => trendsStore.PublicationsCount.data.percentage * 100)

// Loading States
const isPublicationsLoading = computed(() => trendsStore.Loaded.publications);
const isPublicationsCountLoading = computed(() => trendsStore.Loaded.publicationsCount);

// Is visible
const checkData = ref(false)

// Fetch Data on Mount
onMounted(async () => {
    await trendsStore.getPublications();
    await trendsStore.getPublicationsCount();
    checkData.value = computed(() => trendsStore.Publications.data.IF_tools.x.length > 0);
});

</script>

<style scoped>
.highlight {
    color: #001752f8;
    font-weight: 500;
}

.copy-icon {
    position: absolute;
    top: 5px;
    right: 10px;
}

.card-content-vs {
    font-size: 0.9em !important;
    width: 95%;
    margin: auto;
}

</style>