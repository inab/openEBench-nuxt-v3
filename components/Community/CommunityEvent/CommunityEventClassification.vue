<template>
  <div class="community-event-classification">
    <div
      :id="id"
      class="oeb-table"
      :data-benchmarkingevent="id"
      :data-mode="dataMode"
      :data-api-url="apiUrl"
      :data-bench-event-api-url="benchEventApiUrl"
    />
  </div>
</template>

<script setup lang="ts">
import debounce from "lodash.debounce";
import { run_summary_table } from "@inb/oeb-classification-table";
import { defineProps, watch, onMounted } from "vue";

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
  ? runtimeConfig.public.SCIENTIFIC_SERVICE_URL + "/graphql"
  : "https://dev-openebench.bsc.es/api/scientific/graphql";
const benchEventApiUrl = runtimeConfig.public
  ? runtimeConfig.public.BENCH_EVENT_API_URL
  : "https://dev-openebench.bsc.es/rest/bench_event_api";
const dataMode = runtimeConfig.public
  ? runtimeConfig.public.ENVIRONMENT
  : "dev-openebench";

onMounted(() => {
  loadTable();
});

const debouncedFilterArrayWatch = debounce(() => {
  loadTable();
}, debounce);

const loadTable = () => {
  try {
    run_summary_table(props.filterArray, props.id);
  } catch (error) {}
};

watch(
  () => props.filterArray,
  () => {
    debouncedFilterArrayWatch();
  },
  { deep: true },
);
</script>

<style scoped lang="scss">
.oeb-table-scroll {
  margin-top: 15px;
}
.community-event-classification {
  padding: 10px 0 20px;
}
</style>
