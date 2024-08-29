<template>
  <div class="container mx-auto">
    <!-- Loader -->
    <div v-if="loading" class="loader-container">
      <img src="~/assets/images/201805.OpenEBench.logo.Animated.0050secs.gif" alt="Loader GIF" class="loader">

    </div>

    <!-- No Posters Available -->
    <div v-if="!loading && paginatedPosters.length === 0" class="no-posters text-center">
      <NuxtImg src="/images/illustrations/empty-state.svg" alt="working" />
      <span>There are no posters available.<br />We are working on it!</span>
    </div>

    <!-- Posters Section -->
    <div v-if="!loading && paginatedPosters.length > 0" class="card border-0">
      <div v-if="selectedPoster" class="mt-2">
        <div class="back-button-container">
          <button class="back-button" @click="selectedPoster = null">Back to posters</button>
        </div>

        <div class="selected-poster-details">
          <embed :src="getPosterPath(selectedPoster.poster)" type="application/pdf" class="poster-embed" />
          <h3 class="poster-title mt-4">
            <a :href="selectedPoster.link" target="_blank" class="poster-link">
              {{ selectedPoster.title }}
              <font-awesome-icon :icon="['fas', 'arrow-up-right-from-square']" size="xs" class="mx-2" />
            </a>
          </h3>
          <br />
          <p v-if="selectedPoster.authors && selectedPoster.authors.length > 0">
            <b>Authors:</b>
            <span v-for="(author, index) in selectedPoster.authors" :key="index">
              {{ author }}
              <span v-if="index < selectedPoster.authors.length - 1">, </span>
            </span>
          </p>
          <p>Published in {{ formatDate(selectedPoster.date) }} {{ selectedPoster.publication_loc }}</p>
          <p>
            <b>Abstract:</b><br />
            <span v-html="sanitizeHtml(getFormattedAbstract(selectedPoster.abstract, showFullAbstract))"></span>
            <span v-if="shouldShowExpandIcon(selectedPoster.abstract)" class="cursor-pointer text-primary ml-2"
              @click="toggleShowFullAbstract">
              <UIcon :name="showFullAbstract ? 'i-heroicons-minus-16-solid' : 'i-heroicons-plus-16-solid'" />
            </span>
          </p>
          <p><b>How to cite this poster:</b><br />{{ selectedPoster.citation }}</p>
          <p>Presented at {{ selectedPoster.presented_loc }}</p>
        </div>
      </div>

      <div v-else class="mt-8">
        <div class="license-text p-4 bg-light rounded text-center font-weight-bold mb-4">
          This is an open access work distributed under the terms of the Creative Commons Attribution License, which
          permits unrestricted use, distribution, and reproduction in any medium, provided the original work is properly
          cited.
        </div>

        <div class="row">
          <div v-for="poster in paginatedPosters" :key="poster.title" class="col-12 col-md-6 mb-4">
            <div class="card h-100 shadow-sm d-flex flex-column">
              <!-- Thumbnail -->
              <embed :src="getPosterPath(poster.poster)" type="application/pdf" class="card-img-top" />

              <div class="card-body d-flex flex-column justify-content-between">
                <!-- Title -->
                <h5 class="card-title cursor-pointer text-center" @click="selectPoster(poster)">
                  <span v-html="sanitizeHtml(formattedTitle(poster.title))"></span>
                </h5>
              </div>

              <!-- Buttons (CC & DOI) and Date at the Bottom -->
              <div class="card-footer mt-auto d-flex flex-column align-items-center">
                <div class="mx-2 chip">
                  <a class="chip-icon" target="_blank" href="https://creativecommons.org/licenses/by/4.0/deed.en">
                    <img src="@/static/posters/cc.png" alt="CC" class="logo chip-with-logo" />
                  </a>
                  <a target="_blank" :href="poster.link" class="chip-icon">
                    <img src="@/static/posters/doi.svg" alt="CC" class="logo chip-with-logo" />
                  </a>
                </div>
                <p class="card-date text-muted text-center m-0">
                  {{ formatDate(poster.date) }}
                </p>
              </div>
            </div>
          </div>

        </div>

        <!-- Pagination using Nuxt UI -->
        <div v-if="pageCount > 1" class="mt-5">
          <UPagination :active-button="{ variant: 'outline' }" :inactive-button="{ color: 'gray' }"
            :model-value="currentPage" :total="sortedPosters.length" @update:model-value="changePage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import DOMPurify from 'dompurify';

// Define the type for a poster
interface Poster {
  title: string;
  date: string;
  authors: string[];
  presented_loc: string;
  link: string;
  citation: string;
  poster: string;
  abstract: string;
  publication_loc?: string;
  publicationDate?: string;
}

// Define props with a proper type for posters
const props = defineProps<{
  posters: Poster[];
}>();

const selectedPoster = ref<Poster | null>(null);
const localPosters = ref<Poster[]>([]);
const showFullAbstract = ref(false);
const currentPage = ref(1);
const postersPerPage = ref(10);
const loading = ref(true);

const basePath = '/posters/';



onMounted(async () => {
  // Simulate loading delay
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 2000));
  // Load data
  localPosters.value = props.posters;
  loading.value = false;

});

const sortedPosters = computed(() => {
  return [...localPosters.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

const paginatedPosters = computed(() => {
  const start = (currentPage.value - 1) * postersPerPage.value;
  const end = start + postersPerPage.value;
  return sortedPosters.value.slice(start, end);
});

const pageCount = computed(() => {
  return Math.ceil(sortedPosters.value.length / postersPerPage.value);
});

function getPosterPath(filename: string) {
  return `${basePath}${filename}`;
}

function selectPoster(poster: Poster) {
  selectedPoster.value = poster;
}

function formattedTitle(title: string) {
  return title.replace(/\(([^)]+)\)/g, '<br/>($1)');
}

function getFormattedAbstract(abstract: string, showFull: boolean) {
  const words = abstract.split(/(\s+)/);
  if (showFull || words.length <= 50) {
    return words.join('').replace(/\n/g, '<br>');
  } else {
    return words.slice(0, 50).join('') + '...';
  }
}

function shouldShowExpandIcon(abstract: string) {
  const words = abstract.split(/(\s+)/);
  return words.length > 50;
}

function toggleShowFullAbstract() {
  showFullAbstract.value = !showFullAbstract.value;
}

function sanitizeHtml(htmlContent: string) {
  return DOMPurify.sanitize(htmlContent);
}

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function changePage(page: number) {
  currentPage.value = page;
}
</script>

<style scoped>
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.loader {
  width: 160px;
  height: 100px;
}

.chip {
	height: 35px;
	text-align: center;
	justify-content: center;
	display: flex;
	justify-content: center;
	gap: 10px;
	a:hover {
		display: block;
		height: 28px;
	}
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.card-img-top {
  height: 200px;
  /* Adjust height as needed */
  object-fit: cover;
  /* Ensure the image fits well */
}

.card-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* Center the title vertically */
  padding-bottom: 0;
  /* No padding at the bottom */
}

.card-title {
  font-size: 18px;
  margin: 8px 0;
  text-align: center;
  color: #0B579F ;
  text-decoration: underline;
}

.card-title:hover{
  color: #3a6286 ;
  text-decoration: underline;
}

.card-footer {
  background-color: #f8f9fa;
  padding: 10px 0;
  margin-top: auto;
  width: 100%;
}

.chip-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.logo {
	width: 25px;
	height: 25px;
	border-radius: 50%;
	opacity: 0.7;
}

.card-date {
  font-size: 14px;
  padding: 5px 0;
  margin: 0;
}

.bg-light {
  background-color: #f8f9fa;
}

.p-2 {
  padding: 0.5rem;
}

.text-center {
  text-align: center;
}


.card-text.text-muted {
  margin-top: auto;
  font-size: 14px;
  background-color: #f8f9fa;
}

.logo:hover {
	width: 28px;
	height: 28px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 20%);
	transition: box-shadow 0.3s ease-in-out;
}

.back-button-container {
  display: flex;
  justify-content: right;
  position: relative;
  width: 100%;
  margin-top: 16px;
}

.back-button {
  height: 36px;
  min-width: 64px;
  padding: 0 16px;
  background-color: #f5f5f5;
  color: rgba(0, 0, 0, 0.87);
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1), transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.28s;
}

.back-button:hover {
  background-color: #e0e0e0;
}

.back-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.selected-poster-details {
  text-align: left;
  margin-top: 60px;
}

.poster-embed {
  width: 100%;
  height: 600px;
}

.poster-title {
  cursor: pointer;
  color: #0B579F;
  font-size: 19px;
  margin: 8px 0;
  text-align: left;
  word-break: break-word;
  overflow: hidden;
}

.poster-link {
  color: #0B579F;
  /* Ensure link color is also the new blue */
}

.text-primary {
  color: #0B579F !important;

}

.poster-title:hover {
  text-decoration: underline;
}

.license-text {
  font-weight: bold;
}

.no-posters {
  margin-top: 50px;
}

.show-all-button {
  cursor: pointer;
  margin-left: 8px;
}

.no-posters {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.embed-pdf {
  width: 100%;
  height: 200px;
  /* Ensure the embed PDF has a fixed height */
  border: none;
}
</style>
