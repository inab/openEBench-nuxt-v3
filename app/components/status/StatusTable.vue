<template>
  <div class="status-table">
    <UTable
      :columns="columns"
      :rows="services"
      :loading="isTableLoading"
      :loading-state="{
        icon: 'i-heroicons-arrow-path-20-solid',
        label: 'Loading...',
      }"
      :progress="{ color: 'primary', animation: 'carousel' }"
    >
      <template #service-data="{ row }">
        <span v-if="row.status" class="status-ok">
          <font-awesome-icon :icon="['fas', 'circle-check']" />
        </span>
        <span v-else class="status-error">
          <font-awesome-icon :icon="['fas', 'triangle-exclamation']" />
        </span>
        {{ row.service }}
      </template>
      <template #status-data="{ row }">
        {{ row.status ? "Operational" : "Down" }}
      </template>
      <template #response-data="{ row }">
        {{ row.response }}
      </template>
      <template #page-data="{ row }">
        <a target="_blank" :href="row.page">{{ row.page }}</a>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  services: any,
  isTableLoading: boolean
}>();

const columns = [
  {
    key: "service",
    label: "Service",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "response",
    label: "Response time (ms)",
  },
  {
    key: "page",
    label: "Go to page",
  },
];
</script>
<style scoped lang="scss">
.status-ok {
  color: #a0c878;
}
.status-error {
  color: #e52020;
}
.status-table {
  padding: 30px 0 50px;
}
</style>
