<template>
	<div class="community-summary">
		<!-- eslint-disable-next-line vue/no-v-html -- content sanitized with DOMPurify -->
		<div v-html="markup"></div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CommunityMetadata } from '~~/types/communities';
import { marked } from 'marked';

const props = defineProps<{
	metadata: CommunityMetadata;
}>();

const markdownString: ComputedRef<string | null> = computed(
	() => props.metadata.project_summary ?? null
);

const markup = computed(() =>
	sanitizeHtml(marked.parse(markdownString.value ?? '', { async: false }))
);
</script>
