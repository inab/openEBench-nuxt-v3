import { vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useNuxtApp } from "#app";
//import { mockNuxtApp } from "./mocks/nuxt";

import { createResolver, defineNuxtModule } from "@nuxt/kit";

// // Mockear useNuxtApp para devolver el mock de $graphql
// vi.mock("#app", () => ({
//   useNuxtApp: () => mockNuxtApp,
// }));

// // Configura Pinia
// const pinia = createPinia();
// setActivePinia(pinia);

export default defineNuxtModule({
  setup: (_options, nuxt) => {
    const { resolve } = createResolver(import.meta.url);
    const pathToMocks = resolve("./auth.ts");

    nuxt.hook("imports:extend", (_imports) => {
      _imports.push({ name: "useAuth", from: pathToMocks });
    });

    nuxt.hook("nitro:config", (nitroConfig) => {
      if (!nitroConfig.alias) {
        throw new Error(
          "Alias must exist at this point, otherwise server-side cannot be mocked",
        );
      }
      nitroConfig.alias["#auth"] = pathToMocks;
    });
  },
});

// Exportar Pinia para uso en pruebas
//export { pinia };
