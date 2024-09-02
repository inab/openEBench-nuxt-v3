<template>
  <div ref="numberSection" class="d-flex flex-column align-items-center">
    <h1 class="display-4">{{ animatedNumber }}</h1>
    <p  class="description-text fw-medium">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { gsap } from 'gsap'


const props = defineProps<{
  number: number | null;
  description: string;
}>()

const animatedNumber = ref(0)
const numberSection = ref<HTMLElement | null>(null)

const animateNumber = () => {
  if (props.number !== null) {
    gsap.to(animatedNumber, {
      duration: 2,
      // We animate the number from 0 to the final value
      value: props.number,
      onUpdate: function() {
        // Update animatedNumber value to the current animated value
        animatedNumber.value = Math.ceil(this.targets()[0].value)
      },
      ease: 'power3.out',
    })
  }
}

onMounted(() => {
  if (numberSection.value) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && props.number !== null) {
          animateNumber()
          observer.disconnect()
        }
      })
    }, { threshold: 0.5 }) // Trigger when 50% of the element is visible

    observer.observe(numberSection.value)
  }
})

// Watch the number prop to ensure animation happens when it becomes available
watch(() => props.number, (newValue) => {
  if (newValue !== null && numberSection.value) {
    animateNumber()
  }
})
</script>

<style scoped>
.number-section {
  margin-top: 50px;
}

.description-text {
  font-size: 20px;
}
</style>
