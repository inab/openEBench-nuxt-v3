<template>
   <div>
    <WelcomeSection />
    <LandingSearcher />
    <LandingKeyFeatures />
   </div>
 </template>

 <script setup lang="ts">
  import WelcomeSection from '~/components/Landing/LandingHeader.vue';
  import LandingSearcher from '@/components/Landing/LandingSearcher.vue';
  import LandingKeyFeatures from '@/components/Landing/LandingKeyFeatures.vue'
</script>