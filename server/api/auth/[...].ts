import { NuxtAuthHandler } from "#auth";
import KeycloakProvider from "next-auth/providers/keycloak";

const runtimeConfig = useRuntimeConfig();

export default NuxtAuthHandler({
  providers: [
    KeycloakProvider.default({
      clientId: runtimeConfig.public.KEYCLOAK_CLIENT_ID,
      clientSecret: "",
      issuer: runtimeConfig.public.KEYCLOAK_HOST + "/auth/realms/" + runtimeConfig.public.KEYCLOAK_REALM,
      checks: ["pkce", "state"],
      wellKnown: runtimeConfig.public.KEYCLOAK_HOST + "/auth/realms/" + runtimeConfig.public.KEYCLOAK_REALM + "/.well-known/openid-configuration",
      authorization: {
        url:
          runtimeConfig.public.KEYCLOAK_HOST + "/auth/realms/" + runtimeConfig.public.KEYCLOAK_REALM +"/protocol/openid-connect/auth",
        params: {
          type: "oauth2",
          version: "2.0",
          response_type: "code",
          scope: "openid email orcid profile",
          response_mode: "query",
          state: "state",
          grand_type: "authorization_code",
          client_id: runtimeConfig.public.KEYCLOAK_CLIENT_ID,
          code_challenge_method: "S256",
          idToken: true,
          protocol: "auth2",
          redirect_uri: "http://localhost:3001/api/auth/callback/keycloak"
        },
        clientAuthentication: {
          token_endpoint_auth_method: "none",
          method: "none"
        },
        client: {
          token_endpoint_auth_method: "none",
        }
      },
    }),
  ],
  events: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async error(message) {
      console.log("error: ", message);
    }
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id_token = account.id_token;
        token.preferred_username = account.preferred_username;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.token = token.id_token;
      session.preferred_username = token.preferred_username;
      return session;
    },
  },
  debug: true,
});
