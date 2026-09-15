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
import { ref } from "vue";
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
  dataGraph.value.inline_data &&
    dataGraph.value.visualization &&
    dataGraph.value.visualization.schema_url
    ? dataGraph.value.visualization.schema_url
    : null,
);

getPreparedData();

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
      dates: dataGraph.value.dates,
      inline_data: {
        challenge_participants: [],
        visualization: {},
      },
    };
  } else {
    prepared = {
      _id: dataGraph.value.key,
      dates: dataGraph.value.data?.dates ?? dataGraph.value.dates ?? null,
      dataset_contact_ids:
        dataGraph.value.data?.dataset_contact_ids ??
        dataGraph.value.dataset_contact_ids ??
        [],
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

    // Process visualization data for BoxPlot
    prepared.inline_data.visualization = {
      available_metrics: visualization.available_metrics,
      type: visualization.type,
    };
  } else if (graphType === "radar-plot") {
    // The radar-plot widget reads challenge_participants and visualization
    // directly off the top-level `data`, NOT off `inline_data`. Each
    // participant entry needs { label, metric_id, values: [{ v, e }] },
    // and visualization needs representations[0].metrics_series with
    // { metric_id, title, optimization } per metric.

    const participantLabel = dataGraph.value.label ?? dataGraph.value.name ?? "";
    const rawEntries = dataGraph.value.inline_data?.challenge_participants ?? [];

    const radarParticipants = rawEntries.map((entry: any) => ({
      label: participantLabel,
      metric_id: entry.label, // metric id was stored under "label" upstream
      values: [{ v: entry.value, e: entry.error ?? 0 }],
    }));

    const metricsSeries = (props.metrics ?? []).map((metric: any) => {
      const rawId = metric._metadata?.["level_2:metric_id"] ?? metric._id;
      return {
        metric_id: rawId != null ? String(rawId) : metric._id,
        title:
          metric.title || metric.metrics_label || metric.orig_id || rawId,
        optimization: metric.optimization ?? "maximize", // TODO: confirm real field
      };
    });

    prepared = {
      _id: dataGraph.value._id ?? dataGraph.value.key,
      challenge_participants: radarParticipants,
      visualization: {
        dates: {
          modification:
            dataGraph.value.inline_data?.visualization?.dates ?? "",
        },
        representations: [
          {
            type: "radar-plot",
            metrics_series: metricsSeries,
          },
        ],
      },
    };
  }

  preparedData.value = JSON.stringify(prepared);
  type.value = graphType;
}

function getMetricsNames(metricX: string, metricY: string) {
  if (!metricX || !metricY || props.metrics.length === 0) {
    return { metricX, metricY };
  }

  const metricNames = { metricX, metricY };

  props.metrics.forEach((metric: any) => {
    const rawId = metric._metadata?.["level_2:metric_id"] ?? metric._id;
    const id = rawId != null ? String(rawId).toLowerCase() : null;

    if (!id) return;

    const label = metric.title || metric.metrics_label || metric.orig_id || id;

    if (id === metricX.toLowerCase()) {
      metricNames.metricX = label;
    }

    if (id === metricY.toLowerCase()) {
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