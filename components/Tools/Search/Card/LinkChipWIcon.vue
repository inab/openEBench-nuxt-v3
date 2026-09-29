<template>
    <UTooltip v-if="!minimal" :text="link" :popper="{ placement: 'bottom' }">
      <button
        type="button"
        class="link-chip btn btn-light rounded-pill d-inline-flex align-items-center gap-1"
        :class="{ 'link-chip--small': !big }"
        @click="openLink"
      >
        <UIcon :name="icon" class="size-4" />
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
      icon: string;
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