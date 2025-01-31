export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();

  const githubapp = $fetch.create({
    headers: {
      common: {
        Accept: "text/plain, */*",
      },
    },
    baseURL: runtimeConfig.public.GITHUBAPP_API_URL,
    method: "POST",
  });

  return {
    provide: {
      githubapp,
    },
  };
});
