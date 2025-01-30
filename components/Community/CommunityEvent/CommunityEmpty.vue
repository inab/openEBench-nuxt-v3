<template>
  <div class="community-empty">
    <div class="community-empty__image">
      <div class="community-empty__image__content">
        <emptyImg alt="community-empty" viewBox="-100 -100 900 1000"/>
      </div>
    </div>
    <div class="text">
      <h2 class="mt-10 text-h4 text--secondary text-center">
        No benchmarking results yet...
      </h2>
      <h3 class="mt-5 text-h5 text--secondary text-center">
        Come back soon to see some benchmarking results.
      </h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import emptyImg from "../../public/images/illustrations/empty-state.svg?component";
</script>

<style scoped lang="scss">
.community-empty {
  color: rgba(0, 0, 0, 0.6);

  &__image {
    &__content {
      display: flex;
      justify-content: center;

      img {
        height: 100%;
      }
    }
  }
}
.text{
  margin-top: -185px;
}
</style>
