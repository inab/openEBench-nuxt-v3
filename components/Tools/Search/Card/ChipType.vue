<template>
  <UBadge class="chip-type px-2 mr-2" variant="outline" size="md">{{ text }}</UBadge>
</template>
  <script setup lang="ts">
  import { computed } from 'vue';
  import { getSoftwareTypeDescription } from '@/static/dictionaries/softwareTypes';
  
  const props = defineProps<{
    type: string;
  }>();
  
  const text = computed(() => getSoftwareTypeDescription(props.type));
  </script>
  
  <style scoped>
  .chip-type {
    color: #0b579f;
    height: 30px;
  }
  
  .chip-type--small {
    font-size: 0.75rem;
    padding: 0.25em 0.6em;
  }
  </style>