<template>
  <div class="challenge_metric__content">
    <div v-if="isFetchingData" class="">
      <div class="spinner">Loading...</div>
    </div>
    <div v-else class="">
      <div class="challenge-metric-content">
        <div class="challenge-metric-content__header">
          <div class="challenge-metric-content__header__title font-bold">
            {{ metricData.title }}
          </div>
          <div class="challenge-metric-content__header__description">
            {{ metricData.description }}
          </div>
          <UButton
            label="View Metric"
            icon="i-heroicons-eye-16-solid"
            @click="isOpen = true"
          />
        </div>
      </div>
    </div>
    <UModal v-model="isOpen" prevent-close>
      <UCard
        :ui="{
          base: '',
          background: 'bg-white dark:bg-gray-900',
          divide: 'divide-y divide-gray-200 dark:divide-gray-800',
          ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
          rounded: 'rounded-lg',
          shadow: 'shadow',
          body: {
            base: '',
            background: '',
            padding: 'p-4 sm:p-6',
          },
          header: {
            base: '',
            background: '',
            padding: 'px-4 py-2 sm:p-6',
          },
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div
              class="text-primaryOeb-500 text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Metric: {{ metricData.title }}
            </div>
            <UButton
              color="bg-slate-300"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class=""
              @click="isOpen = false"
            />
          </div>
        </template>

        <div class="challenge-metric-content__data text-neutral-500">
          <div class="challenge-metric-content__data__value pb-2">
            <span class="font-bold">Contacts: </span>
            <span
              v-for="contact in metricData.metrics_contact_ids"
              :key="contact"
              class=""
            >
              <span
                class="challenge-metric-content__data__value__contact text-neutral-500"
              >
                {{ formatContact(contact) }}
              </span>
              <span
                v-if="contact !== metricData.metrics_contact_ids.slice(-1)[0]"
                class="text-neutral-500"
                >,
              </span>
            </span>
          </div>
          <div class="challenge-metric-content__data__unit pb-2">
            <span class="font-bold">Formal Definition:</span>
            {{ metricData.formal_definition }}
          </div>
          <div class="challenge-metric-content__data__references pb-2">
            <span class="font-bold">References: </span>
            <span v-for="reference in metricData.references" :key="reference">
              <span
                class="challenge-metric-content__data__references__reference"
              >
                {{ reference }}
              </span>
              <span v-if="reference !== metricData.references.slice(-1)[0]"
                >,
              </span>
            </span>
          </div>
          <div class="challenge-metric-content__data__references pb-2">
            <span class="font-bold">Orig ID: </span> {{ metricData.orig_id }}
          </div>
          <div class="challenge-metric-content__data__metadata pb-2">
            <span class="font-bold">Metadata: </span>
            <div
              v-for="(value, key) in metricData._metadata"
              :key="key"
              class=""
            >
              {{ key }} - {{ value }}
            </div>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

const props = defineProps<{
  isLoadingData: boolean;
  metricId: string;
  metricTool: string;
}>();

const metricId = computed(() => {
  return props.metricId;
});

const metricTool = computed(() => {
  return props.metricTool;
});

const isOpen = ref(false);

const runtimeConfig = useRuntimeConfig();
const { data } = useAuth();
const isFetchingData = ref(true);
const token: string = data?.value.accessToken;

interface MetricData {
  title: string;
  description: string;
  metrics_contact_ids: string[];
  formal_definition: string;
  references: string[];
  orig_id: string;
  _metadata: Record<string, string>;
}

const metricData = ref<MetricData>({
  title: "",
  description: "",
  metrics_contact_ids: [],
  formal_definition: "",
  references: [],
  orig_id: "",
  _metadata: {},
});

const formatContact = (contact: string): string => {
  return contact.replace(".", " ");
};

const fetchMetricData = async (): Promise<void> => {
  try {
    const response = await fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Metrics/${metricId.value}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        method: "GET",
      },
    );
    const data = await response.json();
    isFetchingData.value = false;
    metricData.value = data;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchMetricData();
});
</script>

<style scoped lang="scss">
.challenge-metric-content__header__description {
  text-transform: capitalize;
}
</style>
