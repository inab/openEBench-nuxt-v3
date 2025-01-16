<template>
  <CustomModal :is-open="isModalOpen" width="700" @modal-close="closeModal">
    <template #header>
      <div class="modal-title">{{ modalTitle }}</div>
      <button class="modal-close" aria-label="Close modal" @click="closeModal">
        <UIcon name="i-heroicons-x-mark-16-solid" />
      </button>
    </template>
    <template #content>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmitNewMetric"
        @error="onError"
      >
        <div class="w-100">
          <div
            v-if="isSearchingMetric || !metricObj"
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
              v-if="metricObj"
              class="flex flex-col gap-3 metric__modal pt-3"
            >
              <div class="form-card__row__box row">
                <div class="col-6">
                  <label for="_id">
                    Metric ID
                    <span class="text-red-400 required">*</span>
                  </label>
                  <div class="w-100">
                    <input
                      id="_id"
                      v-model="metricObj._id"
                      type="text"
                      class="form-control custom-entry-input"
                      :disabled="!isMetricEditable"
                    />
                  </div>
                </div>
                <div class="col-6">
                  <label for="orig_id">
                    Original ID
                    <span class="text-red-400 required">*</span>
                  </label>
                  <div class="w-100">
                    <input
                      id="orig_id"
                      v-model="metricObj.orig_id"
                      type="text"
                      class="form-control custom-entry-input"
                      :disabled="!isMetricEditable"
                    />
                  </div>
                </div>
              </div>
              <div class="form-card__row__box row">
                <div class="col-6">
                  <label for="formal_definition">
                    Formal definition
                    <span class="text-red-400 required">*</span>
                  </label>
                  <div class="w-100">
                    <input
                      id="formal_definition"
                      v-model="metricObj.formal_definition"
                      type="text"
                      class="form-control custom-entry-input"
                      :disabled="!isMetricEditable"
                    />
                  </div>
                </div>
              </div>
              <div class="form-card__row__box row">
                <div class="col-12">
                  <label for="title">
                    Title
                    <span class="text-red-400 required">*</span>
                  </label>
                  <div class="w-100">
                    <input
                      id="title"
                      v-model="metricObj.title"
                      type="text"
                      class="form-control custom-entry-input"
                      :disabled="!isMetricEditable"
                    />
                  </div>
                </div>
              </div>
              <div class="form-card__row__box row">
                <div class="col-12">
                  <label for="description">
                    Description
                    <span class="text-red-400 required">*</span>
                  </label>
                  <div class="w-100">
                    <textarea
                      v-model="metricObj.description"
                      class="form-control custom-entry-input"
                      placeholder="Description..."
                      :disabled="!isMetricEditable"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div class="form-card__row__box row">
                <div class="col-12">
                  <label for="title">References</label>
                  <div
                    v-if="
                      metricObj.references && metricObj.references.length > 0
                    "
                    class="w-100"
                  >
                    <div class="row">
                      <div
                        v-for="(reference, index) in metricObj.references"
                        :key="index"
                        class="col-6 pt-0 pb-1"
                      >
                        <div class="input-wrapper big d-flex">
                          <span>{{ index + 1 }}.</span>
                          <input
                            v-model="metricObj.references[index]"
                            type="text"
                            class="form-control"
                            :disabled="!isMetricEditable"
                          />
                          <button
                            v-if="isMetricEditable"
                            class="btn-delete-input"
                            type="button"
                            @click="
                              onDeleteElement(index, metricObj.references)
                            "
                          >
                            <font-awesome-icon :icon="['far', 'trash-can']" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-card__row__box row">
                <div class="col-12">
                  <label for="title">Contacts</label>
                  <div
                    v-if="
                      metricObj.metrics_contact_ids &&
                      metricObj.metrics_contact_ids.length > 0
                    "
                    class="w-100"
                  >
                    <div class="row">
                      <div
                        v-for="(
                          contacts, index
                        ) in metricObj.metrics_contact_ids"
                        :key="index"
                        class="col-6 pt-0 pb-1"
                      >
                        <div class="input-wrapper big d-flex">
                          <span>{{ index + 1 }}.</span>
                          <input
                            v-model="metricObj.metrics_contact_ids[index]"
                            type="text"
                            class="form-control"
                            :disabled="!isMetricEditable"
                          />
                          <button
                            v-if="isMetricEditable"
                            class="btn-delete-input"
                            type="button"
                            @click="
                              onDeleteElement(
                                index,
                                metricObj.metrics_contact_ids,
                              )
                            "
                          >
                            <font-awesome-icon :icon="['far', 'trash-can']" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="metricObj.representation_hints" class="w-100">
                <UFormGroup label="Representation hints">
                  <div class="form-text">
                    <div
                      v-if="metricObj.representation_hints.visualization"
                      class="d-flex"
                    >
                      Usually found in:
                      <span class="pl-2"><b>Bar plots</b></span>
                      <NuxtLink
                        to="/dashboard/plots?type=box"
                        class="btn custom-btn btn-primary mb-2 small ml-5"
                      >
                        View Box Plot
                      </NuxtLink>
                    </div>
                    <div
                      v-else-if="metricObj.representation_hints.optimization"
                      class="d-flex"
                    >
                      Usually found in:
                      <span class="pl-2"><b>Scatter plots</b></span>
                      <NuxtLink
                        to="/dashboard/plots?type=scatter"
                        class="btn custom-btn btn-primary mb-2 small ml-5"
                      >
                        View Scatter Plot
                      </NuxtLink>
                    </div>
                  </div>
                </UFormGroup>
              </div>
            </div>
          </div>
        </div>
        <div class="w-100">
          <div v-if="oks" class="ok-response">
            <div class="alert alert-success text-center">
              {{ oks }}
            </div>
          </div>
        </div>
        <div class="w-100">
          <div v-if="errors.length > 0" class="errors">
            <div class="alert alert-danger text-center">
              {{ getErrors }}
            </div>
          </div>
        </div>
        <div class="form-footer">
          <UButton type="button" variant="secondary" @click="closeModal">
            Cancel
          </UButton>
          <UButton v-if="isMetricEditable" class="" type="submit">
            Submit
          </UButton>
        </div>
      </UForm>
    </template>
    <template #footer>
      <div class="form-footer">
      </div>
    </template>
  </CustomModal>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits } from "vue";
import type { FormErrorEvent, FormSubmitEvent } from "#ui/types";
import CustomModal from "@/components/Common/CustomModal.vue";
import type { Metric } from "@/types/challenge_metric";
import { array, object, string, safeParse } from "valibot";

const props = defineProps<{
  isModalOpen: boolean;
  modalTitle: string;
  metricId: string;
  isMetricEditable: boolean;
  token: string;
}>();

const emits = defineEmits(["close-modal"]);

const runtimeConfig = useRuntimeConfig();
const metricObj = ref<Metric | null>(null);
const isSearchingMetric = ref(true);
const errors = ref<string[]>([]);
const oks = ref<string>("");

const state = ref({
  _id: "",
  orig_id: "",
  formal_definition: "",
  title: "",
  description: "",
  references: [],
  metrics_contact_ids: [],
});

const schema = object({
  _id: string(),
  orig_id: string(),
  formal_definition: string(),
  title: string(),
  description: string(),
  references: array(string()),
  metrics_contact_ids: array(string()),
});

const getErrors = computed(() => errors.value.join(", "));

const closeModal = () => {
  isSearchingMetric.value = true;
  metricObj.value = null;
  errors.value = [];
  emits("close-modal");
};

async function fetchMetric(id: string): Promise<Metric> {
  isSearchingMetric.value = true;
  try {
    const response = await fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Metrics/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${props.token}`,
          Accept: "application/json",
        },
      },
    );
    const data = await response.json();
    metricObj.value = data;
    return data;
  } catch (error) {
    return null;
  } finally {
    isSearchingMetric.value = false;
  }
}

function validateRequiredFields(data: any): string[] {
  const requiredFields = [
    "_id",
    "original_id",
    "formal_definition",
    "title",
    "description",
  ];
  const errorMessages: string[] = [];

  requiredFields.forEach((field) => {
    if (typeof data[field] === "string" && data[field].trim() === "") {
      errorMessages.push(`${field} cannot be empty`);
    }
  });
  return errorMessages;
}

async function onError(event: FormErrorEvent) {
  // console.log("state: ", state.value);
  // console.log("event: ", event);
}

async function onSubmitNewMetric(event: FormSubmitEvent<Schema>) {
  const result = safeParse(schema, state.value);
  if (result.success) {
    const customErrors = validateRequiredFields(state.value);
    if (customErrors.length > 0) {
      errors.value = customErrors;
    } else {
      errors.value = [
        "API Error: The new metric could not be added to the challenge.",
      ];
      //await addNewMetric();
    }
  } else {
    errors.value = result.error.issues.map((issue) => issue.message);
  }
}

watch(
  () => props.metricId,
  async (newVal) => {
    if (newVal) {
      metricObj.value = await fetchMetric(newVal);
      state.value = metricObj.value;
    }
  },
);
</script>

<style lang="scss" scoped>
.input-wrapper {
  background-color: theme("colors.primary.50");
  padding: 0.6rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  line-height: 1;
  padding-bottom: 10px;
  display: flex;
  gap: 10px;
  justify-content: start;
  align-items: baseline;
  input {
    border: none;
    background-color: rgba(255, 255, 255, 0.8);
    width: 100%;
  }
  &.big {
    margin-bottom: 5px;
    width: 100%;
  }
}

.input-wrapper input:disabled {
  background-color: #e9ecef !important;
  opacity: 1;
}

.form-footer {
  display: flex;
  justify-content: end;
  gap: 10px;
}
</style>
