<template>
  <div class="loader-chart-widget">
    <div v-if="isLoadingGraph" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else>
      <div v-if="schemaUrl" class="schema-url text-primaryOeb-500">
        {{ data.name }}: <a :href="schemaUrl" target="_blank">Schema URL</a>
      </div>
      <widget-element :data="preparedData" :type="type"></widget-element>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const isLoadingGraph = ref(true);
onMounted(async () => {
  await import("@inb/oeb-widgets-graphs").then(() => {
    isLoadingGraph.value = false;
  });
});

const props = defineProps<{
  data: any;
  metrics: any[];
}>();

const dataGraph = computed(() => props.data);
const preparedData: string = ref(null);
const type: string = ref("");

const schemaUrl = computed(() =>
  dataGraph.value.inline_data &&
  dataGraph.value.inline_data.visualization &&
  dataGraph.value.inline_data.visualization.schema_url
    ? dataGraph.value.inline_data.visualization.schema_url
    : null,
);

getPreparedData();

function getPreparedData() {
  const visualization =
    typeof dataGraph.value.data !== "undefined"
      ? dataGraph.value.data.datalink.inline_data.visualization
      : dataGraph.value.inline_data.visualization;

  const graphType = visualization.type;
  let prepared = {
    inline_data: {
      challenge_participants: [],
      visualization: {},
    },
  };

  if (graphType == "radar-plot") {
    prepared = {
      _id: dataGraph.value._id,
      name: dataGraph.value.name,
      dates: dataGraph.value.dates,
      inline_data: {
        challenge_participants: [],
        visualization: {},
      },
    };
  } else {
    prepared = {
      _id: dataGraph.value.data._id,
      dates: dataGraph.value.data.dates,
      dataset_contact_ids: dataGraph.value.data.dataset_contact_ids,
      inline_data: {
        challenge_participants: [],
        visualization: {},
      },
    };
  }

  if (graphType === "bar-plot") {
    // Process challenge_participants data for BarPlot
    dataGraph.value.data.datalink.inline_data.challenge_participants.forEach(
      (participant: any) => {
        const preparedParticipant = {
          tool_id: participant.toolname,
          metric_value: participant.metric_value,
          stderr: participant.stderr ? participant.stderr : null,
        };
        prepared.inline_data.challenge_participants.push(preparedParticipant);
      },
    );
    // Process visualization data for BarPlot
    const visualization =
      dataGraph.value.data.datalink.inline_data.visualization;
    prepared.inline_data.visualization = {
      metric: visualization.metric,
      type: visualization.type,
    };
  } else if (graphType === "2D-plot") {
    // Process challenge_participants data for ScatterPlot
    dataGraph.value.data.datalink.inline_data.challenge_participants.forEach(
      (participant: any) => {
        const preparedParticipant = {
          tool_id: participant.tool_id,
          metric_x: participant.metric_x,
          stderr_x: participant.stderr_x,
          metric_y: participant.metric_y,
          stderr_y: participant.stderr_y,
        };
        prepared.inline_data.challenge_participants.push(preparedParticipant);
      },
    );
    // Process visualization data for ScatterPlot
    const visualization =
      dataGraph.value.data.datalink.inline_data.visualization;
    const optimization = visualization.optimization
      ? visualization.optimization
      : null;

    let xAxis = null;
    let yAxis = null;
    if (props.metrics.length > 0) {
      const metricNames = getMetricsNames(
        visualization.x_axis,
        visualization.y_axis,
      );
      xAxis = metricNames.metricX;
      yAxis = metricNames.metricY;
    } else {
      xAxis = visualization.x_axis;
      yAxis = visualization.y_axis;
    }

    prepared.inline_data.visualization = {
      type: visualization.type,
      x_axis: xAxis,
      y_axis: yAxis,
      optimization: optimization,
    };
  } else if (graphType === "box-plot") {
    // Process challenge_participants data for BoxPlot
    dataGraph.value.data.datalink.inline_data.challenge_participants.forEach(
      (participant) => {
        const part = { ...participant };
        const preparedParticipant = { ...part };
        prepared.inline_data.challenge_participants.push(preparedParticipant);
      },
    );
    // Process visualization data for BoxPlot
    const visualization =
      dataGraph.value.data.datalink.inline_data.visualization;
    prepared.inline_data.visualization = {
      available_metrics: visualization.available_metrics,
      type: visualization.type,
    };
  } else if (graphType === "radar-plot") {
    // Process challenge_participants data for RadarPlot
    for (const [_key, value] of Object.entries(
      dataGraph.value.inline_data.challenge_participants,
    )) {
      const preparedParticipant = {
        id: value._id,
        label: value.label,
        value: value.value,
        error: value.error,
      };
      prepared.inline_data.challenge_participants.push(preparedParticipant);
    }
    // Process visualization data for RadarPlot
    const visualization = dataGraph.value.inline_data.visualization;
    prepared.inline_data.visualization = {
      type: visualization.type,
      dates: visualization.dates,
      schema_url: visualization.schema_url,
    };
  }
  preparedData.value = JSON.stringify(prepared);
  type.value = graphType;
}

function getMetricsNames(metricX: string, metricY: string) {
  if (props.metrics.length === 0) return [];

  const metricNames = { metricX: "", metricY: "" };
  props.metrics.forEach((metric: any) => {
    const metricId = metric._metadata?.["level_2:metric_id"] ?? metric._id;
    if (metricId === metricX) metricNames.metricX = metric.title;
    if (metricId === metricY) metricNames.metricY = metric.title;
  });

  return metricNames;
}
</script>

<style lang="scss" scoped>
.loader-chart-widget {
  .schema-url {
    font-size: 15px;
    font-weight: 600;
    padding-top: 30px;
    padding-left: 8px;
    text-align: left;
    a {
      color: theme("colors.primary.500");
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
