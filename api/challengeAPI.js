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
								datalinks {
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
								datalinks {
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
							datalinks {
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
	console.log("dataset: " , dataset)
  const datalink = dataset?.datalinks?.[0];

  if (!datalink?.inline_data) {
    console.warn("No inline_data found in datalinks[0]");
    return [];
  }

  let parsedInlineData;

  try {
    parsedInlineData =
      typeof datalink.inline_data === "string"
        ? JSON.parse(datalink.inline_data)
        : datalink.inline_data;
  } catch (e) {
    console.error("Error parsing inline_data:", e);
    return [];
  }

  return parsedInlineData;
}


export default {
  challengeAPI,
  getGraphData,
};
