<template>
    <div class="landing-animate-number w-100 h-100">
        <div class="">
            <div v-observe-visibility="visibilityChanged" 
            :class="`${'counter'} ${'counter'}-${type}`"
            ref="numberCounter">
                <span class="counter-value">{{ displayValue }}</span>
            </div>
            <div class="counter-text">{{ counterText }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import gsap from 'gsap';
import { ObserveVisibility as vObserveVisibility } from 'vue3-observe-visibility'
import { ref, watch } from 'vue'

const tl = gsap.timeline({ repeat: 0 });

const props = defineProps({
    value: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        default: "linear"
    }
})

let numberProps = computed(() =>props.value)
let counterText = props.type=='Project'?'Project Spaces':props.type
let displayValue = ref(0)
let tweenValue = ref(0) //  ??
let isVisibled = ref(false)
let inputValue = ref(0)
let start = 0
let className = `${'counter'}-${props.type}`
watch(inputValue, () => {
    tl.fromTo("."+className, {
            innerText: start,
            scale: 1,
        },
        {
            innerText: numberProps.value,
            snap: { innerText: 1 },
            duration: 5,
            ease: "linear"
        }
    )
})

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
            font-size: 30px
        }
        
    }
    .counter-text {
        font-size: 20px;
        text-align: center;
        font-weight: 500;
        letter-spacing: .0125em !important;
    }
}

</style>