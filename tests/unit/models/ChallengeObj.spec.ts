import { describe, expect, test } from 'vitest';
import ChallengeObj from '~~/models/ChallengeObj.js';

describe('ChallengeObj', () => {
	test('normalizes plural datalinks and parses dataset data', () => {
		const challengeData = {
			getChallenges: [
				{
					_id: 'challenge',
					acronym: 'challenge',
					_metadata: null,
					participant_datasets: [
						{
							_id: 'participant',
							orig_id: 'tool_P',
							datalinks: [{ uri: 'https://example.org', inline_data: null }],
							_metadata: '{"level_2:participant_id":"tool"}',
						},
					],
					assessment_datasets: [
						{
							_id: 'assessment',
							orig_id: 'assessment',
							datalinks: [{ inline_data: '{"value":0.5,"error":0.1}' }],
							_metadata: '{"level_2:metric_id":"accuracy"}',
							depends_on: {
								metrics_id: 'metric',
								rel_dataset_ids: [{ dataset_id: 'participant' }],
							},
						},
					],
				},
			],
			getDatasets: [
				{
					_id: 'aggregation',
					datalinks: [
						{
							inline_data: '{"visualization":{"type":"bar-plot"},"challenge_participants":[]}',
						},
					],
					_metadata: null,
				},
			],
			getMetrics: [
				{
					_id: 'metric',
					orig_id: 'metric',
					representation_hints: null,
					_metadata: '{"level_2:metric_id":"accuracy"}',
				},
			],
		};

		const challenge = new ChallengeObj('challenge', challengeData);
		challenge.formatData();

		const participant = Object.values(challenge.getParticipants())[0];

		expect(participant.participant_label).toBe('tool');
		expect(participant.datalink.uri).toBe('https://example.org');
		expect(participant.assessments[0].datalink.inline_data).toEqual({
			value: 0.5,
			error: 0.1,
		});
		expect(challenge.getDatasets()[0].datalink.inline_data.visualization.type).toBe('bar-plot');
	});

	test('continues to normalize legacy singular datalinks', () => {
		const challengeData = {
			getChallenges: [
				{
					_id: 'challenge',
					acronym: 'challenge',
					participant_datasets: [],
					assessment_datasets: [],
				},
			],
			getDatasets: [
				{
					_id: 'aggregation',
					datalink: { inline_data: '{"visualization":{"type":"bar-plot"}}' },
				},
			],
			getMetrics: [],
		};

		const challenge = new ChallengeObj('challenge', challengeData);
		challenge.formatData();

		expect(challenge.getDatasets()[0].datalinks).toEqual([
			{ inline_data: { visualization: { type: 'bar-plot' } } },
		]);
	});
});
