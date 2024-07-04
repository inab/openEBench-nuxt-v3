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
import { defineProps } from 'vue'; // Import defineProps from the 'vue' module

import { run_summary_table } from '@inb/oeb-classification-table';

defineProps<{
    id: number,
    filterArray: Array<any>,
    'data-mode': dataMode,
    'data-api-url': apiUrl,
    'data-bench-event-api-url': benchEventApiUrl
}>()

console.log($config)
</script>