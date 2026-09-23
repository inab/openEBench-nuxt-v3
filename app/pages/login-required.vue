<template>
  <div class="login-required">
    <div class="container">
      <h1 class="text-primaryOeb-500">Requires authentication</h1>
      <div class="login-required__body">
        <NuxtImg
          class="login-required__body__img"
          src="images/illustrations/authentication-img.svg"
          alt="authentication"
        />
        <p>Please login to view this page.</p>
      </div>
    </div>
  </div>
</template>
<script setup></script>
<style scoped lang="scss">
.login-required {
  &__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
    &__img {
      max-height: 300px;
    }
    p {
      font-size: 1.5rem;
      color: theme("colors.gray.500");
      text-align: center;
    }
  }
}
</style>
