<template>
	<div class="my-4">
		<div
			class="p-4 max-w-full bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
		>
			<h6 class="text-primaryOeb-500 uppercase text-sm text-center mb-2">
				Filter by Project or Community
			</h6>

			<!-- Carousel -->
			<div class="relative">
				<Carousel
					v-model="currentSlide"
					:items-to-show="5"
					:items-to-scroll="5"
					:wrap-around="false"
					:snap-align="'center'"
					:transition="350"
					:mouse-drag="true"
					:touch-drag="true"
					class="my-3 relative px-4 md:px-8 custom-carousel"
				>
					<Slide v-for="(slide, index) in collections" :key="index">
						<div class="carousel__item mt-1 mx-1">
							<button
								ref="buttons"
								class="uppercase bg-gray-100 text-gray-800 text-sm font-medium px-4 py-2 rounded-full dark:bg-gray-700 dark:text-gray-300 transition-all duration-200 ease-in-out"
								:class="{ 'bg-primaryOeb-500 text-white': selectedCollection === index }"
								:style="{ width: 'auto', display: 'inline-block', whiteSpace: 'nowrap' }"
								@click="setCollection(index)"
							>
								{{ slide.title }}
							</button>
						</div>
					</Slide>

					<!-- Navigation Arrows -->
					<template #addons>
						<Navigation prev-class="carousel__prev" next-class="carousel__next" />
					</template>
				</Carousel>
			</div>

			<!-- Selected collection details with transition effect -->
			<transition name="slide">
				<div
					v-if="selectedCollection !== null"
					class="max-w-7xl p-3 mt-4 bg-gray-50 rounded-lg transition-all transform"
				>
					<div class="flex flex-col md:flex-row justify-between items-center">
						<div
							class="w-full"
							:class="
								collections[selectedCollection].id === 'IMPaCT-Data' ? 'md:w-2/3' : 'md:w-3/4'
							"
						>
							<h6 class="text-lg font-bold text-primaryOeb-500">
								<a :href="collections[selectedCollection].homepage" target="_blank">{{
									collections[selectedCollection].title
								}}</a>
							</h6>
							<p class="text-sm font-medium">{{ collections[selectedCollection].subtitle }}</p>
							<p class="text-sm text-gray-600 text-justify">
								{{ collections[selectedCollection].description }}
							</p>
						</div>
						<div
							class="w-full mt-4 md:mt-0 flex justify-center md:justify-end pr-0 md:pr-4"
							:class="
								collections[selectedCollection].id === 'IMPaCT-Data' ? 'md:w-1/3' : 'md:w-1/4'
							"
						>
							<a target="_blank" :href="collections[selectedCollection].homepage"
								><img
									:src="getImagePath(collections[selectedCollection].image)"
									alt="Collection Image"
									class="rounded-lg collection-image transition-transform duration-500 ease-in-out"
									:class="{
										'collection-image--impact-data':
											collections[selectedCollection].id === 'IMPaCT-Data',
									}"
							/></a>
						</div>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue';
import { useObservatory } from '~~/stores/observatory/index.js';
import { useFairness } from '~~/stores/observatory/fairness';
import { useTrends } from '~~/stores/observatory/trends';
import { useData } from '~~/stores/observatory/data';

// Store
const observatoryStore = useObservatory();
const fairnessStore = useFairness();
const trendsStore = useTrends();
const dataStore = useData();

// Collections
const collections = computed(() => observatoryStore.getCollections);
const selectedCollection = computed(() => observatoryStore.selectedCollection);

const currentSlide = ref(observatoryStore.selectedCollection ?? 0);

watch(selectedCollection, (index) => {
	if (index !== null) {
		currentSlide.value = index;
	}
});

function setCollection(index: number | null) {
	if (observatoryStore.selectedCollection !== index) {
		observatoryStore.selectCollection(index);

		if (index !== null) {
			currentSlide.value = index;
			const collectionId = collections.value[index].id;
			observatoryStore.changeCurrentCollection(collectionId);
		} else {
			observatoryStore.changeCurrentCollection(null);
		}

		triggerDataRefresh();
	} else {
		// Unselect the collection if the same one is clicked again
		observatoryStore.selectCollection(null);
		observatoryStore.changeCurrentCollection('tools');
		triggerDataRefresh();
	}
}

// Refresh data for the selected collection
function triggerDataRefresh() {
	// API calls to refresh data
	fairnessStore.getFAIRscores();
	trendsStore.getLicensesSunburst();
	trendsStore.getLicensesOpenSource();
	trendsStore.getSemanticVersioning();
	trendsStore.getVersionControlCount();
	trendsStore.getVersionControlRepositories();
	trendsStore.getPublications();
	trendsStore.getDependencies();
	trendsStore.getDependenciesCount();
	trendsStore.getDocumentation();
	trendsStore.getDocumentationCount();
	trendsStore.getInputFormats();
	trendsStore.getOutputFormats();
	trendsStore.getFormatsCount();
	dataStore.getCountsPerSource();
	dataStore.getTotalCount();
	dataStore.getFeatures();
	dataStore.getCoverageSources();
	dataStore.getCompleteness();
	dataStore.getTypes();
}

function getImagePath(image: string) {
	return new URL(`/assets/images/collections/${image}`, import.meta.url).href;
}
</script>

<style scoped>
.carousel-container {
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
}

:deep(.carousel__viewport) {
	overflow: hidden !important;
	width: calc(100% - 80px);
	margin-inline: auto !important;
	white-space: nowrap;
}

:deep(.carousel__prev),
:deep(.carousel__next) {
	background-color: transparent !important;
	color: #6b7280;
	top: 50% !important;
	margin: 0 !important;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: none;
	transition:
		background-color 0.2s ease,
		color 0.2s ease;
}

:deep(.carousel__prev:hover),
:deep(.carousel__next:hover) {
	background-color: #f3f4f6 !important;
	color: #0b579f;
}

.carousel__item {
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 5px;
}

.carousel__slide {
	width: auto !important;
}

.carousel__track {
	display: flex;
	justify-content: space-between;
	flex-wrap: nowrap;
	overflow-x: hidden;
	max-width: 100%;
	position: relative;
}

.carousel__item button {
	transition:
		transform 0.2s,
		background-color 0.3s;
	white-space: nowrap;
	width: auto !important;
	display: inline-block;
}

.carousel__item button:hover {
	transform: scale(1.05);
}

:deep(.carousel__next--disabled),
:deep(.carousel__prev--disabled) {
	cursor: not-allowed !important;
	opacity: 0.5;
}

/* Transition Effects */
.slide-enter-from {
	opacity: 0;
	transform: translateY(-60px);
}

.slide-enter-active {
	transition: all 0.3s ease;
}

.slide-leave-to {
	opacity: 0;
	transform: translateY(-60px);
}

.slide-leave-active {
	transition: all 0.3s ease;
}

.collection-image {
	width: 100%;
	max-width: 120px;
	max-height: 100px;
	object-fit: contain;
	transition: transform 0.3s ease;
}

.collection-image:hover {
	transform: scale(1.05);
}

.collection-image--impact-data {
	max-width: 160px;
	max-height: 125px;
	border-radius: 0;
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
