declare module 'nuxt/schema' {
  interface NuxtConfig {
    auth?: {
      isEnabled?: boolean;
      disableServerSideAuth?: boolean;
      globalAppMiddleware?: boolean;
      provider?: {
        type: 'authjs';
      };
      redirect?: {
        login?: string;
        home?: string;
      };
      basePath?: string;
      originEnvKey?: string;
      baseURL?: string;
      origin?: string;
    };
  }

  interface NuxtOptions extends NuxtConfig {}
}

export {};
