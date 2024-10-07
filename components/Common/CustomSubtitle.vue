<template>
    <div class="custom-subtitle">
        {{  text }}
    </div>
</template>

<script setup lang="ts">
    import { defineProps } from 'vue';

    defineProps<{
        text: string;
    }>();
</script>

<style lang="scss" scoped>
    .custom-subtitle {
        width: 100%;
        border-color: rgb(226, 232, 240);
        border-bottom-width: 1px;
        color: theme("colors.primary.500");
        font-size: 22px;
        padding-bottom: 10px;
    }
</style>