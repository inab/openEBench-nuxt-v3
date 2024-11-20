<template>
  <div>
    <NuxtLayout :name="layout">
      <template #trends>
        <div class="p-4">
          <div class="row my-4">
            <h5 class="">FAIRness Trends Analysis</h5>
            <p style="line-height: 1.9" class="mb-2 mt-0">
              Explore trends in key aspects to the FAIRness of research software.
            </p>
          </div>


          <!-- collectionSelector -->
          <div class="row mt-4">
            <div class="col-2"></div>
            <div class="col-8">
              <collectionSelector />
            </div>
            <div class="col-2"></div>
          </div>
          <div class="row mt-4">
            <div class="col-12">
              <div
                class="my-4 p-4 max-full bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <LicensesMain />
              </div>
            </div>
          </div>
        </div>
      </template>
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
import collectionSelector from "@/components/Observatory/CollectionSelector.vue"
import LicensesMain from "@/components/Observatory/trends/licenses/LicensesMain.vue"

const layout = 'observatory'




</script>
