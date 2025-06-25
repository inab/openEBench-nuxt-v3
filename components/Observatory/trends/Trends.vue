<template>
  <div>
        <!-- Main Content -->
        <div class="content p-4">
          <div class="row my-4">
            <h3 class="fw-bold mb-3">FAIRness Trends Analysis</h3>
            <p style="line-height: 1.9" class="mb-2 mt-0">
              Explore trends in key aspects to the FAIRness of research software.
            </p>
          </div>

          <!-- Collection Selector -->
          <div class="row mt-4">
            <div class="col-2"></div>
            <div class="col-8">
              <collectionSelector />
            </div>
            <div class="col-2"></div>
          </div>

          <!-- Licenses Section -->
          <div class="row mt-4">
            <div class="col-12">
              <div
                class="my-4 p-4 max-full bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <LicensesMain />
              </div>
            </div>
          </div>

          <!-- Versioning & Version Control -->
          <div class="row justify-center mt-4 d-flex align-items-stretch">
            <div class="col-5 d-flex">
              <div
                class="pb-5 my-4 p-4 w-100 bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <VersioningMain />
              </div>
            </div>

            <div class="col-7 d-flex">
              <div
                class="pb-5 my-4 p-4 w-100 bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <VersionControl />
              </div>
            </div>
          </div>

          <!-- Publications Section -->
          <div class="row mt-4">
            <div class="col-12">
              <div
                class="my-4 p-4 max-full bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <PublicationsMain />
              </div>
            </div>
          </div>


          <!-- Dependencies -->
          <div class="row mt-4">
            <div class="col-12">
              <div
                class="my-4 p-4 max-full bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <DependenciesMain />
              </div>
            </div>
          </div>

        </div>
      </div>
</template>

<script setup lang="ts">
import collectionSelector from "@/components/Observatory/CollectionSelector.vue";
import LicensesMain from "./licenses/LicensesMain.vue";
import VersioningMain from "./versioning/VersioningMain.vue";
import VersionControl from "./versionControl/VersionControl.vue";
import PublicationsMain from "./publications/PublicationsMain.vue";
import DependenciesMain from "./dependencies/DependenciesMain.vue"

</script>

<style scoped>

.content {
  margin-top: 20px;
}

.title {
  font-size: 1.5rem !important;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal !important;
}

.highlight-info {
  color: #0b579f;
  font-weight: 600;
}

.citation-article {
  font-size: 1rem !important;
}

a {
  color: #0b579f;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
  color: #6a98c4;
}
</style>
