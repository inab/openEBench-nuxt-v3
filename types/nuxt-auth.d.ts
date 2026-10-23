declare module 'nuxt/schema' {
	interface NuxtConfig {
		auth?: {
			isEnabled?: boolean;
			disableServerSideAuth?: boolean;
			globalAppMiddleware?: boolean;
			provider?: {
				type: 'authjs';
			};
			baseURL?: string;
		};
	}

	interface NuxtOptions extends NuxtConfig {
		auth?: NuxtConfig['auth'];
	}
}

export {};
