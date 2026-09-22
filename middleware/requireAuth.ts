export default defineNuxtRouteMiddleware((to, from) => {
  const { status } = useAuth();

  if (to.meta.auth?.authenticatedOnly && status.value !== "authenticated") {
    return navigateTo("/login-required");
  }

  if (to.meta.auth?.unauthenticatedOnly && status.value === "authenticated") {
    return navigateTo("/");
  }
});
