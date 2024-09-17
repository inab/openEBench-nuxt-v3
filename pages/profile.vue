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
    authenticatedOnly: true, // Solo permite acceso a usuarios autenticados
    navigateUnauthenticatedTo: '/login-required' // Redirige a los no autenticados
  }
})

</script>