<template>
  <div class="community-summary">
    <div v-html="markup"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { CommunityMetadata } from "@/types/communities";
import { marked } from "marked";
import DOMPurify from "dompurify";

const props = defineProps<{
  metadata: CommunityMetadata;
}>();

const markdownString: ComputedRef<string | null> = computed(
  () => props.metadata.project_summary ?? null,
);

const markup = computed(() =>
  DOMPurify.sanitize(marked(markdownString.value ?? "")),
);
</script>
