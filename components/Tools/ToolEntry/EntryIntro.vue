<template>
  <UCard variant="outline py-2">
    <div class="entry-intro">

      <div class="entry-intro-header">

        <span class="entry-intro-name">{{ name }}</span>
        <!-- Type -->
        <div class="entry-intro-types">
          <ChipType
            v-for="item in typeList"
            :key="item"
            :type="item"
          />
        </div>
      </div>

      <!-- Version -->
       {{ cleanVersions }}
      <div v-if="cleanVersions.length" class="entry-intro__versions">
        <span
          v-for="(item, i) in visibleVersions"
          :key="i"
          class="entry-intro__version-chip"
        >
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





    </div>

  </UCard>

  
      <div>
  
        <div class="entry-intro__links">
          <!-- en el template -->
            <LinkChipWIcon
            v-if="webpage?.[0]"
            :link="webpage"
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

  </template>
  
  <script setup lang="ts">
  import { computed, ref } from 'vue';
  import { marked } from 'marked';
  import ChipType from '@/components/Tools/Search/Card/ChipType.vue';
  import LinkChipWImage from '@/components/Tools/Search/Card/LinkChipWImage.vue';
  import LinkChipWIcon from '@/components/Tools/Search/Card/LinkChipWIcon.vue';
  
  interface Webpage {
    term?: string;
  }
  
  const props = defineProps<{
    name: string;
    description: string;
    type: string | string[];
    version: string[];
    webpage: Webpage[];
    sourcesLabels: Record<string, string>;
  }>();

  console.log(props.version)

  
  const showAllVersions = ref(false);
  const maxVisibleVersions = 3;
  
  const typeList = computed(() =>
    Array.isArray(props.type) ? props.type : [props.type]
  );
  
  const cleanVersions = computed(() =>
    (props.version || []).filter(
      (item) => item && String(item).trim().toLowerCase() !== 'none'
    )
  );
  
  const visibleVersions = computed(() =>
    showAllVersions.value
      ? cleanVersions.value
      : cleanVersions.value.slice(0, maxVisibleVersions)
  );
  
  const hiddenVersionCount = computed(() =>
    showAllVersions.value
      ? 0
      : Math.max(cleanVersions.value.length - maxVisibleVersions, 0)
  );
  
  const isVersionsCollapsible = computed(
    () => cleanVersions.value.length > maxVisibleVersions
  );
  
  const renderedDescription = computed(() =>
    props.description ? marked(props.description) : ''
  );
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
    padding: 4px 8px;
    border: 1px solid var(--color-primary, #1976d2);
    border-radius: 16px;
    color: var(--color-primary, #1976d2);
    font-size: 0.875rem;
    font-weight: 700;
    background: none;
  }
  
  .entry-intro__version-chip--action {
    cursor: pointer;
  }
  
  .entry-intro__description {
    font-size: 1rem;
  }
  
  .entry-intro__links {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  </style>