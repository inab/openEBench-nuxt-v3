export default defineNuxtPlugin(() => {
  const config = useOebConfig();

  const githubapp = $fetch.create({
    headers: {
      common: {
        Accept: "text/plain, */*",
      },
    },
    baseURL: config.value.GITHUBAPP_API_URL,
    method: "POST",
  });

  return {
    provide: {
      githubapp,
    },
  };
});
