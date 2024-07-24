<template>
    <div>
        <HeaderMenu />
        <div class="py-5 my-3"></div>
        <BreadcrumbsBar />
        <NuxtPage />
        <TheFooter />
        <div>
            <footer class="text-center my-1">
                Made with <font-awesome-icon :icon="['fas', 'heart']" style="color: #dc2626;" />
			    in Barcelona.
            </footer>
        </div>
    </div>
  
</template>

<script>
import HeaderMenu from "~/components/Header/HeaderMenu.vue"
import BreadcrumbsBar from "~/components/Common/BreadcrumbsBar.vue"
import TheFooter from "~/components/TheFooter.vue"
</script>