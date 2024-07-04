export default defineNuxtPlugin(() => {
    const runtimeConfig = useRuntimeConfig()

    const graphql = $fetch.create({
		headers: {
			common: {
				Accept: 'text/plain, */*',
			},
		},
        baseURL: runtimeConfig.public.SCIENTIFIC_SERVICE_URL,
        method: "POST",
    });

    return {
        provide: {
            graphql
        }
    }
});