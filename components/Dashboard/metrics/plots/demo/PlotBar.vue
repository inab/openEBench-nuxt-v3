<template>
  <div class="bar-plot">
    This is bar plot
    <div class="">
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
            <widget-element :data="preparedBar" :type="type"></widget-element>
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
                :key="participant.tool_id"
                :label="`Tool Name: ${participant.tool_id}`"
                name="tool"
              >
                <UInput
                  v-model="participant.metric_value"
                  class="form-control custom-entry-input"
                  autocomplete="off"
                />
              </UFormGroup>
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
import { array, object, string, safeParse } from "valibot";

import demo_bar from "./templates/BARPLOT.json";
const isLoadingGraphBar = ref(true);

const preparedBar = ref<any>({});
const type: string = ref("bar-plot");

const state = ref({
  challenge_participants: "",
});

const schema = object({
  challenge_participants: array(object()),
});

getPreparedData();
function getPreparedData() {
  console.log("demo_bar", demo_bar);

  // Load demo data
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
  console.log("newData", newData);
  console.log("preparedBar", preparedBar.value);
  const preparedObj = JSON.parse(preparedBar.value);
  if (preparedObj.inline_data) {
    preparedObj.inline_data.challenge_participants = newData;
    preparedBar.value = JSON.stringify(preparedObj);
  }

  console.log("preparedBar", preparedBar.value);
}

async function onError(event: FormErrorEvent) {
  console.log("state: ", state.value);
  console.log("event: ", event);
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const result = safeParse(schema, state.value);
  console.log(result);
  if (result.success) {
    const data = state.value.challenge_participants.map((item) => ({
      tool_id: item.tool_id,
      metric_value: parseFloat(item.metric_value.replace(",", ".")),
      stderr: item.stderr,
    }));
    regeneratePlot(data);
  }
  console.log("onSubmit");
}

onMounted(async () => {
  await import("@inb/oeb-widgets-graphs").then(() => {
    isLoadingGraphBar.value = false;
  });
});
</script>
