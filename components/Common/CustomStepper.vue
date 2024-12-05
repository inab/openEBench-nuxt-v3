<template>
  <div class="custom-stepper">
    <div class="custom-stepper__steps">
      <div
        v-for="(step, index) in props.steps"
        :key="index"
        class="custom-stepper__steps__step"
        :class="{ active: index === props.activeStep }"
        @click="props.setActiveStep(index)"
      >
        <div class="custom-stepper__steps--body">
          
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

const props = defineProps({
  steps: Array,
  activeStep: Number,
  setActiveStep: Function
})


</script>