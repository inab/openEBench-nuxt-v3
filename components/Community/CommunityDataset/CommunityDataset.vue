<template>
    <div>
        <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
            <UInput v-model="search" placeholder="Search..." />
        </div>
        <UTable
            :columns="columns"
            :rows="filteredRows"
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
    let totalPages = ref(0)
    const search = ref('')

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

    const filteredRows = computed(() => {
        if (!search.value) {
            totalPages.value = props.datasets.length
            return props.datasets.slice((page.value - 1) * pageCount, (page.value) * pageCount)
        }
        
        let filteredSearcher = props.datasets.filter((challenge: any) => {
            return Object.values(challenge).some((value) => {
                return String(value).toLowerCase().includes(search.value.toLowerCase())
            })
        })
        totalPages.value = filteredSearcher.length
        return filteredSearcher.slice((page.value - 1) * pageCount, (page.value) * pageCount)
    })

</script>