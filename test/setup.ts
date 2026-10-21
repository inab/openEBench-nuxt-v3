import { vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { ref } from 'vue';

import { mockNuxtApp } from './mocks/nuxtAppMock';

vi.mock('#app', async () => {
	const actual = await vi.importActual('#app');

	return {
		...actual,
		useNuxtApp: () => ({
			...mockNuxtApp,
			$auth: {
				status: ref('authenticated'),
				data: ref({
					name: 'John Doe',
					oeb_roles: [],
				}),
			},
		}),
	};
});

vi.mock('#imports', async () => {
	const actual = await vi.importActual('#imports');

	return {
		...actual,
		definePageMeta: (_meta: any) => {},
	};
});

const pinia = createPinia();
setActivePinia(pinia);

export { pinia };
