<template>
    <div class="benchmarking-participant">
        <div class="container">
            This is a participants
        </div>
        
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    const { $graphql } = useNuxtApp()
    const route = useRoute()
    const challengeId = route.params.id

    let datasets = ref(null)
    let participants = ref(null)
    let metrics = ref(null)

    const { data: challenge, status }= await useAsyncData('communities', () => $graphql('/graphql',
    {
                method: 'POST',
                headers: {
                    "Accept": "text/plain, */*",
                },
                body: JSON.stringify(
                    {
                        query: `
                            query ($id: String!) {
                                getChallenges(challengeFilters: { id: $id }) {
                                    _id
                                    name
                                    acronym
                                    metrics_categories {
                                        metrics {
                                            metrics_id
                                            tool_id
                                        }
                                    }
                                    participant_datasets: datasets(datasetFilters: {type: "participant"}) {
                                        _id
                                        orig_id
                                        datalink {
                                            inline_data
                                            schema_url
                                            uri
                                            schema_uri
                                        }

                                        depends_on {
                                            tool_id
                                            metrics_id
                                            rel_dataset_ids {
                                                dataset_id
                                            }
                                        }
                                        _metadata
                                    }
                                    assessment_datasets: datasets(datasetFilters: {type: "assessment"}) {
                                        _id
                                        orig_id
                                        datalink {
                                            inline_data
                                            schema_url
                                            uri
                                            schema_uri
                                        }
                                        dates {
                                            modification
                                        }
                                        depends_on {
                                            tool_id
                                            metrics_id
                                            rel_dataset_ids {
                                                dataset_id
                                            }
                                        }
                                        _metadata
                                    }
                                }

                                getDatasets(
                                    datasetFilters: { challenge_id: $id, type: "aggregation" }
                                ) {
                                    datalink {
                                        inline_data
                                    }
                                    dates {
                                        modification
                                    }
                                    _id
                                }

                                getMetrics {
                                    _id
                                    title
                                    orig_id
                                    representation_hints
                                    _metadata
                                }
                            }
                        `,
                        variables: {
                            id: challengeId,
                        },
                    }
                )
    }))

    datasets.value = challenge.value?.data.getDatasets ?? null
    participants = challenge.value?.data.getChallenges[0] ?? null
    metrics = challenge.value?.data.getMetrics ?? null
</script>