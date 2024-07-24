<template>
    <div class="custom-chip bg-zinc-100"
        :class="selected?'bg-secondaryOeb-100 text-secondaryOeb-600':''">
        <slot />
    </div>
</template>

<script setup lang="ts">
defineProps<{
    selected: boolean
}>()

</script>

<style scoped lang="scss">
    .custom-chip {
        align-items: center;
        cursor: default;
        display: inline-flex;
        line-height: 20px;
        max-width: 100%;
        outline: none;
        overflow: hidden;
        padding: 0 12px;
        position: relative;
        text-decoration: none;
        transition-duration: .28s;
        transition-property: box-shadow,opacity;
        transition-timing-function: cubic-bezier(.4,0,.2,1);
        vertical-align: middle;
        white-space: nowrap;
        border-radius: 16px;
        font-size: 14px;
        height: 32px;
    }
</style>