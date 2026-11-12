<template>
	<div v-if="toolName" class="row mt-0 mb-2">
		<div class="col-12">
			<div class="text-subtitle d-flex justify-content-start align-items-center">
				<h3 class="title-label">Galaxy</h3>
			</div>
		</div>
		<div class="col-12 pt-1 ml-5 d-flex justify-content-start mt-2">
			<p class="mb-4 mt-2">
				{{ toolName }} is available ready-to-use in
				<a href="https://usegalaxy.eu/" target="_blank" rel="noopener noreferrer">
					GalaxyEU
				</a>.
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useToolEntryStore } from '~~/stores/tool_entry';
import { pickToolName } from '~/utils/toolDescription';

interface GalaxyTool {
	preferred_label?: string | string[];
	label?: string | string[];
	name?: string | string[];
}

const toolEntryStore = useToolEntryStore();
const toolName = computed(() => pickToolName(toolEntryStore.Tool as GalaxyTool));
</script>

<style scoped>
.title-label {
	margin: 0 0 8px;
	color: rgba(0, 0, 0, 50%);
	font-size: 1.2rem;
	font-weight: 500;
}
</style>
