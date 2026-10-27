<template>
	<div>
		<ClassificationTable
			:challenge-list="filterArray"
			:active-table="id"
			:mode="dataMode"
			:api-url="apiUrl"
			:bench-event-api-url="benchEventApiUrl"
		/>
	</div>
</template>

<script setup lang="ts">
import ClassificationTable from '@/components/Community/CommunityEvent/CommunityClassificationTable.vue';

defineProps<{
	id: string;
	filterArray: Array<string>;
	debounce?: {
		type: number;
		required: false;
		default: 100;
	};
}>();

const runtimeConfig = useRuntimeConfig();

const apiUrl = runtimeConfig.public
	? `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL.replace(/\/$/, '')}/graphql`
	: 'https://openebench.bsc.es/api/scientific/graphql';
const benchEventApiUrl = runtimeConfig.public
	? runtimeConfig.public.BENCH_EVENT_API_URL
	: 'https://openebench.bsc.es/rest/bench_event_api';
const dataMode = runtimeConfig.public ? runtimeConfig.public.ENVIRONMENT : 'dev-openebench';
</script>

<style scoped lang="scss">
.oeb-table-scroll {
	margin-top: 15px;
}
.community-event-classification {
	padding: 10px 0 20px;
}
</style>
