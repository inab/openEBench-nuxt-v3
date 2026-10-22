<template>
	<div class="container">
		<!-- Tabla de Nuxt UI con solo 'Indicator' y 'Status' -->
		<UTable
			v-model:expanded="expanded"
			:data="items"
			:columns="columns"
			:ui="{
				tr: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer cursor-auto',
				th: 'text-left py-2.5 text-gray-900 dark:text-white font-medium text-sm',
				td: 'max-w-[0] truncate py-2.5 px-3 text-sm',
			}"
		>
			<!-- Indicator -->
			<template #indicator-cell="{ row }">
				<span :class="formatIndicatorStyle(row.original.id)">
					{{ row.original.indicator }}
				</span>
			</template>

			<!-----    STATUS COLUMN  ---------->
			<template #status-cell="{ row }">
				<div v-if="indicatorsExplanation[row.original.id].measured === false">
					<UBadge
						v-if="!indicatorsExplanation[row.original.id].types.includes(metaType(row.original))"
						color="neutral"
						variant="soft"
					>
						NOT APPLICABLE
					</UBadge>
					<UBadge v-else color="neutral" variant="soft"> NOT MEASURED </UBadge>
				</div>
				<div v-else>
					<div
						v-if="
							!idsMainIndicators.includes(row.original.id) &&
							!indicatorsExplanation[row.original.id].types.includes(metaType(row.original))
						"
					>
						<UBadge
							v-if="!indicatorsExplanation[row.original.id].types.includes(metaType(row.original))"
							color="neutral"
							variant="soft"
						>
							NOT APPLICABLE
						</UBadge>
					</div>
					<div
						v-if="
							!idsMainIndicators.includes(row.original.id) &&
							indicatorsExplanation[row.original.id].types.includes(metaType(row.original))
						"
					>
						<UBadge
							v-if="row.original.status === true"
							color="success"
							variant="soft"
							class="bg-green-50 text-green-500 dark:bg-green-400/30 dark:text-green-400"
						>
							PASSED
						</UBadge>
						<UBadge
							v-else
							variant="soft"
							class="bg-amber-50 text-amber-500 dark:bg-amber-400/30 dark:text-amber-400"
						>
							FAILED
						</UBadge>
					</div>
				</div>
			</template>

			<template #expand-cell="{ row }">
				<UButton
					color="neutral"
					variant="ghost"
					size="xs"
					:icon="
						row.getIsExpanded()
							? 'i-heroicons-chevron-up-20-solid'
							: 'i-heroicons-chevron-down-20-solid'
					"
					aria-label="Expand"
					@click="row.toggleExpanded()"
				/>
			</template>

			<!-----     EXPANSION  ---------->
			<template #expanded="{ row }">
				<div class="p-3 shadow-md">
					<!------  ABOUT THIS INDICATOR  -------->
					<div class="col-12">
						<span class="text-sm font-semibold">About this indicator:</span>
					</div>
					<div class="col-11">
						<!------ For high-level indicators  ------->
						<div v-if="idsMainIndicators.includes(row.original.id)" class="my-3 ms-5 text-xs">
							<span class="font-semibold"> What it is: </span>
							<span>
								{{ indicatorsExplanation[row.original.id].what }}
							</span>
						</div>

						<!------ For low-level indicators  ------->
						<div v-if="!idsMainIndicators.includes(row.original.id)" class="mt-3 mb-2 ms-5 text-xs">
							<li>
								<span class="font-semibold">What it is: </span>
								<span>
									{{ indicatorsExplanation[row.original.id].what }}
								</span>
							</li>
						</div>
						<div v-if="!idsMainIndicators.includes(row.original.id)" class="mb-2 ms-5 text-xs">
							<li>
								<span class="font-semibold">Why it is important: </span>
								<span>
									{{ indicatorsExplanation[row.original.id].why }}
								</span>
							</li>
						</div>
						<div v-if="!idsMainIndicators.includes(row.original.id)" class="mb-2 ms-5 text-xs">
							<li>
								<span class="font-semibold">How it is measured: </span>
								<span>{{ indicatorsExplanation[row.original.id].how }}</span>

								<span v-if="indicatorsExplanation[row.original.id].how === 'Not measured.'">
									<a href="#not-measured">
										<UIcon name="i-heroicons-information-circle" class="w-4 h-4 text-gray-600" />
									</a>
								</span>
							</li>
						</div>
						<div v-if="!idsMainIndicators.includes(row.original.id)" class="mb-2 ms-5 text-xs">
							<li>
								<span class="font-semibold">Types of software it applies to: </span>
								<span v-if="indicatorsExplanation[row.original.id].types.length === 2">
									"web" and "non-web"
								</span>
								<span v-if="indicatorsExplanation[row.original.id].types.length === 1">
									"{{ indicatorsExplanation[row.original.id].types[0] }}"
								</span>
								<a href="#types">
									<UIcon name="i-heroicons-information-circle" class="w-4 h-4 text-gray-600" />
								</a>
							</li>
						</div>
					</div>

					<!------  ASSESSMENT SUMMARY  -------->
					<!------ Only for low-level indicators  ------->
					<div v-if="!idsMainIndicators.includes(row.original.id)" class="col-12 mb-0 pb-0 mt-0">
						<span class="text-sm font-semibold">Assessment summary: </span>
					</div>
					<div v-if="!idsMainIndicators.includes(row.original.id)" class="col-11 mb-4">
						<div v-if="!idsMainIndicators.includes(row.original.id)" class="my-3 ms-5 text-xs">
							<logsSection :logs="row.original.logs" />
						</div>
					</div>

					<!------  RECOMMENDATION  -------->
					<!------ Only for low-level indicators  ------->
					<!-- <div v-if="!idsMainIndicators.includes(row.original.id)" class="col-11">
            <span class="text-sm font-semibold">Recomendation: </span>
          </div>
          <div v-if="!idsMainIndicators.includes(row.original.id)" class="col-10">
            <div v-if="!idsMainIndicators.includes(row.original.id)" class="my-3 ms-5 text-xs">
              - This is a recomendation to pass this indicator.
            </div>
          </div> -->

					<!------  NOTE  -------->
					<div class="col-11 pe-4">
						<UAlert
							v-if="
								!idsMainIndicators.includes(row.original.id) &&
								indicatorsExplanation[row.original.id].note != ''
							"
							icon="i-heroicons-exclamation-circle"
							color="warning"
							variant="soft"
							:description="indicatorsExplanation[row.original.id].note"
							class="mt-2 mb-2 ms-5 py-3 text-xs"
						/>
					</div>
				</div>
			</template>
		</UTable>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { indicatorsExplanation as explanationData } from './IndicatorsExplanation.js';
import { useResultStore } from '~~/stores/observatory/evaluation/results';
import logsSection from './LogsSection.vue';
const indicatorsExplanation: Record<string, any> = explanationData;

// Obtener el store
const resultStore = useResultStore();
const FAIRIndicatorsTool = computed(() => resultStore.getFAIRIndicatorsTool);
const FAIRIndicatorsLogs = computed(() => resultStore.getFAIRIndicatorsLogs);

// Props
const props = defineProps<{
	indicators: any[];
	idsMainIndicators: any[];
}>();

const webTypes = ref(['web', 'app', 'api', 'rest', 'suite']);

const expanded = ref<Record<string, boolean>>({});

// Formatting the Indicator column styles
const formatIndicatorStyle = (id: string) => {
	if (/^F\d$/.test(id)) {
		return 'text-blue-600 font-bold';
	} else {
		return 'ms-3';
	}
};

const indicatorFullfilled = (indicator: any) => {
	const value = FAIRIndicatorsTool.value?.[indicator.id];
	return value === 1 || value === 1.0 || value === true;
};

const indicatorLogs = (indicator: any) => {
	return FAIRIndicatorsLogs.value?.[indicator.id] || [];
};

const metaType = (indicator: any) => {
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
	{ accessorKey: 'indicator', header: 'Indicator' },
	{ accessorKey: 'status', header: 'Status' },
	{ id: 'expand', header: '' },
];
</script>
