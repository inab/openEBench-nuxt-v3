<template>
  <div class="bar-plot">
    <div class="bar-description pb-4">
      Box plots summarize the distribution of numerical data for different
      categories or groups in OpenEBench. They display key statistical measures
      like the median, quartiles, and potential outliers, providing a concise
      overview of the central tendency, spread, and shape of the data. This
      allows users to quickly compare the performance distributions across
      various options.
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
                :key="participant.name"
                :label="`Tool Name: ${participant.name}`"
                name="tool"
                class="form-group__block"
              >
                <div class="input-row">
                  <div class="input-row-group">
                    <div class="mr-2 input-row-group__title">Q1:</div>
                    <UInput
                      v-model="participant.q1"
                      class="form-control custom-entry-input"
                      autocomplete="off"
                    />
                  </div>
                  <div class="input-row-group">
                    <div class="mr-2 input-row-group__title">Q3:</div>
                    <UInput
                      v-model="participant.q3"
                      class="form-control custom-entry-input"
                      autocomplete="off"
                    />
                  </div>
                </div>
                <div class="input-row">
                  <div class="input-row-group">
                    <div class="mr-2 input-row-group__title">Mean:</div>
                    <UInput
                      v-model="participant.mean"
                      class="form-control custom-entry-input"
                      autocomplete="off"
                      disabled
                    />
                  </div>
                  <div class="input-row-group">
                    <div class="mr-2 input-row-group__title">Median:</div>
                    <UInput
                      v-model="participant.median"
                      class="form-control custom-entry-input"
                      autocomplete="off"
                      disabled
                    />
                  </div>
                </div>
                <div class="input-row">
                  <div class="input-row-group">
                    <div class="mr-2 input-row-group__title">Lowerfence:</div>
                    <UInput
                      v-model="participant.lowerfence"
                      class="form-control custom-entry-input"
                      autocomplete="off"
                      disabled
                    />
                  </div>
                  <div class="input-row-group">
                    <div class="mr-2 input-row-group__title">Upperfence:</div>
                    <UInput
                      v-model="participant.upperfence"
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

import demo_bar from "./templates/BOXPLOT.json";
const isLoadingGraphBar = ref(true);

const preparedBar = ref<any>({});
const initialValues = ref<any>({});
const type: string = ref("box-plot");
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
  const barVisualization = bar.inline_data.visualization;
  preparedBar.value = {
    _id: bar._id,
    name: bar.name,
    dates: bar.dates,
    inline_data: {
      challenge_participants: [],
      visualization: {
        metric: barVisualization.metric,
        type: barVisualization.type,
      },
    },
  };
  preparedBar.value.inline_data.challenge_participants =
    bar.inline_data.challenge_participants.map((participant: any) => {
      const preparedParticipant = {
        name: participant.name,
        metric_id: participant.metric_id,
        q1: participant.q1,
        mean: participant.mean,
        median: participant.median,
        q3: participant.q3,
        lowerfence: participant.lowerfence,
        upperfence: participant.upperfence,
      };
      return preparedParticipant;
    });

  initialValues.value = JSON.parse(
    JSON.stringify(preparedBar.value.inline_data.challenge_participants),
  );
  state.value.challenge_participants =
    preparedBar.value.inline_data.challenge_participants;
  preparedBar.value = JSON.stringify(preparedBar.value);
}

function recalculateMedians(params) {
  const preparedObj = JSON.parse(preparedBar.value);
  if (preparedObj.inline_data) {
    const initialValuesMap = Object.fromEntries(
      initialValues.value.map((item) => [item.metric_id, item]),
    );

    const preparedObj = JSON.parse(preparedBar.value);

    preparedObj.inline_data.challenge_participants =
      preparedObj.inline_data.challenge_participants.map((item) => {
        const paramItem = params.find((param) => param.name === item.name);
        const initialItem = initialValuesMap[item.metric_id];

        const {
          q1: oldQ1,
          q3: oldQ3,
          mean: oldMean,
          median: oldMedian,
        } = initialItem;

        const { q1: newQ1, q3: newQ3 } = paramItem;

        const oldMidpoint = (oldQ1 + oldQ3) / 2;
        const newMidpoint = (newQ1 + newQ3) / 2;
        const newMedian = oldMedian + (newMidpoint - oldMidpoint);
        const newMean = oldMean + (newMidpoint - oldMidpoint);
        const newIQR = newQ3 - newQ1;
        const lowerFence = newQ1 - 1.5 * newIQR;
        const upperFence = newQ3 + 1.5 * newIQR;

        return {
          ...item,
          q1: newQ1,
          q3: newQ3,
          mean: newMean,
          median: newMedian,
          lowerfence: lowerFence,
          upperfence: upperFence,
        };
      });

    preparedBar.value = JSON.stringify(preparedObj);
    state.value.challenge_participants =
      preparedObj.inline_data.challenge_participants;
    widgetKey.value++;
  }
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
      if (!item.q1 || !item.q3 || isNaN(item.q1) || isNaN(item.q3)) {
        hasDataError.value = true;
        hasDataErrorMessage.value = "Q1 and Q3 values are required";
        return;
      } else if (item.q1 > item.q3) {
        hasDataError.value = true;
        hasDataErrorMessage.value = "Q1 value should be less than Q3 value";
        return;
      }

      const metricValueQ1String =
        typeof item.q1 === "string" ? item.q1 : String(item.q1 || "");
      const itemMetricQ1 = metricValueQ1String.replace(",", ".");
      const metricValueQ1 = parseFloat(itemMetricQ1);

      const metricValueQ3String =
        typeof item.q3 === "string" ? item.q3 : String(item.q3 || "");
      const itemMetricQ3 = metricValueQ3String.replace(",", ".");
      const metricValueQ3 = parseFloat(itemMetricQ3);

      return {
        name: item.name,
        metric_id: item.metric_id,
        q1: isNaN(itemMetricQ1) ? null : metricValueQ1,
        mean: item.mean,
        median: item.median,
        q3: isNaN(itemMetricQ3) ? null : metricValueQ3,
        lowerfence: item.lowerfence,
        upperfence: item.upperfence,
      };
    });

    if (hasDataError.value) {
      return;
    }
    recalculateMedians(data);
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
