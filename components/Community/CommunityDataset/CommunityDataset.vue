<template>
    <div>
        <UTable
            :columns="columns"
            :rows="rows"
            :ui="{
                tr: {
                    base: '',
                    selected: 'bg-gray-50 dark:bg-gray-800/50',
                    active: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer',
                },
            }"
        >
            <template #name-data="{ row }">
                <span>{{ row.name }}</span>
            </template>
            <template #type-data="{ row }">
                <span>{{ row.type }}</span>
            </template>
            <template #download-data="{ row }">
                <a v-if="row.download" :href="row.download" target="_blank">Download</a>
                <span v-else>Not available</span>
            </template>
            
        </UTable>
        <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
            <UPagination v-model="page" :page-count="pageCount" :total="datasets.length" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'

    const props = defineProps<{
        datasets: Object,
        communityId: string
    }>()

    let page = ref(1)
    const pageCount = 15

    const columns = [
        {
            key: "name",
            label: "Name",
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

    let datasets = computed(() => {
        return props.datasets.map((dataset: any) => {
            return {
                name: dataset.name,
                type: dataset.type,
                download: dataset.datalink?dataset.datalink.uri:null
            }
        });
    });

    const rows = computed(() => {
        return datasets.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
    })

    
</script>