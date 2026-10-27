<template>
	<div class="community-events">
		<div class="tab-body-title w-100 flex justify-content-between">
			Events
			<div v-if="eventPrivileges.create" class="">
				<NuxtLink
					:to="`/dashboard/projects_communities/${communityId}/events/add`"
					class="btn custom-btn btn-primary small"
					title="Create New Event"
				>
					Create New Event
				</NuxtLink>
			</div>
		</div>
		<div class="w-100">
			<div class="flex items-center justify-content-end gap-3 py-3">
				<div class="col-4">
					<UInput
						v-model="search"
						color="primary"
						variant="outline"
						icon="i-heroicons-magnifying-glass-20-solid"
						placeholder="Search ..."
						class="input-search"
					/>
				</div>
			</div>
			<UTable
				:columns="columns"
				:loading="isLoadingData"
				:data="filteredRows"
				:ui="{
					tr: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer',
					th: 'text-left rtl:text-right px-2.5 py-2.5 text-gray-900 dark:text-white font-semibold text-sm',
					td: 'whitespace-nowrap py-3 text-sm',
				}"
			>
				<template #dates-cell="{ row }">
					<div>
						<div class="w-100">Benchmark start: {{ row.original.dates?.benchmark_start }}</div>
					</div>
				</template>
				<template #bench_contact-cell="{ row }">
					<span
						v-for="(contact, index) in getContactsArray(row.original.bench_contact ?? '')"
						:key="index"
					>
						<a
							:href="`https://orcid.org/${getContactORCID(contact)}`"
							target="_blank"
							rel="noopener noreferrer"
							class="text-primaryOeb-500"
						>
							{{ contact }}
						</a>
						<br />
					</span>
				</template>
				<template #actions-cell="{ row }">
					<div class="action-btn-group">
						<button class="btn-custom-badget text-sm">
							<NuxtLink
								:to="`/benchmarking/${row.original.community_id}?event=${row.original._id}`"
								title="Visit community event"
								class="text-sm"
							>
								<font-awesome-icon :icon="['far', 'eye']" />
								Visit
							</NuxtLink>
						</button>
						<div v-if="canEditEvent(row.original)">
							<button title="Edit Event" class="btn-custom-badget text-sm">
								<NuxtLink :to="getCommunityEventEditLink(row.original)">
									<font-awesome-icon :icon="['fas', 'pencil']" />
									Edit
								</NuxtLink>
							</button>
						</div>
						<button class="btn-custom-badget text-sm">
							<NuxtLink
								:to="getCommunityEventEditLink(row.original, true)"
								title="View Event challenges"
								class="text-sm column-link"
							>
								<font-awesome-icon :icon="['far', 'calendar']" />
								Challenges
							</NuxtLink>
						</button>
					</div>
				</template>
			</UTable>
		</div>

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
				v-model:page="page"
				class="pagination"
				:items-per-page="pageCount"
				:total="_total"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { CommunityPrivilegeCategories } from '~~/types/communities';
import type { Event } from '~~/types/events';

const props = defineProps<{
	events?: Array<Event>;
	isLoadingData: boolean;
	commmunityPrivileges: CommunityPrivilegeCategories;
	communityId: string;
}>();

const columns = [
	{
		id: 'name',
		accessorKey: 'name',
		header: 'NAME',
	},
	{
		id: 'dates',
		accessorKey: 'dates',
		header: 'DATES',
	},
	{
		id: 'bench_contact',
		accessorKey: 'bench_contact',
		header: 'CONTACTS',
	},
	{
		id: 'actions',
		header: 'ACTIONS',
	},
];
const page = ref<number>(1);
const pageCount = ref<number>(10);
const search = ref<string>('');
const pageFrom = computed(() => (Number(page.value) - 1) * Number(pageCount.value) + 1);
const pageTo = computed(() =>
	Math.min(Number(page.value) * Number(pageCount.value), Number(totalPages.value))
);
const filteredData = computed(() => {
	if (!props.events) return [];
	if (!search.value) return props.events;

	return props.events.filter((event) =>
		Object.values(event).some((value) =>
			String(value).toLowerCase().includes(search.value.toLowerCase())
		)
	);
});

const _total = computed(() => filteredData.value.length);
const filteredRows = computed(() =>
	filteredData.value.slice(
		(Number(page.value) - 1) * Number(pageCount.value),
		Number(page.value) * Number(pageCount.value)
	)
);

const eventPrivileges = computed(() => {
	return props.commmunityPrivileges.event;
});

const canEditEvent = (event: Event) => {
	return (
		(event.privileges === 'Owner' || event.privileges === 'Manager') && eventPrivileges.value.update
	);
};

const totalPages = computed(() => {
	return Math.ceil(Number(_total.value) / Number(pageCount.value));
});

const getCommunityEventEditLink = (row: Event, isChallenge: boolean = false) => {
	if (isChallenge) {
		return `/dashboard/projects_communities/${row.community_id}/events/${row._id}?challenges=true`;
	}
	return `/dashboard/projects_communities/${row.community_id}/events/${row._id}`;
};

function getContactsArray(contacts: string) {
	return contacts.split(',');
}
function getContactORCID(orcid: string) {
	return orcid.split(':')[1];
}
</script>

<style scoped lang="scss">
.community-events {
	min-height: 225px;
}
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

.column-link {
	display: block;
	min-width: 100px;
}
.btn-custom-badget a {
	width: 100%;
	height: 100%;
}
</style>
