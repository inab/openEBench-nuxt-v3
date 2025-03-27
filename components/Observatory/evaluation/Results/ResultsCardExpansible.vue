<template>
  <div>
    <UCard :ui="{body: {padding: 'px-3 py-3 sm:p-3'}}">
      <h6>{{ title }}</h6>
      <div class="grid justify-items-center">
        <FAIRplot 
          :toolName="toolMetadata.label[0]"
          :height="230"
          :label="title"
          :colorFill="color"
          :indicatorsLabel="indicatorsLabel"
          class="mt-3 pb-1 mb-2"
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

  <!-- Detailed results -->
  <div v-if="dialog" @click.self="closeDialog" 
    class="fixed z-30 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex center-text items-center justify-center">
    <div :class="['relative mx-auto p-4 border w-11/12 md:w-2/3 shadow-lg rounded-md bg-white', dialogAnimation]">
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
  </div>

    
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';
import FAIRplot from './FAIRplot.vue';
import IndicatorsTable from './IndicatorsTable.vue';
const metadataStore = useMetadataStore();

// PROPS
const props = defineProps<{
  title: string,
  color: string,
  items: Array<any>,
  indicatorsLabel: Array<any>
}>();

const dialog = ref(false)
const dialogAnimation = ref('an1');

const toolMetadata = computed(() => metadataStore.getToolMetadata);

// Methods
const openDialog = () => {
  dialog.value = true
}
const closeDialog = () => {
  dialogAnimation.value = 'an2';
  setTimeout(() => {
    dialog.value = false;
    dialogAnimation.value = 'an1';
  }, 10);
}

watch(dialog, (newValue) => {
  if (newValue) {
    dialogAnimation.value = 'an1';
  }
});
</script>
<style scoped>
.expandBtn {
	text-transform: none !important;
}

.buttonDetails {
	color: #0b579f !important;
}

.an1 {
  animation: animationup 0.5s ease 0s 1 normal forwards;
}

@keyframes animationup {
  0% {
    transform: scale(0.5);
  }

  100% {
    transform: scale(1);
  }
}

.an2 {
  animation: animationDown 0.5s ease 0s 1 normal forwards;
}

@keyframes animationDown {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}
</style>