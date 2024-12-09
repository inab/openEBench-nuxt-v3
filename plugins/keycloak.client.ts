import Keycloak from 'keycloak-js';

const generateCodeVerifier = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const generateCodeChallenge = async (codeVerifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return btoa(String.fromCharCode(...hashArray))
    .replace(/+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const generateAuthorizationUrl = async(runtimeConfig) => {
  const baseUrl = `${runtimeConfig.public.KEYCLOAK_HOST}/auth/realms/${runtimeConfig.public.KEYCLOAK_REALM}/protocol/openid-connect/auth`;
  
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const params = new URLSearchParams({
    type: "oauth2",
    version: "2.0",
    response_type: "code",
    scope: "openid email orcid profile offline_access",
    response_mode: "query",
    state: "state",
    grant_type: "authorization_code",
    client_id: runtimeConfig.public.KEYCLOAK_CLIENT_ID,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    idToken: "true",
    protocol: "oauth2",
    redirect_uri: `${runtimeConfig.public.BASE_URL}/api/auth/callback/keycloak`,
  });

  return { url: `${baseUrl}?${params.toString()}`, codeVerifier  };
};

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  const keycloak = new Keycloak({
    url: `${runtimeConfig.public.KEYCLOAK_HOST}/auth/realms/${runtimeConfig.public.KEYCLOAK_REALM}/protocol/openid-connect/token`,
    realm: `${runtimeConfig.public.KEYCLOAK_REALM}`,
    clientId: `${runtimeConfig.public.KEYCLOAK_CLIENT_ID}`,
  });

  const authorizationUrl = generateAuthorizationUrl(runtimeConfig);

  return {
    provide: {
      keycloakAuthUrl: authorizationUrl,
    },
  };
});
