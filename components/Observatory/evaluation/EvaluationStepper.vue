<template>
  <div class="stepper row">
    <div v-for="(step, index) in stepperStore.steps" :key="index" class="step flex items-center mb-4 relative">
      <div class="col-12" :class="{'folded': !step.active}">
        <div v-if="index < stepperStore.steps.length - 1" class="vertical-line" :class="{'short': !step.active}"></div>
        <div>
          <p class="flex items-center">
            <span>
              <UIcon v-if="step.completed" name="i-heroicons-check-circle-16-solid" class="text-primaryOeb-500 mr-3 text-2xl" />
              <span v-else class="step-number text-sm mr-3">{{ index + 1 }}</span>
            </span>
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
            <p>Step 4 is building</p>
            <div class="buttons mt-2 ml-5">
              <button v-if="index > 0" class="btn btn-secondary mr-2" @click="stepperStore.goBack(index)">Back</button>
              <button v-if="!step.completed" class="btn btn-primary mr-2" @click="stepperStore.completeStep(index)">Next</button>
              <button v-if="index === stepperStore.steps.length - 1" class="btn btn-danger" @click="stepperStore.cancelSteps">Cancel</button>
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
  height: 22px;
  width: 22px;
  background: #0b579f;
  border-radius: 50px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
.vertical-line {
  position: absolute;
  left: 22px; /* Adjust this value to align with your icons */
  top: 30px; /* Adjust this value to align with your icons */
  width: 1.5px;
  background-color: #dfe3ea;
  height: calc(100% - 30px); /* Adjust this value to align with your icons */
}
.vertical-line.short {
  height: 1.5rem; /* Adjust this value as needed */
}
</style>
