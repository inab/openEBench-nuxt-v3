<template>
	<div class="community-dataset">
		<div>
			<span class="community-dataset__title"> Find the datasets available for this community </span>
		</div>
		<div
			v-if="filteredRows.length > 0"
			class="flex justify-content-end py-2.5 border-b border-gray-200 dark:border-gray-700"
		>
			<UInput
				v-model="search"
				color="neutral"
				variant="outline"
				icon="i-heroicons-magnifying-glass"
				placeholder="Search ..."
				class="input-search"
			/>
		</div>
		<UTable
			:columns="columns"
			:data="filteredRows"
			:ui="{
				tr: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer',
				th: 'text-left rtl:text-right px-2.5 py-2.5 text-gray-900 dark:text-white font-semibold text-sm',
				td: 'whitespace-nowrap px-3 py-3 text-sm',
			}"
		>
			<template #name-cell="{ row }">
				<span>{{ row.original.name }}</span>
			</template>
			<template #type-cell="{ row }">
				<span>{{ row.original.type }}</span>
			</template>
			<template #download-cell="{ row }">
				<a
					v-if="row.original.datalink?.uri ?? row.original.datalinks?.[0]?.uri"
					:href="row.original.datalink?.uri ?? row.original.datalinks?.[0]?.uri"
					target="_blank"
					rel="noopener noreferrer"
				>
					Download
				</a>
				<span v-else>Not available</span>
			</template>
		</UTable>
		<div v-if="filteredRows.length > 0" class="flex flex-wrap justify-between items-center pt-2">
			<div>
				<span class="text-sm leading-5">
					Showing
					<span class="font-medium">{{ pageFrom }}</span>
					to
					<span class="font-medium">{{ pageTo }}</span>
					of
					<span class="font-medium">{{ totalPages }}</span>
					results
				</span>
			</div>
			<UPagination
				v-model:page="page"
				class="pagination"
				:items-per-page="pageCount"
				:total="datasets.length"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Dataset {
	name?: string;
	type?: string;
	datalink?: { uri?: string };
	datalinks?: { uri?: string }[];
	[key: string]: unknown;
}

const props = defineProps<{
	datasets: Dataset[];
	communityId: string;
}>();

const page = ref(1);
const pageCount = ref(10);
const search = ref('');
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed(() => Math.min(page.value * pageCount.value, totalPages.value));
let _total = 0;

const columns = [
	{
		id: 'name',
		accessorKey: 'name',
		header: 'Name',
		enableSorting: false,
	},
	{
		id: 'type',
		accessorKey: 'type',
		header: 'Type',
		enableSorting: false,
	},
	{
		id: 'download',
		accessorKey: 'download',
		header: 'Download',
		enableSorting: false,
	},
];

const datasets = computed(() => {
	return props.datasets.map((dataset) => {
		return {
			name: dataset.name,
			type: dataset.type,
			download: dataset.datalink ? dataset.datalink.uri : null,
		};
	});
});

const filteredRows = computed(() => {
	if (!search.value) {
		_total = props.datasets.length;
		return props.datasets.slice((page.value - 1) * pageCount.value, page.value * pageCount.value);
	}

	const filteredSearcher = props.datasets.filter((challenge) => {
		return Object.values(challenge).some((value) => {
			return String(value).toLowerCase().includes(search.value.toLowerCase());
		});
	});
	_total = filteredSearcher.length;
	return filteredSearcher.slice((page.value - 1) * pageCount.value, page.value * pageCount.value);
});

const totalPages = computed(() => {
	return _total;
});
</script>
<style scoped lang="scss">
.community-dataset {
	&__title {
		display: flex;
		align-items: center;
		color: #0b579f;
		font-size: 18px;
		font-weight: 600;
	}
}
table {
	a {
		color: var(--color-primary-500);
		text-decoration: none;
		&:hover {
			color: var(--color-primary-400);
		}
	}
}
</style>
