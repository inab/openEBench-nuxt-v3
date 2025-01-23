<template>
  <div class="bar-plot">
    <div class="bar-description pb-4">
      Bar plots are visual representations used in OpenEBench to compare
      distinct categories or groups. Each category is represented by a bar, and
      the length of each bar corresponds to the measured value (e.g.,
      performance score, execution time). This simple yet effective
      visualization allows for quick comparisons between different options,
      highlighting strengths and weaknesses at a glance.
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
              @submit="onSubmit"
            >
              <UFormGroup
                v-for="participant in state.challenge_participants"
                :key="participant.tool_id"
                name="tool"
                class="form-group__block"
              >
              <div class="form-group__block__title">
                {{ `Tool Name: ${participant.tool_id}` }}
              </div>
                <div class="input-row">
                  <div class="input-row-group">
                    <UInput
                      v-model="participant.metric_value"
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
import { array, object, string, safeParse } from "valibot";

import demo_bar from "./templates/BARPLOT.json";
const isLoadingGraphBar = ref(true);

const preparedBar = ref<any>({});
const type: string = ref("bar-plot");
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
        tool_id: participant.tool_id,
        metric_value: participant.metric_value,
        stderr: participant.stderr,
      };
      return preparedParticipant;
    });
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
  if (result.success) {
    const data = state.value.challenge_participants.map((item) => {
      const metricValueString =
        typeof item.metric_value === "string"
          ? item.metric_value
          : String(item.metric_value || "");
      const itemMetric = metricValueString.replace(",", ".");
      const metricValue = parseFloat(itemMetric);

      return {
        tool_id: item.tool_id,
        metric_value: isNaN(metricValue) ? null : metricValue, // Handle parse errors gracefully
        stderr: item.stderr,
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
.form-group__block {
  font-size: 16px;
  border: 1px solid #e5e7eb;
  padding: 10px 14px 10px 10px;
  border-radius: 5px;
  margin-top: 2px !important;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
  label {
    font-size: 16px;
  }
  &__title {
    font-weight: 700;
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
