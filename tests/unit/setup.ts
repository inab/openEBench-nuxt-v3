import { vi } from 'vitest';
import { ref } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import { mockNuxtApp } from './mocks/nuxtAppMock';

vi.mock('#app', () => ({
  useNuxtApp: () => mockNuxtApp,
}));

vi.mock('#imports', () => ({
  definePageMeta: (_meta: unknown) => {},
}));

vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $auth: {
      status: ref('authenticated'),
      data: ref({
        statusCode: 200,
        user: {
          name: 'John Doe',
          oeb_roles: [],
        },
      }),
    },
  }),
}));

vi.mock('@/stores/user', () => ({
  useUser: () => ({
    getUserCommunitiesRoles: [{ role: 'admin' }],
    setUserCommunitiesRoles: vi.fn(),
  }),
}));

const pinia = createPinia();
setActivePinia(pinia);

export { pinia };
