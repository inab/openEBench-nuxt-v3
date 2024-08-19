<template>
  <div class="">
    <!-- <LoaderWidgets
			v-if="preparedData"
			:data-chart="preparedData"
		></LoaderWidgets> -->
    <!-- <widget-element
      :data=preparedData
      :type=type>
    </widget-element> -->
    <div v-if="isLoadingGraph" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else>
      <widget-element :data="preparedData" :type="type"></widget-element>
    </div>
  </div>
</template>
<script setup lang="ts">
//import LoaderWidgets from '@inb/oeb-widgets/components/LoaderWidgets.vue';
import { ref } from "vue";
//import '@/components/test/oeb-graph/dist/oe-widget-graph.js';
//import { WidgetElement } from '@inb/oeb-widgets-graphs';

const isLoadingGraph = ref(true);
onMounted(async () => {
  await import("@inb/oeb-widgets-graphs").then(() => {
    isLoadingGraph.value = false;
  });
});

const data = ref([{ value: 10 }]);

const props = defineProps<{
  data: any;
  metrics: any[];
}>();

const preparedData: string = ref(null);
const type: string = ref("");

getPreparedData();

function getPreparedData() {
  const visualization = props.data.datalink
    ? props.data.datalink.inline_data.visualization
    : props.data.inline_data.visualization;
  const graphType = visualization.type;
  let prepared = {
    inline_data: {
      challenge_participants: [],
      visualization: {},
    },
  };
  if (graphType == "radar-plot") {
    prepared = {
      _id: props.data._id,
      name: props.data.name,
      dates: props.data.dates,
      inline_data: {
        challenge_participants: [],
        visualization: {},
      },
    };
  } else {
    prepared = {
      _id: props.data._id,
      dates: props.data.dates,
      dataset_contact_ids: props.data.dataset_contact_ids,
      inline_data: {
        challenge_participants: [],
        visualization: {},
      },
    };
  }

  if (graphType === "bar-plot") {
    // Process challenge_participants data for BarPlot
    props.data.datalink.inline_data.challenge_participants.forEach(
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
    const visualization = props.data.datalink.inline_data.visualization;
    prepared.inline_data.visualization = {
      metric: visualization.metric,
      type: visualization.type,
    };
  } else if (graphType === "2D-plot") {
    // Process challenge_participants data for ScatterPlot
    props.data.datalink.inline_data.challenge_participants.forEach(
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
    const visualization = props.data.datalink.inline_data.visualization;
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
    props.data.datalink.inline_data.challenge_participants.forEach(
      (participant) => {
        const part = { ...participant };
        const preparedParticipant = { ...part };
        prepared.inline_data.challenge_participants.push(preparedParticipant);
      },
    );
    // Process visualization data for BoxPlot
    const visualization = props.data.datalink.inline_data.visualization;
    prepared.inline_data.visualization = {
      available_metrics: visualization.available_metrics,
      type: visualization.type,
    };
  } else if (graphType === "radar-plot") {
    // Process challenge_participants data for RadarPlot
    props.data.inline_data.challenge_participants.forEach((participant) => {
      const preparedParticipant = {
        id: participant._id,
        label: participant.label,
        value: participant.value,
        error: participant.error,
      };
      prepared.inline_data.challenge_participants.push(preparedParticipant);
    });
    // Process visualization data for RadarPlot
    const visualization = props.data.inline_data.visualization;
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
