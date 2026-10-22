<template>
	<div class="user-comminity-events">
		<div class="user-community-events__body">
			<div class="user-community-events__body__table">
				<div class="flex items-center justify-end gap-3 py-3">
					<UInput
						v-model="search"
						color="primary"
						variant="outline"
						icon="i-heroicons-magnifying-glass-20-solid"
						placeholder="Search ..."
						class="input-search"
					/>
				</div>
				<UTable
					:columns="columns"
					:loading="isLoadingData"
					:data="filteredRows"
					:ui="{
						tr: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer',
						th: 'text-left rtl:text-right px-2.5 py-2.5 text-gray-900 dark:text-white font-semibold text-sm',
						td: 'whitespace-nowrap px-3 py-3 text-sm',
					}"
				>
					<template #actions-cell="{ row }">
						{{ row.original }}

						<div v-if="row.original.actions">
							<div v-if="row.original.privileges === 'Owner' && row.original.actions.event">
								<template v-if="row.original.actions.event.read">
									<button title="View community" class="btn-event">
										<NuxtLink :to="`/dashboard/community/${row.original._id}?view`">
											<font-awesome-icon :icon="['fas', 'eye']" />
										</NuxtLink>
									</button>
								</template>
								<template v-if="row.original.actions.event.update">
									<button title="Edit community" class="btn-event">
										<NuxtLink :to="`/dashboard/community/${row.original._id}`">
											<font-awesome-icon :icon="['fas', 'pencil']" />
										</NuxtLink>
									</button>
								</template>
							</div>
							<div v-else-if="row.original.privileges === 'Manager' && row.original.actions.event">
								<template v-if="row.original.actions.event.read">
									<button title="View Entry" class="btn-event">
										<NuxtLink :to="`/dashboard/projects_communities/${row.original._id}?view`">
											<font-awesome-icon :icon="['fas', 'eye']" />
										</NuxtLink>
									</button>
								</template>
								<template v-if="row.original.actions.event.create">
									<button title="Create Entry" class="btn-event">
										<NuxtLink :to="`/dashboard/projects_communities/${row.original._id}`">
											<font-awesome-icon :icon="['fas', 'plus']" />
										</NuxtLink>
									</button>
								</template>
								<template v-if="row.original.actions.event.update">
									<button title="Edit Entry" class="btn-event">
										<NuxtLink :to="`/dashboard/projects_communities/${row.original._id}/edit`">
											<font-awesome-icon :icon="['fas', 'pencil']" />
										</NuxtLink>
									</button>
								</template>
							</div>
							<div v-else-if="row.original.privileges === 'anyone' && row.original.actions.event">
								<template v-if="row.original.actions.event.read">
									<button title="View community" class="btn-event">
										<NuxtLink :to="`/dashboard/community/${row.original._id}/edit`">
											<font-awesome-icon :icon="['fas', 'eye']" />
										</NuxtLink>
									</button>
								</template>
							</div>
						</div>
					</template>
					<template #challenges-cell="{ row }">
						<NuxtLink
							:to="`/dashboard/community/${row.original.community_id}/events/${row.original._id}/challenges`"
							title="View community events challenges"
							class="user-communities__events"
						>
							<font-awesome-icon :icon="['fas', 'circle-arrow-right']" />
						</NuxtLink>
					</template>
				</UTable>
				<div
					v-if="filteredRows.length > 0"
					class="flex flex-wrap justify-between items-center pt-2"
				>
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
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUser } from '~~/stores/user.ts';

defineProps<{
	isLoadingData: any;
}>();

const userStore = useUser();
const communitiesEventsData = computed(() => userStore.getUserCommunitiesEvents);
const page = ref<number>(1);
const pageCount = ref<number>(10);
const pageFrom = computed(() => (Number(page.value) - 1) * Number(pageCount.value) + 1);
const pageTo = computed(() =>
	Math.min(Number(page.value) * Number(pageCount.value), Number(totalPages.value))
);
const search = ref<string>('');

const columns = [
	{
		accessorKey: 'name',
		header: 'NAME',
	},
	{
		accessorKey: 'bench_contact',
		header: 'MANAGERS',
	},
	{
		accessorKey: 'actions',
		header: 'ACTIONS',
	},
	{
		accessorKey: 'challenges',
		header: 'CHALLENGES',
	},
];

const _total = ref(0);
const filteredRows = computed(() => {
	if (
		!communitiesEventsData.value.communityEvents ||
		communitiesEventsData.value.communityEvents.length === 0
	) {
		return [];
	}
	if (!search.value || search.value === '') {
		_total.value = communitiesEventsData.value.communityEvents.length;
		return communitiesEventsData.value.communityEvents.slice(
			(Number(page.value) - 1) * Number(pageCount.value),
			Number(page.value) * Number(pageCount.value)
		);
	}

	const filteredSearcher = communitiesEventsData.value.communityEvents.filter(
		(communityEvent: any) => {
			return Object.values(communityEvent).some((ch) => {
				return String(ch).toLowerCase().includes(search.value.toLowerCase());
			});
		}
	);

	_total.value = filteredSearcher.length;

	return filteredSearcher.slice(
		(Number(page.value) - 1) * Number(pageCount.value),
		Number(page.value) * Number(pageCount.value)
	);
});

const totalPages = computed(() => {
	return Math.ceil(Number(_total.value) / Number(pageCount.value));
});
</script>
