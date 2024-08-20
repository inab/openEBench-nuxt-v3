import { NuxtAuthHandler } from '#auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
const runtimeConfig = useRuntimeConfig();

// Función para generar un valor de estado aleatorio
function generateRandomState() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Función para generar el code_challenge
async function generateCodeChallenge() {
  // Aquí deberías implementar la lógica para generar el code_challenge.
  // Esto puede involucrar el uso de una función hash (como SHA-256) en un code_verifier.
  return 'TMEQMp8fAEtUtHpQQzEJLVN6baChwwZLDm47NssuYEw'; // Ejemplo
}

export default NuxtAuthHandler({
  providers: [
    KeycloakProvider.default({
      clientId: runtimeConfig.public.KEYCLOAK_CLIENT_ID,
      issuer: runtimeConfig.public.KEYCLOAK_REALM,
    }),
  ],
  pages: {
    signIn: '/api/auth/custom-signin',  // Personaliza la página de inicio de sesión si lo deseas
    signOut: '/custom-logout', // Personaliza la página de cierre de sesión si lo deseas
    error: '/auth/error', // Página personalizada de error
    verifyRequest: '/auth/verify-request', // Página de solicitud de verificación (para el login con email)
    newUser: '/auth/new-user' // Página personalizada para nuevos usuarios
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Si se especifica una URL de callback explícita, úsala.
      // Si no, redirige al home
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  }
});
