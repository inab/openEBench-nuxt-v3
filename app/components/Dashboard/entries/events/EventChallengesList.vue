<template>
	<div class="community-event-challenges">
		<div v-if="commmunityPrivileges.create" class="w-100 flex justify-content-end gap-3 py-3">
			<NuxtLink
				:to="`/dashboard/projects_communities/${communityId}/events/${eventId}/add`"
				class="btn custom-btn btn-primary header-button"
				title="Create New Event"
			>
				Create New Challenge
			</NuxtLink>
		</div>
		<UTable
			:columns="columns"
			:loading="isLoadingChallenges"
			:data="filteredRows"
			:ui="{
				tr: {
					base: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer',
				},
				th: {
					base: 'text-left rtl:text-right',
					padding: 'px-2.5 py-2.5',
					color: 'text-gray-900 dark:text-white',
					font: 'font-semibold',
					size: 'text-sm',
				},
				td: {
					base: '',
					padding: 'px-3 py-3',
					font: '',
					size: 'text-sm',
				},
			}"
		>
			<template #dates-cell="{ row }">
				<div>
					<div class="w-100">
						<div class="w-100">
							Benchmark start: {{ formatClientDate(row.original.dates?.benchmark_start) }}
						</div>
						<div
							v-if="row.original.dates?.benchmark_stop && row.original.dates?.benchmark_stop != ''"
							class="w-100"
						>
							Benchmark end: {{ formatClientDate(row.original.dates?.benchmark_stop) }}
						</div>
					</div>
				</div>
			</template>
			<template #actions-cell="{ row }">
				<div class="action-btn-group">
					<button class="btn-custom-badget text-sm">
						<NuxtLink
							:to="`/benchmarking/${communityId}/${row.original._id}`"
							title="Visit challenge"
							class="text-sm"
						>
							<font-awesome-icon :icon="['far', 'eye']" />
							Visit
						</NuxtLink>
					</button>
					<div v-if="row.original.privileges === 'Owner' || commmunityPrivileges.update">
						<button title="Edit challenge" class="btn-custom-badget text-sm">
							<NuxtLink :to="getCommunityChallengeEditLink(row.original)">
								<font-awesome-icon :icon="['fas', 'pencil']" />
								Edit
							</NuxtLink>
						</button>
					</div>
					<div v-else-if="row.original.privileges === 'Manager' || commmunityPrivileges.update">
						<button title="Edit challenge" class="btn-custom-badget text-sm">
							<NuxtLink :to="getCommunityChallengeEditLink(row.original)">
								<font-awesome-icon :icon="['fas', 'pencil']" />
								Edit
							</NuxtLink>
						</button>
					</div>
					<div v-if="row.original.privileges === 'Owner' || commmunityPrivileges.update">
						<button title="Participate" class="btn-custom-badget text-sm">
							<NuxtLink :to="getCommunityChallengeParticipant(row.original)" class="btn-xxl">
								<font-awesome-icon :icon="['fas', 'handshake-angle']" />
								Participate
							</NuxtLink>
						</button>
					</div>
				</div>
			</template>
			<template #view-cell="{ row }">
				<button class="btn-custom-badget text-sm">
					<NuxtLink
						:to="`/benchmarking/${communityId}?event=${row.original._id}`"
						title="View community events"
						class="text-sm"
					>
						Live
					</NuxtLink>
				</button>
			</template>
		</UTable>
		<div class="flex flex-wrap justify-between items-center pt-2">
			<div>
				<span class="text-sm leading-5">
					Showing
					<span class="font-medium">{{ pageFrom }}</span>
					to
					<span class="font-medium">{{ pageTo }}</span>
					of
					<span class="font-medium">{{ _total }}</span>
					results
				</span>
			</div>
			<UPagination
				v-model="page"
				class="pagination"
				:page-count="pageCount"
				:total="_total"
				:ui="{
					wrapper: 'flex items-center',
					default: {
						activeButton: {
							base: 'bg-primary-500 dark:bg-primary-400',
							color: 'text-white',
						},
					},
				}"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { CommunityPrivilegeActions } from '~~/types/communities';
import type { Challenge } from '~~/types/challenge';
import { getLocaleDateString } from '~~/constants/global_const';

const lang = import.meta.client ? window.navigator.language : 'en';
const dateFormat = computed(() => getLocaleDateString(lang));

const props = defineProps<{
	challenges?: Array<Challenge>;
	isLoadingChallenges: boolean;
	commmunityPrivileges: CommunityPrivilegeActions;
	eventId: string;
	communityId: string;
}>();

const columns = [
	{ id: '_id', accessorKey: '_id', header: 'ID' },
	{ id: 'acronym', accessorKey: 'acronym', header: 'Acronym' },
	{ id: 'name', accessorKey: 'name', header: 'Name' },
	{ id: 'dates', accessorKey: 'dates', header: 'Dates' },
	{
		id: 'challenge_contact',
		accessorKey: 'challenge_contact',
		header: 'Contacts',
	},
	{ id: 'actions', header: 'ACTIONS' },
];

const page = ref<number>(1);
const pageCount = ref<number>(10);
const search = ref<string>('');
const pageFrom = computed(() => (Number(page.value) - 1) * Number(pageCount.value) + 1);
const pageTo = computed(() =>
	Math.min(Number(page.value) * Number(pageCount.value), Number(totalPages.value))
);

const _total = ref(0);

const challengesData = computed(() => {
	if (!props.challenges) return [];
	return props.challenges.map((challenge) => {
		return {
			...challenge,
		};
	});
});

const filteredRows = computed(() => {
	if (!props.challenges) return [];

	if (!search.value) {
		_total.value = props.challenges.length;
		return props.challenges.slice(
			(Number(page.value) - 1) * Number(pageCount.value),
			Number(page.value) * Number(pageCount.value)
		);
	}

	const filteredSearcher = props.challenges.filter((challenge: any) => {
		return Object.values(challenge).some((value) => {
			return String(value).toLowerCase().includes(search.value.toLowerCase());
		});
	});

	_total.value = filteredSearcher.length;

	return filteredSearcher.slice(
		(Number(page.value) - 1) * Number(pageCount.value),
		Number(page.value) * Number(pageCount.value)
	);
});

const totalPages = computed(() => {
	return Math.ceil(Number(_total.value) / Number(pageCount.value));
});

function formatClientDate(date: string) {
	const formattedDate = new Date(date);
	return formattedDate.toLocaleDateString(lang, {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});
}

const getCommunityChallengeEditLink = (row) => {
	return `/dashboard/projects_communities/${props.communityId}/events/${props.eventId}/challenges/${row._id}`;
};

const getCommunityChallengeParticipant = (row) => {
	return `/dashboard/projects_communities/${props.communityId}/events/${props.eventId}/challenges/${row._id}/participant`;
};
</script>

<style scoped lang="scss">
.btn-event {
	padding: 5px;
	font-size: 16px;
	a {
		color: var(--color-gray-400);
	}
}

.action-btn-group {
	display: flex;
	gap: 10px;
}
.header-button {
	padding: 5px 10px;
	font-size: 14px;
	text-decoration: none;
	margin-bottom: 5px;
}
.btn-custom-badget a {
	width: 100%;
	height: 100%;
	display: block;
}
.btn-custom-badget a.btn-xxl {
	min-width: 80px;
}
</style>
