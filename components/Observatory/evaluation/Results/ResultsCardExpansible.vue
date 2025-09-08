<template>
  <div>
    <UCard :ui="{body: {padding: 'px-4 py-4 sm:p-4'},shadow: 'shadow-md'}">

      <div class="d-flex flex-wrap items-start">
        <div class="col-9">
          <h5 class="mb-2">{{ title }}</h5>
          <span class="text-sm">{{ description }}</span>
        </div>
        <div class="col-3 text-end mt-1">
          <div class="score leading-5">{{ score?.toFixed(2) }}</div>
          <!--div class="control text-body-secondary text-sm">Avg. score: {{ control }}</div-->
        </div>
      </div>
      
      <div class="flex w-full mt-4 mb-4">
        <IndicatorsBars :indicators="indicators" class="flex-1"/>
      </div>
      <UAccordion multiple default-close color="white" :items="feedbackItems">
      <!-- Body/content -->
      <template #item="{ item }">
        <ul class="list-disc space-y-1 pr-2">
          <li
            v-for="(point, index) in item.content"
            :key="index"
            class="mb-2 text-[0.82rem] text-black"
          >
            {{ point }}
          </li>
        </ul>
      </template>
    </UAccordion>

      <div class="grid justify-items-end">
        <UButton 
          class="text-primaryOeb-500 text-xs expandBtn" 
          variant="ghost" 
          trailing 
          icon="i-heroicons-arrows-pointing-out-16-solid"
          @click="openDialog()"
        >
          Detailed
        </UButton>
      </div>
    </UCard>

  <!-- Detailed results -->
  <div v-if="dialog" @click.self="closeDialog" 
    class="fixed z-30 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex center-text items-center justify-center">
    <div :class="['relative mx-auto p-4 border w-11/12 md:w-2/3 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto', dialogAnimation] ">
      <h6 class="mb-0">{{ title }}</h6>
      <span class="text-xs font-thin">Detailed indicators</span>

      <IndicatorsTable
        :indicators="items"
        :idsMainIndicators="indicatorsLabel"
        class="mt-3"
      />

      <div class="row grid justify-items-center">
        <div class="11">
          <p class="mt-4">
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5 mr-2" />
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
  </div>

    
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';
import type { AccordionItem } from '@nuxt/ui'
import FAIRplot from './FAIRplot.vue';
import IndicatorsBars from './IndicatorsBars.vue';
import IndicatorsTable from './IndicatorsTable.vue';

const metadataStore = useMetadataStore();

// PROPS
const props = defineProps<{
  title: string,
  description: string,
  score: number,
  control: number,
  indicators: Array<object>,
  strengths: Array<string>,
  improvements: Array<string>,
  items: Array<any>,
  indicatorsLabel: Array<any>,
  
}>();

const dialog = ref(false)
const dialogAnimation = ref('an1');

const toolMetadata = computed(() => metadataStore.getToolMetadata);
const feedbackItems = computed<AccordionItem[]>(() => {
  const items: AccordionItem[] = []
  if (props.strengths?.length) items.push({ label: 'Strengths', content: props.strengths })
  if (props.improvements?.length) items.push({ label: 'How to improve',  content: props.improvements })
  return items
})
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


.score {
  color: #0b579f;
  font-size: 2.3em;
  margin-top: 0;
  line-height: 1.25rem;
  margin-bottom: 0.2em;
  padding-right: 0.em

}

.control {
  font-size: 0.7em;
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