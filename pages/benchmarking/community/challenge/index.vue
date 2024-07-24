<template>
    <div class="benchmarking-challenge container">
        <div class="benchmarking-challenge__title">
            {{ challenge.acronym }} ( {{ challenge._id }})
        </div>
        <div class="benchmarking-challenge__subtitle">
            {{ challenge.name }}
        </div>
        <div class="benchmarking-challenge__body">
            <div class="benchmarking-challenge__body_dec" v-for="(item, index) in datasets" :key="index">
                <div v-if="index == tab && item">
                    <ChartDescriptionCard
                        :type="item.datalink.inline_data.visualization.type"
                        :label="challenge.challenge_label"
                    />
                </div>
            </div>
            <div class="benchmarking-challenge__body__content">
                <h2 class="text-h6 mt-8">
                    Choose the metrics you want to visualize in the diagram:
                </h2>
                <div class="benchmarking-challenge__body__content__chips">
                    <CustomChip v-for="(item, index) in datasets" :key="item._id"
                        :selected="index == tab">
                        <span v-if="item.datalink.inline_data.visualization.type == 'box-plot'"
                        >
                            {{ item.datalink.inline_data.visualization.available_metrics[0] }}
                        </span>
                        <span v-else>
                            {{
                                item.datalink.inline_data.visualization.type == '2D-plot'
                                    ? item.datalink.inline_data.visualization.x_axis +
                                    ' + ' +
                                    item.datalink.inline_data.visualization.y_axis
                                    : item.datalink.inline_data.visualization.metric
                            }}
                        </span>
                    </CustomChip>
                </div>
                <div class="benchmarking-challenge__body__content__graphs">
                    <div v-for="(item, index) in datasets" :key="item._id"
                        class="benchmarking-challenge__body__content__graphs__items">
                        <LoaderChartWidgets
                            :data="item"
                            :metrics="metrics"
                        ></LoaderChartWidgets>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { challengeAPI } from "@/api/challengeAPI";
    import  ChallengeObj  from "@/models/ChallengeObj";
    import ChartDescriptionCard from '@/components/Cards/ChartDescriptionCard.vue';
    import CustomChip from '@/components/Common/CustomChip.vue';
    import LoaderChartWidgets from '@/components/Widgets/LoaderChartWidgets.vue';

    const route = useRoute()
    const challengeId = route.params.challenge

    let datasets = ref(Array)
    let participants: any = ref(null)
    let metrics = ref(null)
    let challenge: any = ref(null)

    let responseData = await challengeAPI(challengeId)

    let challengeObj = new ChallengeObj(challengeId, responseData.data)
    challengeObj.formatData()
    challenge.value = challengeObj.getChallenge()
    participants.value = challengeObj.getParticipants()
    metrics.value = challengeObj.getMetrics()
    datasets.value = challengeObj.getDatasets()

    console.log(challenge.value)

    let tab = ref(0)

</script>

<style scoped lang="scss">
    .benchmarking-challenge__body__content__chips {
        white-space: normal;
        flex-wrap: wrap;
        max-width: 100%;
        display: flex;
        transition: .3s cubic-bezier(.25,.8,.5,1);
        flex: 1 0 auto;
        gap: 10px;
    }
</style>