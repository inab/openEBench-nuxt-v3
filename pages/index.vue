<template>
  <div>
    <WelcomeSection />
    <LandingSearcher />
    <LandingKeyFeatures />
    <LandingFeatureTease />
    <LandingNumbers />
    <LandingLogos />
  </div>
</template>

<script setup lang="ts">
import WelcomeSection from "~/components/Landing/LandingHeader.vue";
import LandingSearcher from "@/components/Landing/LandingSearcher.vue";
import LandingKeyFeatures from "@/components/Landing/LandingKeyFeatures.vue";
import LandingFeatureTease from "~/components/Landing/LandingFeatureTease.vue";
import LandingNumbers from "~/components/Landing/LandingNumbers.vue";
import LandingLogos from "~/components/Landing/LandingLogos.vue";
</script>
