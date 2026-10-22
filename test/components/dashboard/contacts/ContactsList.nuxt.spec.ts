import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ContactsList from '@/components/Dashboard/contacts/ContactsList.vue';
import { useUser } from '~~/stores/user.ts';

describe('Dashboard Contacts List', () => {
	let wrapper;

	beforeEach(async () => {
		wrapper = mount(ContactsList, {
			global: {
				stubs: ['FontAwesomeIcon', 'NuxtIcon', 'RouterLink'],
			},
			props: {
				contactsData: [
					{
						id: '1',
						name: 'Test Name 1',
						email: '',
					},
					{
						id: '2',
						name: 'Test Name 2',
						email: '',
					},
					{
						id: '3',
						name: 'Test Name ',
						email: '',
					},
				],
				isLoading: false,
				token: 'token',
			},
		});

		useUser();
	});

	it('should render the component', () => {
		wrapper.vm.page = 1;
		wrapper.vm.pageCount = 10;
		wrapper.vm._total = 3;

		expect(wrapper.exists()).toBe(true);
		expect(wrapper.find('.dashboard-contacts-list').exists()).toBe(true);
	});
});
