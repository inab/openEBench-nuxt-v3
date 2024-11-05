<template>
  <div>
  <NuxtLayout :name="layout">
    <template #fairness>
      <h1>FAIRness</h1>
    </template>
  </NuxtLayout>
  </div>
</template>
  
<script setup lang="ts">
const layout = 'observatory'
  
</script>
