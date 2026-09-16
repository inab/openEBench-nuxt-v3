<template>
    <UTooltip :text="link" :popper="{ placement: 'bottom' }">
      <button
        v-if="type !== 'other'"
        type="button"
        class="link-chip-img btn btn-light rounded-pill d-inline-flex align-items-center gap-1"
        :class="{ 'link-chip-img--small': !big }"
        @click="openLink"
      >
        <!-- Alternativa con @nuxt/image, ya lo tenéis instalado:
             <NuxtImg :src="icon" width="20" height="20" :alt="label" />
             Con <img> plano basta para PNGs pequeños y estáticos como estos. -->
        <img :src="icon" :alt="label" class="link-chip-img__logo" />
        <span v-if="!minimal">{{ label }}</span>
      </button>
    </UTooltip>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  // Los PNG deben vivir en /public/icons/ (Nuxt3/Vite ya no soporta
  // require() para assets estáticos como en Nuxt2).
  const ICONS: Record<string, string> = {
    biotools: '/icons/elixir-logo-black.png',
    bioconda: '/icons/bioconda-logo-black.png',
    github: '/icons/github-logo-black.png',
    bioconductor: '/icons/bioconductor-logo-black.png',
    galaxy: '/icons/galaxy-logo-black.png',
    toolshed: '/icons/galaxy-logo-black.png',
    sourceforge: '/icons/sourceforge-logo-black.png',
    bitbucket: '/icons/bitbucket-logo-black.png',
    openebench: '/icons/OEB-minimal-logo-black.png',
  };
  
  const LABELS: Record<string, string> = {
    biotools: 'bio.tools',
    bioconda: 'Bioconda',
    github: 'GitHub',
    bioconductor: 'Bioconductor',
    galaxy: 'GalaxyEU',
    toolshed: 'Toolshed',
    sourceforge: 'Sourceforge',
    bitbucket: 'Bitbucket',
    openebench: 'OpenEBench',
    other: 'link',
  };
  
  const props = withDefaults(
    defineProps<{
      link: string;
      type: string;
      text: string;
      big?: boolean;
      minimal?: boolean;
    }>(),
    {
      big: false,
      minimal: false,
    }
  );
  
  const icon = computed(() => ICONS[props.type] ?? '');
  const label = computed(() => LABELS[props.type] ?? props.text);
  
  function openLink() {
    window.open(props.link, '_blank');
  }
  </script>
  
  <style scoped>
  .link-chip-img {
    background-color: #f5f5f5;
    border: none;
    padding: 0.35em 0.75em;
  }
  
  .link-chip-img--small {
    font-size: 0.8rem;
    padding: 0.25em 0.6em;
  }
  
  .link-chip-img__logo {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
  </style>