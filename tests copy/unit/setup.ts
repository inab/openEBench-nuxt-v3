import { vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useNuxtApp } from "#app";
import { useRuntimeConfig } from "#imports";
import { mockNuxtApp } from "./mocks/nuxtAppMock";

// Mockear useNuxtApp para devolver el mock de $graphql
vi.mock("#app", () => ({
  useNuxtApp: () => mockNuxtApp,
}));

vi.mock("#imports", () => ({
  definePageMeta: (_meta: any) => {},
}));

vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $auth: {
      status: ref('authenticated'), // Simula un usuario autenticado
      data: ref({ name: 'John Doe', oeb_roles: [] }), // Datos de usuario
    },
  }),
}));

// Configura Pinia
const pinia = createPinia();
setActivePinia(pinia);

// Exportar Pinia para uso en pruebas
export { pinia };
