<template>
    <div>
        <NuxtImg src="/images/illustrations/404.svg"
        sizes="100vw sm:50vw md:400px" />
        <UButton @click="handleError">Go back home</UButton>
    </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })
</script>