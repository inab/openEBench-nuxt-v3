<template>
  <div class="benchmarking-challenge">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="benchmarking-challenge container">
      <div class="benchmarking-challenge__title text-primaryOeb-500">
        {{ challenge.acronym }} ( {{ challenge._id }})
      </div>
      <hr />
      <div class="benchmarking-challenge__subtitle">
        {{ challenge.name }}
      </div>
      <div class="benchmarking-challenge__body">
        <div v-if="chatAvailable" class="chatAvailable">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="benchmarking-challenge__body_dec text-gray-500 text-sm"
          >
            <div v-if="index == tab && item">
              <ChartDescriptionCard
                :type="item.visualization?.type"
                :label="challenge.challenge_label"
              />
            </div>
          </div>
        </div>
        <div v-else class="empty-state-container">
          <span class="empty-state-text"
            >No charts have been generated for this challenge</span
          >
          <div class="empty-img-wrapper">
            <emptyImg class="empty-img" viewBox="0 0 600 800" />
          </div>
        </div>
        <div
          v-if="chatAvailable"
          class="benchmarking-challenge__body__content text-sm"
        >
          <h2
            class="benchmarking-challenge__body__content__title text-h6 mt-8 mb-2"
          >
            Choose the metrics you want to visualize in the diagram:
          </h2>
          <div class="benchmarking-challenge__body__content__graphs">
            <CustomTabs :data="items" :metrics="metrics" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { challengeAPI, getGraphData } from "@/api/challengeAPI";
import ChallengeObj from "@/models/ChallengeObj";
import ChartDescriptionCard from "@/components/Cards/ChartDescriptionCard.vue";
import CustomTabs from "@/components/Widgets/CustomTabs.vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import { useCommunity } from "@/stores/community";
import emptyImg from "../../public/images/illustrations/empty-state.svg?component";

const route = useRoute();
const isPending = ref(false);
const communityStore = useCommunity();
const communityId: string = route.params.community;
const eventsObj: any[] = communityStore.getEvents;
const community: Ref<any> = ref(null);
const challengeId = route.params.challenge;
const chatAvailable = ref<boolean>(true);
const datasets = ref<any[]>([]);
const participants: any = ref(null);
const metrics = ref(null);
const challenge: any = ref(null);
const tab = ref(0);
const itemSelected = ref(null);
const items = ref([]);

await challengeAPI(challengeId).then(async (response: any) => {
  const challengeObj = new ChallengeObj(challengeId, response.data);
  challengeObj.formatData();
  challenge.value = challengeObj.getChallenge();
  metrics.value = challengeObj.getMetrics();
  datasets.value = challengeObj.getDatasets();
  participants.value = challengeObj.getParticipants();
  participants.value = Object.values(participants.value);
  items.value = [];

  for (const [_key, dataset] of Object.entries(datasets.value)) {
    const graphData = await getGraphData(dataset);
    const datalink = dataset?.datalinks?.[0];

    if (!graphData || !graphData.visualization) {
      chatAvailable.value = false;
      continue;
    }

    graphData.challenge_participants = graphData.challenge_participants ?? [];

    datalink.inline_data = JSON.stringify(graphData);

    const visualization = graphData.visualization;
    let label = "";

    const type = visualization?.type?.toLowerCase();

    console.log("type: " , type)

    if (type === "box-plot") {
      label = visualization.available_metrics?.[0] || "box-plot";
    } else if (type === "2d-plot") {
      label = `${visualization?.x_axis ?? "X"} + ${visualization?.y_axis ?? "Y"}`;
    } else {
      label = visualization?.metric || "visualización";
    }

    const item = {
      _id: dataset._id,
      key: dataset._id,
      label: label,
      data: dataset,
      challenge_participants: graphData.challenge_participants,
      visualization: graphData.visualization,
    };

    items.value.push(item);
  }

  itemSelected.value = items.value[0] ?? null;
});

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

function getVisualizationType(item) {
  try {
    const data = item?.datalinks?.[0]?.inline_data;
    const parsed = typeof data === "string" ? JSON.parse(data) : data;

    return parsed?.visualization?.type || "";
  } catch (e) {
    console.warn("Invalid inline_data:", e);
    return "";
  }
}

const currentEvent = computed(() => {
  const selectedEvent = communityStore.getCurrentEvent;
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
    isActualRoute: true,
  },
];
</script>

<style scoped lang="scss">
.benchmarking-challenge {
  &__title {
    font-size: 32px;
    font-weight: 500;
    padding-bottom: 5px;
    line-height: 1.5rem;
    letter-spacing: 0.0073529412em !important;
  }

  &__subtitle {
    font-size: 18px;
    font-weight: 400;
    padding-bottom: 5px;
    color: black;
  }

  &__body {
    padding-top: 30px;

    &__content {
      &__title {
        font-size: 18px;
        font-weight: 400;
        padding-bottom: 5px;
        color: black;
      }
    }
  }

  .benchmarking-challenge__body__content__chips {
    white-space: normal;
    flex-wrap: wrap;
    max-width: 100%;
    display: flex;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    flex: 1 0 auto;
    gap: 10px;
  }
}

hr {
  opacity: 0.1;
}

.empty-state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  width: 100%;
  min-height: 300px;
  gap: 1.5rem;
  color: #555;
}

.empty-state-text {
  font-size: 1.2rem;
  font-weight: 500;
}

.empty-img-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 400px;
  width: 100%;
}

.empty-img {
  width: 100%;
  height: auto;
}
</style>
