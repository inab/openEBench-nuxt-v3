<template>
  <div class="stepper row">
    <div v-for="(step, index) in steps" :key="index" class="step flex items-center mb-4">
      <div class="col-12" :class="{'folded': !step.active}">
        <!-- Header step -->
        <div>
          <p class="flex items-center">
            <span>
              <UIcon v-if="step.completed" name="i-heroicons-check-circle-16-solid" class="text-primaryOeb-500 mr-3 text-2xl" />
              <span v-else class="step-number text-sm mr-3">{{ index + 1 }}</span>
            </span>
            {{ step.title }}
          </p>
        </div>
        <!-- Content step -->
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
                  @sourceSelected="handleSourceSelected"
                />
              </div>
              <div class="col-3">
                <EvaluationSourceCard
                  title="GitHub repository"
                  description="Enter the URL of the software's GitHub repository"
                  source="github"
                  icon="mdi-github"
                  @sourceSelected="handleSourceSelected"
                />
              </div>
              <div class="col-3">
                <EvaluationSourceCard
                  title="Metadata file"
                  description="Provide the URL of a metadata file in Bioschema format"
                  source="metadata_file"
                  icon="mdi-code-json"
                  @sourceSelected="handleSourceSelected"
                />
              </div>
            </div>
          </div>

          <!----------------- STEP 2 ------------------->
          <!-------------------------------------------->
          <div v-if="index === 1">
            <div v-if="selectedSource === 'github'"> {{ selectedSource }}</div>
            <div v-else-if="selectedSource === 'software_observatory'">{{ selectedSource }}</div>
            <div v-else>{{ selectedSource }}</div>

            <!-- Buttons -->
            <div class="buttons mt-2 ml-5">
              <button v-if="index > 0" class="btn btn-secondary mr-2" @click="goBack(index)">Back</button>
              <button v-if="!step.completed" class="btn btn-primary mr-2" @click="completeStep(index)">Next</button>
              <button v-if="index === steps.length - 1" class="btn btn-danger" @click="cancelSteps">Cancel</button>
            </div>
          </div>

          <!----------------- STEP 3 ------------------->
          <!-------------------------------------------->
          <div v-if="index === 2">
            <p>Additional content for Step 3</p>
            <div class="buttons mt-2 ml-5">
              <button v-if="index > 0" class="btn btn-secondary mr-2" @click="goBack(index)">Back</button>
              <button v-if="!step.completed" class="btn btn-primary mr-2" @click="completeStep(index)">Next</button>
              <button v-if="index === steps.length - 1" class="btn btn-danger" @click="cancelSteps">Cancel</button>
            </div>
          </div>

          <!----------------- STEP 4 ------------------->
          <!-------------------------------------------->
          <div v-if="index === 3">
            <p>Additional content for Step 4</p>
            <div class="buttons mt-2 ml-5">
              <button v-if="index > 0" class="btn btn-secondary mr-2" @click="goBack(index)">Back</button>
              <button v-if="!step.completed" class="btn btn-primary mr-2" @click="completeStep(index)">Next</button>
              <button v-if="index === steps.length - 1" class="btn btn-danger" @click="cancelSteps">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import EvaluationSourceCard from "@/components/Observatory/evaluation/EvaluationSourceCard.vue"

const steps = ref([
  { title: "Select the source of the software's metadata", completed: false, active: true },
  { title: 'Introduce software to evaluate', completed: false, active: false },
  { title: 'Edit the metadata if needed', completed: false, active: false },
  { title: 'Results', completed: false, active: false },
]);

const selectedSource = ref('');

const completeStep = (index) => {
  steps.value[index].completed = true;
  if (index < steps.value.length - 1) {
    steps.value[index].active = false;
    steps.value[index + 1].active = true;
  }
};

const goBack = (index) => {
  if (index > 0) {
    steps.value[index].active = false;
    steps.value[index - 1].completed = false;
    steps.value[index - 1].active = true;
  }
};

const cancelSteps = () => {
  steps.value.forEach((step, index) => {
    step.completed = false;
    step.active = index === 0;
  });
};

const handleSourceSelected = (source) => {
  console.log(`Source selected: ${source}`);
  selectedSource.value = source;
  completeStep(0); // Avanzar al siguiente paso
};
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
</style>
