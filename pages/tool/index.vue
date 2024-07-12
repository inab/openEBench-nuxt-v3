<template>
    <div class="tool h-100">
        <iframe
            :src=iframeSRC
            width="100%"
            height="100%"
            frameborder="0"
        >
        </iframe>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const hostname = runtimeConfig.public.OEB_LEGACY_ANGULAR_URI
const query = route.query.search ? route.query.search : ''
const iframeSRC = `${hostname}tool?search=${query}`

definePageMeta({
    layout: "embed-iframe-full-width",
})
</script>

<style scoped lang="scss">
.tool {
    flex: 1 1 auto;
    backface-visibility: hidden;

    min-height: 100vh;
    max-width: 100%;
    position: relative;
    iframe {
        height: 100vh;
    }
}
</style>