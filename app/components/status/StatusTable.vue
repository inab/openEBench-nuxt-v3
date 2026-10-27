<template>
	<div class="status-table">
		<UTable
			:columns="columns"
			:data="services"
			:loading="isTableLoading"
			:loading-color="'primary'"
			loading-animation="carousel"
		>
			<template #service-cell="{ row }">
				<span v-if="row.original.status" class="status-ok">
					<font-awesome-icon :icon="['fas', 'circle-check']" />
				</span>
				<span v-else class="status-error">
					<font-awesome-icon :icon="['fas', 'triangle-exclamation']" />
				</span>
				{{ row.original.service }}
			</template>
			<template #status-cell="{ row }">
				{{ row.original.status ? 'Operational' : 'Down' }}
			</template>
			<template #response-cell="{ row }">
				{{ row.original.response }}
			</template>
			<template #page-cell="{ row }">
				<a target="_blank" :href="row.original.page">{{ row.original.page }}</a>
			</template>
		</UTable>
	</div>
</template>

<script setup lang="ts">
interface ServiceStatus {
	service: string;
	status: boolean | null;
	response: string | number | null;
	page: string;
}

defineProps<{
	services: ServiceStatus[];
	isTableLoading: boolean;
}>();

const columns = [
	{
		accessorKey: 'service',
		header: 'Service',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		accessorKey: 'response',
		header: 'Response time (ms)',
	},
	{
		accessorKey: 'page',
		header: 'Go to page',
	},
];
</script>
<style scoped lang="scss">
.status-ok {
	color: #a0c878;
}
.status-error {
	color: #e52020;
}
.status-table {
	padding: 30px 0 50px;
}
</style>
