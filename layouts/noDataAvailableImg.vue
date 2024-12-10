<template>
  <div class="no-data">
    <div class="no-data__image">
      <div class="no-data__image__content">
        <emptyImg  alt="empty data" viewBox="0 0 650 1300"/>
      </div>
    </div>
    <div class="no-data_body">
      <h4 class="mt-3 text-h5 text--secondary text-center">
      <i>No {{info}} data available</i>
      </h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import emptyImg from "../../public/images/illustrations/empty-state.svg?component";
const props = defineProps<{
  info?: string;
}>();

</script>

<style scoped lang="scss">
.no-data {
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
