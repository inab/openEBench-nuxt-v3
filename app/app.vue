<script setup lang="ts">
useHead({
	title:
		'OpenEBench - The ELIXIR gateway to benchmarking communities, software monitoring, and quality metrics',
	meta: [
		{
			name: 'OpenEBench',
			content:
				'OpenEBench is the ELIXIR gateway to benchmarking communities, software monitoring, and quality metrics for life sciences tools and workflows.',
		},
	],
});
</script>

<template>
	<UApp>
		<NuxtLoadingIndicator />
		<div class="h-100">
			<NuxtLayout name="default" />
		</div>
	</UApp>
</template>

<style>
.main {
	padding-top: 60px;
}
</style>
