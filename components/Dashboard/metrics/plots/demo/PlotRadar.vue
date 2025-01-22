<template>
  <div class="bar-plot">
    <div class="bar-description pb-4">
      Radar plots in OpenEBench present multi-dimensional data in a circular
      format, allowing for a comprehensive visualization of performance across
      multiple categories or metrics. Each axis represents a specific metric,
      and the plotted points show the relative performance of different tools or
      options across all dimensions. This enables users to easily compare and
      assess the strengths and weaknesses of various contenders at a glance.
    </div>
    <div class="w-100 pt-1">
      <div v-if="isLoadingGraphBar" class="loader-container mt-5">
        <img
          src="~/assets/images/201805.OpenEBench.logo.Animated.0050secs.gif"
          alt="Loader GIF"
          class="loader"
        />
      </div>
      <div v-else>
        <div class="row">
          <div class="col-8">
            <widget-element
              :key="widgetKey"
              :data="preparedBar"
              :type="type"
            ></widget-element>
          </div>
          <div class="col-4">
            <UForm
              :schema="schema"
              :state="state"
              class="space-y-4"
              @error="onError"
              @submit="onSubmit"
            >
              <UFormGroup
                v-for="participant in state.challenge_participants"
                :key="participant.id"
                :label="`Tool Name: ${participant.id}`"
                name="tool"
                class="form-group__block"
              >
                <div class="input-row">
                  <div class="input-row-group">
                    <div class="mr-2 input-row-group__title">Value:</div>
                    <UInput
                      v-model="participant.value"
                      class="form-control custom-entry-input"
                      autocomplete="off"
                    />
                  </div>
                  <div class="input-row-group">
                    <div class="mr-2 input-row-group__title">Error:</div>
                    <UInput
                      v-model="participant.error"
                      class="form-control custom-entry-input"
                      autocomplete="off"
                    />
                  </div>
                </div>
                <div class="input-row">
                  <div class="input-row-group">
                    <div class="mr-2 input-row-group__title">Label:</div>
                    <UInput
                      v-model="participant.label"
                      class="form-control custom-entry-input"
                      autocomplete="off"
                      disabled
                    />
                  </div>
                </div>
              </UFormGroup>
              <div v-if="hasDataError" class="w-100">
                <div class="alert alert-danger" role="alert">
                  {{ hasDataErrorMessage }}
                </div>
              </div>
              <div class="form-footer pt-3">
                <UButton class="" type="submit"> Generate plot </UButton>
              </div>
            </UForm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { array, object, safeParse } from "valibot";

import demo_bar from "./templates/RADARPLOT.json";
const isLoadingGraphBar = ref(true);

const preparedBar = ref<any>({});
const initialValues = ref<any>({});
const type: string = ref("radar-plot");
const hasDataError = ref(false);
const hasDataErrorMessage = ref("");
const widgetKey = ref(0);

const state = ref({
  challenge_participants: [],
});

const schema = object({
  challenge_participants: array(object()),
});

getPreparedData();
function getPreparedData() {
  const bar = demo_bar;
  const barVisualization = bar.visualization;
  preparedBar.value = {
    _id: bar._id,
    name: bar.name,
    dates: bar.dates,
    inline_data: {
      challenge_participants: [],
      visualization: {
        dates: barVisualization.dates,
        type: barVisualization.type,
        schema_url: barVisualization.schema_url,
      },
    },
  };
  for (const [_key, value] of Object.entries(bar.assessments)) {
    const preparedParticipant = {
      id: value._id,
      label: value.label,
      value: value.value,
      error: value.error,
    };
    preparedBar.value.inline_data.challenge_participants.push(
      preparedParticipant,
    );
  }

  initialValues.value = JSON.parse(
    JSON.stringify(preparedBar.value.inline_data.challenge_participants),
  );
  state.value.challenge_participants =
    preparedBar.value.inline_data.challenge_participants;
  preparedBar.value = JSON.stringify(preparedBar.value);
}

function regeneratePlot(newData: any) {
  const preparedObj = JSON.parse(preparedBar.value);
  if (preparedObj.inline_data) {
    preparedObj.inline_data.challenge_participants = newData;
    preparedBar.value = JSON.stringify(preparedObj);
  }

  widgetKey.value++;
}

async function onError(event: FormErrorEvent) {
  console.log("state: ", state.value);
  console.log("event: ", event);
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const result = safeParse(schema, state.value);
  hasDataError.value = false;
  hasDataErrorMessage.value = "";

  if (result.success) {
    const data = state.value.challenge_participants.map((item) => {
      const metricValueString =
        typeof item.value === "string" ? item.value : String(item.value || "");
      const itemMetric = metricValueString.replace(",", ".");
      const metricValue = parseFloat(itemMetric);

      const metricErrorString =
        typeof item.error === "string" ? item.error : String(item.error || "");
      const itemMetricError = metricErrorString.replace(",", ".");
      const metricValueError = parseFloat(itemMetricError);

      return {
        id: item.id,
        label: item.label,
        value: isNaN(metricValue) ? null : metricValue,
        error: metricValueError,
      };
    });

    if (hasDataError.value) {
      return;
    }
    regeneratePlot(data);
  }
}

onMounted(async () => {
  await import("@inb/oeb-widgets-graphs").then(() => {
    isLoadingGraphBar.value = false;
  });
});
</script>

<style lang="scss" scoped>
.input-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  &-group {
    display: block;
    align-items: center;
    gap: 10px;
    &__title {
      font-weight: 500;
      font-size: 13px;
    }
  }
}
.form-group__block {
  font-size: 16px;
  border: 1px solid #e5e7eb;
  padding: 10px 14px 10px 10px;
  border-radius: 5px;
  margin-top: 2px !important;
  label {
    font-size: 16px;
  }
}
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  .loader {
    max-height: 130px;
  }
}
</style>
