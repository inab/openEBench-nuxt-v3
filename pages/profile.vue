<template>
    <div class="dashboard-profile">
        <Dashboard />
    </div>
</template>

<script setup lang="ts">
import Dashboard from "@/components/Dashboard/Profile.vue";

definePageMeta({
  middleware: 'auth',
  auth: {
    authenticatedOnly: true,
    navigateUnauthenticatedTo: '/login-required'
  }
})

</script>