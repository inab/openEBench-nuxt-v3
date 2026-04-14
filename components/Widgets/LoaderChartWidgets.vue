<template>
  <div class="loader-chart-widget">
    <div v-if="isLoadingGraph" class="loader-container mt-5">
      <img src="~/assets/images/201805.OpenEBench.logo.Animated.0050secs.gif" alt="Loader GIF" class="loader" />
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
import { ref, onMounted, watch, computed } from "vue";
import BoxPlotConverter from "@/utils/BoxPlotConverter.js";

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

console.log("dataGraph: ", dataGraph.value);

const schemaUrl = computed(() =>
  dataGraph.value.inline_data?.visualization?.schema_url ?? null
);

watch(
  () => props.data,
  () => {
    if (props.data) {
      getPreparedData();
    }
  },
  { immediate: true }
);

// Add this after getPreparedData() call
watch(preparedData, (newVal) => {
  if (newVal) {
    try {
      console.log('[widget] type:', type.value);
      console.log('[widget] preparedData parsed:', JSON.parse(newVal));
    } catch (e) {
      console.error('[widget] preparedData is not valid JSON:', newVal);
    }
  }
}, { immediate: true });

function getPreparedData() {
  const visualization =
    dataGraph.value.visualization ??
    dataGraph.value.inline_data?.visualization ??
    {};
  const graphType = visualization?.type ?? null;

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
      dates: dataGraph.value.dates ?? dataGraph.value.data?.dates ?? null,
      inline_data: {
        challenge_participants: [],
        visualization: {},
      },
    };
  } else {
    prepared = {
      _id: dataGraph.value.key ?? dataGraph.value._id,
      dates: dataGraph.value.data?.dates ?? dataGraph.value.dates ?? null,
      dataset_contact_ids: dataGraph.value.data?.dataset_contact_ids ?? null,
      inline_data: {
        challenge_participants: [],
        visualization: {},
      },
    };
  }

  if (graphType === "bar-plot") {
    // Process challenge_participants data for BarPlot
    const participants = dataGraph.value.challenge_participants ?? [];

    participants.forEach((participant: any) => {
      const preparedParticipant = {
        tool_id: participant.tool_id,
        metric_value: participant.metric_value,
        stderr: participant.stderr ? participant.stderr : null,
      };
      prepared.inline_data.challenge_participants.push(preparedParticipant);
    });

    // Process visualization data for BarPlot
    prepared.inline_data.visualization = {
      metric: visualization.metric,
      type: visualization.type,
    };
  } else if (graphType === "2D-plot") {
    // Process challenge_participants data for ScatterPlot
    const participants = dataGraph.value?.challenge_participants ?? [];
    participants.forEach((participant: any) => {
      const preparedParticipant = {
        tool_id: participant.tool_id,
        metric_x: participant.metric_x,
        stderr_x: participant.stderr_x,
        metric_y: participant.metric_y,
        stderr_y: participant.stderr_y,
      };
      prepared.inline_data.challenge_participants.push(preparedParticipant);
    });

    const optimization = visualization.optimization ?? null;

    let xAxis = visualization.x_axis;
    let yAxis = visualization.y_axis;

    if (props.metrics.length > 0) {
      const metricNames = getMetricsNames(xAxis, yAxis);
      xAxis = metricNames.metricX;
      yAxis = metricNames.metricY;
    }

    prepared.inline_data.visualization = {
      type: visualization.type,
      x_axis: xAxis,
      y_axis: yAxis,
      optimization: optimization,
    };
  } else if (graphType === "box-plot") {
    // Process challenge_participants data for BoxPlot
    const participants = dataGraph.value?.challenge_participants ?? [];
    const log2Param =
      dataGraph.value?.visualization.axes_scale &&
        dataGraph.value?.visualization.axes_scale === "?log2=true"
        ? true
        : false;

    const result = BoxPlotConverter(participants, log2Param);

    prepared.inline_data.challenge_participants = result;

    // // Process visualization data for BoxPlot
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
    const radarVisualization = dataGraph.value.inline_data.visualization;
    prepared.inline_data.visualization = {
      type: radarVisualization.type,
      dates: radarVisualization.dates,
      schema_url: radarVisualization.schema_url,
    };
  }
  console.log('[getPreparedData] graphType:', graphType);
  console.log('[getPreparedData] dataGraph.value:', JSON.parse(JSON.stringify(dataGraph.value)));
  console.log('[getPreparedData] prepared before stringify:', prepared);

  preparedData.value = JSON.stringify(prepared);
  type.value = graphType;
}

function getMetricsNames(metricX: string, metricY: string) {
  if (!metricX || !metricY || props.metrics.length === 0) {
    return { metricX, metricY };
  }

  const metricNames = { metricX, metricY };

  props.metrics.forEach((metric: any) => {
    const rawId = metric._metadata?.["level_2:metric_id"];
    const label = metric.title || metric.metrics_label || metric.orig_id || metric._id;

    // Handle both string and array cases
    const ids: string[] = Array.isArray(rawId)
      ? rawId.map((id: string) => id.toLowerCase())
      : rawId
        ? [rawId.toLowerCase()]
        : [metric._id?.toLowerCase()];

    if (ids.includes(metricX.toLowerCase())) {
      metricNames.metricX = label;
    }
    if (ids.includes(metricY.toLowerCase())) {
      metricNames.metricY = label;
    }
  });

  return metricNames;
}
</script>

<style lang="scss" scoped>
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.loader {
  width: 160px;
  height: 100px;
}

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
