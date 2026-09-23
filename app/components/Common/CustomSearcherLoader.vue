<template>
  <div class="w-100">
    <span class="loader"></span>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.loader {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: block;
  margin: 15px auto;
  position: relative;
  background: rgb(244, 124, 33, 0.7);
  box-sizing: border-box;
  animation: shadowExpandX 2s linear infinite alternate;
}

@keyframes shadowExpandX {
  0% {
    box-shadow:
      0 0,
      0 0;
    color: rgba(255, 255, 255, 0.2);
  }
  100% {
    box-shadow:
      -24px 0,
      24px 0;
    color: rgb(244, 124, 33, 0.4);
  }
}
</style>
