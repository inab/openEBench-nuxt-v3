<template>
  <div>
    <UCard :ui="{body: {padding: 'px-3 py-3 sm:p-3'}}">
      <h6>{{ title }}</h6>
      <div class="grid justify-items-center">
        <p>ResultsCardExpansible</p>
        <FAIRplot 
          :toolName="toolMetadata.label[0]"
          :height="220"
          :label="title"
          :colorFill="color"
          :indicatorsLabels="indicatorsLabels"
        />
      
      </div>
      <div class="grid justify-items-end">
        <UButton 
          class="text-primaryOeb-500 text-xs expandBtn" 
          variant="ghost" 
          trailing 
          icon="i-heroicons-arrows-pointing-out-16-solid"
          @click="openDialog()"
        >
          Detailed results
        </UButton>
      </div>
    </UCard>
  </div>

      <UModal v-model="dialog" class="center-text">
        <div class="p-3">
          <h6 class="mb-0">{{ title }}</h6>
          <span class="text-xs font-thin">Detailed indicators</span>
    
          <IndicatorsTable
            :indicators="items"
            :idsMainIndicators="indicatorsLabel"
          />

          <div class="row grid justify-items-center">
            <div class="11">
              <p class="mt-4">
                <UIcon name="i-heroicons-information-circle" class="w-5 h-5" />
                <span class="text-xs font-light">
                  Not all indicators apply to all kinds of software. For instance,
                  the conditions for a web application to be accessible differ
                  from a command line tool. To keep our set of indicators as
                  simple as possible, we only distinguish between what we consider
                  the minimum number of software categories necessary for our
                  purpose: “web” and “non-web" tools.
                  <br>
                  APIs, web applications, suites, workbenches and databases lie
                  under the “web” category. Software of any other kind is
                  considered “non-web”.
                </span>
              </p>
            </div>
          </div>

        </div>
      </UModal>
    
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';
import FAIRplot from './FAIRplot.vue';
import IndicatorsTable from './IndicatorsTable.vue';
const metadataStore = useMetadataStore();

// PROPS
const props = defineProps<{
  title: string,
  color: string,
  items: Array<Any>,
  indicatorsLabel: Array<Any>
}>();

const dialog = ref(false)

const toolMetadata = computed(() => metadataStore.getToolMetadata);

// Methods
const openDialog = () => {
  dialog.value = true
}
const closeDialog = () => {
  dialog.value = false
}

</script>
<style scoped>
.expandBtn {
	text-transform: none !important;
}

.buttonDetails {
	color: #0b579f !important;
}
</style>