<template>
  <div class="dashboard">
    <div class="w-100 container">
      {{  status  }}
    </div>

    <NuxtLink to="/dashboard/communities">Communities</NuxtLink>
  </div>
</template>

<script setup lang="ts">

const { status, data } = useAuth();
</script>

<style lang="scss" scoped>
.dashboard {
  .container {
    padding: 1rem;
  }
  &__title {
    padding-bottom: 50px;
    padding-top: 20px;
    h2 {
      border-color: rgb(226, 232, 240, 1);
      border-bottom-width: 1px;
    }
  }
}
</style>
