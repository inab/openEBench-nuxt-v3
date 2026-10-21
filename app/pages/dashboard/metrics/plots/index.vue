<template>
	<div class="metrics-plots">
		<BreadcrumbsBar :breadcrumbs-array="routeArray" />
		<div class="w-100 container">
			<div v-if="status == 'authenticated'">
				<UAccordion class="intro-accordion" :items="HEADER_ITEM" default-value="plots">
					<template #default="{ item }">
						<h2 class="intro-accordion-title">{{ item.label }}</h2>
					</template>

					<template #trailing="{ open }">
						<UIcon
							name="i-heroicons-chevron-right-20-solid"
							class="intro-accordion-icon"
							:class="[open && 'rotate-90']"
						/>
					</template>

					<template #plots>
						<div class="accordion_metrics__body">
							<div class="dashboard__description text-gray-500">
								<div class="dashboard__description__image">
									<img
										src="~/assets/images/dashboard/Charts-pana.png"
										alt="metrics"
										class="metrics__body__img"
									/>

									<div class="hidden">
										<a href="https://storyset.com/business"> Business illustrations by Storyset </a>
									</div>
								</div>

								<div class="dashboard__description__text">
									<div class="dashboard__description__text__extension mt-2">
										Communities in OpenEBench leverage powerful visualization tools to present
										benchmarking results in clear and insightful ways. These interactive plots
										enable users to explore performance trends, compare tool effectiveness across
										different datasets, and gain valuable insights into software capabilities.
									</div>

									<div class="dashboard__description__text__extension">
										<p>
											The plots available in OpenEBench include bar plots, scatter plots, box plots,
											radar plots, and line plots. Each plot type offers unique advantages for
											visualizing and interpreting benchmarking data, allowing users to tailor their
											analysis to specific research questions or performance evaluation needs.
										</p>
									</div>
								</div>
							</div>
						</div>
					</template>
				</UAccordion>
				<div class="metrics__body pt-4">
					<div class="metric-filter d-flex justify-content-start">
						<div class="metric-filter__col col-12 col-md-6 col-lg-4 d-flex">
							<label for="plotType" class="form-label">Select Plot Type:</label>
							<USelect
								id="plotType"
								v-model="plotSelected"
								:items="plotTypes"
								class="custom-select-input w-full"
								size="xl"
							/>
						</div>
					</div>
					<div class="dashboard-tabs pt-4">
						<Plots :type-selected="plotSelected" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BreadcrumbsBar from '@/components/Common/BreadcrumbsBar.vue';
import Plots from '@/components/Dashboard/metrics/plots/Plots.vue';
import { useRoute } from 'vue-router';

definePageMeta({
	middleware: 'require-auth',
	auth: {
		authenticatedOnly: true,
		navigateUnauthenticatedTo: '/login-required',
	},
});

const { data, status } = useAuth();
const route = useRoute();
const plotTypes = [
	{
		label: 'Bar Plot',
		value: 'bar-plot',
	},
	{
		label: 'Scatter Plot',
		value: '2D-plot',
	},
	{
		label: 'Box Plot',
		value: 'box-plot',
	},
	{
		label: 'Radar Plot',
		value: 'radar-plot',
	},
	{
		label: 'Line Plot',
		value: 'line-plot',
	},
];
const requestedPlot = Array.isArray(route.query.plot) ? route.query.plot[0] : route.query.plot;
const plotSelected = ref(
	typeof requestedPlot === 'string' ? requestedPlot : (plotTypes[0]?.value ?? 'bar-plot')
);

if (plotSelected.value == 'scatter') {
	plotSelected.value = '2D-plot';
} else if (plotSelected.value == 'bar') {
	plotSelected.value = 'bar-plot';
}

const HEADER_ITEM = [
	{
		label: 'Plots',
		value: 'plots',
		slot: 'plots',
	},
];

const routeArray = [
	{ label: 'Dashboard', isActualRoute: false, route: '/dashboard' },
	{ label: 'Metrics', isActualRoute: false, route: '/dashboard/metrics' },
	{ label: 'Plots', isActualRoute: true },
];
</script>

<style lang="scss" scoped>
.dashboard__description {
	display: flex;

	&__image {
		margin-right: 40px;

		img {
			max-height: 500px;
		}
	}

	&__text {
		font-size: 16px;
		line-height: 1.5;
	}
}

.dashboard__description__text {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin-top: 10px;
}

.metric-filter__col {
	align-items: center;
	gap: 0.75rem;

	label {
		padding-right: 0;
		margin-bottom: 0;
		white-space: nowrap;
	}

	.custom-select-input {
		flex: 1;
		min-width: 0;
	}
}
</style>
