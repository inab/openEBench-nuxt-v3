<template>
  <div class="community-empty">
    <div class="community-empty__image">
      <div class="community-empty__image__content">
        <img
          src="~/assets/images/illustrations/empty-state.svg"
          alt="community-empty"
        />
      </div>
    </div>
    {{ item }}
    <div class="community-empty_body">
      <h2 class="mt-10 text-h4 text--secondary text-center">
        No benchmarking results yet...
      </h2>
      <h3 class="mt-5 text-h5 text--secondary text-center">
        Come back soon to see some benchmarking results.
      </h3>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.community-empty {
  color: rgba(0, 0, 0, 0.6);
  &__image {
    &__content {
      height: 300px;
      display: flex;
      justify-content: center;
      img {
        height: 100%;
      }
    }
  }
}
</style>
