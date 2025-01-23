<template>
  <div class="bar-plot">
    <div class="bar-description pb-4">
      Line plots in OpenEBench illustrate trends and changes over time or across
      a continuous variable. Each data point is connected by a line, revealing
      patterns, growth, or fluctuations in performance. This visualization helps
      users understand how software behavior evolves under different conditions
      or over time intervals, facilitating analysis of dynamic performance
      characteristics.
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
          <div class="">This graph is not available for this demo.</div>
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
              @submit="onSubmit"
            >
              <UFormGroup
                v-for="participant in state.challenge_participants"
                :key="participant.name"
                :label="`Tool Name: ${participant.name}`"
                name="tool"
                class="form-group__block"
              >
                <div class="row">
                  <label for="x_value" class="form-label form-label-title">X Value</label>
                  <div
                    v-for="(p, indexX) in participant.x_value"
                    :key="indexX"
                    class="input-row col-4"
                  >
                    <div class="input-row-group pt-1">
                      <UInput
                        v-model="participant.x_value[indexX]"
                        class="form-control custom-entry-input"
                        autocomplete="off"
                      />
                    </div>
                  </div>
                </div>
                <div class="row pt-3">
                  <label for="y_value" class="form-label form-label-title">Y Value</label>
                  <div
                    v-for="(py, indexY) in participant.y_value"
                    :key="indexY"
                    class="input-row col-4"
                  >
                    <div class="input-row-group pt-1">
                      <UInput
                        v-model="participant.y_value[indexY]"
                        class="form-control custom-entry-input"
                        autocomplete="off"
                      />
                    </div>
                  </div>
                </div>
              </UFormGroup>
              <div v-if="hasDataError" class="w-100">
                <div class="alert alert-danger" role="alert">
                  {{ hasDataErrorMessage }}
                </div>
              </div>
              <div class="form-footer pt-3 d-flex justify-content-end">
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

import demo_bar from "./templates/LINEPLOT.json";
const isLoadingGraphBar = ref(true);

const preparedBar = ref<any>({});
const initialValues = ref<any>({});
const type: string = ref("line-plot");
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
        dates: barVisualization.dates,
        type: barVisualization.type,
        x_axis: barVisualization.x_axis,
        y_axis: barVisualization.y_axis,
      },
    },
  };
  preparedBar.value.inline_data.challenge_participants =
    bar.inline_data.challenge_participants.map((participant: any) => {
      const preparedParticipant = {
        name: participant.name,
        metric_id: participant.metric_id,
        x_value: participant.x_value,
        y_value: participant.y_value,
        t_error: participant.t_error,
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

function regeneratePlot(newData: any) {
  const preparedObj = JSON.parse(preparedBar.value);
  if (preparedObj.inline_data) {
    preparedObj.inline_data.challenge_participants = newData;
    preparedBar.value = JSON.stringify(preparedObj);
  }

  widgetKey.value++;
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const result = safeParse(schema, state.value);
  hasDataError.value = false;
  hasDataErrorMessage.value = "";

  if (result.success) {
    const data = state.value.challenge_participants.map((item) => {
      const xValues = item.x_value.map((x) => {
        const xValueString =
          typeof x === "string" ? x : x === 0 ? "0" : String(x || "");
        return parseFloat(xValueString);
      });

      const yValues = item.y_value.map((y) => {
        const yValueString =
          typeof y === "string" ? y : y === 0 ? "0" : String(y || "");
        return parseFloat(yValueString);
      });

      return {
        name: item.name,
        metric_id: item.metric_id,
        x_value: xValues,
        y_value: yValues,
        t_error: item.t_error,
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
.form-label-title {
  font-size: 14px !important;
  text-decoration: underline;
}
</style>
