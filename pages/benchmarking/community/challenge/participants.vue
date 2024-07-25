<template>
    <div class="benchmarking-participant">
        <div class="container">
            <div class="benchmarking-participant__skeleton" v-if="status.pending">

            </div>
            <div class="benchmarking-participant__content" v-else>
                <h1 class="">{{ challenge.challenge_label }} ({{ challenge._id }})</h1>
                <h2 class="">{{ challenge.name }}</h2>
                <p class="text--secondary">
                    List of tools participating in the challenge, together with a summary of
                    the metrics obtained.
                </p>
            </div>
            <div class="" v-if="participants?.length > 0">
                <div class="" v-if="status.pending">

                </div>
                <div class="" v-else>
                    <ChallengeParticipantMetricsTable
                        :metricsTable="metricsTable"
                    />
                </div>
                <div class="" v-if="status.pending">
                    <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
                </div>
                <div class="" v-else>
                    <h2 class="text-h6 mt-8">
                        Choose one of the {{ participants.length }} participants whose metrics
                        you want to visualize in the radar plot:
                    </h2>
                    <div class="" v-if="metricsTable.participants.length > 15">
                        <div class="row row-metrics">
                            </div>
                                <div class="metrics-item bg-stone-100" :class="[item.id==selectedParticipant?'selected':'']">
                                    {{  item.participant_label }}
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-wrap justify-between items-center">
                            <div>
                                <span class="text-sm leading-5">
                                    Showing
                                    <span class="font-medium">{{ pageFrom }}</span>
                                    to
                                    <span class="font-medium">{{ pageTo }}</span>
                                    of
                                    <span class="font-medium">{{ pageTotal }}</span>
                                    results
                                </span>
                            </div>
                            <UPagination v-model="page" :page-count="pageCount" :total="itemsTable.length" />
                        </div>

                        <div class="chart-image text--secondary mt-6 mx-10"
							align="center"
							color="rgba(0, 0, 0, 0.6)">
                            <NuxtImg
                                src="/empty-state.svg"  />
							<h2>No chart available.</h2>
							<p class="text-h6">
								No visual representation implemented yet. Check back soon!
							</p>
                        </div>
            </div>
            <div class="" v-else>
                <noDataAvailable item="participants and metrics" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import ChallengeParticipantMetricsTable from '@/components/Challenges/ChallengeParticipantMetricsTable.vue';
    import { challengeAPI } from "@/api/challengeAPI";
    import  ChallengeObj  from "@/models/ChallengeObj";
    import noDataAvailable from '@/layouts/noDataAvailable.vue';

    const route = useRoute()
    const challengeId = route.params.id

    let datasets = ref(Array)
    let participants: any = ref(null)
    let metrics = ref(null)
    let challenge: any = ref(null)

    let status = { pending: false} // TODo
    let page = ref(1)
    let pageCount = ref(15)
   
    let selectedParticipant = ref('')

    let responseData = await challengeAPI(challengeId)

    let challengeObj = new ChallengeObj(challengeId, responseData.data)
    challengeObj.formatData()
    challenge.value = challengeObj.getChallenge()
    participants.value = challengeObj.getParticipants()
    metrics.value = challengeObj.getMetrics()
    datasets.value = challengeObj.getDatasets()
    participants.value = Object.keys(participants.value).map(function(k){ return participants.value[k] });

    let metricsTable: { participants: any; metrics: any[]; dataMatrix: any; length: number } = getMetricsTable()

    let itemsTable = metricsTable.participants.map(
        (participant: Object, participantI: number) => {
            return {
                id: participant._id,
                participant_label: participant.participant_label,
            };
        }
    );
    let itemsRows = computed(() => {
        return itemsTable.slice((page.value - 1) * pageCount.value, page.value * pageCount.value);
    });

    if(metricsTable.participants.length > 0) {
        selectedParticipant.value = metricsTable.participants[0]._id
    }

    const pageTotal = computed(() => metricsTable.participants.length)
    const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
    const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

    function getMetricsTable() {
        // Gather the metrics
        const metricsIdsDict = {};
        participants.value.forEach((participant: any) => {
            participant.assessments.forEach((assessment: any) => {
                if (
                    typeof assessment.depends_on.metrics_id !== 'string' &&
                    !(assessment.depends_on.metrics_id instanceof String)
                ) {
                    return;
                }

                // This metric value is unavailable or hidden for some reason
                if (
                    !assessment.datalink.inline_data ||
                    assessment.datalink.inline_data.hide
                ) {
                    return;
                }

                if (!(assessment.depends_on.metrics_id in metricsIdsDict)) {
                    metricsIdsDict[assessment.depends_on.metrics_id] = {
                        metric: {},
                        participants: {},
                    };
                }
                metricsIdsDict[assessment.depends_on.metrics_id].participants[participant._id] = assessment.datalink.inline_data;
            });
        });
        participants.value.forEach((participant: any) => {
            participant.assessments.forEach((assessment: any) => {
                if (
                    typeof assessment.depends_on.metrics_id !== 'string' &&
                    !(assessment.depends_on.metrics_id instanceof String)
                ) {
                    return;
                }

                // This metric value is unavailable or hidden for some reason
                if (
                    !assessment.datalink.inline_data ||
                    assessment.datalink.inline_data.hide
                ) {
                    return;
                }

                if (!(assessment.depends_on.metrics_id in metricsIdsDict)) {
                    metricsIdsDict[assessment.depends_on.metrics_id] = {
                        metric: {},
                        participants: {},
                    };
                }
                metricsIdsDict[assessment.depends_on.metrics_id].participants[
                    participant._id
                ] = assessment.datalink.inline_data;
            });
        });
        // And their metadata
        metrics.value.forEach((metric) => {
            if (metric._id in metricsIdsDict) {
                metricsIdsDict[metric._id].metric = metric;
            }
        });
        const sortedMetricsIds = Object.keys(metricsIdsDict).sort();
        const dataMatrix = participants.value.map((participant: any) => {
            return sortedMetricsIds.map((metricsId: any) => {
                if (
                    !(metricsId in metricsIdsDict) ||
                    !(participant._id in metricsIdsDict[metricsId].participants)
                ) {
                    return null;
                }

                return metricsIdsDict[metricsId].participants[participant._id];
            });
        });
        return {
            participants: participants.value,
            metrics: sortedMetricsIds.map((mI) => metricsIdsDict[mI].metric),
            dataMatrix,
        };
    }

    function handleChangeSelected(id: string) {
        selectedParticipant.value = id
    }
</script>

<style scoped lang="scss">
.row-metrics {
    padding-bottom: 15px;
    .metrics-item {
        border-radius: 16px;
        padding: 5px 15px;
        margin-bottom: 10px;
        cursor: pointer;
        &.selected {
            background-color: theme('colors.primary.100');
        }
    }
}
.chart-image img {
    max-height: 300px;
}
</style>