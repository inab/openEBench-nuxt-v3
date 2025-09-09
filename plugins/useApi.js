export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  
  const api = $fetch.create({
    headers: {
      common: {
        Accept: "text/plain, */*",
      },
    },
    baseURL: runtimeConfig.public.MONITORING.baseURL,
    method: "POST",
  });

  return {
    provide: {
      api,
    },
  };
});
