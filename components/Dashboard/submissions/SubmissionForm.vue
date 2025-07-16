<template>
  <div class="dashboard-submission-form">
    <div class="w-100">
      <div class="dashboard-add__title">
        <h2 class="text-primaryOeb-500">
          <span class="w-100">Submission form</span>
        </h2>
      </div>
      <div class="row">
        <div class="col-4 custom-navigation">
          <div
            v-for="link in links"
            :key="link.label"
            class="cursor-pointer flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
            :class="[link.isDone ? 'done' : 'disabled']"
            @click="selectedComponent = link.component"
          >
            <Icon :name="link.icon" />
            <span>{{ link.label }}</span>
          </div>
        </div>
        <div class="col-8">
          <component :is="selectedComponent" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import SubmissionValidation from "@/components/Dashboard/submissions/form/SubmissionValidation.vue";
import SubmissionPrediction from "@/components/Dashboard/submissions/form/SubmissionPrediction.vue";

const links = [
  {
    label: "Container Validation",
    icon: "i-heroicons-inbox-arrow-down",
    component: SubmissionValidation,
    isDone: true,
  },
  {
    label: "Generate Predictions",
    icon: "i-heroicons-cog-8-tooth-solid",
    component: SubmissionPrediction,
    isDone: false,
  },
  {
    label: "Validate Output and Compute Assessment Metrics",
    icon: "i-heroicons-command-line",
    component: SubmissionPrediction,
    isDone: false,
  },
  {
    label: "View Summary",
    icon: "i-heroicons-clipboard-document-list",
    component: SubmissionPrediction,
    isDone: false,
  },
  {
    label: "Publication",
    icon: "i-heroicons-cloud-arrow-up",
    component: SubmissionPrediction,
    isDone: false,
  },
];

const selectedComponent = ref(SubmissionValidation);
</script>
<style scoped lang="scss">
.dashboard-add__title {
  border-color: rgb(226, 232, 240, 1);
  border-bottom-width: 1px;
  font-size: 15px;
}
.custom-navigation {
  .disabled {
    color: #ccc;
    cursor: not-allowed;
  }
  .isDone {

  }
}
</style>
