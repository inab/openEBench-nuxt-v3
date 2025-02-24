import { NuxtAuthHandler } from "#auth";
import KeycloakProvider from "next-auth/providers/keycloak";
const runtimeConfig = useRuntimeConfig();

const refreshAccessToken = async (token: JWT) => {
  try {
    const details = {
      client_id: runtimeConfig.public.KEYCLOAK_CLIENT_ID,
      client_secret: "secrettt", 
      authorization_code: token.accessToken,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
    };
    const formBody: string[] = [];

    Object.entries(details).forEach(([key, value]: [string, any]) => {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);
      formBody.push(encodedKey + "=" + encodedValue);
    });

    const formData = formBody.join("&");
    const url = `${runtimeConfig.public.KEYCLOAK_HOST}/auth/realms/${runtimeConfig.public.KEYCLOAK_REALM}/protocol/openid-connect/token`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formData,
    });

    const refreshedTokens = await response.json();

    if (!response.ok) throw refreshedTokens;
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Si no hay nuevo refresh token, usar el antiguo
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};

export default NuxtAuthHandler({
  secret: '2990de7a246eb8aa80684cc357ebd54615a5add237758af78388f25e68383db4',
  providers: [
    KeycloakProvider.default({
      clientId: runtimeConfig.public.KEYCLOAK_CLIENT_ID,
      clientSecret: "",
      issuer: `${runtimeConfig.public.KEYCLOAK_HOST}/auth/realms/${runtimeConfig.public.KEYCLOAK_REALM}`,
      checks: ["pkce", "state"],
      wellKnown: `${runtimeConfig.public.KEYCLOAK_HOST}/auth/realms/${runtimeConfig.public.KEYCLOAK_REALM}/.well-known/openid-configuration`,
      authorization: {
        url: `${runtimeConfig.public.KEYCLOAK_HOST}/auth/realms/${runtimeConfig.public.KEYCLOAK_REALM}/protocol/openid-connect/auth`,
        params: {
          type: "oauth2",
          version: "2.0",
          response_type: "code",
          scope: "openid email orcid profile offline_access",
          response_mode: "query",
          state: "state",
          grand_type: "authorization_code",
          client_id: runtimeConfig.public.KEYCLOAK_CLIENT_ID,
          code_challenge_method: "S256",
          idToken: true,
          protocol: "auth2",
          redirect_uri: `${runtimeConfig.public.BASE_URL}/api/auth/callback/keycloak`,
        },
        clientAuthentication: {
          token_endpoint_auth_method: "none",
          method: "none",
        },
        client: {
          token_endpoint_auth_method: "none",
        },
      },
      httpOptions: {
        timeout: 100000,
      },
      userinfo: {
        url: `${runtimeConfig.public.KEYCLOAK_HOST}/auth/realms/${runtimeConfig.public.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
      },
      session: {
        jwt: true,
        maxAge: 30 * 60 + 10,
      },
      cookies: {
        sessionToken: {
          name: `__Secure-next-auth.session-token`,
          options: {
            httpOnly: true,
            sameSite: "lax",
          },
        },
      },
    }),
  ],
  async debugHandler(req, res, next) {
    console.log('Auth request:', req.url);
    console.log('Config:', runtimeConfig.public);
    next();
  },
  events: {
    async signIn() {
      return true;
    },
    async error(message) {
      console.log("error: ", message);
    },
  },
  callbacks: {
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, user, account, profile }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.id_token = account.id_token;
        token.orcid = account.orcid ?? null;
        token["oeb:roles"] = user["oeb:roles"] || account["oeb:roles"];
        token.refreshToken = account.refresh_token;
        const decodedAccessToken = JSON.parse(
          atob(account.access_token.split(".")[1]),
        );
        if (decodedAccessToken["oeb:roles"]) {
          token["oeb:roles"] = decodedAccessToken["oeb:roles"];
        }
      }

      if (user) {
        token["oeb:roles"] = user["oeb:roles"] ?? token["oeb:roles"];
        if(user.orcid) {
          token.orcid = user.orcid;
        }
      }

      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      const refreshedToken = await refreshAccessToken(token);
      return refreshedToken;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.token = token.id_token;
      session.preferred_username = token.preferred_username;
      session.resource_access = token.resource_access;
      session.orcid = token.orcid ?? '';
      session.oeb_roles = token["oeb:roles"];
      session.user["oeb:roles"] = token["oeb:roles"];
      return session;
    },
  },
  debug: true,
});