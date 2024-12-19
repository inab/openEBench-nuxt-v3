<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="onSubmitNewMetric"
  >
    <div class="row form-card__row">
      <div class="form-card__row__box row">
        <div class="form-group col-6">
          <label for="acronym">
            Metric title
            <span class="text-red-400 required">*</span>
          </label>
          <div class="w-100">
            <input
              id="acronym"
              v-model="state.title"
              type="text"
              class="form-control custom-entry-input"
              placeholder="Title"
            />
          </div>
        </div>
        <div class="form-group col-6">
          <label for="formal_definition">
            Formal definition
            <span class="text-red-400 required">*</span>
          </label>
          <div class="w-100">
            <input
              id="formal_definition"
              v-model="state.formal_definition"
              type="text"
              class="form-control custom-entry-input"
              placeholder="Formal definition"
            />
          </div>
        </div>
        <div class="form-group">
          <label for="description">
            Description
            <span class="text-red-400 required">*</span>
          </label>
          <div class="w-100">
            <input
              id="description"
              v-model="state.description"
              type="text"
              class="form-control custom-entry-input"
              placeholder="Description"
            />
          </div>
        </div>
      </div>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from "#ui/types";
import { object, string, array, safeParse, nonEmpty, is } from "valibot";

const state = ref({
  title: "",
  description: "",
  formal_definition: "",
  orig_id: "",
  metrics_contact_ids: [] as string[],
});

const schema = object({
  title: string(),
  description: string(),
  formal_definition: string(),
  orig_id: string(),
  metrics_contact_ids: array(
    object({
      id: string(),
      name: string(),
    }),
  ),
});

function onSubmitNewMetric() {}
</script>
