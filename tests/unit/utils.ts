import { setup } from '@nuxt/test-utils';

export function nuxtTestUtilSetup() {
  return setup({
    dev: false,
    server: false,
    browser: false,
  });
}
