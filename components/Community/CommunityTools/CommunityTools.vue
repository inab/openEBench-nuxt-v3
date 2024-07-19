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
                <NuxtLink :to="`/tool/${row.registry_rool_id ? row.registry_tool_id.split(':')[1] : ''}`"
                    class="text-blue-600 dark:text-blue-400">
                    {{ row.name }}
                </NuxtLink>
            </template>
        </UTable>
        <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
            <UPagination v-model="page" :page-count="pageCount" :total="tools.length" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'

    const props = defineProps<{
        tools: Object,
        communityId: string
    }>()

    let page = ref(1)
    const pageCount = 15

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