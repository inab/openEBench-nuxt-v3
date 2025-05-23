<template>
  <div class="community-event-table-content w-100">
    <p
      class="text-body-2 text--secondary d-flex align-center text-stone-500 text-comment"
    >
      <span>
        <UIcon name="i-heroicons-information-circle" scale="2"></UIcon>
      </span>
      An Event corresponds to a time-bound contest where a tool, pipeline,
      service or product, i.e. the participant, is compared against other
      participants using a predefined collection of reference datasets and
      assessment metrics.
    </p>
    <div class="community-event-table-content__row">
      <CommunityEventClassification
        :id="event._id"
        :key="event._id"
        :filter-array="selectedIds"
      />
    </div>
    <div class="pt-3 community-event-table-content__row">
      <h2 class="mb-4">Challenges</h2>
      <p class="text-body-2 text--secondary d-flex align-center text-stone-500">
        <span>
          <UIcon name="i-heroicons-information-circle" scale="2" />
        </span>
        Challenges are a set of tests which the community uses to benchmark
        participating tools. Each of the categories in which a benchmarking
        event is divided. In its simplest form, one challenge comprises one
        reference dataset and one or more evaluation metrics. This can be
        customised if needed.
      </p>
    </div>

    <div class="alert alert-info mt-4">
      To filter the table results, please select single challenges below, the
      table will update automatically.
    </div>
    <div class="community-event-table-content__row">
      <CommunityEventTable
        :event-challenges="event.challenges"
        :community-id="communityId"
        :filter-array="selectedIds"
        @handle-change-challengers="handleChangeChallengers"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import CommunityEventClassification from "@/components/Community/CommunityEvent/CommunityEventClassification.vue";
import CommunityEventTable from "@/components/Community/CommunityEvent//CommunityEventTable.vue";

defineProps<{
  event: Object;
  communityId: string;
}>();

const selected = ref<any[]>([]);
const selectedIds = computed(() => selected.value.map((item: any) => item._id));

function handleChangeChallengers(currentSelected: any) {
  selected.value = currentSelected;
}
</script>

<style scoped lang="scss">
.community-event-table-content {
  p > span {
    margin-right: 10px;
    width: 20px;
    font-size: 22px;
  }
  .text-comment {
    font-size: 14px;
  }
  &__row {
    font-size: 14px;
    h2 {
      font-size: 25px;
    }
  }
}
.alert-info {
  font-size: 14px;
}
</style>
