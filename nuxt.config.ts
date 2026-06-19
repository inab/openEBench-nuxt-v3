import { customRoutes } from './router.options';
import svgLoader from 'vite-svg-loader';
import { defineNuxtConfig } from 'nuxt/config';

const mockAuthModule = process.env.VITEST ? ['./test/mocks/setup.ts'] : [];

export default defineNuxtConfig({
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
      mode: 'out-in',
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
    server: {
      watch: {
        usePolling: true,
        interval: 100,
        ignored: ['!**/models/**'],
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/_variables.scss";',
        },
      },
    },
    plugins: [svgLoader()],
    optimizeDeps: {
      include: [
        'dompurify',
        'aos',
        'data-urls',
        'whatwg-encoding',
        'vue3-carousel/dist/carousel.es.js',
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
    'bootstrap/dist/css/bootstrap.min.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
    'aos/dist/aos.css',
    'vue-multiselect/dist/vue-multiselect.min.css',
    '~/assets/styles/main.scss',
  ],

  ssr: false,

  plugins: [
    '~/plugins/config.client',
    '~/plugins/useGraphql',
    '~/plugins/useObservatory',
    '~/plugins/useGithubapp',
    '~/plugins/useApi',
  ],

  runtimeConfig: {
    public: {
      BASE_URL: process.env.APP_BASE_URL,
      AUTH_ORIGIN: process.env.AUTH_ORIGIN,
    },
  },

  auth: {
    isEnabled: true,
    disableServerSideAuth: false,
    globalAppMiddleware: false,
    provider: {
      type: 'authjs',
    },
    redirect: {
      login: '/login',
      home: '/',
    },
    basePath: '/api/auth',
    originEnvKey: 'AUTH_ORIGIN',
    baseURL: process.env.APP_BASE_URL || 'https://test2.openebench.bsc.es',
    origin: process.env.AUTH_ORIGIN || 'https://inb.bsc.es',
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
    'nuxt-viewport',
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
    'vue3-carousel-nuxt',
    '@sidebase/nuxt-auth',
    ...mockAuthModule,
  ],

  typescript: {
    shim: false,
  },

  image: {
    provider: 'ipx',
    dir: 'assets/images',
  },

  viewport: {
    breakpoints: {
      desktop: 1024,
      desktopMedium: 1280,
      desktopWide: 1600,

      mobile: 320,
      mobileMedium: 375,
      mobileWide: 425,

      tablet: 768,
    },
  },
});