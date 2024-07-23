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
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import ChallengeParticipantMetricsTable from '@/components/Challenges/ChallengeParticipantMetricsTable.vue';
    import { challengeAPI } from "~/api/challengeAPI";
    import  ChallengeObj  from "~/models/ChallengeObj";

    const PARTICIPANT_ID_KEY = 'level_2:participant_id';
    const EXCLUDE_PARTICIPANT_KEY = 'level_2:exclude_participant';
    const CHALLENGE_LABEL_KEY = 'level_2:challenge_id';
    const METRIC_ID_KEY = 'level_2:metric_id';

    const { $graphql } = useNuxtApp()
    const route = useRoute()
    const challengeId = route.params.id

    let datasets = ref(Array)
    let participants: any = ref(null)
    let metrics = ref(null)
    let challenge: any = ref(null)

    let status = { pending: false} // TODo

    let responseData = await challengeAPI(challengeId)

    let challengeObj = new ChallengeObj(challengeId, responseData.data)
    challengeObj.formatData()
    challenge.value = challengeObj.getChallenge()
    participants.value = challengeObj.getParticipants()
    metrics.value = challengeObj.getMetrics()
    datasets.value = challengeObj.getDatasets()
    participants.value = Object.keys(participants.value).map(function(k){ return participants.value[k] });

    let metricsTable = getMetricsTable()
    console.log(metricsTable)

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
</script>