<template>
  <div>
      <HeaderMenu />
      <div class="py-5 my-3"></div>
      <BreadcrumbsBar />
      <NuxtPage />
      <TheFooter />
      <div>
        <footer class="footer2 text-center py-1">
          Made with <font-awesome-icon :icon="['fas', 'heart']" style="color: #dc2626;" />
          in Barcelona.
        </footer>
      </div>
  </div>

</template>

<script setup lang="ts">
import HeaderMenu from "~/components/Header/HeaderMenu.vue"
import BreadcrumbsBar from "~/components/Common/BreadcrumbsBar.vue"
import TheFooter from "~/components/TheFooter.vue"

useHead
({
  title: 'OpenEBench - The ELIXIR gateway to benchmarking communities, software monitoring, and quality metrics',
  meta: [
    { name: 'description',
    content: 'My amazing site.' }
  ],
})
</script>

<style scoped lang="scss">
.embed-iframe-full-width {
	height: 100%;
}

.footer2 {
   position:fixed;
   left:0px;
   bottom:0px;
   height:35px;
   width:100%;
   background-color: #F5F5F5;
}
</style>
