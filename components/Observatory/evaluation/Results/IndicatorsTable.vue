<template>
  <div class="container">
    <!-- Tabla de Nuxt UI con solo 'Indicator' y 'Status' -->
    <UTable v-model:expand="expand" :rows="items" :columns="columns"
    :ui="{
      tr: {
        base: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer cursor-auto',
      },
      th: {
        base: 'text-left ',
        padding: 'py-2.5',
        color: 'text-gray-900 dark:text-white',
        font: 'font-medium',
        size: 'text-sm',
      },
      td: {
        base: 'max-w-[0] truncate',
        padding: 'py-2.5 px-3',
        font: '',
        size: 'text-sm',
      },
      default:{
        expandButton: {
          class:'align-right',
          
        }
      },
    }">

      <!-- Indicator -->
      <template #indicator-data="{ row }">
        <span :class="formatIndicatorStyle(row.id)">
          {{ row.indicator }}
        </span>
      </template>

      <!-----    STATUS COLUMN  ---------->
      <template #status-data="{ row }">
        <div v-if="indicatorsExplanation[row.id].measured === false">
          <UBadge v-if="!indicatorsExplanation[row.id].types.includes(metaType(row))" color="gray" variant="soft"
          >
            NOT APPLICABLE
          </UBadge>
          <UBadge v-else color="gray" variant="soft"
          >
            NOT MEASURED
          </UBadge>
        </div>
        <div v-else>
          <div v-if=" !idsMainIndicators.includes(row.id) &&
						!indicatorsExplanation[row.id].types.includes(metaType(row))"
          >
            <UBadge v-if="!indicatorsExplanation[row.id].types.includes(metaType(row))" 
              color="gray" variant="soft"
            >
              NOT APPLICABLE
            </UBadge>
          </div>
          <div v-if="!idsMainIndicators.includes(row.id) && indicatorsExplanation[row.id].types.includes(metaType(row))">
            <UBadge v-if="row.status === true" color="green" variant="soft"
            >
              PASSED
            </UBadge>
            <UBadge v-else color="amber" variant="soft"
            >
              FAILED
            </UBadge>

          </div>
        </div>
      </template>

      <!-----     EXPANSION  ---------->
      <template #expand="{ row }">
        <div class="p-3 shadow-md">
          <!------  ABOUT THIS INDICATOR  -------->
          <div class="col-12">
            <span class="text-sm font-semibold">About this indicator:</span>
          </div>
          <div class="col-11">

            <!------ For high-level indicators  ------->
            <div v-if="idsMainIndicators.includes(row.id)" class="my-3 ms-5 text-xs">
              <span class="font-semibold"> What it is: </span>
              <span>
                {{ indicatorsExplanation[row.id].what }}
              </span>
            </div>

            <!------ For low-level indicators  ------->
            <div v-if="!idsMainIndicators.includes(row.id)" class="mt-3 mb-2 ms-5 text-xs">
              <li>
                <span class="font-semibold">What it is: </span>
                <span>
                  {{ indicatorsExplanation[row.id].what }}
                </span>
              </li>
            </div>
            <div v-if="!idsMainIndicators.includes(row.id)" class="mb-2 ms-5 text-xs">
              <li>
                <span class="font-semibold">Why it is important: </span>
                <span>
                  {{ indicatorsExplanation[row.id].why }}
                </span>
              </li>
            </div>
            <div v-if="!idsMainIndicators.includes(row.id)" class="mb-2 ms-5 text-xs">
              <li>
                <span class="font-semibold">How it is measured: </span>
                <span>{{ indicatorsExplanation[row.id].how }}</span>

                <span v-if="indicatorsExplanation[row.id].how === 'Not measured.'">
                  <a href="#not-measured">
                    <UIcon name="i-heroicons-information-circle" class="w-4 h-4 text-gray-600" />
                  </a>
                </span>
              </li>
            </div>
            <div v-if="!idsMainIndicators.includes(row.id)" class="mb-2 ms-5 text-xs">
              <li>
                <span class="font-semibold">Types of software it applies to: </span>
                <span v-if="indicatorsExplanation[row.id].types.length === 2">
                  "web" and "non-web"
                </span>
                <span v-if="indicatorsExplanation[row.id].types.length === 1">
                  "{{ indicatorsExplanation[row.id].types[0] }}"
                </span>
                <a href="#types"> 
                  <UIcon name="i-heroicons-information-circle" class="w-4 h-4 text-gray-600" />
                </a>
              </li>
            </div>
          </div>

          <!------  ASSESSMENT SUMMARY  -------->
					<!------ Only for low-level indicators  ------->
          <div v-if="!idsMainIndicators.includes(row.id)" class="col-12 mb-0 pb-0 mt-0">
            <span class="text-sm font-semibold">Assessment summary: </span>
          </div>
          <div v-if="!idsMainIndicators.includes(row.id)" class="col-11">
            <div v-if="!idsMainIndicators.includes(row.id)" class="my-3 ms-5 text-xs">
              <logsSection :logs="row.logs"/>
            </div>
          </div>

          <!------  RECOMMENDATION  -------->
					<!------ Only for low-level indicators  ------->
          <!-- <div v-if="!idsMainIndicators.includes(row.id)" class="col-11">
            <span class="text-sm font-semibold">Recomendation: </span>
          </div>
          <div v-if="!idsMainIndicators.includes(row.id)" class="col-10">
            <div v-if="!idsMainIndicators.includes(row.id)" class="my-3 ms-5 text-xs">
              - This is a recomendation to pass this indicator.
            </div>
          </div> -->

          <!------  NOTE  -------->
          <div class="col-11">
            <UAlert
              v-if="!idsMainIndicators.includes(row.id) && indicatorsExplanation[row.id].note != ''"
              color="red"
              variant="soft"
              :description="indicatorsExplanation[row.id].note"
              class="mt-2 mb-3 text-xs"
            />
          </div>

        </div>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { indicatorsExplanation } from './IndicatorsExplanation.js';
import { useResultStore } from '@/stores/observatory/evaluation/results';
import logsSection from './LogsSection.vue';

// Obtener el store
const resultStore = useResultStore();
const FAIRIndicatorsTool = computed(() => resultStore.getFAIRIndicatorsTool);
const FAIRIndicatorsLogs = computed(() => resultStore.getFAIRIndicatorsLogs);

// Props
const props = defineProps<{
  indicators: any[];
  idsMainIndicators: any[];
}>();

const webTypes = ref(['web', 'app', 'api', 'rest', 'suite'])

const expand = ref({
  openedRows: [],
  row: {}
});

// Formatting the Indicator column styles
const formatIndicatorStyle = (id) => {
  if (/^F\d$/.test(id)) {
    return 'text-blue-600 font-bold';
  } else {
    return 'ms-3';
  }
};

const indicatorFullfilled = (indicator) => {
  const value = FAIRIndicatorsTool.value?.[indicator.id];
  return value === 1 || value === 1.0 || value === true;
};

const indicatorLogs = (indicator) => {
  return FAIRIndicatorsLogs.value?.[indicator.id] || [];
};

const metaType = (indicator) => {
  if (webTypes.value.includes(indicator.type)) {
    return 'web';
  } else {
    return 'non-web';
  }
};

// Create the elements for the table
const items = computed(() =>
  props.indicators.map((indicator) => ({
    id: indicator.id,
    indicator: `${indicator.avatar} ${indicator.name}`,
    status: indicatorFullfilled(indicator),
    avatar: indicator.avatar,
    logs: indicatorLogs(indicator),
  }))
);

// Visible columns
const columns = [
  { key: 'indicator', label: 'Indicator' },
  { key: 'status', label: 'Status' }
];
</script>
