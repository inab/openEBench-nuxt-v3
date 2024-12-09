<template>
  <div class="no-border">
    <div v-if="loading" class="loader-container">
      <img
        src="~/assets/images/201805.OpenEBench.logo.Animated.0050secs.gif"
        alt="Loader GIF"
        class="loader"
      />
    </div>
    <div v-else class="paper-container mt-8">
      <div v-for="(paper, index) in papers" :key="paper.doi" class="paper">
        <!-- Link -->
        <h5>
          <a :href="`https://doi.org/${paper.doi}`" target="_blank">
            {{ paper.title }}
          </a>
        </h5>
        <!-- Authors -->
        <p v-if="paper.authors && paper.authors.length > 0">
          <strong>Authors: </strong> {{ getAuthors(paper.authors, index) }}
          <span
            v-if="hasMoreAuthors(paper.authors)"
            class="show-all-button cursor-pointer"
            @click="toggleShowAllAuthors(index)"
          >
            <UIcon
              :name="
                showAllAuthors[index]
                  ? 'i-heroicons-minus-16-solid'
                  : 'i-heroicons-plus-16-solid'
              "
            />
          </span>
        </p>
        <!-- Date -->
        <p v-if="paper.publicationDate">
          Publication Date: &nbsp <i>{{ formatDate(paper.publicationDate) }}</i>
        </p>
        <hr />
      </div>
    </div>

    <div v-if="papers.length === 0" class="no-papers text-center">
      <NuxtImg src="/images/illustrations/empty-state.svg" alt="working" />
      <span>There are no papers available.<br />We are working on it!</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Types
interface Paper {
  doi: string;
  title?: string;
  authors?: string;
  publicationDate?: string;
}

// Props
const props = defineProps<{
  papers: Paper[];
}>();

const loading = ref(true);

// State
const showAllAuthors = ref<boolean[]>([]);

// Methods
function getAuthors(authors: string, index: number): string {
  const authorList = authors.split(",").map((author) => author.trim());

  if (authorList.length <= 12 || showAllAuthors.value[index]) {
    return authorList.join(", ");
  } else {
    return authorList.slice(0, 12).join(", ") + "...";
  }
}

function hasMoreAuthors(authors: string): boolean {
  const authorList = authors.split(",").map((author) => author.trim());
  return authorList.length > 12;
}

function toggleShowAllAuthors(index: number): void {
  showAllAuthors.value[index] = !showAllAuthors.value[index];
}

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

// Fetch paper information from the CrossRef API
async function fetchPaperInfo(doi: string): Promise<Paper | null> {
  try {
    const response = await fetch(`https://api.crossref.org/works/${doi}`);
    if (!response.ok) {
      throw new Error("Failed to fetch paper information");
    }
    const data = await response.json();
    if (data && data.message) {
      const { title, author, published } = data.message;
      const publicationDate =
        published &&
        published["date-parts"] &&
        published["date-parts"][0].join("-");

      // Ensure DOI is included in the returned object
      return {
        doi, // Ensure DOI is part of the returned object
        title: title && title[0],
        authors:
          author && author.map((a: any) => `${a.given} ${a.family}`).join(", "),
        publicationDate: publicationDate || "Unknown",
      };
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Error fetching paper information:", error);
    return null;
  }
}

async function fetchAllPaperDetails() {
  loading.value = true;
  try {
    for (let i = 0; i < props.papers.length; i++) {
      const paper = props.papers[i];
      const details = await fetchPaperInfo(paper.doi);
      if (details) {
        // Keep the original DOI when merging details
        props.papers[i] = { ...details, doi: paper.doi };
      }
    }
    // Sort papers by publication date after fetching all details
    props.papers.sort(
      (a, b) =>
        new Date(b.publicationDate || "").getTime() -
        new Date(a.publicationDate || "").getTime(),
    );
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await fetchAllPaperDetails();
  loading.value = false;
});
</script>

<style scoped>
.no-border {
  border: none;
  box-shadow: none;
}

.paper-container {
  display: flex;
  flex-direction: column;
}

.paper {
  margin-bottom: 15px;
  text-align: left;
}

.show-all-button {
  cursor: pointer;
  color: #0b579f;
}

.show-all-button:hover {
  color: #6a98c4;
}

.no-papers {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

h5 a {
  color: #0b579f;
  text-decoration: none;
}

h5 a:hover {
  color: #6a98c4;
  text-decoration: underline;
}

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

img {
  height: 300px;
}
</style>
