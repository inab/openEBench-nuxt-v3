<template>
  <div>
    <HeaderMenu />
    <div class="py-4 my-3"></div>
    <ScrollToTop/>
    <NuxtPage />
    <TheFooter />
    <div>
      <footer class="footer2 text-center py-1">
        Made with
        <font-awesome-icon :icon="['fas', 'heart']" style="color: #dc2626" />
        in Barcelona.
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderMenu from "~/components/Header/HeaderMenu.vue";
import BreadcrumbsBar from "~/components/Common/BreadcrumbsBar.vue";
import ScrollToTop from '~/components/Common/ArrowUp.vue';
import TheFooter from "~/components/TheFooter.vue";
// useHead({
//   title:
//     "OpenEBench - The ELIXIR gateway to benchmarking communities, software monitoring, and quality metrics",
//   meta: [
//     {
//       name: "OpenEBench",
//       content:
//         "OpenEBench is the ELIXIR gateway to benchmarking communities, software monitoring, and quality metrics for life sciences tools and workflows.",
//     },
//   ],
// });
</script>

<style scoped>
.footer2 {
  position: fixed;
  left: 0px;
  bottom: 0px;
  height: 35px;
  width: 100%;
  background-color: #f5f5f5;
}
</style>
