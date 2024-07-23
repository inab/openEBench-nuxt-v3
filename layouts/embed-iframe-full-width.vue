<template>
	<div class="embed-iframe-full-width">
		<HeaderMenu />
    <BreadcrumbsBar />
	</div>
	
</template>

<script setup lang="ts">
import HeaderMenu from "~/components/Header/HeaderMenu.vue"
import BreadcrumbsBar from "~/components/Common/BreadcrumbsBar.vue"

useHead
({
  title: 'OpenEBench - The ELIXIR gateway to benchmarking communities, software monitoring, and quality metrics',
  meta: [
    { name: 'description',
    content: 'My amazing site.' }
  ],
})
</script>

<style scoped lang="scss">
.embed-iframe-full-width {
	height: 100%;
}
</style>
