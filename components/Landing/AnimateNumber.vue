<template>
  <div ref="numberSection" class="d-flex flex-column align-items-center">
    <h1 class="display-4 thicker-number">{{ animatedNumber }}</h1>
    <p class="description-text fw-medium">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { gsap } from 'gsap'

const props = defineProps<{
  number: number | null;
  description: string;
}>()

const animatedNumber = ref(0)
const numberSection = ref<HTMLElement | null>(null)
const route = useRoute()
let checkInterval: number | null = null

// Function to animate the number
const animateNumber = () => {
  if (props.number !== null) {
    gsap.to(animatedNumber, {
      duration: 2,
      value: props.number,
      onUpdate: function () {
        animatedNumber.value = Math.ceil(this.targets()[0].value)
      },
      ease: 'power3.out',
    })
  }
}

// Function to check if the element is in the viewport
const checkIfInView = () => {
  if (numberSection.value) {
    const rect = numberSection.value.getBoundingClientRect()
    const inViewport = rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    if (inViewport) {
      animateNumber()
    }
  }
}

// Function to check the current roue (back browser button check)
const checkRouteAndViewport = () => {
  if (route.path === '/') {
    checkIfInView()
  }
}

onMounted(() => {
  // Perform an immediate check when the component mounts
  checkRouteAndViewport()

  // Set an interval to check the route and viewport every 250ms (check the back button of browser)
  checkInterval = window.setInterval(() => {
    checkRouteAndViewport()
  }, 250)
})

onUnmounted(() => {
  if (checkInterval !== null) {
    clearInterval(checkInterval)
  }
})

</script>

<style scoped>
.number-section {
  margin-top: 50px;
}

.thicker-number {
  font-weight: 300;
  text-shadow: 0.5px 0.5px 0 #000000;
}

.description-text {
  font-size: 20px;
  text-shadow: 0.5px 0.5px 0 #000000;
}
</style>
