<template>
  <a :href="href" target="_blank" class="card-link">
    <div class="card mb-5 mx-3 main-card">
      <div class="image-container">
        <!-- custom styles for ELIXIR STEERS -->
        <img
          v-if="title === 'ELIXIR STEERS'"
          :src="src"
          class="responsive-img"
          style="max-width: 65%"
        />
        <img v-else :src="src" class="responsive-img" style="max-width: 80%" />
      </div>
      <hr />
      <h5 class="text-center">{{ title }}</h5>
    </div>
  </a>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  title: string;
  href: string;
  src: string;
}>();
</script>

<style scoped>
/* Main card styles */
.main-card {
  border: none;
  min-width: 340px;
  max-width: 345px;
  min-height: 250px;
  transition:
    transform 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
  box-shadow: 0 1px 6px 1px rgba(0, 0, 0, 0.1); /* Initial shadow */
}

.main-card:hover {
  box-shadow: 0 6px 16px 2px rgba(0, 0, 0, 0.2);
}

.image-container {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.responsive-img {
  max-height: 100%;
  max-width: 75%;
  object-fit: contain;
}

.card-link {
  text-decoration: none;
}
</style>
