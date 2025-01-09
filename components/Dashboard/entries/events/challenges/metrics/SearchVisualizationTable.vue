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
          <div class="row mb-4" v-if="selectedVisualizationTmp !== null && selectedVisualizationTmp.name">
            <div class="col-12">
              <div
                class="card"
              >
                <div class="card-body">
                  <div class="card-body-header">
                    <h5 class="card-title">
                      <div
                        v-if="recomendedVisualization[0]?.name === chartSelected.name"
                        class="card-recommended"
                        title="Recommended Visualization"
                      >
                        <font-awesome-icon :icon="['fas', 'star']" />
                      </div>
                      {{ selectedVisualizationTmp.name }}
                    </h5>
                  </div>
                  <div class="w-100">
                    <div class="card-body-content row">
                      <div class="widget-card-img col-7">
                        <img
                          heigth="300px"
                          :src=selectedVisualizationTmp.image
                        />
                      </div>
                      <div class="card-body-content__description col-5">
                        <p>
                          {{ selectedVisualizationTmp.description }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-3" v-if="visualizationSelected === '' || visualizationSelected !== 'bar'">
              <div
                class="card"
                :class="[
                  visualizationSelected === ''
                    ? ''
                    : visualizationSelected === 'bar'
                    ? 'card-checked'
                    : 'card-non-checked',
                ]"
              >
                <div class="card-body">
                  <div class="card-body-header">
                    <h5 class="card-title">
                      <div
                        v-if="recomendedVisualization[0]?.name === 'Bar Plot'"
                        class="card-recommended"
                        title="Recommended Visualization"
                      >
                        <font-awesome-icon :icon="['fas', 'star']" />
                      </div>
                      Bar Plot
                    </h5>
                    <div class="card-selector">
                      <UCheckbox 
                        :model-value="selectedVisualizationTmp.name === 'bar'"
                        @update:model-value="updateVisualization(chartBar, $event)"
                      />
                    </div>
                  </div>
                  <div class="w-100">
                    <div class="widget-card-img">
                      <img
                        heigth="300px"
                        :src=chartBar.image
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-3" v-if="visualizationSelected === '' || visualizationSelected !== 'scatter'">
              <div
                class="card"
                :class="[
                  selectedVisualizationTmp.name === ''
                  ? ''
                    : selectedVisualizationTmp.name === 'scatter'
                    ? 'card-checked'
                    : 'card-non-checked',
                ]"
              >
                <div class="card-body">
                  <div class="card-body-header">
                    <h5 class="card-title">
                      <div
                        v-if="
                          recomendedVisualization[0]?.name === 'Scatter Plot'
                        "
                        class="card-recommended"
                        title="Recommended Visualization"
                      >
                        <font-awesome-icon :icon="['fas', 'star']" />
                      </div>
                      Scatter Plot
                    </h5>
                    <div class="card-selector">
                      <UCheckbox 
                        :model-value="selectedVisualizationTmp.name === 'scatter'"
                        @update:model-value="updateVisualization(chartScatter, $event)"
                      />
                    </div>
                  </div>
                  <div class="w-100">
                    <div class="widget-card-img">
                      <img
                        heigth="300px"
                        :src=chartScatter.image
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-3" v-if="visualizationSelected === '' || visualizationSelected !== 'radar'">
              <div
                class="card"
                :class="[
                  selectedVisualizationTmp.name === ''
                  ? ''
                    : selectedVisualizationTmp.name === 'radar'
                    ? 'card-checked'
                    : 'card-non-checked',
                ]"
              >
                <div class="card-body">
                  <div class="card-body-header">
                    <h5 class="card-title">
                      <div
                        v-if="recomendedVisualization[0]?.name === 'Radar Plot'"
                        class="card-recommended"
                        title="Recommended Visualization"
                      >
                        <font-awesome-icon :icon="['fas', 'star']" />
                      </div>
                      Radar Plot
                    </h5>
                    <div class="card-selector">
                      <UCheckbox 
                        :model-value="selectedVisualizationTmp.name === 'radar'"
                        @update:model-value="updateVisualization(chartRadar, $event)"
                      />
                    </div>
                  </div>
                  <div class="w-100">
                    <div class="widget-card-img">
                      <img
                        heigth="300px"
                        :src=chartRadar.image
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-3" v-if="visualizationSelected === '' || visualizationSelected !== 'box'">
              <div
                class="card"
                :class="[
                  selectedVisualizationTmp.name === ''
                  ? ''
                    : selectedVisualizationTmp.name === 'box'
                    ? 'card-checked'
                    : 'card-non-checked',
                  ]"
              >
                <div class="card-body">
                  <div class="card-body-header">
                    <h5 class="card-title">
                      <div
                        v-if="recomendedVisualization[0]?.name === 'Box Plot'"
                        class="card-recommended"
                      >
                        <font-awesome-icon :icon="['fas', 'star']" />
                      </div>
                      Box Plot
                    </h5>
                    <div class="card-selector">
                      <UCheckbox 
                        :model-value="selectedVisualizationTmp.name === 'box'"
                        @update:model-value="updateVisualization(chartBox, $event)"
                      />
                    </div>
                  </div>
                  <div class="w-100">
                    <div class="widget-card-img">
                      <img
                        heigth="300px"
                        :src=chartBox.image
                      />
                    </div>
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
import { ref, computed, defineEmits } from "vue";
import type { Metric } from "@/types/challenge_metric";
import type { ChartDefault } from "@/types/visualizations";
import { ChartBar, ChartBox, ChartRadar, ChartScatter } from "@/constants/visualization_const";

const props = defineProps<{
  selectedMetrics: Metric[];
  selectedVisualization: ChartDefault;
}>();

const emits = defineEmits(["handleSelectedVisualization"]);

const selectedVisualizationTmp = computed({
  get: () => props.selectedVisualization,
  set: (value) => emits("handleSelectedVisualization", value),
});

const visualizationSelected = ref(<String>"");
const chartSelected = ref<ChartDefault>({
  id: "",
  name: "",
  internal_id: "",
  image: "",
  description: "",
});

let chartBar = new ChartBar();
let chartScatter = new ChartScatter();
let chartRadar = new ChartRadar();
let chartBox = new ChartBox();

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

  metricsByType.sort((a, b) => b.total - a.total);

  return metricsByType;
});

const updateSelectedTitle = (type: string) => {
  switch (type) {
    case 'bar':
      chartSelected.value = new ChartBar();
      break;
    case 'scatter':
      chartSelected.value = new ChartScatter();
      break;
    case 'radar':
      chartSelected.value = new ChartRadar();
      break;
    case 'box':
      chartSelected.value = new ChartBox();
      break;
    default:
      break;
  }
};

const updateVisualization = (type: ChartDefault, isSelected: Boolean) => {
  console.log(type)
  selectedVisualizationTmp.value = {
    id: type.id,
    name: type.name,
    internal_id: "",
    image: type.image,
    description: type.description,
  };
  console.log(type)
  console.log(selectedVisualizationTmp.value);
  console.log(isSelected);

  console.log(selectedVisualizationTmp.value)

  if (isSelected) {
    updateSelectedTitle(type);
  } else {
    chartSelected.value = {
      id: "",
      name: "",
      internal_id: "",
      image: "",
      description: "",
    };
  }
  //emits("handleSelectedVisualization", chartSelected.value);
};
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
      .card .card-body-header {
        display: flex;
        justify-content: space-between;
        .card-title {
          display: flex;
          gap: 10px;
        }
        .fa-star {
          color: #f1c40f;
        }
      }
      .card {
        &.card-checked {
          transform: scale(1.04);
          box-shadow: 0 5px 15px #00000026;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: start;
          text-decoration: none;
          transition: transform 0.2s;
        }
        &.card-non-checked {
          background-color: rgba(0, 0, 0, 0.05);
        }
      }
    }
  }
}
.widget-card-img {
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
