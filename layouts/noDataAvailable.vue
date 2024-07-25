<template>
    <div class="no-data-available">
        <NuxtImg src="/images/illustrations/empty-state.svg" />
        <h3 class="mt-10 text-h5 text-center">No {{ item }} available.</h3>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    item: any;
}>();
</script>