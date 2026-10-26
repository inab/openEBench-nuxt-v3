import { NuxtAuthHandler } from '#auth';
import type { JWT } from 'next-auth/jwt';
import KeycloakProvider from 'next-auth/providers/keycloak';

declare module 'next-auth' {
	interface User {
		orcid?: string;
		'oeb:roles'?: unknown;
	}
	interface Account {
		orcid?: string;
		'oeb:roles'?: unknown;
	}
	interface Session {
		accessToken?: string;
		token?: string;
		preferred_username?: string;
		resource_access?: unknown;
		orcid?: string;
		oeb_roles?: unknown;
		user?: User & { 'oeb:roles'?: unknown };
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		accessToken?: string;
		refreshToken?: string;
		accessTokenExpires?: number;
		id_token?: string;
		orcid?: string | null;
		preferred_username?: string;
		resource_access?: unknown;
		'oeb:roles'?: unknown;
		error?: string;
	}
}

// The provider is exposed under `.default` when loaded as CJS from the server bundle
const providerModule = KeycloakProvider as unknown as
	typeof KeycloakProvider | { default: typeof KeycloakProvider };
const Keycloak = typeof providerModule === 'function' ? providerModule : providerModule.default;

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}
const runtimeConfig = { ...useRuntimeConfig(), public: usePublicConfig() };

// next-auth >= 4.22 only reads NEXTAUTH_URL to build its URLs (it ignores the host nuxt-auth passes)
process.env.NEXTAUTH_URL ||= runtimeConfig.public.BASE_URL;

const refreshAccessToken = async (token: JWT) => {
	try {
		const details = {
			client_id: runtimeConfig.public.KEYCLOAK_CLIENT_ID,
			authorization_code: token.accessToken,
			grant_type: 'refresh_token',
			refresh_token: token.refreshToken,
		};
		const formBody: string[] = [];

		Object.entries(details).forEach(([key, value]) => {
			const encodedKey = encodeURIComponent(key);
			const encodedValue = encodeURIComponent(String(value));
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

		if (!response.ok) throw refreshedTokens;
		return {
			...token,
			accessToken: refreshedTokens.access_token,
			accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
			refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Si no hay nuevo refresh token, usar el antiguo
		};
	} catch {
		return {
			...token,
			error: 'RefreshAccessTokenError',
		};
	}
};

export default NuxtAuthHandler({
	secret: runtimeConfig.authSecret,
	providers: [
		Keycloak({
			clientId: runtimeConfig.public.KEYCLOAK_CLIENT_ID,
			clientSecret: '',
			issuer: `${runtimeConfig.public.KEYCLOAK_HOST}/auth/realms/${runtimeConfig.public.KEYCLOAK_REALM}`,
			checks: ['pkce', 'state'],
			wellKnown: `${runtimeConfig.public.KEYCLOAK_HOST}/auth/realms/${runtimeConfig.public.KEYCLOAK_REALM}/.well-known/openid-configuration`,
			authorization: {
				url: `${runtimeConfig.public.KEYCLOAK_HOST}/auth/realms/${runtimeConfig.public.KEYCLOAK_REALM}/protocol/openid-connect/auth`,
				params: {
					type: 'oauth2',
					version: '2.0',
					response_type: 'code',
					scope: 'openid email profile offline_access',
					response_mode: 'query',
					state: 'state',
					grand_type: 'authorization_code',
					client_id: runtimeConfig.public.KEYCLOAK_CLIENT_ID,
					code_challenge_method: 'S256',
					idToken: true,
					protocol: 'auth2',
					redirect_uri: `${runtimeConfig.public.BASE_URL}/api/auth/callback/keycloak`,
				},
				...({
					clientAuthentication: { token_endpoint_auth_method: 'none', method: 'none' },
				} as object),
				...({
					client: {
						token_endpoint_auth_method: 'none',
					},
				} as object),
			},
			httpOptions: {
				timeout: 100000,
			},
			userinfo: {
				url: `${runtimeConfig.public.KEYCLOAK_HOST}/auth/realms/${runtimeConfig.public.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
			},
			...({ session: { jwt: true, maxAge: 30 * 60 + 10 } } as object),
			...({
				cookies: {
					sessionToken: {
						name: `__Secure-next-auth.session-token`,
						options: {
							httpOnly: true,
							sameSite: 'lax',
						},
					},
				},
			} as object),
		}),
	],
	...({
		async debugHandler(req: { url?: string }, _res: unknown, next: () => void) {
			console.log('Auth request:', req.url);
			console.log('Config:', runtimeConfig.public);
			next();
		},
	} as object),
	events: {
		async signIn() {},
		...({
			async error(message: unknown) {
				console.log('error: ', message);
			},
		} as object),
	},
	callbacks: {
		async redirect({ baseUrl }) {
			return baseUrl;
		},
		async jwt({ token, user, account }) {
			if (account && user) {
				token.accessToken = account.access_token;
				token.id_token = account.id_token;
				token.orcid = account.orcid ?? null;
				token['oeb:roles'] = user['oeb:roles'] || account['oeb:roles'];
				token.refreshToken = account.refresh_token;
				const decodedAccessToken: unknown = JSON.parse(atob(account.access_token!.split('.')[1]!));
				if (isRecord(decodedAccessToken) && decodedAccessToken['oeb:roles']) {
					token['oeb:roles'] = decodedAccessToken['oeb:roles'];
				}
			}

			if (user) {
				token['oeb:roles'] = user['oeb:roles'] ?? token['oeb:roles'];
				if (user.orcid) {
					token.orcid = user.orcid;
				}
			}

			if (Date.now() < (token.accessTokenExpires ?? 0)) {
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
			session.oeb_roles = token['oeb:roles'];
			if (session.user) session.user['oeb:roles'] = token['oeb:roles'];
			return session;
		},
	},
	debug: true,
});
