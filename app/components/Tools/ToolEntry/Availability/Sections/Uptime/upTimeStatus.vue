<template>
	<div class="status-row">
		<div class="status-cell">
			<div class="status-title">CURRENT STATUS</div>
			<div class="status-text" :class="statusClass">{{ status }}</div>
		</div>

		<div class="status-cell">
			<div class="status-title">DAYS {{ status }}</div>
			<div class="status-text">{{ time }}</div>
		</div>

		<div v-if="url" class="status-cell status-cell--source">
			<div class="status-title">SOURCE</div>
			<a :href="url" target="_blank" rel="noopener noreferrer" class="visit-link">
				<UIcon name="i-mdi-open-in-new" aria-hidden="true" />
				<span>{{ shortUrl }}</span>
			</a>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
	defineProps<{
		status?: string;
		time?: number;
		url?: string;
	}>(),
	{
		status: 'UNKNOWN',
		time: 0,
		url: '',
	}
);

const shortUrl = computed(() => props.url.replace(/^https?:\/\//, ''));
const statusClass = computed(() => ({
	'text-up': props.status === 'UP',
	'text-down': props.status === 'DOWN',
}));
</script>

<style scoped>
.status-row {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	margin-bottom: 12px;
	padding-bottom: 12px;
	border-bottom: 1px solid rgba(0, 0, 0, 8%);
}

.status-cell {
	min-width: 0;
	padding: 0 12px;
	border-right: 1px solid rgba(0, 0, 0, 8%);
}

.status-cell:first-child {
	padding-left: 0;
}

.status-cell:last-child {
	padding-right: 0;
	border-right: 0;
}

.status-title {
	color: #888;
	font-size: 11px;
	font-weight: 500;
	letter-spacing: 0.04em;
	line-height: 1.3;
}

.status-text {
	font-size: 30px;
	font-weight: 500;
	line-height: 1.2;
}

.text-up {
	color: #2e7d32;
}

.text-down {
	color: #c62828;
}

.visit-link {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	max-width: 100%;
	margin-top: 4px;
	color: #0b579f;
	font-size: 13px;
	font-weight: 500;
	text-decoration: none;
	word-break: break-all;
}

.visit-link:hover {
	text-decoration: underline;
}

@media (max-width: 575.98px) {
	.status-row {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		row-gap: 12px;
	}

	.status-cell:nth-child(2) {
		border-right: 0;
	}

	.status-cell--source {
		grid-column: 1 / -1;
		padding-left: 0;
	}
}
</style>
