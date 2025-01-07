<template>
  <div class="add-visualization-table">
    <div class="add-visualization-table__body">
      <div class="add-visualization-table__body__title">
        Currently we have 4 visualizations available for you to use.
      </div>
      <div class="add-visualization-table__body__content">
        <div class="add-visualization-table__body__content__title">
          ( Recommended Visualization
          <span>{{
            recomendedVisualization[0]?.name || "No Visualization Available"
          }}</span>
          )
        </div>
        <div class="add-visualization-table__body__content__box">
          <div class="row">
            <div class="col-6">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Bar Plot</h5>
                  <div class="">
                    <widget-element
                      :data="preparedBar"
                      type="bar-plot"
                    ></widget-element>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Scatter Plot</h5>
                  <div class="">
                    <widget-element
                      :data="preparedScatter"
                      type="2D-plot"
                    ></widget-element>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-6 mt-3">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Radar Plot</h5>
                  <div class="">
                    <widget-element
                      :data="preparedRadar"
                      type="radar-plot"
                    ></widget-element>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-6 mt-3">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Box Plot</h5>
                  <div class="">
                    <widget-element
                      :data="preparedBox"
                      type="box-plot"
                    ></widget-element>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import type { Metric } from "@/types/challenge_metric";
import demo_bar from "./demo/bar_plot_demo.json";
import demo_scatter from "./demo/scatter_plot_demo.json";
import demo_radar from "./demo/radar_plot_demo.json";
import demo_box from "./demo/box_plot_demo.json";

const props = defineProps<{
  selectedMetrics: Metric[];
}>();

const isShadowHostReady = ref(false);
let intervalId: number | undefined;


const isLoadingGraph = ref(true);
const preparedBar = ref({
  _id: "",
  name: "",
  dates: [],
  inline_data: {
    challenge_participants: [],
    visualization: {},
  },
});

const preparedScatter = ref({
  _id: "",
  name: "",
  dates: "",
  inline_data: {
    challenge_participants: [],
    visualization: {},
  },
});
const preparedRadar = ref({
  _id: "",
  name: "",
  dates: "",
  inline_data: {
    challenge_participants: [],
    visualization: {},
  },
});

const preparedBox = ref({
  _id: "",
  name: "",
  dates: "",
  inline_data: {
    challenge_participants: [],
    visualization: {},
  },
});

const recomendedVisualization = computed(() => {
  if (props.selectedMetrics.length === 0) {
    return [{ name: "No Visualization Available", total: 0 }];
  }

  const metricsByType = [
    { name: "Bar Plot", total: 0 },
    { name: "Scatter Plot", total: 0 },
    { name: "Radar Plot", total: 0 },
    { name: "Box Plot", total: 0 },
  ];

  props.selectedMetrics.forEach((metric) => {
    if (
      metric.representation_hints &&
      metric.representation_hints?.visualization
    ) {
      const type = metricsByType.filter((item) => item.name === "Bar Plot");
      type[0].total += 1;
    } else if (
      metric.representation_hints &&
      metric.representation_hints.other_property
    ) {
      const type = metricsByType.filter((item) => item.name === "Line Plot");
      type[0].total += 1;
    }
  });

  // get the most recommended visualization
  metricsByType.sort((a, b) => b.total - a.total);

  return metricsByType;
});

loadPreparedData();

function getPreparedData() {
  // Load demo data
  const bar = demo_bar;
  const scatter = demo_scatter;
  const radar = demo_radar;
  const box = demo_box;

  const barVisualization = bar.inline_data.visualization;
  const scatterVisualization = scatter.inline_data.visualization;
  const radarVisualization = radar.visualization;
  const boxVisualization = box.inline_data.visualization;


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
  preparedBar.value = JSON.stringify(preparedBar.value);

  preparedScatter.value = {
    _id: scatter._id,
    dates: scatter.dates,
    inline_data: {
      challenge_participants: [],
      visualization: scatterVisualization,
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
  preparedScatter.value = JSON.stringify(preparedScatter.value);

  preparedRadar.value = {
    _id: radar._id,
    name: radar.name,
    dates: radar.dates,
    inline_data: {
      challenge_participants: [],
      visualization: radarVisualization,
    },
  };
  preparedRadar.value.inline_data.challenge_participants =
    radar.inline_data.challenge_participants.map((participant: any) => {
      const preparedParticipant = {
        id: participant._id,
        label: participant.label,
        value: participant.value,
        error: participant.error,
      };
      return preparedParticipant;
    });
  preparedRadar.value = JSON.stringify(preparedRadar.value);

  preparedBox.value = {
    _id: box._id,
    name: box.name,
    dates: box.dates,
    inline_data: {
      challenge_participants: [],
      visualization: boxVisualization,
    },
  };
  preparedBox.value.inline_data.challenge_participants =
    box.inline_data.challenge_participants.map((participant: any) => {
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
  preparedBox.value = JSON.stringify(preparedBox.value);

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Datos cargados.");
      resolve(true);
    }, 1000); // Simula retraso en la carga
  });
}

async function loadPreparedData() {
  // Activa el loader
  isLoadingGraph.value = true;

  // Llama a la función para cargar los datos
  await getPreparedData();

  // Aplica estilos al shadowRoot después de cargar los datos
  applyShadowStyles();

  // Desactiva el loader
  isLoadingGraph.value = false;
}

function applyShadowStyles() {
  const shadowHost = document.querySelector(".classification-dropdown");

  if (shadowHost && shadowHost.shadowRoot) {
    const style = document.createElement("style");
    style.textContent = `
      .classification-dropdown {
        min-width: auto !important;
      }
    `;
    shadowHost.shadowRoot.appendChild(style); // Aplica los estilos
  } else {
    console.error("ShadowRoot no encontrado. Verifica el flujo de datos.");
  }
}

onMounted(async () => {
  await import("@inb/oeb-widgets-graphs").then(() => {
    isLoadingGraph.value = false;
  });
});
</script>

<style lang="scss" scoped>
.add-visualization-table {
  &__body {
    &__title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 10px;
    }

    &__content {
      &__title {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 10px;

        span {
          font-weight: bold;
        }
      }
    }
  }
}
</style>
<style>
.add-visualization-table >>> .classification-dropdown {
  min-width: auto !important;
}
</style>
