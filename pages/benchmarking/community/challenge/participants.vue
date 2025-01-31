<template>
  <div class="benchmarking-participant">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="container">
      <div class="benchmarking-participant__title text-primaryOeb-500">
        {{ challenge.acronym }} ( {{ challenge._id }})
      </div>
      <hr />
      <div class="benchmarking-challenge__subtitle">
        <i>{{ challenge.name }}</i>
      </div>

      <div
        v-if="status.pending"
        class="benchmarking-participant__skeleton"
      ></div>
      <p class="text">
        List of tools participating in the challenge, together with a summary of
        the metrics obtained.
      </p>
      <div v-if="participants?.length > 0" class="">
        <div v-if="status.pending" class=""></div>
        <div v-else class="">
          <ChallengeParticipantMetricsTable :metrics-table="metricsTable" />
        </div>
        <div v-if="status.pending" class="">
          <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
        </div>
        <div v-else class="">
          <h2 class="choosetext">
            Choose one of the {{ participants.length }} participants whose
            metrics you want to visualize in the radar plot:
          </h2>
        </div>
      </div>
      <div v-else class="">
        <noDataAvailable description="No participants and metrics available." />
      </div>
      <div
        class="chart-image text--secondary"
        align="center"
        color="rgba(0, 0, 0, 0.6)"
      >
        <CustomTabs :data="itemsObjList" :metrics="metrics" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ChallengeParticipantMetricsTable from "@/components/Challenges/ChallengeParticipantMetricsTable.vue";
import { challengeAPI } from "@/api/challengeAPI";
import ChallengeObj from "@/models/ChallengeObj";
import noDataAvailable from "@/layouts/noDataAvailableCard.vue";
import CustomTabs from "@/components/Widgets/CustomTabs.vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";

const METRIC_ID_KEY = "level_2:metric_id";

const route = useRoute();
const challengeId = route.params.id;
const isPending = ref(false);
const communityStore = useCommunity();
const communityId: string = route.params.community;
const community: Ref<any> = ref(null);
const eventsObj: any[] = communityStore.getEvents;

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
  data: {
    _id: "",
    name: "",
    dates: "",
    dataset_contact_ids: "",
    inline_data: {
      challenge_participants: [],
      visualization: {},
    },
  },
};

const itemsObjList = [];

await challengeAPI(challengeId).then((response: any) => {
  const challengeObj = new ChallengeObj(challengeId, response.data);
  challengeObj.formatData();
  challenge.value = challengeObj.getChallenge();
  metrics.value = challengeObj.getMetrics();
  datasets.value = challengeObj.getDatasets();
  participants.value = challengeObj.getParticipants();
  participants.value = Object.values(participants.value);

  if (participants.value.length > 0) {
    const charData = participants.value[0].assessments[0].dates;

    for (const [_key, value]: any of Object.entries(participants.value)) {
      itemObj = {
        _id: value._id,
        key: value._id,
        name: value.participant_label,
        label: value.participant_label,
        dates: charData,
        dataset_contact_ids: "",
        inline_data: {
          challenge_participants: [],
          visualization: {
            type: "radar-plot",
            schema_url: value.datalink.uri,
            dates: charData,
          },
        },
      };
      value.assessments.forEach((assessment: any) => {
        const item = {
          key: value._id,
          value: assessment.datalink.inline_data.value,
          error: assessment.datalink.inline_data.error,
          label: assessment._metadata
            ? assessment._metadata[METRIC_ID_KEY]
            : "",
        };
        itemObj.inline_data.challenge_participants.push(item);
      });
      itemsObjList.push(itemObj);
    }

    itemSelected.value = itemsObjList[0];
  }
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

if (communityStore.communityId === communityId) {
  community.value = communityStore.getCommunityData;
} else {
  const { data, pending }: { data: any; pending: Ref<boolean> } =
    await useAsyncData("community", () =>
      communityStore.requestCommunityData(communityId, event),
    );
  community.value = data.value ?? null;
  isPending.value = pending.value;
}

const currentEvent = computed(() => {
  const selectedEvent = communityStore.getCurrentEvent;

  // If no event is selected, select the first available event.
  if (!selectedEvent && eventsObj.length > 0) {
    const firstEvent = eventsObj[0];
    communityStore.setCurrentEvent(firstEvent);
    return firstEvent;
  }
  return selectedEvent;
});

const routeArray: Array<{
  label: string;
  isActualRoute: boolean;
  route?: string;
}> = [
  {
    label: "Benchmarking Communities",
    isActualRoute: false,
    route: "/benchmarking",
  },
  {
    label: community.value?.acronym + " " + "Events",
    isActualRoute: false,
    route: "/benchmarking/" + communityId + "/events",
  },
  {
    label: currentEvent.value?.name,
    isActualRoute: false,
    route: "/benchmarking/" + communityId + "?event=" + currentEvent.value._id,
  },
  {
    label: "Challenge " + challenge.value.acronym + " " + challengeId,
    isActualRoute: false,
    route: "/benchmarking/" + communityId + "/" + challengeId,
  },
  {
    label: "Participants",
    isActualRoute: true,
  },
];
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

.benchmarking-participant {
  &__title {
    font-size: 32px;
    font-weight: 500;
    line-height: 1.5rem;
    letter-spacing: 0.0073529412em !important;
  }

  &__subtitle {
    font-size: 18px;
    font-weight: 400;
    padding-bottom: 5px;
    color: black;
  }
}

.text {
  color: gray;
  padding-top: 10px;
}

.choosetext {
  font-size: 20px;
  line-height: 32px;
  margin-top: 25px;
}

hr {
  opacity: 0.1;
}
</style>
