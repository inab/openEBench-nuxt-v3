<template>
    <UTooltip v-if="!minimal" :text="link" :popper="{ placement: 'bottom' }">
      <button
        type="button"
        class="link-chip btn btn-light rounded-pill d-inline-flex align-items-center gap-1"
        :class="{ 'link-chip--small': !big }"
        @click="openLink"
      >
        <UIcon :name="iconName" class="size-4" />
        <span v-if="text">{{ text }}</span>
      </button>
    </UTooltip>
  
    <button
      v-else
      type="button"
      class="link-chip link-chip--minimal btn btn-light rounded-pill d-inline-flex align-items-center"
      :class="{ 'link-chip--small': !big }"
      @click="openLink"
    >
      <UIcon :name="iconName" class="size-3" />
    </button>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  const props = withDefaults(
    defineProps<{
      text?: string;
      link?: string;
      icon: string; // formato 'mdi-web', igual que en el Vue2 original
      big?: boolean;
      minimal?: boolean;
    }>(),
    {
      text: '',
      link: '',
      big: false,
      minimal: false,
    }
  );
  
  // El Vue2 pasaba iconos en formato Vuetify ('mdi-web'), que coincide
  // exactamente con el nombre del icono en la colección mdi de Iconify.
  // Solo hace falta anteponer el prefijo 'i-' que usa UIcon.
  const iconName = computed(() => `i-${props.icon}`);
  
  function openLink() {
    if (props.link) {
      window.open(props.link, '_blank');
    }
  }
  </script>
  
  <style scoped>
  .link-chip {
    background-color: #f5f5f5;
    border: none;
    padding: 0.35em 0.75em;
  }
  
  .link-chip--small {
    font-size: 0.8rem;
    padding: 0.25em 0.6em;
  }
  
  .link-chip--minimal {
    padding: 0.35em 0.5em;
  }
  </style>