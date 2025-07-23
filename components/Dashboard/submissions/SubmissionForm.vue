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
            v-for="(link, index) in links"
            :key="link.label"
            class="cursor-pointer flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
            :class="[
              index == selectedBlock ? 'active' : '',
              link.status == 'pending' ? 'innactive' : '',
            ]"
            @click="selectedComponent = link.component"
          >
            <div class="badget">
              {{ index + 1 }}
            </div>
            <Icon :name="link.icon" />
            <span>{{ link.label }}</span>
          </div>
        </div>
        <div class="col-8">
          <div class="container-validation">
            <div
              class="container-validation__block"
              :class="[selectedBlock == 0 ? 'active' : 'innactive']"
            >
              <div class="container-validation__block__badget">
                <div
                  class="container-validation__block__badget__custom-badget"
                  :class="[selectedBlock === 0 ? 'active' : '']"
                >
                  {{ links[0].index }}
                </div>
                <div class="container-validation__block__badget__line"></div>
              </div>
              <div class="container-validation__block__content">
                <div class="container-validation__block__content__header">
                  <div
                    class="container-validation__block__content__header__title"
                  >
                    Container Validation
                    <div v-if="links[0].status != 'active'">
                      {{ links[0].status }}
                    </div>
                  </div>
                </div>
                <div v-if="selectedBlock == 0" class="container-body">
                  <SubmissionValidation :is-done="links[0].isDone" />
                </div>
              </div>
            </div>
            <div
              class="container-validation__block"
              :class="[selectedBlock != 1 ? 'innactive' : '']"
            >
              <div class="container-validation__block__badget">
                <div
                  class="container-validation__block__badget__custom-badget"
                  :class="[selectedBlock === 2 ? 'active' : '']"
                >
                  {{ links[1].index }}
                </div>
                <div class="container-validation__block__badget__line"></div>
              </div>
              <div class="container-validation__block__content">
                <div class="container-validation__block__content__header">
                  <div
                    class="container-validation__block__content__header__title"
                  >
                    <div class="w-100">Generate Predictions</div>
                  </div>
                  <div
                    v-if="links[1].status != 'active'"
                    class="w-100 container-validation__block__content__header__status"
                  >
                    {{ links[1].status }}
                  </div>
                </div>
                <div v-if="selectedBlock == 1" class="container-body">
                  <SubmissionValidation :is-done="links[1].isDone" />
                </div>
              </div>
            </div>
            <div
              class="container-validation__block"
              :class="[selectedBlock != 2 ? 'innactive' : '']"
            >
              <div class="container-validation__block__badget">
                <div
                  class="container-validation__block__badget__custom-badget"
                  :class="[selectedBlock === 2 ? 'active' : '']"
                >
                  {{ links[2].index }}
                </div>
                <div class="container-validation__block__badget__line"></div>
              </div>
              <div class="container-validation__block__content">
                <div class="container-validation__block__content__header">
                  <div
                    class="container-validation__block__content__header__title"
                  >
                    <div class="w-100">
                      Validate Output and Compute Assessment Metrics
                    </div>
                  </div>
                  <div
                    v-if="links[2].status != 'active'"
                    class="w-100 container-validation__block__content__header__status"
                  >
                    {{ links[2].status }}
                  </div>
                </div>
                <div v-if="selectedBlock == 2" class="container-body">
                  <SubmissionCompute :is-done="links[2].isDone" />
                </div>
              </div>
            </div>
            <div
              class="container-validation__block"
              :class="[selectedBlock != 3 ? 'innactive' : '']"
            >
              <div class="container-validation__block__badget">
                <div
                  class="container-validation__block__badget__custom-badget"
                  :class="[selectedBlock === 3 ? 'active' : '']"
                >
                  {{ links[3].index }}
                </div>
                <div class="container-validation__block__badget__line"></div>
              </div>
              <div class="container-validation__block__content">
                <div class="container-validation__block__content__header">
                  <div
                    class="container-validation__block__content__header__title"
                  >
                    <div class="w-100">View Summary</div>
                  </div>
                  <div
                    v-if="links[3].status != 'active'"
                    class="w-100 container-validation__block__content__header__status"
                  >
                    {{ links[3].status }}
                  </div>
                </div>
                <div v-if="selectedBlock == 3" class="container-body">
                  <SubmissionSummary :is-done="links[3].isDone" />
                </div>
              </div>
            </div>
            <div
              class="container-validation__block"
              :class="[selectedBlock != 4 ? 'innactive' : '']"
            >
              <div class="container-validation__block__badget">
                <div
                  class="container-validation__block__badget__custom-badget"
                  :class="[selectedBlock === 4 ? 'active' : '']"
                >
                  {{ links[4].index }}
                </div>
                <div class="container-validation__block__badget__line"></div>
              </div>
              <div class="container-validation__block__content">
                <div class="container-validation__block__content__header">
                  <div
                    class="container-validation__block__content__header__title"
                  >
                    <div class="w-100">Published</div>
                  </div>
                  <div
                    v-if="links[4].status != 'active'"
                    class="w-100 container-validation__block__content__header__status"
                  >
                    {{ links[4].status }}
                  </div>
                </div>
                <div v-if="selectedBlock == 4" class="container-body">
                  <SubmissionPublished :is-done="links[4].isDone" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Component } from "vue";
import { ref } from "vue";
import SubmissionValidation from "@/components/Dashboard/submissions/form/SubmissionValidation.vue";
import SubmissionPrediction from "@/components/Dashboard/submissions/form/SubmissionPrediction.vue";
import SubmissionCompute from "@/components/Dashboard/submissions/form/SubmissionCompute.vue";
import SubmissionSummary from "@/components/Dashboard/submissions/form/SubmissionSummary.vue";
import SubmissionPublished from "@/components/Dashboard/submissions/form/SubmissionPublished.vue";

interface LinkItem {
  index: number;
  label: string;
  icon: string;
  component: Component;
  isDone: boolean;
  status?: string;
}

const links = ref<LinkItem[]>([
  {
    index: 1,
    label: "Container Validation",
    icon: "i-heroicons-inbox-arrow-down",
    component: SubmissionValidation,
    isDone: false,
    status: "active",
  },
  {
    index: 2,
    label: "Prediction",
    icon: "i-heroicons-cog-8-tooth-solid",
    component: SubmissionPrediction,
    isDone: false,
    status: "pending",
  },
  {
    index: 3,
    label: "Reproducibility",
    icon: "i-heroicons-command-line",
    component: SubmissionPrediction,
    isDone: false,
    status: "pending",
  },
  {
    index: 4,
    label: "Metrics",
    icon: "i-heroicons-clipboard-document-list",
    component: SubmissionPrediction,
    isDone: false,
    status: "pending",
  },
  {
    index: 5,
    label: "Publication",
    icon: "i-heroicons-cloud-arrow-up",
    component: SubmissionPrediction,
    isDone: false,
    status: "pending",
  },
]);

const selectedComponent = ref(SubmissionValidation);
const selectedBlock = ref(0);
const formValidationSended = ref(false);
const predictionValidationSended = ref(false);

function handleValidation(status, index) {
  links[index].isDone = status;
}
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
}

.container-validation {
  padding: 10px 0 10px 0;
  &__block {
    display: grid;
    grid-template-columns: 30px 1fr;
    gap: 10px;
    &.active {
      .container-validation__block__content__header__title {
        font-weight: bold;
        color: theme("colors.primary.500");
      }
    }
    &.innactive {
      color: #b5c0d0 !important;
      &__content__header__title {
        color: theme("colors.primary.500") !important;
      }
    }
    &:not(:first-child) {
      margin-top: 30px;
    }
    &__badget {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      &__custom-badget {
        border-radius: 40px;
        border: 1px solid #dee2e6;
        text-align: center;
        height: 30px;
        width: 30px;
        &.active {
          border: 1px solid #0b579f;
        }
      }
      &__line {
        flex: 1;
        width: 3px;
        background-color: #dee2e6;
        margin-top: 5px;
      }
    }
    &__content {
      padding: 10px 15px;
      background-color: #fafafa;
      border: 1px solid #dee2e6;
      border-radius: 5px;
      &__header {
        &__title {
          border-bottom: 1px solid rgb(226, 232, 240, 1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 18px;
        }
        &__status {
          font-style: italic;
        }
      }
    }
  }
}

.badget {
  border-radius: 40px;
  border: 1px solid #dee2e6;
  text-align: center;
  height: 30px;
  width: 30px;
}

.custom-navigation {
  .active {
    font-weight: bold;
    .iconify {
      color: theme("colors.secondaryOeb.500");
    }
    .badget {
      border: 1px solid #0b579f;
      color: theme("colors.primary.500");
    }
  }
  .innactive {
    color: #dee2e6;
    cursor: not-allowed;
  }
}
</style>
