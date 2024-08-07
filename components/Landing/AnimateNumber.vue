<template>
  <div class="landing-animate-number w-100 h-100">
    <div class="">
      <div
        ref="numberCounter"
        v-observe-visibility="visibilityChanged"
        :class="`${'counter'} ${'counter'}-${type}`"
      >
        <span class="counter-value">{{ displayValue }}</span>
      </div>
      <div class="counter-text">{{ counterText }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import gsap from "gsap";
import { ref, watch } from "vue";

const tl = gsap.timeline({ repeat: 0 });

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    default: "linear",
  },
});

const numberProps = computed(() => props.value);
const counterText = props.type == "Project" ? "Project Spaces" : props.type;
const displayValue = ref(0);
const tweenValue = ref(0); //  ??
const isVisibled = ref(false);
const inputValue = ref(0);
const start = 0;
const className = `${"counter"}-${props.type}`;

watch(inputValue, () => {
  tl.fromTo(
    "." + className,
    {
      innerText: start,
      scale: 1,
    },
    {
      innerText: numberProps.value,
      snap: { innerText: 1 },
      duration: 5,
      ease: "linear",
    },
  );
});

function visibilityChanged(isVisible: boolean, entry: any) {
  if (!isVisibled.value && isVisible) {
    isVisibled.value = isVisible;
    inputValue.value = numberProps.value;
  } else {
    isVisibled.value = false;
    inputValue.value = 0;
  }
}
</script>

<style scoped lang="scss">
.landing-animate-number {
  display: flex;
  justify-content: center;
  align-items: center;
  .counter {
    font-size: 50px;
    text-align: center;
    width: 100%;
    .counter-value {
      font-size: 30px;
    }
  }
  .counter-text {
    font-size: 20px;
    text-align: center;
    font-weight: 500;
    letter-spacing: 0.0125em !important;
  }
}
</style>
