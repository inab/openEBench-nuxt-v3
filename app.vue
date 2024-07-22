<script setup lang="ts">
useHead
({
  title: 'OpenEBench',
  meta: [
    { name: 'description',
    content: 'OpenEBench' }
  ],
})
</script>

<template>
  <div class="h-100">
    <NuxtLayout />
    <div class="main">
      <NuxtPage />
    </div>
  </div>
</template>

<style>
  .main {
    padding-top: 60px;
  }
</style>
