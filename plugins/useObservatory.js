export default defineNuxtPlugin(() => {
  const config = useOebConfig();

  const observatory = $fetch.create({
    headers: {
      common: {
        Accept: "text/plain, */*",
      },
    },
    baseURL: config.value.OBSERVATORY_URI,
    method: "POST",
  });

  return {
    provide: {
      observatory,
    },
  };
});
