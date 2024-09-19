<template>
  <div class="container d-flex justify-content-center align-items-center">
    <div class="row col-8 shadow p-3 mb-5 bg-white rounded m-5">
      <div class="col-12 col-sm-12 col-md-6 py-5">
        <h2>Whoops!</h2>
        <p>{{ description }}</p>
        <div v-if="btnPath != null" class="mt-5">
          <UButton @click="handleError">Benchmarking communities</UButton>
        </div>
      </div>
      <div class="col-12 col-sm-12 col-md-6">
        <NuxtImg src="/images/illustrations/empty-state.svg" sizes="100vw sm:50vw md:400px"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const props = withDefaults(defineProps<{
  description: any;
  btnPath?: any;
}>(), {
  btnPath: null,
});

const router = useRouter();

const handleError = () => {
  if (props.btnPath) {
    router.push(props.btnPath);
  }
};
</script>
<style scoped >
.min-vh-80 {
  min-height: 80vh;
}

</style>
