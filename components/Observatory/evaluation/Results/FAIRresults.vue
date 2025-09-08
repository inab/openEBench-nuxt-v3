<template>
  <div class="my-5">
    <div v-if="data != true" class="flex flex-wrap content-around">
      <div class="col-6 py-3 px-5">
        <USkeleton class="h-64 w-full" />
      </div>
      <div class="col-6 py-3 px-5">
        <USkeleton class="h-64 w-full" />
      </div>
      <div class="col-6 py-3 px-5">
        <USkeleton class="h-64 w-full" />
      </div>
      <div class="col-6 py-3 px-5">
        <USkeleton class="h-64 w-full" />
      </div>
    </div>
    <div v-else class="flex flex-wrap content-around">
      <div class="col-6 py-3 px-4">
        <ResultsCardExpansible
          :title="findabilitySummary.title"
          :description="findabilitySummary.description"
          :score="findabilitySummary.score"
          :control="findabilitySummary.control"
          :indicators="findabilitySummary.indicators"
          :strengths="findabilitySummary.strengths"
          :improvements="findabilitySummary.improvements"  
          :items="itemsFindability"
          :indicatorsLabel="labelsFindability"
        />
      </div>
      <div class="col-6 py-3 px-4">
        <ResultsCardExpansible
          :title="accessibilitySummary.title"
          :description="accessibilitySummary.description"
          :score="accessibilitySummary.score"
          :control="accessibilitySummary.control"
          :indicators="accessibilitySummary.indicators"
          :strengths="accessibilitySummary.strengths"
          :improvements="accessibilitySummary.improvements"  
          :items="itemsAccessibility"
          :indicatorsLabel="labelsAccessibility"  
        />
      </div>
      <div class="col-6 py-3 px-4">
        <ResultsCardExpansible
          :title="interoperabilitySummary.title"
          :description="interoperabilitySummary.description"
          :score="interoperabilitySummary.score"
          :control="interoperabilitySummary.control"
          :indicators="interoperabilitySummary.indicators"
          :strengths="interoperabilitySummary.strengths"
          :improvements="interoperabilitySummary.improvements"  
          :items="itemsInteroperability"
          :indicatorsLabel="labelsInteroperability"  
        />
      </div>

      <div class="col-6 py-3 px-4">
        <ResultsCardExpansible
          :title="reusabilitySummary.title"
          :description="reusabilitySummary.description"
          :score="reusabilitySummary.score"
          :control="reusabilitySummary.control"
          :indicators="reusabilitySummary.indicators"
          :strengths="reusabilitySummary.strengths"
          :improvements="reusabilitySummary.improvements"  
          :items="itemsReusability"
          :indicatorsLabel="labelsReusability"  
        />
      </div>
    </div>

  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useResultStore } from '@/stores/observatory/evaluation/results';
import ResultsCardExpansible from './ResultsCardExpansible.vue';
import { findability, accessibility, interoperability, reusability } from './indicatorsTableItems';

const store = useResultStore()
const itemsFindability = ref(findability);
const labelsFindability = ref(['F1', 'F2', 'F3']);

const itemsAccessibility = ref(accessibility)
const labelsAccessibility = ref(['A1', 'A2', 'A3'])

const itemsInteroperability = ref(interoperability)
const labelsInteroperability = ref(['I1','I2','I3'])

const itemsReusability = ref(reusability)
const labelsReusability = ref(['R1','R2','R3','R4'])


const { getFAIRIndicatorsTool, getFAIRIndicatorsFeedback } = storeToRefs(store)

const t = computed(() => {
  return getFAIRIndicatorsTool.value ?? {} // fallback when null/undefined
})

const feedback = computed(() => {
  return getFAIRIndicatorsFeedback.value ?? {}
} )

const data = computed(() => !!t.value && Object.keys(t.value).length > 0)


const findabilitySummary = computed(() => ({
  title: 'Findability',
  description: 'How easily software and its metadata can be discovered by humans and machines.',
  score: t.value.F ?? null,
  control: 0.89,
  indicators: [
    { label: 'F1', score: t.value.F1 ?? 0, title: 'F1. Identity uniqueness', explanation: 'Does the software have a persistent and unique identifier?' },
    { label: 'F2', score: t.value.F2 ?? 0, title: 'F2. Existence of metadata', explanation: 'Is the software described with rich, structured metadata?' },
    { label: 'F3', score: t.value.F3 ?? 0, title: 'F3. Discoverability', explanation: 'Can the software be found using external resources? ' },
  ],
  strengths: (feedback.value.F.strengths ?? []).filter(s => s.trim() !== '').slice(0, 3),
  improvements: (feedback.value.F.improvements ?? []).filter(s => s.trim() !== '').slice(0, 3),
}))

const accessibilitySummary = computed(() => ({
  title: 'Accessibility',
  description: 'Whether users can obtain, install, and run the software without barriers.',
  score: t.value.A ?? null,
  control: 0.89,
  indicators: [
    { label: 'A1', score: t.value.A1 ?? 0, title: 'A1. Availability of working version', explanation: 'Can users access or install a working version of the software?' },
    { label: 'A3', score: t.value.A3 ?? 0, title: 'A3. Unrestricted Access', explanation: 'Can the software be used without barriers?' },
  ],
  strengths: (feedback.value.A.strengths ?? []).filter(s => s.trim() !== '').slice(0, 3),
  improvements: (feedback.value.A.improvements ?? []).filter(s => s.trim() !== '').slice(0, 3),
}))

const interoperabilitySummary = computed(() => ({
  title: 'Interoperability',
  description: 'Whether the software can work smoothly with other tools, data formats, and platforms.',
  score: t.value.I ?? null,
  control: 0.89,
  indicators: [
    { label: 'I1', score: t.value.I1 ?? 0, title: 'I1. Data format standards and practices', explanation: 'Does the software use and support standard data formats and good data handling practices?' },
    { label: 'I2', score: t.value.I2 ?? 0, title: 'I2. Software integration', explanation: 'Can the software be used easily with other tools or in workflows?' },
    { label: 'I3', score: t.value.I3 ?? 0, title: 'I3. Dependencies availability', explanation: 'Are the software’s dependencies documented and accessible?' },
  ],
  strengths: (feedback.value.I.strengths ?? []).filter(s => s.trim() !== ''),
  improvements: (feedback.value.I.improvements ?? []).filter(s => s.trim() !== '').slice(0, 3),
}))

const reusabilitySummary = computed(() => ({
  title: 'Reusability',
  description: 'Whether the software can be easily reused, adapted, and cited by others.',
  score: t.value.R ?? null,
  control: 0.89,
  indicators: [
    { label: 'R1', score: t.value.R1 ?? 0, title: 'R1. Usage Documentation', explanation: 'Does the software provide documentation to help users understand and apply it effectively?' },
    { label: 'R2', score: t.value.R2 ?? 0, title: 'R2. License', explanation: 'Are there clear legal conditions for using the software?' },
    { label: 'R3', score: t.value.R3 ?? 0, title: 'R3. Recognition and governance', explanation: 'Recognition and governance' },
    { label: 'R4', score: t.value.R4 ?? 0, title: 'R4. Versioning and historical traceability', explanation: 'Versioning and historical traceability' },
  ],
  strengths: (feedback.value.R.strengths ?? []).filter(s => s.trim() !== '').slice(0, 3),
  improvements: (feedback.value.R.improvements ?? []).filter(s => s.trim() !== '').slice(0, 3),
}))
  

</script>