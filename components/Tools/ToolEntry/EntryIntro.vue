<template>
  <UCard variant="outline py-2">
    <div class="entry-intro">
      <div class="entry-intro-header">
        <span class="entry-intro-name">{{ name }}</span>
        <!-- Type -->
        <div class="entry-intro-types">
          <ChipType v-for="item in typeList" :key="item" :type="item" />
        </div>
      </div>

      <!-- Version -->
      <div v-if="cleanVersions.length" class="entry-intro__versions my-3">
        <span v-for="(item, i) in visibleVersions" :key="i" class="entry-intro__version-chip">
          {{ item }}
        </span>
        <button
          v-if="hiddenVersionCount > 0"
          type="button"
          class="entry-intro__version-chip entry-intro__version-chip--action"
          @click="showAllVersions = true"
        >
          +{{ hiddenVersionCount }} more
        </button>
        <button
          v-else-if="showAllVersions && isVersionsCollapsible"
          type="button"
          class="entry-intro__version-chip entry-intro__version-chip--action"
          @click="showAllVersions = false"
        >
          show less
        </button>
      </div>

      <!-- Description -->
      <p class="entry-intro__description" v-html="renderedDescription"></p>

      <!-- Links -->
      <div>
        <div class="entry-intro__links">
          <LinkChipWIcon
            v-if="primaryWebpage"
            :link="primaryWebpage"
            text="Homepage"
            icon="mdi-web"
            big
          />
          <LinkChipWImage
            v-for="[key, value] in Object.entries(sourcesLabels)"
            :key="key"
            :link="value"
            :type="key"
            :text="key"
            light
            big
          />
        </div>
      </div>
    </div>
  </UCard>

  
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { marked } from 'marked';
import ChipType from '@/components/Tools/Search/Card/ChipType.vue';
import LinkChipWImage from '@/components/Tools/Search/Card/LinkChipWImage.vue';
import LinkChipWIcon from '@/components/Tools/Search/Card/LinkChipWIcon.vue';

type EntryValue = string | number | null | undefined | { term?: string };

interface Webpage {
  term?: string;
}

const props = defineProps<{
  name: string;
  description: string;
  type: EntryValue | EntryValue[];
  version: EntryValue | EntryValue[];
  webpage: string | Webpage | Array<string | Webpage>;
  sourcesLabels: Record<string, string>;
}>();

const showAllVersions = ref(false);
const maxVisibleVersions = 3;

const toText = (value: EntryValue) => {
  if (value == null) return '';
  if (typeof value === 'object') return value.term || '';
  return String(value);
};

const toTextList = (value: EntryValue | EntryValue[]) => {
  const values = Array.isArray(value) ? value : [value];
  return values.map(toText).filter((item) => item.trim() !== '');
};

const typeList = computed(() => toTextList(props.type));

const cleanVersions = computed(() =>
  toTextList(props.version).filter((item) => item && String(item).trim().toLowerCase() !== 'none')
);

const primaryWebpage = computed(() => {
  const webpages = Array.isArray(props.webpage) ? props.webpage : [props.webpage];
  return webpages.map((item) => toText(item)).find(Boolean) || '';
});

const visibleVersions = computed(() =>
  showAllVersions.value ? cleanVersions.value : cleanVersions.value.slice(0, maxVisibleVersions)
);

const hiddenVersionCount = computed(() =>
  showAllVersions.value ? 0 : Math.max(cleanVersions.value.length - maxVisibleVersions, 0)
);

const isVersionsCollapsible = computed(() => cleanVersions.value.length > maxVisibleVersions);

const renderedDescription = computed(() => (props.description ? marked(props.description) : ''));
</script>

<style scoped>
.entry-intro {
  padding: 0 12px 0 12px;
}

.entry-intro-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.entry-intro-name {
  font-size: 2.125rem;
  font-weight: 700;
  word-break: break-word;
  overflow-wrap: break-word;
}

.entry-intro-types {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  gap: 4px;
}

.entry-intro__versions {
  margin-top: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.entry-intro__version-chip {
  padding: 2px 6px;
  border: 1px solid var(--color-primary, #0b579f);
  border-radius: 16px;
  color: var(--color-primary, #0b579f);
  font-size: 0.875rem;
  font-weight: 700;
  background: none;
}

.entry-intro__version-chip--action {
  cursor: pointer;
}

/* .entry-intro__description {
  font-size: 1rem;
} */

.entry-intro__links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
