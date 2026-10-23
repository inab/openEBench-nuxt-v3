<template>
	<div class="user-communities-edit">
		<BreadcrumbsBar :breadcrumbs-array="routeArray" />
		<div class="user-communities-edit__body">
			<div class="user-communities-edit__body__table">
				<CommunityEdit
					:id="communityId"
					:loading-data="loadingData"
					:community-obj="communityData"
					:commmunity-privileges="communityPrivileges"
					:is-view="isView ? true : false"
					:events="communityEvents"
					:is-loading-events="isLoadingEvents"
					:privileges-type="privilegesType"
					:tab-index="tabIndex"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import BreadcrumbsBar from '@/components/Common/BreadcrumbsBar.vue';
import CommunityEdit from '@/components/Dashboard/entries/CommunityEdit.vue';
import { useUser } from '~~/stores/user.ts';
import { privileges } from '~~/constants/privileges';
import type { CommunityObject } from '~~/types/dashboard-types';
import type { Event } from '~~/types/events';
import { decodeDataUrlText } from '@/utils/decodeDataUrlText';

definePageMeta({
	middleware: 'require-auth',
	auth: {
		authenticatedOnly: true,
		navigateUnauthenticatedTo: '/login-required',
	},
});

const runtimeConfig = useRuntimeConfig();
const { data } = useAuth();
const route = useRoute();
const communityId: string = route.params.id as string;
const tabIndex: Ref<string> = ref(route.query.events ? '1' : '0');
const loadingData = ref<boolean>(true);
const token = data.value?.accessToken as string;
const userStore = useUser();
const routeName = ref<string>('');
const isLoadingEvents = ref<boolean>(true);

const isView = computed(() => {
	if (userPrivileges.value.length === 0) return true;

	const hasAdminPrivilege = userPrivileges.value.some((privilege) => privilege.role === 'admin');

	if (hasAdminPrivilege) return false;

	const userPrivilege = userPrivileges.value.find(
		(privilege) => privilege.community === communityId
	);

	return userPrivilege ? userPrivilege.role !== 'owner' : true;
});

const userPrivileges = computed(() => userStore.getUserCommunitiesRoles);

if (userPrivileges.value.length == 0) {
	userStore.setUserCommunitiesRoles(data.value?.oeb_roles as string[] | undefined);
}

const communityData = ref<CommunityObject | null>(null);

const communityPrivileges = computed(() => {
	const isAdmin = userPrivileges.value.filter((privilege) => privilege.role === 'admin');

	if (isAdmin.length > 0) {
		return privileges.admin;
	}

	const privilege = userPrivileges.value.find((privilege) => {
		return privilege.community === communityId;
	});

	return privileges[privilege?.role ?? 'anyone'] ?? privileges.anyone;
});

const privilegesType = computed(() => {
	const privilege = userPrivileges.value.find((privilege) => {
		return privilege.community === communityId;
	});

	return privilege ? privilege.role.charAt(0).toUpperCase() + privilege.role.slice(1) : 'None';
});

const communityEvents = ref<Array<Event>>([]);

const routeArray = ref([
	{ label: 'Dashboard', isActualRoute: false, route: '/dashboard' },
	{
		label: 'Projects & Communities',
		isActualRoute: false,
		route: '/dashboard/projects_communities',
	},
	{
		label: computed(() => routeName.value),
		isActualRoute: true,
	},
]);

const fetchUserCommunity = async (token: string): Promise<void> => {
	try {
		const response = await fetch(
			`${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Community/${communityId}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				method: 'GET',
			}
		);

		const data = await response.json();
		if (data._metadata && data._metadata['project:summary']) {
			const decodedSummary = await decodeDataUrlText(data._metadata['project:summary']);
			data._metadata.project_summary = decodedSummary;
		}

		communityData.value = data;
		loadingData.value = false;
		routeName.value = `Community ${communityData.value?.acronym}`;

		const eventResponse = await fetchUserCommunitiesEvents(token, String(data._id));
		communityEvents.value = eventResponse ?? [];
	} catch (error) {
		console.error('Error fetching communities data:', error);
	}
};

const fetchUserCommunitiesEvents = async (
	token: string,
	communityId: string
): Promise<Event[] | undefined> => {
	try {
		const communityEventResponse = await userStore.fetchCommunitiesEvents(token, communityId);
		const data = await communityEventResponse;
		data.map((item) => {
			if (Array.isArray(item.bench_contact)) {
				return {
					...item,
					bench_contact: item.bench_contact.map((contact) => {
						if (typeof contact === 'object' && contact !== null) {
							return {
								...contact,
								id: contact.id ? contact.id.replace(/\./g, ' ').split(':')[1] || '' : '',
								name: contact.name ? contact.name.replace(/\./g, ' ') : '',
							};
						}
						return contact;
					}),
				};
			}
			return item;
		});

		isLoadingEvents.value = false;
		return data;
	} catch (error) {
		console.error('Error fetching communities events data:', error);
	}
};

if (userStore.getUserCommunitiesRoles.length == 0) {
	userStore.fetchUserPrivileges(token);
}

onMounted(async () => {
	try {
		await fetchUserCommunity(token);
	} catch (error) {
		console.error('Error fetching communities data:', error);
	}
});
</script>
