export async function challengeAPI(challengeID) {
  return await useNuxtApp().$graphql("/graphql", {
    method: "POST",
    headers: {
      Accept: "text/plain, */*",
    },
    body: JSON.stringify({
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
        id: challengeID,
      },
    }),
  });
}
export async function getGraphData(dataset) {
  let response =
    dataset.datalink.inline_data.visualization.type === "bar-plot" ||
    dataset.datalink.inline_data.visualization.type === "box-plot"
      ? await useNuxtApp().$graphql(
          `/widget/${dataset.datalink.inline_data.visualization.type}/${dataset._id}${
            dataset.datalink.inline_data.visualization.type === "box-plot"
              ? "?log2=true"
              : ""
          }`,
          {
            method: "GET",
            headers: {
              Accept: "text/plain, */*",
            },
          },
        )
      : [];
  return response;
}

export default {
  challengeAPI,
  getGraphData,
};
