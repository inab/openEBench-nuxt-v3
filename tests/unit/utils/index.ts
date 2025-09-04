//import { nuxtTestUtilSetup, renderPage } from '@nuxt/test-utils'
import { nuxtTestUtilSetup, renderPage } from '../utils';

export async function setupTest() {
  await nuxtTestUtilSetup(); // Prepara el entorno para las pruebas
}

export async function fetchPage(path: string) {
  return await renderPage(path); // Renderiza la página específica
}
