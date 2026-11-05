<template>
	<div class="bioconda-install">
		This software is available in
		<a href="https://bioconda.github.io/" target="_blank" rel="noopener noreferrer">Bioconda</a>.
		Install it with:
		<div class="bioconda-install__code">
			<CodeBlock :code="code" />
		</div>
		Detailed installation instructions and how to set an environment are available
		<a href="https://mamba.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer">
			here </a
		>.
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CodeBlock from './CodeBlock.vue';

const props = withDefaults(
	defineProps<{
		name?: string;
	}>(),
	{
		name: '',
	}
);

const code = computed(() => `mamba install -c bioconda ${props.name}`.trim());
</script>

<style scoped>
.bioconda-install__code {
	display: flex;
	justify-content: center;
}
</style>
