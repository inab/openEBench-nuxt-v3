<script setup lang="ts">
useHead({
  title:
    "OpenEBench - The ELIXIR gateway to benchmarking communities, software monitoring, and quality metrics",
  meta: [
    {
      name: "OpenEBench",
      content:
        "OpenEBench is the ELIXIR gateway to benchmarking communities, software monitoring, and quality metrics for life sciences tools and workflows.",
    },
  ],
});
definePageMeta({
  layout: false,
});
</script>
<template>
  <div class="h-100">
    <NuxtLoadingIndicator color="#00ff00" error-color="#ff0000" height="5" duration="3000" throttle="100" />
    <NuxtLayout name="default"> </NuxtLayout>
  </div>
</template>

<style>
.main {
  padding-top: 60px;
}
</style>
