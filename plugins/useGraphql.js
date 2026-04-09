export default defineNuxtPlugin(() => {
  const config = useOebConfig();

  const graphql = $fetch.create({
    headers: {
      common: {
        Accept: "text/plain, */*",
      },
    },
    baseURL: config.value.SCIENTIFIC_SERVICE_URL,
    method: "POST",
  });

  return {
    provide: {
      graphql,
    },
  };
});
