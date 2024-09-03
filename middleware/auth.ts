export default defineNuxtRouteMiddleware((to, from) => {
  const { status } = useAuth(); // Obtiene el estado de autenticación de la sesión

  // Verifica si la ruta requiere autenticación
  if (to.meta.auth && status.value !== "authenticated") {
    return navigateTo("/login"); // Redirige a login si el usuario no está autenticado
  }

  // Verifica si la ruta solo permite usuarios no autenticados
  if (to.meta.auth?.unauthenticatedOnly && status.value === "authenticated") {
    return navigateTo("/"); // Redirige a la página principal si el usuario ya está autenticado
  }
});
