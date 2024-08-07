import { NuxtAuthHandler } from "#auth";
import KeycloakProvider from "next-auth/providers/keycloak";

const runtimeConfig = useRuntimeConfig();

function getSignInUrl() {
  const baseUrl = `${runtimeConfig.public.KEYCLOAK_HOST}/auth/realms/${runtimeConfig.public.KEYCLOAK_REALM}/protocol/openid-connect/auth?`;
  const urlParams = new URLSearchParams({
    protocol: "oauth2",
    response_type: "code",
    access_type: "",
    client_id: runtimeConfig.public.KEYCLOAK_CLIENT_ID,
    redirect_uri: "",
    scope: "openid",
    code_challenge_method: "S256",
    response_mode: "fragment",
  });
  return `${baseUrl}${urlParams.toString()}`;
}

export default NuxtAuthHandler({
  pages: {
    signIn: getSignInUrl(),
  },
  providers: [
    KeycloakProvider.default({
      clientId: runtimeConfig.public.KEYCLOAK_CLIENT_ID,
      authorization: {
        url: "https://inb.bsc.es/auth/realms/openebench/protocol/openid-connect/auth?",
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
});
