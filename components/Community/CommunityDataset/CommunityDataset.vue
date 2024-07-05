<template>
    <div>
        <UTable
            :columns="columns"
            :rows="rows"
        />
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'

    const props = defineProps<{
        datasets: Object,
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
            key: "type",
            label: "Type"
        },
        {
            key: "download",
            label: "Download"
        }
    ]

    const rows = computed(() => {
        return props.datasets.slice((page.value - 1) * pageCount, (page.value) * pageCount)
    })
</script>