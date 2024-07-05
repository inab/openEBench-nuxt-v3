<template>
    <div>
        This is a tools
        {{  tools }}
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'

    const props = defineProps<{
        tools: Object,
        communityId: string
    }>()

    let page = ref(1)
    const pageCount = 10

    const columns = [
        {
            key: "name",
            label: "Name"
        },
        {
            key: "status",
            label: "Status"
        },
        {
            key: "description",
            label: "Description"
        }
    ]

    const rows = computed(() => {
        return props.tools.slice((page.value - 1) * pageCount, (page.value) * pageCount)
    })
</script>