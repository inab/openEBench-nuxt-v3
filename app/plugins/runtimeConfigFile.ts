import { mergeConfig } from '../../shared/mergeConfig';

// Runs before every other plugin so no API/Keycloak call is made with build-time values
export default defineNuxtPlugin({
	name: 'runtime-config-file',
	enforce: 'pre',
	async setup() {
		try {
			const overrides = await $fetch<Record<string, unknown>>('/config.json', {
				baseURL: '/',
				cache: 'no-store',
			});
			mergeConfig(useRuntimeConfig().public, overrides);
		} catch (error) {
			console.warn('[config] /config.json could not be loaded, using built-in defaults', error);
		}
	},
});
