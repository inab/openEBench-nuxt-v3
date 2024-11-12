import type { Challenge } from "@/types/challenge";
const runtimeConfig = useRuntimeConfig();

export default async function metricsSearcher(id: string, token: string) {
  try {
    const response = await fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Challenge`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        method: "GET",
      },
    );

    const data = await response.json();

    let challengeList = [] as Challenge[];

    data.forEach((metric: Challenge) => {
      if (metric.metrics_categories) {
        const categoryList = metric.metrics_categories[0].metrics;
        categoryList.forEach((category: any) => {
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
