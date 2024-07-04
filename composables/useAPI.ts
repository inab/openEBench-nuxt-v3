import type { UseFetchOptions } from 'nuxt/app'

export function useAPI<T, p>(
  url: string | (() => string),
  options: Omit<UseFetchOptions<T>, 'default'> & { default: () => T | Ref<T> },
  body: p
) {
  return useFetch(url, {
    ...options,
    ...body,
    $fetch: useNuxtApp().$graphql
  })
}