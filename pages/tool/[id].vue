<template>
    <div class="tool_item container">
        <iframe
            :src="`${'hostname'}tool/${'toolId'}`"
            width="100%"
            height="100%"
            frameborder="1"
        >
        </iframe>
    </div>

</template>

<script setup lang="ts">
    const route = useRoute()
    const toolId: string = route.params.id
    const runtimeConfig = useRuntimeConfig()
    
    const hostname = runtimeConfig.public.OEB_LEGACY_ANGULAR_URI
</script>

<style scoped lang="scss">
    .tool_item {
        height: 100%;
        flex: 1 1 auto;
        backface-visibility: hidden;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        max-width: 100%;
        position: relative;
    }
</style>