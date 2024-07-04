<template>
    <p class="text-body-2 text--secondary d-flex align-center">
        <span class="">
            <UIcon name="i-heroicons-information-circle"></UIcon>
        </span>
        An Event corresponds to a time-bound contest where a tool, pipeline,
        service or product, i.e. the participant, is compared against other
        participants using a predefined collection of reference datasets and
        assessment metrics.
    </p>
    <div class="">
        <CommunityEventClassification 
            :id="event.id"
            :key="event.id"
            :filter-array="selectedIds"
        />
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import CommunityEventClassification from '@/components/Community/CommunityEvent/CommunityEventClassification.vue'

    defineProps<{
        event: Object
    }>()

    let search: string = ref('')
    let selected: Array<any> = ref([])
    let header = [
        {
            text: 'Acronym',
            align: 'start',
            value: 'acronym',
        }, {
            text: 'Name', 
            value: 'name'
        }
    ]
    let selectedIds = computed(() => selected.value.map((item) => item._id))
</script>