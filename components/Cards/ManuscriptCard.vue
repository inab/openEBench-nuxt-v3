<template>
    <div class="no-border">
        <div class="paper-container mt-8">
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
                    <span v-if="hasMoreAuthors(paper.authors)" class="show-all-button cursor-pointer"
                        @click="toggleShowAllAuthors(index)">
                        <UIcon
                            :name="showAllAuthors[index] ? 'i-heroicons-minus-16-solid' : 'i-heroicons-plus-16-solid'"
                            c />
                    </span>
                </p>
                <!-- Date -->
                <p v-if="paper.publicationDate">
                    Publication Date: &nbsp <i>{{ formatDate(paper.publicationDate) }}</i>
                </p>
                <hr />
            </div>
        </div>

        <div v-if="papers.length === 0" class="no-papers mt-5 text-center">
            <i class="bi bi-file-earmark-excel-fill text-primary text-4xl"></i>
            <p>No papers available.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';

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

// State
const showAllAuthors = ref<boolean[]>([]);

// Methods
function getAuthors(authors: string, index: number): string {
    const authorList = authors.split(',').map((author) => author.trim());

    if (authorList.length <= 12 || showAllAuthors.value[index]) {
        return authorList.join(', ');
    } else {
        return authorList.slice(0, 12).join(', ') + '...';
    }
}

function hasMoreAuthors(authors: string): boolean {
    const authorList = authors.split(',').map((author) => author.trim());
    return authorList.length > 12;
}

function toggleShowAllAuthors(index: number): void {
    showAllAuthors.value[index] = !showAllAuthors.value[index];
}

function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

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
    color: #0B579F;
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
    color: #0B579F;
}

h5 a:hover {
    color: #6a98c4;
}
</style>