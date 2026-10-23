import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Index from '@/pages/dashboard/index.vue';
import authMiddleware from '../../../../app/middleware/requireAuth';

const mockFetch = vi.hoisted(() => vi.fn());

vi.mock('#build/fetch.mjs', () => ({
	$fetch: mockFetch,
}));

vi.mock('#imports', async () => {
	const actual = await vi.importActual('#imports');

	return {
		...actual,
		useRuntimeConfig: () => ({
			public: {
				SCIENTIFIC_SERVICE_URL_API: 'https://dev.openebench.bsc.es/api/scientific/',
			},
		}),
	};
});

vi.mock('~~/stores/user', () => ({
	useUser: () => ({
		getUserCommunitiesRoles: [],
		setUserCommunitiesRoles: vi.fn(),
	}),
}));

vi.mock('@/middleware/requireAuth', () => ({
	default: vi.fn((context) => {
		const { auth } = context;

		if (!auth || (auth.authenticatedOnly && context.auth.status === 'unauthenticated')) {
			context.redirect('/login-required');
		}
	}),
}));

describe('Dashboard Index', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('allows authenticated users', () => {
		const context = {
			redirect: vi.fn(),
			auth: { authenticatedOnly: true, status: 'authenticated' },
		};

		authMiddleware(context);
		expect(context.redirect).not.toHaveBeenCalled();
	});

	it('does not render user-specific content for unauthenticated user', async () => {
		const context = {
			redirect: vi.fn(),
			auth: { authenticatedOnly: true, status: 'unauthenticated' },
		};

		authMiddleware(context);
		expect(context.redirect).toHaveBeenCalledWith('/login-required');
	});

	it('renders the dashboard header with authenticated user', () => {
		const wrapper = mount(Index, {
			global: {
				stubs: ['NuxtLink'],
			},
		});

		const hour = new Date().getHours();
		const text = hour < 12 ? 'Good morning,' : hour < 18 ? 'Good afternoon,' : 'Good evening,';

		const header = wrapper.find('.dashboard__header__title');
		expect(header.exists()).toBe(true);
		expect(header.text()).toBe(text);
	});

	it('updates totalMetrics with the length of fetched data', async () => {
		const mockResponse = [
			{ id: 1, name: 'Metric 1' },
			{ id: 2, name: 'Metric 2' },
		];

		mockFetch.mockResolvedValue(mockResponse);

		const wrapper = mount(Index, {
			global: {
				stubs: ['NuxtLink'],
			},
		});

		await wrapper.vm.countTotalMetrics();

		expect(wrapper.vm.totalMetrics).toEqual(mockResponse.length);
	});

	it('update totalTools with the length of fetched data', async () => {
		const mockResponse = [
			{ id: 1, name: 'Tool 1' },
			{ id: 2, name: 'Tool 2' },
			{ id: 3, name: 'Tool 3' },
		];

		mockFetch.mockResolvedValue(mockResponse);

		const wrapper = mount(Index, {
			global: {
				stubs: ['NuxtLink'],
			},
		});

		await wrapper.vm.countTotalTools();

		expect(wrapper.vm.totalTools).toEqual(mockResponse.length);
	});

	it('update totalCommunities with the length of fetched data', async () => {
		const mockResponse = [
			{ id: 1, name: 'Community 1' },
			{ id: 2, name: 'Community 2' },
			{ id: 3, name: 'Community 3' },
		];

		mockFetch.mockResolvedValue(mockResponse);

		const wrapper = mount(Index, {
			global: {
				stubs: ['NuxtLink'],
			},
		});

		await wrapper.vm.countTotalCommunities();

		expect(wrapper.vm.totalCommunities).toEqual(mockResponse.length);
	});

	it('update totalContacts with the length of fetched data', async () => {
		const mockResponse = [
			{ id: 1, name: 'Contact 1' },
			{ id: 2, name: 'Contact 2' },
			{ id: 3, name: 'Contact 3' },
		];

		mockFetch.mockResolvedValue(mockResponse);

		const wrapper = mount(Index, {
			global: {
				stubs: ['NuxtLink'],
			},
		});

		await wrapper.vm.countTotalContacts();

		expect(wrapper.vm.totalContacts).toEqual(mockResponse.length);
	});
});
