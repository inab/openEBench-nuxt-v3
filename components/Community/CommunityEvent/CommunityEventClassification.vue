<template>
  <div>
    <ClassificationTable 
      :challengeList="filterArray" 
      :activeTable="id"
      :dataMode="dataMode"
      :apiUrl="apiUrl"
      :benchEventApiUrl="benchEventApiUrl"
    />
  </div>
</template>

<script setup lang="ts">
import ClassificationTable from "@/components/Community/CommunityEvent/CommunityClassificationTable.vue";
import { watch, onMounted } from "vue";


const props = defineProps<{
  id: number;
  filterArray: Array<any>;
  debounce: {
    type: number;
    required: false;
    default: 100;
  };
}>();

const config = useOebConfig();

const apiUrl = config.value.SCIENTIFIC_SERVICE_URL + "/graphql";
const benchEventApiUrl = config.value.BENCH_EVENT_API_URL
  ? config.value.BENCH_EVENT_API_URL
  : "https://openebench.bsc.es/rest/bench_event_api";
const dataMode = config.value.ENVIRONMENT
  ? config.value.ENVIRONMENT
  : "openebench";

</script>

<style scoped lang="scss">
.oeb-table-scroll {
  margin-top: 15px;
}
.community-event-classification {
  padding: 10px 0 20px;
}
</style>