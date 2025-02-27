<template>
  <div class="status-page">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">
      <div class="primary label-btn">
        <h2 class="status-page__body__general__title text-primaryOeb-500">
          Status Services
        </h2>
      </div>
      <div class="status-page__header">
        <div v-if="globalStatus" class="row status-page__header__ok">
          <div class="col-8 status-page__header__ok__column">
            <div class="status-page__header__ok__column__text">
              <div class="w-100">
                <div class="w-100">
                  <span class="status-ok status-page__header__ok__title">
                    <font-awesome-icon :icon="['fas', 'signal']" /> </span
                  >All systems operational
                </div>
                <div class="subtitle">
                  System Update: No Ongoing Issues, All Services Are Performing
                  Normally
                </div>
              </div>
            </div>
          </div>
          <div class="col-4 status-page__header__error__img">
            <img
              src="~/assets/images/status/status_ok_png.png"
              alt="welcome-header-image"
            />
          </div>
        </div>
        <div v-else class="row status-page__header__error">
          <div class="col-8 status-page__header__error__column">
            <div class="status-page__header__error__column__text">
              <div class="w-100">
                <div class="w-100">
                  <span class="status-error status-page__header__error__title">
                    <font-awesome-icon :icon="['fas', 'signal']" />
                  </span>
                  There is an error in some service
                </div>
                <div class="subtitle">
                  Service Alert: An Error Has Been Detected in some service, Our
                  Team Is Investigating
                </div>
              </div>
            </div>
          </div>
          <div class="col-4 status-page__header__error__img">
            <img
              src="~/assets/images/status/status_error_png.png"
              alt="welcome-header-image"
            />
          </div>
        </div>
      </div>
      <div class="status-page__body">
        <div class="status-page__body__general">
          <div
            class="status-page__body__general__title__subtitle text-primaryOeb-500"
          >
            List of OpenEBench services
          </div>
          <StatusTable
            :services="statusGeneral"
            :is-table-loading="isTableLoading"
          />
        </div>
        <div class="status-page__body__container">
          <div
            class="status-page__body__general__title__subtitle last text-primaryOeb-500"
          >
            Extended view
          </div>
          <div class="status-page__body__container__box">
            <div class="status-page__body__container__box__title">
              <span v-if="isVreServicesUp" class="status-ok">
                <font-awesome-icon :icon="['fas', 'circle-check']" />
              </span>
              <span v-else class="status-error">
                <font-awesome-icon :icon="['fas', 'triangle-exclamation']" />
              </span>
              VRE Services. Response time: {{ vreLatency }} ms
            </div>
            <div class="status-page__body__container__box_graph">
              <div ref="chartDivVre" style="width: 90%; height: 300px"></div>
            </div>
          </div>
          <div class="status-page__body__container__box">
            <div class="status-page__body__container__box__title">
              <span v-if="isScientificServicesUp" class="status-ok">
                <font-awesome-icon :icon="['fas', 'circle-check']" />
              </span>
              <span v-else class="status-error">
                <font-awesome-icon :icon="['fas', 'triangle-exclamation']" />
              </span>
              API. Response time: {{ scientificLatency }} ms
            </div>
            <div class="status-page__body__container__box_graph">
              <div ref="chartDivApi" style="width: 90%; height: 300px"></div>
            </div>
          </div>
          <div class="status-page__body__container__box">
            <div class="status-page__body__container__box__title">
              <span v-if="isKeycloakServiceUp" class="status-ok">
                <font-awesome-icon :icon="['fas', 'circle-check']" />
              </span>
              <span v-else class="status-error">
                <font-awesome-icon :icon="['fas', 'triangle-exclamation']" />
              </span>
              Auth Service. Response time: {{ keycloakLatency }} ms
            </div>
            <div class="status-page__body__container__box_graph">
              <div ref="chartDivAuth" style="width: 90%; height: 300px"></div>
            </div>
          </div>
          <div class="status-page__body__container__box">
            <div class="status-page__body__container__box__title">
              <span v-if="isObservatoryServiceUp" class="status-ok">
                <font-awesome-icon :icon="['fas', 'circle-check']" />
              </span>
              <span v-else class="status-error">
                <font-awesome-icon :icon="['fas', 'triangle-exclamation']" />
              </span>
              Observatory API. Response time: {{ observatoryLatency }} ms
            </div>
            <div class="status-page__body__container__box_graph">
              <div
                ref="chartDivObservatory"
                style="width: 90%; height: 300px"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import StatusTable from "@/components/status/StatusTable.vue";
import Plotly from "plotly.js-dist";

const runtimeConfig = useRuntimeConfig();
const vreServicesUrl = `${runtimeConfig.public.VRE_URI}`;
const scientificUrl = `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL}`;
const keycloakUrl = `${runtimeConfig.public.KEYCLOAK_HOST}`;
const observatoryUrl = `${runtimeConfig.public.OBSERVATORY_API_URL}`;

const isVreServicesUp = ref(null);
const isScientificServicesUp = ref(null);
const isKeycloakServiceUp = ref(null);
const isObservatoryServiceUp = ref(null);

const vreLatency = ref(null);
const scientificLatency = ref(null);
const keycloakLatency = ref(null);
const observatoryLatency = ref(null);
const chartDivVre = ref(null);
const chartDivApi = ref(null);
const chartDivAuth = ref(null);
const chartDivObservatory = ref(null);
const statusGeneral = ref({});
const isTableLoading = ref(true);

const recomendedTraces = [2000, 1000, 2000, 1000];
const realTraces = ref({
  vre: null,
  scientific: null,
  keycloak: null,
  observatory: null,
});

const globalStatus = computed(() => {
  if (
    isVreServicesUp.value &&
    isScientificServicesUp.value &&
    isKeycloakServiceUp.value &&
    isObservatoryServiceUp.value
  ) {
    return true;
  }
  return false;
});

const checkVreServices = async () => {
  const markStart = `fetch-start-vre`;
  const markEnd = `fetch-end-vre`;
  const measureName = `fetch-duration-vre`;

  performance.mark(markStart);

  return fetch(`https://api.allorigins.win/raw?url=${vreServicesUrl}`, {
    method: "GET",
    headers: {
      "Content-Type": "text/html",
    },
  })
    .then(async (response) => {
      const text = await response.text();
      isVreServicesUp.value = response.ok && text.trim().length > 0;
      performance.mark(markEnd);
      performance.measure(measureName, markStart, markEnd);

      vreLatency.value = performance.getEntriesByName(measureName)[0].duration;
      realTraces.value.vre =
        performance.getEntriesByName(measureName)[0].duration;
    })
    .catch((error) => {
      return false;
    });
};

const checkScientificServices = async () => {
  const markStart = `fetch-start-sci`;
  const markEnd = `fetch-end-sci`;
  const measureName = `fetch-duration-sci`;

  performance.mark(markStart);

  return fetch(`https://api.allorigins.win/raw?url=${scientificUrl}`, {
    method: "GET",
    headers: {
      "Content-Type": "text/html",
    },
  })
    .then(async (response) => {
      const text = await response.text();
      isScientificServicesUp.value = response.ok && text.trim().length > 0;
      performance.mark(markEnd);
      performance.measure(measureName, markStart, markEnd);

      scientificLatency.value = performance
        .getEntriesByName(measureName)[0]
        .duration.toFixed(2);
      realTraces.value.scientific = performance
        .getEntriesByName(measureName)[0]
        .duration.toFixed(2);
    })
    .catch((error) => {
      console.log("Error on API: fetch: " , error);
      return false;
    });
};

const checkKeycloakServices = async () => {
  performance.mark("fetch-start");
  const markStart = `fetch-start-keycloack`;
  const markEnd = `fetch-end-keycloack`;
  const measureName = `fetch-duration-keycloack`;

  performance.mark(markStart);

  return fetch(`https://api.allorigins.win/raw?url=${keycloakUrl}`, {
    method: "GET",
    headers: {
      "Content-Type": "text/html",
    },
  })
    .then(async (response) => {
      console.log(response);

      const text = await response.text();
      isKeycloakServiceUp.value = response.ok && text.trim().length > 0;
      performance.mark(markEnd);
      performance.measure(measureName, markStart, markEnd);

      keycloakLatency.value = performance
        .getEntriesByName(measureName)[0]
        .duration.toFixed(2);
      realTraces.value.keycloak = performance
        .getEntriesByName(measureName)[0]
        .duration.toFixed(2);
    })
    .catch((error) => {
      console.log("Error on Auth fetch: " , error);
      return false;
    });
};

const checkObservatoryServices = async () => {
  performance.mark("fetch-start");
  const markStart = `fetch-start-obs`;
  const markEnd = `fetch-end-obs`;
  const measureName = `fetch-duration-obs`;

  performance.mark(markStart);
  return fetch(`${observatoryUrl}/stats/tools/count_total`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      const text = await response.json();
      isObservatoryServiceUp.value = response.ok && text.length > 0;
      performance.mark(markEnd);
      performance.measure(measureName, markStart, markEnd);

      observatoryLatency.value = performance
        .getEntriesByName(measureName)[0]
        .duration.toFixed(2);
      realTraces.value.observatory = performance
        .getEntriesByName(measureName)[0]
        .duration.toFixed(2);
    })
    .catch((error) => {
      console.log("Observatory error: ", error);
      return false;
    });
};

const routeArray: Array = [{ label: "Status", isActualRoute: true }];

const fetchAndPlot = async () => {
  realTraces.value = {
    vre: null,
    scientific: null,
    keycloak: null,
    observatory: null,
  };

  await Promise.all([
    //checkVreServices(),
    checkScientificServices(),
    checkObservatoryServices(),
    checkKeycloakServices(),
  ]);

  drawChartVre();
  drawChartApi();
  drawChartAuth();
  drawChartObservatory();

  statusGeneral.value = [
    {
      service: "VRE",
      status: isVreServicesUp.value,
      response: vreLatency,
      class: isVreServicesUp.value
        ? ""
        : "bg-red-500/50 dark:bg-red-400/50 animate-pulse",
      page: vreServicesUrl,
    },
    {
      service: "API",
      status: isScientificServicesUp.value,
      response: scientificLatency,
      class: isScientificServicesUp.value
        ? ""
        : "bg-red-500/50 dark:bg-red-400/50 animate-pulse",
      page: scientificUrl,
    },
    {
      service: "Auth",
      status: isKeycloakServiceUp.value,
      response: keycloakLatency,
      class: isKeycloakServiceUp.value
        ? ""
        : "bg-red-500/50 dark:bg-red-400/50 animate-pulse",
      page: keycloakUrl,
    },
    {
      service: "Observatory",
      status: isObservatoryServiceUp.value,
      response: observatoryLatency,
      class: isObservatoryServiceUp.value
        ? ""
        : "bg-red-500/50 dark:bg-red-400/50 animate-pulse",
      page: observatoryUrl,
    },
  ];

  isTableLoading.value = false;
};

const drawChartVre = () => {
  if (!chartDivVre.value) return;

  const traceReal = {
    x: [vreLatency.value],
    y: ["VRE"],
    type: "bar",
    name: "Real latency",
    marker: { color: "rgb(11, 87, 159)", opacity: 0.7 },
    orientation: "h",
  };

  const traceRecomended = {
    x: [recomendedTraces[0]],
    y: ["VRE"],
    type: "bar",
    name: "Recomended maximum latency",
    marker: { color: "rgb(204,204,204)", opacity: 0.5 },
    orientation: "h",
  };

  Plotly.newPlot(chartDivVre.value, [traceRecomended, traceReal], {
    title: "Fetch Time per Service (ms)",
    xaxis: { tickangle: -45 },
    yaxis: { title: "Time (ms)" },
    barmode: "group",
  });
};

const drawChartApi = () => {
  if (!chartDivApi.value) return;

  const traceReal = {
    x: [scientificLatency.value],
    y: ["API"],
    type: "bar",
    name: "Real latency",
    marker: { color: "rgb(11, 87, 159)", opacity: 0.7 },
    orientation: "h",
  };

  const traceRecomended = {
    x: [recomendedTraces[1]],
    y: ["API"],
    type: "bar",
    name: "Recomended maximum latency",
    marker: { color: "rgb(204,204,204)", opacity: 0.5 },
    orientation: "h",
  };

  Plotly.newPlot(chartDivApi.value, [traceRecomended, traceReal], {
    title: "Fetch Time per Service (ms)",
    xaxis: { tickangle: -45 },
    yaxis: { title: "Time (ms)" },
    barmode: "group",
  });
};

const drawChartAuth = () => {
  if (!chartDivAuth.value) return;

  const traceReal = {
    x: [keycloakLatency.value],
    y: ["Auth"],
    type: "bar",
    name: "Real latency",
    marker: { color: "rgb(11, 87, 159)", opacity: 0.7 },
    orientation: "h",
  };

  const traceRecomended = {
    x: [recomendedTraces[2]],
    y: ["Auth"],
    type: "bar",
    name: "Recomended maximum latency",
    marker: { color: "rgb(204,204,204)", opacity: 0.5 },
    orientation: "h",
  };

  Plotly.newPlot(chartDivAuth.value, [traceRecomended, traceReal], {
    title: "Fetch Time per Service (ms)",
    xaxis: { tickangle: -45 },
    yaxis: { title: "Time (ms)" },
    barmode: "group",
  });
};

const drawChartObservatory = () => {
  if (!chartDivObservatory.value) return;

  const traceReal = {
    x: [observatoryLatency.value],
    y: ["Observatory"],
    type: "bar",
    name: "Real latency",
    marker: { color: "rgb(11, 87, 159)", opacity: 0.7 },
    orientation: "h",
  };

  const traceRecomended = {
    x: [recomendedTraces[3]],
    y: ["Observatory"],
    type: "bar",
    name: "Recomended maximum latency",
    marker: { color: "rgb(204,204,204)", opacity: 0.5 },
    orientation: "h",
  };

  Plotly.newPlot(chartDivObservatory.value, [traceRecomended, traceReal], {
    title: "Fetch Time per Service (ms)",
    xaxis: { tickangle: -45 },
    yaxis: { title: "Time (ms)" },
    barmode: "group",
  });
};

onMounted(fetchAndPlot);
</script>

<style scoped lang="scss">
.status-ok {
  color: #a0c878;
}
.status-error {
  color: #e52020;
}
.status-page {
  &__header {
    font-size: 25px;
    padding-top: 90px;
    font-weight: bold;
    padding-bottom: 130px;
    & .fa-signal {
      padding-right: 10px;
    }
    &__ok,
    &__error {
      height: 110px;
      background-color: rgba(11, 87, 159, 0.1);
      border-radius: 10px;
      img {
        max-height: 350px;
        position: absolute;
      }
      &__column {
        height: 110px;
        .subtitle {
          font-size: 16px;
          font-weight: 500;
          padding-top: 20px;
        }
        &__text {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          padding: 15px 30px;
        }
      }
      &__img {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    &__ok {
      &__column {
        height: 110px;
      }
    }
  }
  &__body {
    &__general {
      &__title {
        font-size: 2rem;
        border-color: rgb(226, 232, 240);
        border-bottom-width: 1px;
        &__subtitle {
          font-size: 1.5rem;
          border-color: rgb(226, 232, 240);
          border-bottom-width: 1px;
          &.last {
            margin-bottom: 30px;
          }
        }
      }
    }
    &__container {
      &__box {
        box-shadow:
          rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
          rgba(0, 0, 0, 0.08) 0px 0px 0px 1px !important;
        min-height: 320px;
        display: flex;
        flex-direction: column;
        transition: transform 0.4s;
        padding: 20px 30px;
        margin-bottom: 20px;
      }
      &__title {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
