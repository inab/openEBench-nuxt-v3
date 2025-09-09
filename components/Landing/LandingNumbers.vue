<template>
  <div class="langing-numbers">
    <div class="container h-100">
      <div class="row h-100 align-items-center">
        <div class="col-12 col-sm-6 col-lg-3 mb-3 mb-lg-0 h-100">
          <AnimateNumber description="Communities" :number="communitiesCount" />
        </div>
        <div class="col-12 col-sm-6 col-lg-3 mb-3 mb-lg-0 h-100">
          <AnimateNumber description="Tools" :number="toolsCount" />
        </div>
        <div class="col-12 col-sm-6 col-lg-3 mb-3 mb-lg-0 h-100">
          <AnimateNumber description="Resources" :number="resourcesCount" />
        </div>
        <div class="col-12 col-sm-6 col-lg-3 mb-3 mb-lg-0 h-100">
          <AnimateNumber description="Project Spaces" :number="projectsCount" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDashboard } from '@/stores/dashboard.js';

import AnimateNumber from "~/components/Landing/AnimateNumber.vue";

const store = useDashboard();
store.getResourcesCount();
store.getCommunities();
store.getToolsCount();

const communitiesCount = computed(() => store.CommunitiesCount || []);
const resourcesCount = computed(() => store.ResourcesCount || []);
const projectsCount = computed(() => store.ProjectsCount || []);
const toolsCount = computed(() => store.ToolsCount || []);

</script>

<style scoped lang="scss">
.langing-numbers {
  min-height: 170px;
  color: white;
  background-image: url("~/assets/images/backgrounds/material2_parallax.webp");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  /* Parallax effect */
  display: flex;
  align-items: center;

  .container {
    height: 100%;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .col {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
  }
}
</style>
