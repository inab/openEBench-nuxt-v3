export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    headers: {
      Accept: "text/plain, */*",
    },
  });

  return {
    provide: {
      api,
    },
  };
});
