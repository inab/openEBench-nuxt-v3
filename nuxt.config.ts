import { customRoutes } from './custom-routes';
import svgLoader from 'vite-svg-loader';
import { defineNuxtConfig } from 'nuxt/config';

const mockAuthModule = process.env.VITEST ? ['./test/mocks/setup.ts'] : [];
const testUtilsModule = process.env.VITEST ? ['@nuxt/test-utils/module'] : [];

export default defineNuxtConfig({
	compatibilityDate: '2026-09-23',
	// next-auth 4.24 does not export ./core, which nuxt-auth imports; production is patched in Dockerfile.production
	$development: {
		alias: {
			'next-auth/core': `${process.cwd()}/node_modules/next-auth/core/index.js`,
		},
	},
	devtools: {
		enabled: true,
	},
	app: {
		baseURL: '/',
		head: {
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1',
			link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
		},
		pageTransition: {
			name: 'page',
		},
	},
	nitro: {
		serveStatic: true,
		compressPublicAssets: false,
		externals: {
			inline: ['@inb/oeb-classification-table'],
		},
	},
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "@/assets/styles/_variables.scss" as *;',
				},
			},
		},
		plugins: [svgLoader()],
		optimizeDeps: {
			include: [
				'dompurify',
				'aos',
				'gsap',
				'vue-multiselect',
				'pluralize',
				'marked',
				'@inb/oeb-widgets-graphs',
				'valibot',
				'@vuepic/vue-datepicker',
			],
		},
	},

	devServer: {
		host: '0.0.0.0',
		port: 3001,
	},

	css: [
		'~/assets/css/main.css',
		'@fortawesome/fontawesome-svg-core/styles.css',
		'aos/dist/aos.css',
		'vue-multiselect/dist/vue-multiselect.min.css',
		'~/assets/styles/main.scss',
	],

	ssr: false,

	plugins: [
		'~/plugins/useGraphql',
		'~/plugins/useObservatory',
		'~/plugins/useGithubapp',
		'~/plugins/useApi',
	],

	runtimeConfig: {
		// Server-only; set via the NUXT_AUTH_SECRET environment variable
		authSecret: '',
		public: {
			ENVIRONMENT: process.env.ENVIRONMENT || 'test-oeb2',
			OEB_LEGACY_ANGULAR_URI:
				process.env.OEB_LEGACY_ANGULAR_URI || 'https://legacy.dev-openebench.bsc.es',
			VRE_URI: process.env.VRE_URI || 'https://openebench.bsc.es/vre/home',
			OBSERVATORY_URI: process.env.OBSERVATORY_URI || 'https://observatory.openebench.bsc.es',
			SCIENTIFIC_SERVICE_URL:
				process.env.SCIENTIFIC_SERVICE_URL || 'https://openebench.bsc.es/api/scientific',
			SCIENTIFIC_SERVICE_URL_API:
				process.env.SCIENTIFIC_SERVICE_URL_API || 'https://openebench.bsc.es/api/scientific',
			BENCH_EVENT_API_URL:
				process.env.BENCH_EVENT_API_URL || 'https://openebench.bsc.es/rest/bench_event_api',
			OBSERVATORY_API_URL:
				process.env.OBSERVATORY_API_URL || 'https://observatory.openebench.bsc.es/api',
			GITHUBAPP_API_URL:
				process.env.GITHUBAPP_API_URL ||
				'https://observatory.openebench.bsc.es/github-metadata-api',
			MONITORING: {
				baseURL: process.env.REST_API_URL || 'https://openebench.bsc.es/monitor/rest',
			},
			KEYCLOAK_HOST: process.env.KEYCLOAK_HOST || 'https://inb.bsc.es',
			KEYCLOAK_REALM: process.env.KEYCLOAK_REALM || 'oeb2dev',
			KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID || 'oeb-frontend',
			BASE_URL: process.env.APP_BASE_URL || 'https://openebench.bsc.es',
			AUTH_ORIGIN: process.env.AUTH_ORIGIN || 'https://inb.bsc.es',
		},
	},

	auth: {
		isEnabled: true,
		disableServerSideAuth: false,
		globalAppMiddleware: false,
		provider: {
			type: 'authjs',
		},
		// nuxt-auth >= 1.0 has no basePath/origin options: baseURL must be the full URL including the path
		baseURL: `${
			process.env.AUTH_ORIGIN || process.env.APP_BASE_URL || 'https://test-oeb2.openebench.bsc.es'
		}/api/auth`,
	},

	hooks: {
		'pages:extend': (pages) => {
			customRoutes.forEach((customRoute) => {
				pages.push(customRoute);
			});
		},
	},

	modules: [
		'@nuxt/image',
		'@nuxt/ui',
		'@pinia/nuxt',
		'@nuxt/eslint',
		'vue3-carousel-nuxt',
		'@sidebase/nuxt-auth',
		...testUtilsModule,
		...mockAuthModule,
	],

	typescript: {
		shim: false,
		tsConfig: {
			include: ['../types/**/*.d.ts'],
		},
	},

	image: {
		provider: 'ipx',
	},
});
