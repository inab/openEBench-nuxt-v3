<template>
  <div class="benchmarking-participant">
    <div class="container">
      <div
        v-if="status.pending"
        class="benchmarking-participant__skeleton"
      ></div>
      <div v-else class="benchmarking-participant__content">
        <h1 class="">{{ challenge.challenge_label }} ({{ challenge._id }})</h1>
        <h2 class="">{{ challenge.name }}</h2>
        <p class="text--secondary">
          List of tools participating in the challenge, together with a summary
          of the metrics obtained.
        </p>
      </div>
      <div v-if="participants?.length > 0" class="">
        <div v-if="status.pending" class=""></div>
        <div v-else class="">
          <ChallengeParticipantMetricsTable :metrics-table="metricsTable" />
        </div>
        <div v-if="status.pending" class="">
          <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
        </div>
        <div v-else class="">
          <h2 class="text-h6 mt-8">
            Choose one of the {{ participants.length }} participants whose
            metrics you want to visualize in the radar plot:
          </h2>
        </div>

        <div
          class="chart-image text--secondary"
          align="center"
          color="rgba(0, 0, 0, 0.6)"
        >
          <CustomTabs :data="items" :metrics="metrics" />
        </div>
      </div>
      <div v-else class="">
        <noDataAvailable item="participants and metrics" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ChallengeParticipantMetricsTable from "@/components/Challenges/ChallengeParticipantMetricsTable.vue";
import { challengeAPI } from "@/api/challengeAPI";
import ChallengeObj from "@/models/ChallengeObj";
import noDataAvailable from "@/layouts/noDataAvailable.vue";
import CustomTabs from "@/components/Widgets/CustomTabs.vue";

const METRIC_ID_KEY = "level_2:metric_id";
const PARTICIPANT_ID_KEY = "level_2:participant_id";

const route = useRoute();
const challengeId = route.params.id;

const datasets = ref(Array);
const participants: any = ref(null);
const metrics = ref(null);
const challenge: any = ref(null);

const status = { pending: false }; // TODo
const page = ref(1);
const pageCount = ref(15);

const selectedParticipant = ref("");

const itemSelected = ref(null);

const items = [];

let itemObj = {
  _id: "",
  name: "",
  dates: "",
  dataset_contact_ids: "",
  inline_data: {
    challenge_participants: [],
    visualization: {},
  },
};

await challengeAPI(challengeId).then((response: any) => {
  const challengeObj = new ChallengeObj(challengeId, response.data);
  challengeObj.formatData();
  challenge.value = challengeObj.getChallenge();
  metrics.value = challengeObj.getMetrics();
  datasets.value = challengeObj.getDatasets();
  participants.value = challengeObj.getParticipants();
  participants.value = Object.values(participants.value);

  const charData = participants.value[0].assessments[0].dates;

  itemObj = {
    _id: participants.value[0]._id,
    name: participants.value[0].participant_label,
    dates: charData,
    dataset_contact_ids: "",
    inline_data: {
      challenge_participants: [],
      visualization: {
        type: "radar-plot",
        schema_url: participants.value[0].datalink.uri,
        dates: charData,
      },
    },
  };

  for (const [_key, value]: any of Object.entries(participants.value)) {
    value.assessments.forEach((assessment: any) => {
      const item = {
        key: value._id,
        value: assessment.datalink.inline_data.value,
        error: assessment.datalink.inline_data.error,
        label: assessment._metadata[METRIC_ID_KEY],
      };
      itemObj.data.inline_data.challenge_participants.push(item);
    });
  }

  items.push(itemObj);

  itemSelected.value = items[0];
});

const metricsTable: {
  participants: any;
  metrics: any[];
  dataMatrix: any;
  length: number;
} = getMetricsTable();

const itemsTable = () => {
  return metricsTable.participants.map(
    (participant: Object, participantI: number) => {
      return {
        id: participant._id,
        participant_label: participant.participant_label,
      };
    },
  );
};

if (metricsTable.participants.length > 0) {
  selectedParticipant.value = metricsTable.participants[0]._id;
}

function getMetricsTable() {
  // Gather the metrics
  const metricsIdsDict = {};
  for (const [_key, participant] of Object.entries(participants.value)) {
    participant.assessments.forEach((assessment: any) => {
      if (
        typeof assessment.depends_on.metrics_id !== "string" &&
        !(assessment.depends_on.metrics_id instanceof String)
      ) {
        return;
      }

      // This metric value is unavailable or hidden for some reason
      if (
        !assessment.datalink.inline_data ||
        assessment.datalink.inline_data.hide
      ) {
        return;
      }

      if (!(assessment.depends_on.metrics_id in metricsIdsDict)) {
        metricsIdsDict[assessment.depends_on.metrics_id] = {
          metric: {},
          participants: {},
        };
      }
      metricsIdsDict[assessment.depends_on.metrics_id].participants[
        participant._id
      ] = assessment.datalink.inline_data;
    });
  }

  for (const [_key, participant] of Object.entries(participants.value)) {
    participant.assessments.forEach((assessment: any) => {
      if (
        typeof assessment.depends_on.metrics_id !== "string" &&
        !(assessment.depends_on.metrics_id instanceof String)
      ) {
        return;
      }

      // This metric value is unavailable or hidden for some reason
      if (
        !assessment.datalink.inline_data ||
        assessment.datalink.inline_data.hide
      ) {
        return;
      }

      if (!(assessment.depends_on.metrics_id in metricsIdsDict)) {
        metricsIdsDict[assessment.depends_on.metrics_id] = {
          metric: {},
          participants: {},
        };
      }
      metricsIdsDict[assessment.depends_on.metrics_id].participants[
        participant._id
      ] = assessment.datalink.inline_data;
    });
  }

  // And their metadata
  metrics.value.forEach((metric) => {
    if (metric._id in metricsIdsDict) {
      metricsIdsDict[metric._id].metric = metric;
    }
  });

  const sortedMetricsIds = Object.keys(metricsIdsDict).sort();

  const dataMatrix = participants.value.map((participant: any) => {
    return sortedMetricsIds.map((metricsId: any) => {
      if (
        !(metricsId in metricsIdsDict) ||
        !(participant._id in metricsIdsDict[metricsId].participants)
      ) {
        return null;
      }

      return metricsIdsDict[metricsId].participants[participant._id];
    });
  });

  return {
    participants: participants.value,
    metrics: sortedMetricsIds.map((mI) => metricsIdsDict[mI].metric),
    dataMatrix,
  };
}

function handleChangeSelected(id: string) {
  selectedParticipant.value = id;
}
</script>

<style scoped lang="scss">
.row-metrics {
  padding-bottom: 15px;
  .metrics-item {
    border-radius: 16px;
    padding: 5px 15px;
    margin-bottom: 10px;
    cursor: pointer;
    &.selected {
      background-color: theme("colors.primary.100");
    }
  }
}
.chart-image img {
  max-height: 300px;
}
</style>
