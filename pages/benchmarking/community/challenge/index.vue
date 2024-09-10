<template>
  <BreadcrumbsBar :breadcrumbs-array="routeArray" />
  <div class="benchmarking-challenge container">
    <div class="benchmarking-challenge__title text-primaryOeb-500">
      {{ challenge.acronym }} ( {{ challenge._id }})
    </div>
    <div class="benchmarking-challenge__subtitle">
      {{ challenge.name }}
    </div>
    <div class="benchmarking-challenge__body">
      <div v-for="(item, index) in datasets" :key="index"
        class="benchmarking-challenge__body_dec text-gray-500 text-sm">
        <div v-if="index == tab && item">
          <ChartDescriptionCard :type="item.datalink.inline_data.visualization.type"
            :label="challenge.challenge_label" />
        </div>
      </div>
      <div class="benchmarking-challenge__body__content text-sm">
        <h2 class="benchmarking-challenge__body__content__title text-h6 mt-8">
          Choose the metrics you want to visualize in the diagram:
        </h2>
        <div class="benchmarking-challenge__body__content__graphs">
          <CustomTabs :data="items" :metrics="metrics" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { challengeAPI, getGraphData } from "@/api/challengeAPI";
import ChallengeObj from "@/models/ChallengeObj";
import ChartDescriptionCard from "@/components/Cards/ChartDescriptionCard.vue";
import CustomTabs from "@/components/Widgets/CustomTabs.vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";

const route = useRoute();
const isPending = ref(false);
const communityStore = useCommunity();
const communityId: string = route.params.community;
const eventsObj: any[] = communityStore.getEvents;
const community: Ref<any> = ref(null);
const challengeId = route.params.challenge;

const datasets = ref(Array);
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

  for (const [_key, value] of Object.entries(datasets.value)) {
    const graphData = await getGraphData(value).then((response: any) => {
      return response;
    });
    if (graphData && graphData.length > 0) {
      value.datalink.inline_data.challenge_participants = graphData;
    }
    const label =
      (value as any).datalink.inline_data.visualization.type == "box-plot"
        ? (value as any).datalink.inline_data.visualization.available_metrics[0]
        : (value as any).datalink.inline_data.visualization.type == "2D-plot"
          ? (value as any).datalink.inline_data.visualization.x_axis +
          " + " +
          (value as any).datalink.inline_data.visualization.y_axis
          : (value as any).datalink.inline_data.visualization.metric;

    const newData = value;

    const item: any = {
      key: value?._id,
      data: newData,
      label: label,
    };
    items.value.push(item);
  }

  itemSelected.value = items.value[0];
});

if (communityStore.communityId === communityId) {
  community.value = communityStore.getCommunityData;
} else {
  const { data, pending }: { data: any; pending: Ref<boolean> } = await useAsyncData(
    "community",
    () => communityStore.requestCommunityData(communityId, event),
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

const routeArray: Array<{ label: string; isActualRoute: boolean; route?: string }> = [
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
    route: "/benchmarking/" + communityId + "?event=" + currentEvent.value._id
  },
  {
    label: "Challenge " + challenge.value.acronym + ' ' + challengeId,
    isActualRoute: true,
  },

];

</script>

<style scoped lang="scss">
.benchmarking-challenge {
  &__title {
    font-size: 35px;
    font-weight: 600;
    padding-bottom: 5px;
    line-height: 2.5rem;
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
</style>
