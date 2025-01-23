<template>
  <div class="scatter-plot">
    <div class="scatter-description pb-4">
      Scatter plots in OpenEBench display the relationship between two
      variables. Each data point is represented as a marker on a graph, with its
      position determined by the values of the two variables. This visualization
      helps identify trends, correlations, and potential outliers, allowing
      users to gain deeper insights into complex performance patterns.
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
              :data="preparedScatter"
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
                :key="participant.tool_id"
                :label="`Tool Name: ${participant.tool_id}`"
                name="tool"
                class="form-group__block"
              >
                <div class="input-row">
                  <div class="input-row-group">
                    <div class="mr-2 input-row-group__title">value X:</div>
                    <UInput
                      v-model="participant.metric_x"
                      class="form-control custom-entry-input"
                      autocomplete="off"
                    />
                  </div>
                  <div class="input-row-group">
                    <div class="mr-2 input-row-group__title">value Y:</div>
                    <UInput
                      v-model="participant.metric_y"
                      class="form-control custom-entry-input"
                      autocomplete="off"
                    />
                  </div>
                </div>
              </UFormGroup>
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

import demo_scatter from "./templates/SCATTERPLOT.json";
const isLoadingGraphBar = ref(true);
const preparedScatter = ref<any>({});
const type: string = "2D-plot";
const widgetKey = ref(0);

const state = ref({
  challenge_participants: [],
});

const schema = object({
  challenge_participants: array(object()),
});

getPreparedData();
function getPreparedData() {
  const scatter = demo_scatter;
  const barVisualization = scatter.inline_data.visualization;
  preparedScatter.value = {
    _id: scatter._id,
    dates: scatter.dates,
    inline_data: {
      challenge_participants: [],
      visualization: barVisualization,
    },
  };
  preparedScatter.value.inline_data.challenge_participants =
    scatter.inline_data.challenge_participants.map((participant: any) => {
      const preparedParticipant = {
        tool_id: participant.tool_id,
        metric_x: participant.metric_x,
        stderr_x: participant.stderr_x,
        metric_y: participant.metric_y,
        stderr_y: participant.stderr_y,
      };
      return preparedParticipant;
    });
  state.value.challenge_participants =
    preparedScatter.value.inline_data.challenge_participants;
  preparedScatter.value = JSON.stringify(preparedScatter.value);
}

function regeneratePlot(newData: any) {
  const preparedObj = JSON.parse(preparedScatter.value);
  if (preparedObj.inline_data) {
    preparedObj.inline_data.challenge_participants = newData;
    preparedScatter.value = JSON.stringify(preparedObj);
  }

  widgetKey.value++;
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const result = safeParse(schema, state.value);
  if (result.success) {
    const data = state.value.challenge_participants.map((item) => {
      const metricValueStringX =
        typeof item.metric_x === "string"
          ? item.metric_x
          : String(item.metric_x || "");
      const itemMetricX = metricValueStringX.replace(",", ".");
      const metricValueX = parseFloat(itemMetricX);

      const metricValueStringY =
        typeof item.metric_y === "string"
          ? item.metric_y
          : String(item.metric_y || "");
      const itemMetricY = metricValueStringX.replace(",", ".");
      const metricValueY = parseFloat(itemMetricY);

      return {
        tool_id: item.tool_id,
        metric_x: isNaN(itemMetricX) ? null : metricValueX,
        metric_y: isNaN(itemMetricY) ? null : metricValueY,
        stderr_x: item.stderr_x,
        stderr_y: item.stderr_y,
      };
    });
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
  font-weight: 700;
  border: 1px solid #e5e7eb;
  padding: 10px 14px 10px 10px;
  border-radius: 5px;
  margin-top: 2px !important;
  label {
    font-size: 16px;
    font-weight: 700;
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
