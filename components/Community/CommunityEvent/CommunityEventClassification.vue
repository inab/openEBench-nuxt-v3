<template>
    <div>
        Classification Table
        <div
            :id="id"
            class="oeb-table caption"
            :data-benchmarkingevent="id"
            :data-mode="dataMode"
            :data-api-url="apiUrl"
            :data-bench-event-api-url="benchEventApiUrl"
        />
    </div>
</template>

<script setup lang="ts">
    import debounce from 'lodash.debounce';
    import { run_summary_table } from '@inb/oeb-classification-table';
    import { defineProps } from 'vue';
     // Import defineProps from the 'vue' modul
    const props = defineProps<{
        id: number,
        filterArray: Array<any>
    }>()

    const runtimeConfig = useRuntimeConfig()


    let apiUrl = runtimeConfig.public ? runtimeConfig.public.SCIENTIFIC_SERVICE_URL + '/graphql' : 'https://dev-openebench.bsc.es/api/scientific/graphql'
    let benchEventApiUrl = runtimeConfig.public ? runtimeConfig.public.BENCH_EVENT_API_URL : 'https://dev-openebench.bsc.es/rest/bench_event_api'
    let dataMode = runtimeConfig.public ? runtimeConfig.public.ENVIRONMENT : 'dev-openebench'
    console.log(props.filterArray)

    let debouncedFilterArrayWatch = debounce(() => {
        loadTable();
    }, debounce);

    const loadTable = () => {
        try {
            run_summary_table(props.filterArray, props.id);
            console.log(run_summary_table)
        } catch (error) {}
    }
    loadTable()
</script>

<style lang="scss">
    .oeb-table-scroll {
        margin-top: 15px;
    }
</style>