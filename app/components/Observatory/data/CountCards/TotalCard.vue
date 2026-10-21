<template>
	<div class="main-row flex items-center gap-3 rounded px-3 py-2 blue-shadow">
		<div class="total-icon flex shrink-0 items-center justify-center rounded-full">
			<UIcon name="i-mdi-database" class="w-6 h-6" />
		</div>
		<div class="min-w-0">
			<p class="number-text">Total</p>
			<p class="number">{{ formatNumber(Number(count)) }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
// PROPS
const props = defineProps<{
	count: null;
}>();

function formatNumber(value: number) {
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
</script>

<style scoped>
.main-row {
	box-sizing: border-box;
	width: 13em;
	height: 4em;
	background-color: #001752f8;
}

.total-icon {
	width: 2.5rem;
	height: 2.5rem;
	color: #001752f8;
	background-color: white;
}

.blue-shadow {
	box-shadow: 0 0 10px 0 rgba(18, 121, 219, 60%);
	transition: box-shadow 0.3s ease-in-out;
}

.blue-shadow:hover {
	box-shadow: 0 0 20px 0 rgba(18, 121, 219, 80%);
}

.number {
	font-size: 1.35rem;
	color: white !important;
	margin: 0;
	line-height: normal;
}

.number-text {
	color: white !important;
	font-family: Roboto, sans-serif;
	font-size: 0.9rem;
	font-weight: 600;
	line-height: normal;
	word-break: initial;
	margin: 0 0 0.2rem;
}

.number-highlight {
	font-weight: 700;
}
</style>
