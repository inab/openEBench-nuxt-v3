<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="onSubmitNewMetric"
  >
    <div class="form-card__row">
      <div class="form-card__row__box row">
        <div class="col-6">
          <label for="acronym">
            Metric title
            <span class="text-red-400 required">*</span>
          </label>
          <div class="w-100">
            <UInput
              id="acronym"
              v-model="state.title"
              type="text"
              class="custom-select-input"
            />
          </div>
        </div>
        <div class="col-6">
          <label for="formal_definition">
            Formal definition
            <span class="text-red-400 required">*</span>
          </label>
          <div class="w-100">
            <UInput
              id="formal_definition"
              v-model="state.formal_definition"
              type="text"
              class="custom-select-input"
            />
          </div>
        </div>
      </div>
      <div class="form-card__row__box row">
        <div class="col-6">
          <label for="orig_id">
            Original ID
            <span class="text-red-400 required">*</span>
          </label>
          <div class="w-100">
            <UInput
              id="orig_id"
              v-model="state.orig_id"
              type="text"
              class="custom-select-input"
            />
          </div>
        </div>
        <div class="col-6">
          <label for="formal_definition"> Type </label>
          <div class="w-100">
            <USelect v-model="state.type" :options="types" class="selector" />
          </div>
        </div>
      </div>
      <div class="form-card__row__box row">
        <div class="form-group">
          <label for="description">
            Description
            <span class="text-red-400 required">*</span>
          </label>
          <div class="w-100">
            <UTextarea
              id="description"
              v-model="state.description"
              type="text"
              class="custom-select-input"
            >
            </UTextarea>
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
        <UButton type="submit"> Submit </UButton>
      </div>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from "vue";
import type { FormErrorEvent, FormSubmitEvent } from "#ui/types";
import { object, string, array, safeParse, nonEmpty, is } from "valibot";

const state = ref({
  title: "",
  description: "",
  formal_definition: "",
  orig_id: "",
  metrics_contact_ids: [] as string[],
  type: "Assessment",
});

const emit = defineEmits(["modal-close"]);

const types = ["Assessment", "Aggregation"];
const errors = ref<string[]>([]);
const oks = ref<string>("");
const schema = object({
  title: string(),
  description: string(),
  formal_definition: string(),
  orig_id: string(),
  type: string(),
  metrics_contact_ids: array(
    object({
      id: string(),
      name: string(),
    }),
  ),
});

const getErrors = computed(() => errors.value.join(", "));

function validateRequiredFields(data: any): string[] {
  const requiredFields = ["title", "formal_definition", "description"];
  const errorMessages: string[] = [];

  requiredFields.forEach((field) => {
    if (typeof data[field] === "string" && data[field].trim() === "") {
      errorMessages.push(`${field} cannot be empty`);
    }
  });
  return errorMessages;
}

async function showOkMessage(msg: string) {
  oks.value = msg;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      oks.value = "";
      resolve("done");
    }, 5000);
  });
}

function closeModal() {
  emit("modal-close");
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

async function addNewMetric() {
  const body = {
    title: state.value.title,
    description: state.value.description,
    formal_definition: state.value.formal_definition,
    orig_id: state.value.orig_id,
    type: state.value.type,
  };
}
</script>

<style lang="scss" scoped>
.form-card__row__box {
  padding-bottom: 15px;
}
</style>
