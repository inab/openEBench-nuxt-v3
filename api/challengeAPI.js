// TEMPORARY: the Dataset field is `datalinks` in the new schema (test2) and `datalink` in the old one
// (production). We try the new name and retry with the old one if the API rejects it.
// TODO: remove the fallback (keep only `datalinks`) once the new schema is stable in every environment.
const fetchChallenge = (challengeID, datalinkField) =>
	useNuxtApp().$graphql('/graphql', {
		method: 'POST',
		headers: {
			Accept: 'text/plain, */*',
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
								${datalinkField} {
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
								${datalinkField} {
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
							${datalinkField} {
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

export async function challengeAPI(challengeID) {
	let response = await fetchChallenge(challengeID, 'datalinks');
	// TODO: remove this retry together with the one in stores/community.js
	if (response?.errors?.some((e) => /datalinks/.test(e.message ?? ''))) {
		response = await fetchChallenge(challengeID, 'datalink');
	}
	return response;
}

export async function getGraphData(dataset) {
	const datalink = dataset?.datalink ?? dataset?.datalinks?.[0];

	if (!datalink?.inline_data) {
		return [];
	}

	let parsedInlineData;

	try {
		parsedInlineData =
			typeof datalink.inline_data === 'string'
				? JSON.parse(datalink.inline_data)
				: datalink.inline_data;
	} catch (e) {
		console.error('Error parsing inline_data:', e);
		return [];
	}

	return parsedInlineData;
}

export default {
	challengeAPI,
	getGraphData,
};
