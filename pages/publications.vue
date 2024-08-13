<template>
  <div class="team">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="container">
      <div class="w-100">
        <h2 class="text-primaryOeb-500 mb-4">OpenEBench Publications</h2>

        <p class="text-sm leading-6 mt-3">
          Here, you can find different scientific contributions, e.g. peer-reviewed
          articles, conference posters, and public pre-prints, reflecting the work
          carried out by the OpenEBench team and the multiple collaborations with
          the scientific communities that use and support the platform.
        </p>

        <p class="text-sm leading-6 mt-3">
          These contributions are organized into two sections to reflect whether
          they are core to the OpenEBench activities or contribute to the different
          communities.
        </p>
        <!-- Cite Us -->

        <div>
          <h3 class="section-title-border text-2xl font-normal mt-4">Cite Us</h3>
          <hr class="mb-4" />

          <p class="text-sm">
            If you use resources from OpenEBench in your research, please cite us as
            follows:
          </p>
          <p class="text-sm">
            OpenEBench: A benchmarking infrastructure for bioinformatics methods,
            tools, and web services. Part of the ELIXIR Tools platform. Developed by
            the Barcelona Supercomputing Center (BSC) in collaboration with partners
            within ELIXIR and beyond. Available at:
            <a href="https://openebench.bsc.es">https://openebench.bsc.es.</a>
          </p>
        </div>


        <br />

        <div class="community-tabs md:flex">
          <UTabs :items="tabsItems" class="w-full" :ui="{ list: { tab: { active: 'text-primaryOeb-500' } } }">
            <template #default="{ item, index, selected }">
              <div class="flex items-center gap-2 relative truncate">
                <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />
                <span class="">{{ item.label }}</span>
                <span v-if="selected"
                  class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
              </div>
            </template>
            <template #papers>
              <div class="p-4 custom-tab">
                Here will be the papers
              </div>
            </template>
            <template #posters>
              <div class="custom-tab">
                <div class="p-4">
                  Here will be the posters
                </div>
              </div>
            </template>
          </UTabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";

const route = useRoute();


const routeArray: { label: string, isActualRoute: boolean }[] = [
  { label: "About", isActualRoute: true },
  { label: "Publications", isActualRoute: true },
];
const tabsItems: { label: string, icon: string, slot: string }[] = [
  {
    label: "Manuscripts",
    icon: "i-heroicons-document-duplicate-16-solid",
    slot: "papers",
  },
  {
    label: "Posters",
    icon: "i-heroicons-document-chart-bar-16-solid",
    slot: "posters",
  },
];


</script>

<style lang="scss" scoped>
.community-tabs ul {
  margin: 0;
  padding: 0;
}

.custom-tab {
  border: 2px solid rgba(243, 244, 246);
  border-radius: 0.5rem;
}

.section-title-border {
  padding-bottom: 5px;
  color: #0b579f;
}
</style>
