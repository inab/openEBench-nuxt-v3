// https://nuxt.com/docs/api/configuration/nuxt-config

import { customRoutes } from "./router.options";

export default defineNuxtConfig({
  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },

  css: [
    "~/assets/styles/main.scss",
    "bootstrap/dist/css/bootstrap.min.css",
    '@fortawesome/fontawesome-svg-core/styles.css',
    'aos/dist/aos.css'
  ],

  ssr: false,

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
      title: 'OpenEBench',
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    }
  },

  plugins: [
		'~/plugins/useGraphql',
    '~/plugins/useObservatory',
    '~/plugins/useApi',
	],

  imports: {
    dirs: [
      // Scan top-level modules
      'composables',
      // ... or scan modules nested one level deep with a specific name and file extension
      'composables/*/index.{ts,js,mjs,mts}',
      // ... or scan all modules within given directory
      'composables/**'
    ]
  },

  runtimeConfig: {
    public: {
      ENVIRONMENT: process.env.ENVIRONMENT || 'dev-openebench',
      OEB_LEGACY_ANGULAR_URI: process.env.OEB_LEGACY_ANGULAR_URI || 'https://legacy.dev-openebench.bsc.es/',
      VRE_URI: process.env.VRE_URI || 'https://dev-openebench.bsc.es/vre/home/',
      OBSERVATORY_URI: process.env.OBSERVATORY_URI || 'https://observatory.openebench.bsc.es',
      SCIENTIFIC_SERVICE_URL: process.env.NUXT_SCIENTIFIC_SERVICE_URL ||'https://dev-openebench.bsc.es/api/scientific',
      BENCH_EVENT_API_URL: process.env.BENCH_EVENT_API_URL || 'https://dev-openebench.bsc.es/rest/bench_event_api',
      OBSERVATORY_API_URL: process.env.OBSERVATORY_API_URL || 'https://observatory.openebench.bsc.es/api',
      GITHUBAPP_API_URL: process.env.GITHUBAPP_API_URL || 'https://observatory.openebench.bsc.es/githubapp/api',
      MONITORING: {
        baseURL:
          process.env.REST_API_URL || 'https://dev-openebench.bsc.es/monitor/rest/',
      },
      KEYCLOAK_HOST: process.env.KEYCLOAK_HOST || 'https://inb.bsc.es/auth',
      KEYCLOAK_REALM: process.env.KEYCLOAK_REALM || 'openebench',
      KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID || 'oeb-frontend',
    },
  },

  routeRules: {
    '/benchmarking/:community': { ssr: false }
  },

  hooks: {
    "pages:extend": (pages) => {
      customRoutes.forEach((customRoute) => {
        pages.push(customRoute)
      })
    }
  },

  vite: {
    server: {
      hmr: {
        clientPort: 3003,
        host: '0.0.0.0',
      },
      watch: {
        usePolling: true
      },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@import "@/assets/styles/_variables.scss";',
            },
        },
    },
  },

  devServer: {
    port: 3003,
  },

  modules: ["@nuxt/image", "@nuxt/ui", '@pinia/nuxt']
})