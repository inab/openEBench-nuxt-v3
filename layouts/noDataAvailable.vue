<template>
  <div class="no-data-available">
    <NuxtImg src="/images/illustrations/empty-state.svg" class="image mt-5" />
    <h4 class="mt-10 text text-center">No {{ item }} available.</h4>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  item: any;
}>();
</script>

<style lang="scss" scoped>
.no-data-available {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  .image {
    width: 450px;
    height: auto;
  }
  .text {
    font-size: 24px;
    font-weight: 400;
  }
}
</style>
