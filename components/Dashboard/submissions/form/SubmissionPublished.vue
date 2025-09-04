<template>
  <div class="submission-validation">
    <div class="body">
      <div class="form">
        <div class="custom-row">
          <label
            >Model Description
            <span class="text-red-400 required">*</span>
          </label>
          <textarea
            v-model="description"
            placeholder="Describe your model..."
            class="form-control custom-entry-input"
          />
        </div>
        <div class="custom-row">
          <label
            >Tags
            <span class="text-red-400 required">*</span>
          </label>
          <input
            v-model="tags"
            placeholder="e.g., classification,segmentation"
            class="form-control custom-entry-input"
          />
        </div>
        <div class="custom-row">
          <label
            >Container Registry URL
            <span class="text-red-400 required">*</span>
          </label>
          <input
            v-model="registryUrl"
            placeholder="https://gitlab.com/container/your-model"
            class="form-control custom-entry-input"
          />
        </div>
        <div class="custom-row">
          <label
            >Nextflow Workflow Git Repository URL
            <span class="text-red-400 required">*</span>
          </label>
          <input
            v-model="nextFlowRepo"
            placeholder="https://gitlab.com/user/repo"
            class="form-control custom-entry-input"
          />
        </div>
        <div class="custom-row">
          <label>Model Repository Link (optional)</label>
          <input
            v-model="repolink"
            placeholder="https://hugginface.co/your-model"
            class="form-control custom-entry-input"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const description = ref("");
const tags = ref("");
const registryUrl = ref("");
const nextFlowRepo = ref("");
const repolink = ref("");

</script>
<style scoped lang="scss">
.submission-validation {
  .title {
    border-bottom: 1px solid rgb(226, 232, 240, 1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
  }
  .custom-row {
    padding-bottom: 25px;
  }
  .body {
    padding-top: 20px;
  }
}
</style>
