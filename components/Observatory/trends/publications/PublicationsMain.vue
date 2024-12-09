<template>
    <div class="relative">
        <!-- Options Button -->
        <PlotWOptions  v-if="checkData.value" class="copy-icon" :items="dialogItems"
            :currentCollection="current_collection" />
        <!-- Header -->
        <div class="text-center mt-4">
            <h6 class="text-2xl font-semibold">Publications</h6>
            <p style="line-height: 1.8" class="card-content-vs  text-sm mt-4 text-gray-700">
                Publications of software in the form of research papers generally
                offer a careful description of the software, often including domain of
                application and usage, contributing to its
                <span class="highlight">Findability</span>.
                <br />
                A publication can serve as the reference to credit authors of a
                software and is the most common way to cite software in research
                publications.
            </p>
        </div>
        <div class="mt-4 mb-2">
            <div v-if="isPublicationsLoading">
                <USkeleton class="h-52 mb-3 mx-10" />
            </div>
            <div v-else>
                <PublicationsPlot v-if="checkData.value" :xValues="xvalues" :yPercentageValues="ypercentagevalues"
                    :yIFValues="yifvalues" :textPercentageTools="textpercentagetools"
                    :textPercentageJournals="textpercentagejournals" />
                <noDataAvailable info="publications" v-else></noDataAvailable>
            </div>

        </div>
        <p class="mt-2 text-center mb-2 ml-8">
            <span class="text-sm  highlight"> Percentage (top) and impact factor (bottom) of publications devoted
                to software in the top publishers of software in the Life
                Sciences.</span>
        </p>


    </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref} from 'vue';
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

const xvalues = computed(() => trendsStore.Publications.data.IF_tools.x || []);
const ypercentagevalues = computed(() => trendsStore.Publications.data.percentages.y || []);
const yifvalues = computed(() => trendsStore.Publications.data.IF_tools.y || []);
const textpercentagetools = computed(() => trendsStore.Publications.data.percentages.text_tools || []);
const textpercentagejournals = computed(() => trendsStore.Publications.data.percentages.text_journals || []);

// Loading States
const isPublicationsLoading = computed(() => trendsStore.Loaded.publications);

// Is visible
const checkData = ref(false)

// Fetch Data on Mount
onMounted(async () => {
    await trendsStore.getPublications();

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