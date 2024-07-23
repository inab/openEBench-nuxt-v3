<template>
    <div class="challenge-participant-metrics">
        <UTable
            :columns="headers"
            :rows="items"
        >
            <template #participant-data="{ row }">
                <!-- {{  row.participant_label }} -->
                {{  row }}
            </template>
        </UTable> 
    </div>
</template>

<script setup lang="ts">

const props = defineProps<{
    metricsTable: Object
}>()

const headers = props.metricsTable.metrics.map((metric: Object, metricsI: number) => {
    return {
        label: metric.metrics_label,
        key: `metricsValues[${metricsI}].value`,
    };
});

headers.unshift({
    label: 'Participant',
    key: 'participant',
});

console.log(headers)

let items = props.metricsTable.participants.map(
    (participant: Object, participantI: number) => {
        return {
            _id: participant._id,
            participant_label: participant.participant_label,
            metricsValues: props.metricsTable.dataMatrix[participantI],
        };
    }
);

items.map((item) => {
    console.log(item)
})

console.log(items)

</script>