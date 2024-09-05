import { NuxtAuthHandler } from "#auth";
import KeycloakProvider from "next-auth/providers/keycloak";

const runtimeConfig = useRuntimeConfig();

const refreshAccessToken = async (token: JWT) => {
  console.log("refreshing token ...");
  try {
    if (Date.now() > token.refreshTokenExpired) throw Error;
    const details = {
      client_id: runtimeConfig.public.KEYCLOAK_CLIENT_ID,
      client_secret: "",
      grant_type: ['authorization_code'],
      refresh_token: token.refreshToken,
    };
    const formBody: string[] = [];
    Object.entries(details).forEach(([key, value]: [string, any]) => {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);
      formBody.push(encodedKey + '=' + encodedValue);
    });
    const formData = formBody.join('&');
    const url = `${runtimeConfig.public.KEYCLOAK_HOST}/auth/realms/${runtimeConfig.public.KEYCLOAK_REALM}/protocol/openid-connect/token`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formData,
    });
    const refreshedTokens = await response.json();

    console.log("token refreshed ...")

    if (!response.ok) throw refreshedTokens;
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpired: Date.now() + (refreshedTokens.expires_at - 15) * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      refreshTokenExpired:
        Date.now() + (refreshedTokens.refresh_expires_in - 15) * 1000,
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
};

export default NuxtAuthHandler({
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
          scope: "openid email orcid profile",
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
      userinfo: {
        url: `${runtimeConfig.public.KEYCLOAK_HOST}/auth/realms/${runtimeConfig.public.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
      },
      session: {
        jwt: true,
        maxAge: 60 * 60 * 24 * 7,
      }
    }),
  ],
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
      // Initial sign in
      if (account && user) {
        console.log("initial sigin in");
        // Add access_token, refresh_token and expirations to the token right after signin
        token.accessToken = account.access_token;
        token.id_token = account.id_token;
        token.refreshToken = account.refreshToken;
        token.accessTokenExpired =
          Date.now() + (account.expires_at - 15);
        token.refreshTokenExpired =
          Date.now() + (account.refresh_expires_in - 15);
        token.user = user;
        return token;
      }

      console.log("account: ", account);
      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpired) {
        console.log("token not expired yet");
        return token;
      }

      return refreshAccessToken(token);

      // if (account) {
      //   token.accessToken = account.access_token;
      //   token.id_token = account.id_token;
      //   token.preferred_username = account.preferred_username;
      //   token.resource_access = profile.resource_access;
      // }
      // if (typeof user !== typeof undefined){
      //   token.user = user;
      // }
      //return token;
    },
    async session({ session, token }) {
      console.log("calling new session");
      console.log("token: ", token);
      console.log("session: ", session);
      session.accessToken = token.accessToken;
      session.token = token.id_token;
      session.preferred_username = token.preferred_username;
      session.resource_access = token.resource_access;
      return session;
    },
  },
  debug: true,
});