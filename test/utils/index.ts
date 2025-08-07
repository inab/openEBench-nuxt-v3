//import { nuxtTestUtilSetup, renderPage } from '@nuxt/test-utils'
import { nuxtTestUtilSetup, renderPage } from "../utils";

export async function setupTest() {
  await nuxtTestUtilSetup();
}

export async function fetchPage(path: string) {
  return await renderPage(path);
