export default defineNuxtPlugin(() => {
  const config = useOebConfig();
  
  const api = $fetch.create({
    headers: {
      common: {
        Accept: "text/plain, */*",
      },
    },
    baseURL: config.value.MONITORING.baseURL,
    method: "POST",
  });

  return {
    provide: {
      api,
    },
  };
});
