<template>
    <div class="relative">
        <!-- Options Button -->
        <PlotWOptions class="copy-icon" :items="dialogItems" :currentCollection="current_collection" />

        <!-- Licensing Header -->
        <div class="text-center mt-4">
            <h6 class="text-2xl font-semibold">Licensing</h6>
            <p class="text-sm text-gray-700">
                Licensing is one of the most crucial features of a piece of software, determining both its
                <span class="highlight">Accessibility</span> and
                <span class="highlight">Reusability</span>.
            </p>
        </div>

        <!-- Visualizations -->
        <div class="grid grid-cols-12 gap-6 mt-6 pb-4">
            <!-- Sunburst Chart -->
            <div class="col-span-4 flex justify-center items-center">
                <div v-if="isLicensesSunburstLoading" class="w-full">
                    <USkeleton class="h-52 mx-10" />
                </div>
                <PlotLicensesPie v-else :labels="sunburstLabels" :parents="sunburstParents" :values="sunburstValues"
                    :text="sunburstText" />
            </div>

            <!-- Bar Chart -->
            <div class="col-span-8 flex justify-center items-center">
                <div v-if="isLicensesOpenSourceLoading" class="w-full">
                    <USkeleton class="h-52 mx-10" />
                </div>
                <PlotLicensesBars v-else :counts_permissive="countsPermissive" :licenses_permissive="licensesPermissive"
                    :counts_copyleft="countsCopyleft" :licenses_copyleft="licensesCopyleft" :counts_data="countsData"
                    :licenses_data="licensesData" />
            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
import { onBeforeMount, computed } from 'vue';
import PlotLicensesPie from './PlotLicensesPie.vue';
import PlotLicensesBars from './PlotLicensesBars.vue'
import { useTrends } from '@/stores/observatory/trends';
import { useObservatory } from '@/stores/observatory/index.js';
import PlotWOptions from '~/components/Observatory/PlotWOptions.vue';
import { embedCodes } from '~/components/Observatory/visualizations/embedCodes.js';

// Store
const store = useTrends();
const observatoryStore = useObservatory();
const dialogItems = [embedCodes.licensesPie, embedCodes.licensesBar];

// Computed Properties
const current_collection = computed(() => observatoryStore.currentCollection);

const sunburstLabels = computed(() => store.LicensesSunburst.data.ids);
const sunburstParents = computed(() => store.LicensesSunburst.data.parents);
const sunburstValues = computed(() => store.LicensesSunburst.data.v || []);
const sunburstText = computed(() => store.LicensesSunburst.data.text || []);

const countsPermissive = computed(() => store.LicensesOpenSource.data.counts_permissive || []);
const licensesPermissive = computed(() => store.LicensesOpenSource.data.licenses_permissive || []);
const countsCopyleft = computed(() => store.LicensesOpenSource.data.counts_copyleft || []);
const licensesCopyleft = computed(() => store.LicensesOpenSource.data.licenses_copyleft || []);
const countsData = computed(() => store.LicensesOpenSource.data.counts_data || []);
const licensesData = computed(() => store.LicensesOpenSource.data.licenses_data || []);

// Loading States
const isLicensesSunburstLoading = computed(() => store.Loaded.licensesSunburst);
const isLicensesOpenSourceLoading = computed(() => store.Loaded.licensesOpenSource);

// Fetch Data on Mount
onBeforeMount(async () => {
    await store.getLicensesSunburst();
    await store.getLicensesOpenSource();
});

</script>


<style scoped>
.card-content {
    font-size: 0.9em !important;
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
</style>