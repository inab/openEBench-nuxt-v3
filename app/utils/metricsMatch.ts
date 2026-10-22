import type { Challenge, ChallengeMetrics } from '~~/types/challenge';

type ChallengeWithMetrics = Omit<Challenge, 'metrics_categories'> & {
	metrics_categories?: ChallengeMetrics[];
};
const runtimeConfig = useRuntimeConfig();

export default async function metricsSearcher(id: string, token: string) {
	try {
		const response = await fetch(
			`${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Challenge`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
				},
				method: 'GET',
			}
		);

		const data = (await response.json()) as ChallengeWithMetrics[];

		const challengeList: ChallengeWithMetrics[] = [];

		data.forEach((metric) => {
			if (metric.metrics_categories?.[0]?.metrics) {
				const categoryList = metric.metrics_categories[0].metrics;
				categoryList.forEach((category) => {
					if (category.metrics_id === id) {
						challengeList.push(metric);
					}
				});
			}
		});

		return challengeList;
	} catch (error) {
		console.error(error);
	}
}
