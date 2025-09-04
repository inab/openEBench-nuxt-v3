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
            @click="handleSelect(index)"
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
              v-for="(link, index) in links"
              :key="link.label"
              class="container-validation__block"
              :class="[selectedBlock === index ? 'active' : 'innactive']"
            >
              <div class="container-validation__block__badget">
                <div
                  class="container-validation__block__badget__custom-badget"
                  :class="{ active: selectedBlock === index }"
                >
                  {{ link.index }}
                </div>
                <div class="container-validation__block__badget__line"></div>
              </div>

              <div class="container-validation__block__content">
                <div class="container-validation__block__content__header">
                  <div class="container-validation__block__content__header__title">
                    <div class="w-100">{{ link.label }}</div>
                    <div
                      v-if="link.status !== 'active'"
                      class="container-validation__block__content__header__status"
                    >
                      {{ link.status }}
                    </div>
                  </div>
                </div>

                <div v-if="selectedBlock === index" class="container-body">
                  <component :is="selectedComponent" :is-done="link.isDone" />
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
import type { Component } from 'vue';
import { ref } from 'vue';
import SubmissionValidation from '@/components/Dashboard/submissions/form/SubmissionValidation.vue';
import SubmissionPrediction from '@/components/Dashboard/submissions/form/SubmissionPrediction.vue';
import SubmissionCompute from '@/components/Dashboard/submissions/form/SubmissionCompute.vue';
import SubmissionSummary from '@/components/Dashboard/submissions/form/SubmissionSummary.vue';
import SubmissionPublished from '@/components/Dashboard/submissions/form/SubmissionPublished.vue';

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
    label: 'Container Validation',
    icon: 'i-heroicons-inbox-arrow-down',
    component: SubmissionValidation,
    isDone: false,
    status: 'active',
  },
  {
    index: 2,
    label: 'Prediction',
    icon: 'i-heroicons-cog-8-tooth-solid',
    component: SubmissionPrediction,
    isDone: false,
    status: 'pending',
  },
  {
    index: 3,
    label: 'Reproducibility',
    icon: 'i-heroicons-command-line',
    component: SubmissionCompute,
    isDone: false,
    status: 'pending',
  },
  {
    index: 4,
    label: 'Metrics',
    icon: 'i-heroicons-clipboard-document-list',
    component: SubmissionSummary,
    isDone: false,
    status: 'pending',
  },
  {
    index: 5,
    label: 'Publication',
    icon: 'i-heroicons-cloud-arrow-up',
    component: SubmissionPublished,
    isDone: false,
    status: 'pending',
  },
]);

const selectedComponent = ref(SubmissionValidation);
const selectedBlock = ref(0);
// const formValidationSended = ref(false);
// const predictionValidationSended = ref(false);

function handleSelect(index: number) {
  selectedBlock.value = index;
}

// function handleValidation(statusDone: boolean, index: number) {
//   links.value[index].isDone = statusDone;
// }
</script>
<style scoped lang="scss">
.dashboard-add__title {
  border-color: rgb(226, 232, 240, 1);
  border-bottom-width: 1px;
  font-size: 15px;
}

.container-validation {
  padding: 10px 0 10px 0;
  .disabled {
    color: #ccc;
    cursor: not-allowed;
  }
  &__block {
    display: grid;
    grid-template-columns: 30px 1fr;
    gap: 10px;
    &.active {
      .container-validation__block__content__header__title {
        font-weight: bold;
        color: theme('colors.primary.500');
      }
    }
    &.innactive {
      color: #b5c0d0 !important;
      &__content__header__title {
        color: theme('colors.primary.500') !important;
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
      color: theme('colors.secondaryOeb.500');
    }
    .badget {
      border: 1px solid #0b579f;
      color: theme('colors.primary.500');
    }
  }
  .innactive {
    color: #dee2e6;
    cursor: not-allowed;
  }
}
</style>
