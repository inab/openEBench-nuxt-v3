<template>
  <div class="container d-flex justify-content-center align-items-center">
    <div class="row col-8 shadow p-3 mb-5 bg-white rounded m-5">
      <div class="col-12 col-sm-12 col-md-6 py-5">
        <h2>Whoops!</h2>
        <p class="mt-3">
          {{ description }} <i>{{ id }}</i>
        </p>
        <div v-if="btnPath != null" class="mt-4">
          <UButton @click="handleError">{{ btnText }}</UButton>
        </div>
      </div>
      <div class="col-12 col-sm-12 col-md-6">
        <emptyImg  class="img" viewBox="400 -50 900 1500"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import emptyImg from "../../public/images/illustrations/empty-state.svg?component";
const props = withDefaults(
  defineProps<{
    description: any;
    id: any;
    btnPath?: any;
    btnText?: any;
  }>(),
  {
    btnPath: null,
    id: null,
    btnText: null,
  },
);

const router = useRouter();

const handleError = () => {
  if (props.btnPath) {
    router.push(props.btnPath);
  }
};
</script>
<style scoped>
.min-vh-80 {
  min-height: 80vh;
}

.img{
  margin-bottom: -290px;
}
</style>
