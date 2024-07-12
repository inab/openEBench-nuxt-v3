<script setup lang="ts">
useHead
({
  title: 'OpenEBench',
  meta: [
    { name: 'description',
    content: 'My amazing site.' }
  ],
})
</script>

<template>
  <div class="h-100">
    <NuxtLayout />
    <NuxtPage/>
  </div>
</template>
