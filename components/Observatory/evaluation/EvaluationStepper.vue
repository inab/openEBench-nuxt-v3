<template>
  <div class="stepper row">
    <div v-for="(step, index) in stepperStore.steps" :key="index" class="step flex items-center mb-4 relative">
      <div class="col-12" :class="{'folded': !step.active}">
        <div v-if="index < stepperStore.steps.length - 1" class="vertical-line" :class="{'short': !step.active}"></div>
        <div>
          <p class="flex items-center">
            <span v-if="step.completed" class="step-number mr-3">
              <UIcon  name="i-heroicons-check-16-solid" class="text-xl" />
            </span>
            <span v-else class="step-number text-sm mr-3">{{ index + 1 }}</span>

            {{ step.title }}
          </p>
        </div>
        <div v-if="step.active" class="step-content">

          <!----------------- STEP 1 ------------------->
          <!-------------------------------------------->
          <div v-if="index === 0">
            <div class="flex justify-evenly my-4 p-4">
              <div class="col-3">
                <EvaluationSourceCard
                  title="Software Observatory"
                  description="Select a software from the Software Observatory's database"
                  source="software_observatory"
                  icon="mdi-database"
                />
              </div>
              <div class="col-3">
                <EvaluationSourceCard
                  title="GitHub repository"
                  description="Enter the URL of the software's GitHub repository"
                  source="github"
                  icon="mdi-github"
                />
              </div>
              <div class="col-3">
                <EvaluationSourceCard
                  title="Metadata file"
                  description="Provide the URL of a metadata file in Bioschema format"
                  source="metadata_file"
                  icon="mdi-code-json"
                />
              </div>
            </div>
          </div>

          <!----------------- STEP 2 ------------------->
          <!-------------------------------------------->
          <div v-if="index === 1" class="my-4 p-4">
            <div v-if="stepperStore.selectedSource === 'github'">
              <GitHubInput />
            </div>
            <div v-else-if="stepperStore.selectedSource === 'software_observatory'">
              <ObservatoryInput />
            </div>
            <div v-else>
              <MetadataFileInput />
            </div>
          </div>

          <!----------------- STEP 3 ------------------->
          <!-------------------------------------------->
          <div v-if="index === 2">
            <div>
              <MetadataEdit v-if="loadedMetadata"/>
            </div>
          </div>

          <!----------------- STEP 4 ------------------->
          <!-------------------------------------------->
          <div v-if="index === 3">
            <div>
              <ResultsTabs />
            </div>
            <div class="buttons mt-2 ml-5">

              <UButton variant="ghost" color="red" @click="stepperStore.cancelSteps" v-if="index === stepperStore.steps.length - 1">
                Cancel
              </UButton>
              <div class="text-right">
                <UButton v-if="index > 0" class="mr-2" color="gray" variant="ghost" size="md" :ui="{color:{gray:{ghost:'text-gray-900 hover:bg-gray-100'}},}" @click="stepperStore.goBack(index)">
                  Back
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useStepperStore } from '@/stores/observatory/evaluation/index';
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';
import { storeToRefs } from 'pinia';
import EvaluationSourceCard from "@/components/Observatory/evaluation/EvaluationSourceCard.vue"
import GitHubInput from "@/components/Observatory/evaluation/GitHub/GitHubInput.vue"
import ObservatoryInput from "@/components/Observatory/evaluation/Observatory/ObservatoryInput.vue"
import MetadataFileInput from "@/components/Observatory/evaluation/MetadataFile/MetadataFileInput.vue"
import MetadataEdit from "@/components/Observatory/evaluation/Metadata/MetadataEdit.vue"
import ResultsTabs from "@/components/Observatory/evaluation/Results/ResultsTabs.vue"


const stepperStore = useStepperStore();
const metadataStore = useMetadataStore();
// Getters
const loadedMetadata = computed(() => metadataStore.getLoadedMetadata);
const toolMetadata = computed(() => metadataStore.getToolMetadata);

const { steps, selectedSource, completeStep, goBack, cancelSteps, handleSourceSelected } = storeToRefs(stepperStore);
</script>

<style scoped>
.stepper {
  display: flex;
  flex-direction: column;
}
.step {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  margin-top: 1rem;
  position: relative;
}
.content {
  display: flex;
  flex-direction: column;
}
.folded {
  max-height: 2rem; /* Adjust this value as needed */
  overflow: hidden;
}
.buttons {
  display: flex;
}
.step-content {
  margin-top: 1rem;
  margin-left: 2rem;
}
.step-number {
  color: white;
  height: 25px;
  width: 25px;
  background: #0b579f;
  border-radius: 50px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
.vertical-line {
  position: absolute;
  left: 24px; /* Adjust this value to align with your icons */
  top: 32px; /* Adjust this value to align with your icons */
  width: 1px;
  background-color: #dfe3ea;
  height: 100%; /* Adjust this value to align with your icons */
}
.vertical-line.short {
  height: 2rem; /* Adjust this value as needed */
}
</style>
