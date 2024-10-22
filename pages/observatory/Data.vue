<template>
  <div>
    <NuxtLayout :name="layout">
      <div class="p-4">
        <div class="row my-4">
          <h5 class="">Explore Data Integration at the Software Observatory</h5>
        </div>
        <div class="row my-4">
          <div class="col-6">
            <p style="line-height: 1.9" class="mb-0 mt-0">
              Our system periodically pulls metadata from
            <strong>eight diverse sources</strong>, enriched further with dynamic
            data on repository activity, website availability, and trends in
            publication citations. As each piece of metadata flows into our
            system, it undergoes a meticulous harmonization process, ensuring
            uniformity and relevance across varying data types and sources.
            <br /><br />
            On this page, you can <strong>Visualize the Integration</strong>: dive
            into our enriched database and see firsthand the scope of each
            source's contribution, the comprehensive depth of metadata, and the
            overlaps that characterize our dataset.
            </p>
          </div>
          <div class="col-6">
            <img src="/images/observatory/observatory_illustration_5.svg"
            alt="Illustration_5"
            class="illustration5" />
          </div>

        </div>

        <!-- collectionSelector -->
        <div class="row mt-4">
          <div  class="col-2"></div>
          <div class="col-8">
            <collectionSelector/>
          </div>
          <div class="col-2"></div>
        </div>
        
        <!-- MainCards -->
        <div class="bg-neutral-100 my-4">
          <MainCards/>
        </div>

      </div>
    </NuxtLayout>
  </div>
</template>
  
<script setup lang="ts">
import collectionSelector from "@/components/Observatory/CollectionSelector.vue"
import MainCards from "@/components/Observatory/data/CountCards/MainCards.vue"

const layout = 'observatory'

</script>

<style scoped>
.illustration5{
  width: 80%;
}
</style>