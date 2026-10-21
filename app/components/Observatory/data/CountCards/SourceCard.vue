<template>
	<div class="source-card flex items-center gap-3 rounded px-3 py-2">
		<div class="source-logo flex shrink-0 items-center justify-center">
			<img
				:src="`/images/observatory/${label}-logo.svg`"
				:alt="`${title} logo`"
				class="source-logo-image"
			/>
		</div>
		<div class="counts-text min-w-0 flex-1">
			<h3>{{ title }}</h3>
			<h2>{{ formatNumber(Number(count)) }}</h2>
		</div>
	</div>
</template>
<script setup lang="ts">
// PROPS
const props = defineProps<{
	title: string;
	count: number;
	label: string;
}>();

function formatNumber(value: number): string {
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
</script>

<style scoped>
.source-logo {
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 9999px;
	background-color: #001752f8;
}

.source-logo-image {
	display: block;
	width: 2.5rem;
	height: 2.5rem;
	object-fit: contain;
}

.source-card {
	box-sizing: border-box;
	background-color: white;
	width: 13em;
	height: 4em;
}

.counts-text {
	text-align: left;
}

.source-card h3 {
	font-family: 'Open Sans', sans-serif;
	font-size: 0.9rem;
	font-weight: 500;
	line-height: normal;
	margin: 0 0 0.2rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.source-card h2 {
	font-family: 'Open Sans', sans-serif;
	font-size: 1.35rem;
	font-weight: 500;
	line-height: normal;
	margin: 0;
}
</style>
