<template>
  <div
    class="container min-vh-80 d-flex justify-content-center align-items-center error-page"
  >
    <div class="row shadow p-3 mb-5 bg-white rounded m-5">
      <div class="col-12 col-sm-12 col-md-6">
        <h1 class="text-primaryOeb-500">{{ error?.statusCode }}</h1>
        <h2>Whoops!</h2>
        <p v-if="error?.statusCode === 404">
          {{ pageNotFound }}
        </p>
        <p v-else>
          {{ otherError }}
        </p>
        <br />
        <UButton @click="handleError">Go back home</UButton>
      </div>

      <div class="col-12 col-sm-12 col-md-6">
        <CommunityImg />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";
import CommunityImg from "./public/images/illustrations/chart-person.svg?component";

defineProps({
  error: Object as () => NuxtError,
});

const otherError = "An error occurred";
const pageNotFound =
  "Sorry to say, but it looks like this page does not exist.";

const handleError = () => clearError({ redirect: "/" });
</script>

<style>
.min-vh-80 {
  min-height: 80vh;
}
.error-page svg {
  max-width: 400px;
  max-height: 350px;
}
</style>
