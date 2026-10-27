<template>
	<div class="dashboard-profile">
		<Dashboard />
	</div>
</template>

<script setup lang="ts">
import Dashboard from '@/components/Dashboard/Profile.vue';

definePageMeta({
	middleware: 'require-auth',
	auth: {
		authenticatedOnly: true,
		navigateUnauthenticatedTo: '/login-required',
	},
});
</script>
