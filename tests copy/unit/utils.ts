import { setup } from '@nuxt/test-utils'

export function nuxtTestUtilSetup() {
  return setup({
    dev: false, // No es necesario si solo estás probando la lógica
    server: false, // Esto deshabilita el servidor para pruebas unitarias
    browser: false, // No necesitas un navegador para pruebas unitarias
  })
}
