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

const runtimeConfig = useRuntimeConfig();

const apiUrl = runtimeConfig.public
  ? runtimeConfig.public.SCIENTIFIC_SERVICE_URL + "graphql"
  : "https://dev-openebench.bsc.es/api/scientific/graphql";
const benchEventApiUrl = runtimeConfig.public
  ? runtimeConfig.public.BENCH_EVENT_API_URL
  : "https://dev-openebench.bsc.es/rest/bench_event_api";
const dataMode = runtimeConfig.public
  ? runtimeConfig.public.ENVIRONMENT
  : "dev-openebench";

</script>

<style scoped lang="scss">
.oeb-table-scroll {
  margin-top: 15px;
}
.community-event-classification {
  padding: 10px 0 20px;
}
</style>
