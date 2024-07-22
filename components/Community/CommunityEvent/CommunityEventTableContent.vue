<template>
    <div class="community-event-table-content w-100">
        <p class="text-body-2 text--secondary d-flex align-center text-stone-500">
            <span>
                <UIcon name="i-heroicons-information-circle" scale="2"></UIcon>
            </span>
            An Event corresponds to a time-bound contest where a tool, pipeline,
            service or product, i.e. the participant, is compared against other
            participants using a predefined collection of reference datasets and
            assessment metrics.
        </p>
        <div class="">
            <CommunityEventClassification 
                :id="event._id"
                :key="event._id"
                :filterArray="selectedIds"
            />
        </div>
        <div class="">
            <h2 class="">Challenges</h2>
            <p class="text-body-2 text--secondary d-flex align-center">
                <span>
                    <UIcon name="i-heroicons-information-circle" scale="2" />
                </span>
                
                Challenges are a set of tests which the community uses to benchmark
                participating tools. Each of the categories in which a benchmarking event
                is divided. In its simplest form, one challenge comprises one reference
                dataset and one or more evaluation metrics. This can be customised if
                needed.
            </p>
        </div>
        {{ selectedIds }}
        <div class="">
            <CommunityEventTable
                :eventChallenges="event.challenges"
                :communityId="communityId"
                :filterArray="selectedIds"
                @handleChangeChallengers="handleChangeChallengers"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import CommunityEventClassification from '@/components/Community/CommunityEvent/CommunityEventClassification.vue'
    import CommunityEventTable from '@/components/Community/CommunityEvent//CommunityEventTable.vue';

    const props = defineProps<{
        event: Object,
        communityId: string
    }>()

    // TODO
    let search: string = ref('')
    
    let selected: Array<any> = ref([])
    let selectedIds = computed(() => selected.value.map((item) => item._id))

    function handleChangeChallengers(currentSelected) {
        selected.value = currentSelected
    }
</script>

<style scoped lang="scss">
.community-event-table-content {
    p > span {
        margin-right: 10px;
        width: 20px;
        font-size: 22px;
    }
}
</style>