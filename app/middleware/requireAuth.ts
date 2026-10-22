export default defineNuxtRouteMiddleware((to, from) => {
	const { status } = useAuth();
	const auth = to.meta.auth as
		| { authenticatedOnly?: boolean; unauthenticatedOnly?: boolean }
		| undefined;

	if (auth?.authenticatedOnly && status.value !== 'authenticated') {
		return navigateTo('/login-required');
	}

	if (auth?.unauthenticatedOnly && status.value === 'authenticated') {
		return navigateTo('/');
	}
});
