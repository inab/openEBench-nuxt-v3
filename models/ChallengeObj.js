const PARTICIPANT_ID_KEY = 'level_2:participant_id';
const EXCLUDE_PARTICIPANT_KEY = 'level_2:exclude_participant';
const CHALLENGE_LABEL_KEY = 'level_2:challenge_id';
const METRIC_ID_KEY = 'level_2:metric_id';

function parseJson(value) {
	return typeof value === 'string' ? JSON.parse(value) : value;
}

function normalizeMetadata(dataset) {
	dataset._metadata = parseJson(dataset._metadata);
}

function normalizeDataset(dataset) {
	const datalinks = Array.isArray(dataset.datalinks)
		? dataset.datalinks
		: dataset.datalink
			? [dataset.datalink]
			: [];

	dataset.datalinks = datalinks;
	dataset.datalink = datalinks[0] ?? null;

	if (dataset.datalink?.inline_data != null) {
		dataset.datalink.inline_data = parseJson(dataset.datalink.inline_data);
	}

	normalizeMetadata(dataset);
}

class ChallengeObj {
	constructor(id, data) {
		this.id = id;
		this.data = data;
	}

	formatData() {
		this.data.getChallenges.forEach((challenge) => {
			challenge._metadata = parseJson(challenge._metadata);
			challenge.participant_datasets = challenge.participant_datasets ?? [];
			challenge.assessment_datasets = challenge.assessment_datasets ?? [];

			challenge.participant_datasets.forEach(normalizeDataset);
			challenge.assessment_datasets.forEach(normalizeDataset);
		});

		this.data.getDatasets.forEach(normalizeDataset);

		this.data.getMetrics.forEach((metric) => {
			metric.representation_hints = parseJson(metric.representation_hints);
			normalizeMetadata(metric);
		});
	}

	getChallenge() {
		let challengeObj = this.data.getChallenges[0];
		let challengeLabel;
		if (challengeObj._metadata) {
			challengeLabel = challengeObj._metadata[CHALLENGE_LABEL_KEY];
		}

		if (challengeObj.acronym) {
			challengeLabel = challengeObj.acronym;
		}

		if (challengeLabel === undefined) {
			let chaOrigId = challengeObj.orig_id;
			if (!chaOrigId) {
				chaOrigId = challengeObj._id;
			}
			const colonPos = chaOrigId.indexOf(':');
			if (colonPos >= 0) {
				// Removing prefix
				challengeLabel = chaOrigId.substring(colonPos + 1);
			} else {
				challengeLabel = chaOrigId;
			}
		}
		challengeObj.challenge_label = challengeLabel;
		return challengeObj;
	}

	getParticipants(data = null) {
		/** @type {Record<string, any>} */
		let participantsArray = {};
		let dataObj = {};
		if (data) {
			dataObj = data;
		} else {
			dataObj = this.data;
		}
		dataObj.getChallenges[0].participant_datasets.forEach((participant) => {
			if (participant._metadata && participant._metadata[EXCLUDE_PARTICIPANT_KEY]) {
				return;
			}
			participantsArray[participant._id] = participant;
			participant.assessments = [];

			// Obtaining the participant label
			let parLabel;
			if (participant._metadata) {
				parLabel = participant._metadata[PARTICIPANT_ID_KEY];
			}

			if (parLabel === undefined) {
				let parOrigId = participant.orig_id;
				if (!parOrigId) {
					parOrigId = participant._id;
				}
				const colonPos = parOrigId.indexOf(':');
				if (colonPos >= 0) {
					// Removing prefix
					parLabel = parOrigId.substring(colonPos + 1);
				} else {
					parLabel = parOrigId;
				}

				// Removing suffix
				if (parLabel.endsWith('_P')) {
					parLabel = parLabel.substring(0, parLabel.length - 2);
				}
			}

			participant.participant_label = parLabel;
		});

		dataObj.getChallenges[0].assessment_datasets.forEach((assessment) => {
			assessment.depends_on.rel_dataset_ids.forEach((participantRef) => {
				if (participantRef.dataset_id in participantsArray) {
					participantsArray[participantRef.dataset_id].assessments.push(assessment);
				}
			});
		});
		return participantsArray;
	}

	getMetrics() {
		return this.data.getMetrics.map((metric) => {
			const allLabels = [];
			let proposedLabel;
			if (metric._metadata) {
				proposedLabel = metric._metadata[METRIC_ID_KEY];
				if (proposedLabel !== undefined) {
					allLabels.push(proposedLabel);
				}
			}
			if (metric.orig_id) {
				const colonPos = metric.orig_id.indexOf(':');
				if (colonPos >= 0) {
					// Removing prefix
					proposedLabel = metric.orig_id.substring(colonPos + 1);
					if (proposedLabel !== undefined) {
						allLabels.push(proposedLabel);
					}
				}
				allLabels.push(metric.orig_id);
			}

			metric.metrics_label = allLabels[0];

			return metric;
		});
	}

	getDatasets() {
		return this.data.getDatasets;
	}
}

export default ChallengeObj;
