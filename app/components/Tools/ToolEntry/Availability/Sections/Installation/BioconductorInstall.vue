<template>
	<div class="bioconductor-install">
		This software is available in
		<a href="https://bioconductor.org/" target="_blank" rel="noopener noreferrer">Bioconductor</a>.
		To install it, start R and enter:
		<div class="bioconductor-install__code">
			<CodeBlock :code="code" />
		</div>

		Detailed installation instructions can be found
		<a :href="biocUrl" target="_blank" rel="noopener noreferrer">here</a>. Instructions on how to
		install Bioconductor can be found
		<a href="https://bioconductor.org/install/" target="_blank" rel="noopener noreferrer"> here </a
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

const code = computed(
	() =>
		`if (!require("BiocManager", quietly = TRUE)) {\n\tinstall.packages("BiocManager")\n}\n\nBiocManager::install(c("${props.name}"))`
);
const biocUrl = computed(
	() => `https://bioconductor.org/packages/release/bioc/html/${encodeURIComponent(props.name)}.html`
);
</script>

<style scoped>
.bioconductor-install__code {
	display: flex;
	justify-content: center;
}
</style>
