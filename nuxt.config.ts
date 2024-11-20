import { customRoutes } from "./router.options";
import svgLoader from "vite-svg-loader";

export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },
  vite: {
    server: {
      port: 3001,
      watch: {
        usePolling: true,
        interval: 100,
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
        "dompurify",
        "aos",
        "data-urls",
        "whatwg-encoding",
        "vue3-carousel/dist/carousel.es.js",
        "gsap",
        "vue-multiselect",
        "pluralize",
        "marked",
        "lodash.debounce",
        "@inb/oeb-classification-table",
        "@inb/oeb-widgets-graphs",
        "valibot",
        "@vuepic/vue-datepicker",
      ],
    },
  },

  devServer: {
    port: 3001,
  },

  css: [
    "~/assets/styles/main.scss",
    "bootstrap/dist/css/bootstrap.min.css",
    "@fortawesome/fontawesome-svg-core/styles.css",
    "aos/dist/aos.css",
    "vue-multiselect/dist/vue-multiselect.min.css",
  ],

  ssr: false,

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
  },

  plugins: [
    "~/plugins/useGraphql",
    "~/plugins/useObservatory",
    "~/plugins/useApi",
  ],

  runtimeConfig: {
    public: {
      ENVIRONMENT: process.env.ENVIRONMENT || "dev-openebench",
      OEB_LEGACY_ANGULAR_URI:
        process.env.OEB_LEGACY_ANGULAR_URI ||
        "https://legacy.dev-openebench.bsc.es/",
      VRE_URI: process.env.VRE_URI || "https://dev-openebench.bsc.es/vre/home/",
      OBSERVATORY_URI:
        process.env.OBSERVATORY_URI || "https://observatory.openebench.bsc.es",
      SCIENTIFIC_SERVICE_URL:
        process.env.NUXT_SCIENTIFIC_SERVICE_URL ||
        "https://dev-openebench.bsc.es/api/scientific",
      SCIENTIFIC_SERVICE_URL_API:
        process.env.SCIENTIFIC_SERVICE_URL_API ||
        "https://dev-openebench.bsc.es/api/scientific",
      BENCH_EVENT_API_URL:
        process.env.BENCH_EVENT_API_URL ||
        "https://dev-openebench.bsc.es/rest/bench_event_api",
      OBSERVATORY_API_URL:
        process.env.OBSERVATORY_API_URL ||
        "https://observatory.openebench.bsc.es/api",
      GITHUBAPP_API_URL:
        process.env.GITHUBAPP_API_URL ||
        "https://observatory.openebench.bsc.es/githubapp/api",
      MONITORING: {
        baseURL:
          process.env.REST_API_URL ||
          "https://dev-openebench.bsc.es/monitor/rest/",
      },
      KEYCLOAK_HOST: process.env.KEYCLOAK_HOST || "https://inb.bsc.es/",
      KEYCLOAK_REALM: process.env.KEYCLOAK_REALM || "openebench",
      KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID || "oeb-frontend",
      BASE_URL: process.env.APP_BASE_URL || "https://openebench.bsc.es",
      AUTH_ORIGIN: process.env.AUTH_ORIGIN || "https://inb.bsc.es",
    },
  },

  auth: {
    globalAppMiddleware: false,
    provider: {
      type: "authjs",
    },
    redirect: {
      login: "/login",
      home: "/",
    },
    basePath: '/api/auth',
    disableServerSideAuth: false,
    originEnvKey: 'AUTH_ORIGIN',
    baseURL: process.env.AUTH_ORIGIN || "https://inb.bsc.es",
    origin: process.env.AUTH_ORIGIN || "https://inb.bsc.es", 
  },

  hooks: {
    "pages:extend": (pages) => {
      customRoutes.forEach((customRoute) => {
        pages.push(customRoute);
      });
    },
  },

  modules: [
    "@nuxt/image",
    "@nuxt/ui",
    "@pinia/nuxt",
    "nuxt-viewport",
    "@nuxt/eslint",
    "@nuxt/test-utils/module",
    "vue3-carousel-nuxt",
    "@sidebase/nuxt-auth",
  ],

  buildModules: [
    "@nuxt/typescript-build",
  ],

  image: {
    dir: 'assets/images',
    alias: {
      illustrations: '/assets/images/illustrations',
    },
  },

  eslint: {
    // TODO: Remove this when the project is clean
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
