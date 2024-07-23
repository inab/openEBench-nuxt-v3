const PARTICIPANT_ID_KEY = 'level_2:participant_id';
const EXCLUDE_PARTICIPANT_KEY = 'level_2:exclude_participant';
const CHALLENGE_LABEL_KEY = 'level_2:challenge_id';
const METRIC_ID_KEY = 'level_2:metric_id';

class ChallengeObj {
    constructor(id, data) {
        this.id = id
        this.data = data
    }

    formatData() {
        this.data.getChallenges.forEach((challenge) => {
            if ( typeof challenge._metadata === 'string' || challenge._metadata instanceof String) {
                challenge._metadata = JSON.parse(challenge._metadata);
            }
    
            challenge.participant_datasets.forEach((participant) => {
                if (
                    typeof participant.datalink.inline_data === 'string' ||
                    participant.datalink.inline_data instanceof String
                ) {
                    participant.datalink.inline_data = JSON.parse(
                        participant.datalink.inline_data
                    );
                }
                if (
                    typeof participant._metadata === 'string' ||
                    participant._metadata instanceof String
                ) {
                    participant._metadata = JSON.parse(participant._metadata);
                }
            });
    
            challenge.assessment_datasets.forEach((assessment) => {
                if (
                    typeof assessment.datalink.inline_data === 'string' ||
                    assessment.datalink.inline_data instanceof String
                ) {
                    assessment.datalink.inline_data = JSON.parse(
                        assessment.datalink.inline_data
                    );
                }
                if (
                    typeof assessment._metadata === 'string' ||
                    assessment._metadata instanceof String
                ) {
                    assessment._metadata = JSON.parse(assessment._metadata);
                }
            });
        });

        this.data.getDatasets.forEach((aggregation) => {
            if (
                typeof aggregation.datalink.inline_data === 'string' ||
                aggregation.datalink.inline_data instanceof String
            ) {
                aggregation.datalink.inline_data = JSON.parse(
                    aggregation.datalink.inline_data
                );
            }
            if (
                typeof aggregation._metadata === 'string' ||
                aggregation._metadata instanceof String
            ) {
                aggregation._metadata = JSON.parse(aggregation._metadata);
            }
        });

        this.data.getMetrics.forEach((metric) => {
            if (
                typeof metric.representation_hints === 'string' ||
                metric.representation_hints instanceof String
            ) {
                metric.representation_hints = JSON.parse(metric.representation_hints);
            }
            if (
                typeof metric._metadata === 'string' ||
                metric._metadata instanceof String
            ) {
                metric._metadata = JSON.parse(metric._metadata);
            }
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
        challengeObj.challenge_label = challengeLabel
        return challengeObj
    }

    getParticipants() {
        let participantsArray = {}
        this.data.getChallenges[0].participant_datasets.forEach((participant) => {
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
        
        this.data.getChallenges[0].assessment_datasets.forEach((assessment) => {
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
        return this.data.getDatasets
    }
}

export default ChallengeObj