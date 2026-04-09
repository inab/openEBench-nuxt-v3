import { loadOebConfig } from '@/composables/useOebConfig';
import { defineNuxtPlugin } from 'nuxt/app';

export default defineNuxtPlugin(async () => {
  console.log('[plugin] config.client running...');
  await loadOebConfig();
  console.log('[plugin] config.client done');
});