export default defineNuxtPlugin(() => {
    const runtimeConfig = useRuntimeConfig()

    const observatory = $fetch.create({
		headers: {
			common: {
				Accept: 'text/plain, */*',
			},
		},
        baseURL: runtimeConfig.public.OBSERVATORY_URI,
        method: "POST",
    });

    return {
        provide: {
            observatory
        }
    }
});