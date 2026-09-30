<template>
  <div class="tool-brief">
    <div class="tool-brief__bar">
      <div class="container-fluid">
        <div class="tool-brief__content">
          <div class="tool-brief__name">
            {{ name }}
          </div>

          <div class="tool-brief__links">
            <LinkChipWIcon
              v-if="webpage?.length && webpage[0]?.term"
              :link="webpage[0].term"
              text=""
              icon="mdi-web"
              big
              minimal
            />

            <LinkChipWImage
              v-for="[key, value] in Object.entries(sourcesLabels || {})"
              :key="key"
              :link="value"
              :type="key"
              text=""
              light
              big
              minimal
            />

            <div class="tool-brief__types">
              <ChipType
                v-for="item in normalizedTypes"
                :key="item"
                :type="item"
                class="me-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="tool-brief__divider" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ChipType from '@/components/Tools/Search/Card/ChipType.vue';
import LinkChipWImage from '@/components/Tools/Search/Card/LinkChipWImage.vue';
import LinkChipWIcon from '@/components/Tools/Search/Card/LinkChipWIcon.vue';

const props = defineProps<{
  name: string;
  type: string | string[];
  version: string[];
  sourcesLabels: Record<string, string>;
  webpage: Array<{ term?: string }>;
}>();

const normalizedTypes = computed(() => {
  if (Array.isArray(props.type)) {
    return props.type;
  }

  return props.type ? [props.type] : [];
});
</script>

<style scoped>
.tool-brief {
  position: fixed;
  top: 64px;
  left: 0;
  width: 100%;
  z-index: 100;
  background: white;
}

.tool-brief__bar {
  height: 56px;
  border-bottom: 1px solid #dee2e6;
}

.tool-brief__content {
  height: 56px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.tool-brief__name {
  flex: 0 0 auto;
  font-size: 1.25rem;
  font-weight: 500;
  white-space: nowrap;
}

.tool-brief__links {
  display: flex;
  align-items: center;
  min-width: 0;
}

.tool-brief__types {
  display: flex;
  align-items: center;
  margin-left: 12px;
}

/* @media (max-width: 767.98px) {
  .tool-brief {
    display: none;
  }
} */

@media (min-width: 1450px) {
  .tool-brief__content {
    padding-left: calc(50% - 702px);
    padding-right: calc(50% - 702px);
  }
}
</style>