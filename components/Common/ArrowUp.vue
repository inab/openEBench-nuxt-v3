<template>
    <div>
        <button v-if="isRendered" @click="scrollToTop"
            class="fixed right-5 flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-primaryOeb-500 text-white hover:bg-secondaryOeb-500 transition-all"
            :class="{ 'opacity-0 pointer-events-none': !isVisible, 'opacity-100': isVisible }"
            style="bottom: 315px;" aria-label="Scroll to top">
            <UIcon name="i-heroicons-chevron-up-solid" class="text-white text-2xl font-extrabold" />
        </button>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isVisible = ref(false);
const isRendered = ref(false);

const handleScroll = () => {
    const scrollPosition = window.scrollY;

    // Show the button after scrolling past 200px
    if (scrollPosition > 200) {
        if (!isRendered.value) {
            isRendered.value = true;
        }
        setTimeout(() => {
            isVisible.value = true;
        }, 50);
    } else {
        isVisible.value = false;
        setTimeout(() => {
            if (!isVisible.value) {
                isRendered.value = false;
            }
        }, 800);
    }
};

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
button {
    transition: opacity 0.8s ease, transform 0.3s ease;
    opacity: 0;
    z-index: 2;
}

button.opacity-100 {
    opacity: 1;
}

button.opacity-0 {
    opacity: 0;
}

button:hover {
    transform: scale(1.2);
}
</style>
