<template>
  <div class="metrics-edit">
    <div class="w-100 container">
      <div class="metrics-edit__title">
        <h2 class="text-primaryOeb-500">
          <span class=""
            >Metric: <i>{{ metric._id }}</i></span
          >
        </h2>
      </div>
      <div class="metrics-edit__body">
        <div
          v-if="isSearchingMetric"
          class="flex justify-content-center items-center"
        >
          <div class="space-y-2 pt-4">
            <USkeleton class="h-8 w-[400px]" />
            <USkeleton class="h-8 w-[400px]" />
            <USkeleton class="h-20 w-[400px]" />
          </div>
        </div>
        <div v-else>
          <div
            v-if="metric?._id"
            class="flex flex-col gap-3 metric__modal pt-3"
          >
            <div class="flex gap-3">
              <UFormGroup label="Metric ID">
                <input
                  v-model="metric._id"
                  class="form-control"
                  disabled
                  placeholder="Metric ID"
                />
              </UFormGroup>
              <UFormGroup label="Original ID">
                <input
                  v-model="metric.orig_id"
                  class="form-control"
                  disabled
                  placeholder="Original ID"
                />
              </UFormGroup>
              <UFormGroup label="Formal definition">
                <input
                  v-model="metric.formal_definition"
                  class="form-control"
                  disabled
                  placeholder="Formal definition"
                />
              </UFormGroup>
              <UFormGroup label="Original ID">
                <input
                  v-model="metric.orig_id"
                  class="form-control"
                  disabled
                  placeholder="Original ID"
                />
              </UFormGroup>
            </div>
            <div class="flex gap-5">
              <UFormGroup label="References" class="row">
                <input
                  v-for="(reference, index) in metric.references"
                  :key="index"
                  :value="reference"
                  class="form-control col-4"
                  disabled
                  placeholder="References"
                />
              </UFormGroup>
            </div>
            <div class="flex gap-3 w-100">
              <UFormGroup label="Title" class="w-100">
                <input
                  v-model="metric.title"
                  class="form-control"
                  disabled
                  placeholder="Title"
                />
              </UFormGroup>
            </div>
            <div class="flex gap-3 w-100">
              <UFormGroup label="Description" class="w-100">
                <textarea
                  v-model="metric.description"
                  class="form-control"
                  rows="10"
                  disabled
                  placeholder="Description"
                >
                </textarea>
              </UFormGroup>
            </div>
            <div class="form-footer">
              <UButton type="button" @click="goBack"> Cancel </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Metric } from "@/types/challenge_metric";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  metric: Metric;
  isSearchingMetric: boolean;
}>();

const router = useRouter();

function goBack() {
  router.push("/dashboard/metrics");
}
</script>

<style scoped lang="scss">
.metrics-edit {
  &__title {
    padding-bottom: 20px;
    padding-top: 20px;
    h2 {
      border-color: rgb(226, 232, 240, 1);
      border-bottom-width: 1px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 5px;
      span {
        padding-bottom: 5px;
      }
      a {
        padding: 5px 10px;
        font-size: 14px;
        text-decoration: none;
        margin-bottom: 5px;
      }
    }
  }
  &__skeleton {
    &__small {
      width: 100%;
      height: 50px;
    }
    &__big {
      width: 100%;
      height: 250px;
    }
  }
  .form-footer {
    display: flex;
    justify-content: end;
    gap: 10px;
  }
}
</style>
