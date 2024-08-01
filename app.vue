<script setup lang="ts">
  useHead({
    title: 'OpenEBench',
    meta: [
    { name: 'description',
      content: 'OpenEBench' }
    ],
  })
  definePageMeta({
    layout: false,
  })
</script>
<template>
  <div class="h-100">
    <NuxtLayout name="default">
    </NuxtLayout>
  </div>
</template>

<style>
  .main {
    padding-top: 60px;
  }
</style>
