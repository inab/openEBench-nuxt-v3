<template>
  <div v-if="markdownString" class="community-event-summary">
    <div class="community-event-summary__markup" v-html="markup"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { marked } from "marked";
import DOMPurify from "dompurify";

const props = defineProps<{
  markdown: {
    summary?: string;
  };
}>();

const markdownString: ComputedRef<string | null> = computed(
  () => props.markdown.summary ?? null,
);

const markup = computed(() =>
  DOMPurify.sanitize(marked(markdownString.value ?? "")),
);
</script>

<style lang="scss">
.community-event-summary {
  padding-top: 5px;
  &__markup {
    h1 {
      padding-top: 0;
      color: #396fba;
      font-size: 38px;
    }
    a {
      color: #0b579f;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
        color: #6a98c4;
      }
    }
    strong{
      font-weight: 500;
    }
    h2,
    h3 {
      padding-bottom: 8px;
    }
    p,
    ul {
      font-size: 0.875rem !important;
      font-weight: 400;
      line-height: 1.25rem;
      letter-spacing: 0.0178571429em !important;
    }
    ul {
      padding-bottom: 16px;
    }
    img {
      max-height: 80vh;
      max-width: 100%;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
    table {
      display: block;
      width: 100%;
      width: max-content;
      max-width: 100%;
      overflow: auto;
      margin-bottom: 30px;
      border: solid 1px #ddeeee;
      border-collapse: collapse;
      border-spacing: 0;
      font-size: 12px;
      tbody td {
        border: 1px solid theme("colors.primary.100");
        padding: 10px;
      }
      thead th {
        background-color: theme("colors.primary.100");
        border: 1px solid theme("colors.primary.100");
        padding: 10px;
      }
    }
  }
}
</style>
