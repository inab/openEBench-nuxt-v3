import { vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useNuxtApp } from '#app';
import { mockNuxtApp } from './mocks/nuxt';

// Mockear useNuxtApp para devolver el mock de $graphql
vi.mock('#app', () => ({
  useNuxtApp: () => mockNuxtApp
}));

// Configura Pinia
const pinia = createPinia();
setActivePinia(pinia);

// Exportar Pinia para uso en pruebas
export { pinia };