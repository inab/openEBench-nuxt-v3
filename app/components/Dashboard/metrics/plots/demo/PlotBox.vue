<template>
	<div class="bar-plot">
		<div class="bar-description pb-4">
			Box plots summarize the distribution of numerical data for different categories or groups in
			OpenEBench. They display key statistical measures like the median, quartiles, and potential
			outliers, providing a concise overview of the central tendency, spread, and shape of the data.
			This allows users to quickly compare the performance distributions across various options.
		</div>
		<div class="w-100 pt-1">
			<div v-if="isLoadingGraphBar" class="loader-container mt-5">
				<img
					src="~/assets/images/201805.OpenEBench.logo.Animated.0050secs.gif"
					alt="Loader GIF"
					class="loader"
				/>
			</div>
			<div v-else>
				<div class="row">
					<div class="col-8">
						<widget-element :key="widgetKey" :data="preparedBar" :type="type"></widget-element>
					</div>
					<div class="col-4">
						<UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
							<UFormGroup
								v-for="participant in state.challenge_participants"
								:key="participant.name"
								name="tool"
								class="form-group__block"
							>
								<div class="form-group__block__title">
									{{ `Tool Name: ${participant.name}` }}
								</div>
								<div class="input-row">
									<div class="input-row-group">
										<div class="mr-2 input-row-group__title">Q1:</div>
										<UInput
											v-model="participant.q1"
											class="form-control custom-entry-input"
											autocomplete="off"
										/>
									</div>
									<div class="input-row-group">
										<div class="mr-2 input-row-group__title">Q3:</div>
										<UInput
											v-model="participant.q3"
											class="form-control custom-entry-input"
											autocomplete="off"
										/>
									</div>
								</div>
								<div class="input-row">
									<div class="input-row-group">
										<div class="mr-2 input-row-group__title">Mean:</div>
										<UInput
											v-model="participant.mean"
											class="form-control custom-entry-input"
											autocomplete="off"
											disabled
										/>
									</div>
									<div class="input-row-group">
										<div class="mr-2 input-row-group__title">Median:</div>
										<UInput
											v-model="participant.median"
											class="form-control custom-entry-input"
											autocomplete="off"
											disabled
										/>
									</div>
								</div>
								<div class="input-row">
									<div class="input-row-group">
										<div class="mr-2 input-row-group__title">Lowerfence:</div>
										<UInput
											v-model="participant.lowerfence"
											class="form-control custom-entry-input"
											autocomplete="off"
											disabled
										/>
									</div>
									<div class="input-row-group">
										<div class="mr-2 input-row-group__title">Upperfence:</div>
										<UInput
											v-model="participant.upperfence"
											class="form-control custom-entry-input"
											autocomplete="off"
											disabled
										/>
									</div>
								</div>
							</UFormGroup>
							<div v-if="hasDataError" class="w-100">
								<div class="alert alert-danger" role="alert">
									{{ hasDataErrorMessage }}
								</div>
							</div>
							<div class="form-footer pt-3 d-flex justify-content-end">
								<UButton class="" type="submit"> Generate plot </UButton>
							</div>
						</UForm>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { array, object, safeParse } from 'valibot';
import type { FormSubmitEvent } from '#ui/types';

import demo_bar from './templates/BOXPLOT.json';
const isLoadingGraphBar = ref(true);

interface BoxParticipant {
	name: string;
	metric_id: string;
	q1: number;
	mean: number;
	median: number;
	q3: number;
	lowerfence: number;
	upperfence: number;
}
interface BoxFormParticipant {
	name: string;
	metric_id: string;
	q1: string;
	mean: string;
	median: string;
	q3: string;
	lowerfence: string;
	upperfence: string;
}
interface BoxPlotData {
	inline_data?: { challenge_participants: BoxParticipant[] };
}

const preparedBar = ref('');
const initialValues = ref<BoxParticipant[]>([]);
const type = ref<string>('box-plot');
const hasDataError = ref(false);
const hasDataErrorMessage = ref('');
const widgetKey = ref(0);

const state = ref({
	challenge_participants: [] as BoxFormParticipant[],
});

const schema = object({
	challenge_participants: array(object({})),
});

function toFormParticipant(participant: BoxParticipant): BoxFormParticipant {
	return {
		name: participant.name,
		metric_id: participant.metric_id,
		q1: String(participant.q1),
		mean: String(participant.mean),
		median: String(participant.median),
		q3: String(participant.q3),
		lowerfence: String(participant.lowerfence),
		upperfence: String(participant.upperfence),
	};
}

getPreparedData();
function getPreparedData() {
	const bar = demo_bar;
	const barVisualization = bar.inline_data.visualization;
	const prepared = {
		_id: bar._id,
		dates: bar.dates,
		inline_data: {
			challenge_participants: [] as BoxParticipant[],
			visualization: {
				type: barVisualization.type,
			},
		},
	};
	prepared.inline_data.challenge_participants = bar.inline_data.challenge_participants.map(
		(participant) => {
			const preparedParticipant = {
				name: participant.name,
				metric_id: participant.metric_id,
				q1: participant.q1,
				mean: participant.mean,
				median: participant.median,
				q3: participant.q3,
				lowerfence: participant.lowerfence,
				upperfence: participant.upperfence,
			};
			return preparedParticipant;
		}
	);

	initialValues.value = JSON.parse(JSON.stringify(prepared.inline_data.challenge_participants));
	state.value.challenge_participants =
		prepared.inline_data.challenge_participants.map(toFormParticipant);
	preparedBar.value = JSON.stringify(prepared);
}

function recalculateMedians(params: Pick<BoxParticipant, 'name' | 'q1' | 'q3'>[]) {
	const preparedObj: BoxPlotData = JSON.parse(preparedBar.value);
	if (preparedObj.inline_data) {
		const initialValuesMap = Object.fromEntries(
			initialValues.value.map((item) => [item.metric_id, item])
		);

		preparedObj.inline_data.challenge_participants =
			preparedObj.inline_data.challenge_participants.map((item) => {
				const paramItem = params.find((param) => param.name === item.name);
				const initialItem = initialValuesMap[item.metric_id];
				if (!paramItem || !initialItem) return item;

				const { q1: oldQ1, q3: oldQ3, mean: oldMean, median: oldMedian } = initialItem;

				const { q1: newQ1, q3: newQ3 } = paramItem;

				const oldMidpoint = (oldQ1 + oldQ3) / 2;
				const newMidpoint = (newQ1 + newQ3) / 2;
				const newMedian = oldMedian + (newMidpoint - oldMidpoint);
				const newMean = oldMean + (newMidpoint - oldMidpoint);
				const newIQR = newQ3 - newQ1;
				const lowerFence = newQ1 - 1.5 * newIQR;
				const upperFence = newQ3 + 1.5 * newIQR;

				return {
					...item,
					q1: newQ1,
					q3: newQ3,
					mean: newMean,
					median: newMedian,
					lowerfence: lowerFence,
					upperfence: upperFence,
				};
			});

		preparedBar.value = JSON.stringify(preparedObj);
		state.value.challenge_participants =
			preparedObj.inline_data.challenge_participants.map(toFormParticipant);
		widgetKey.value++;
	}
}

type Schema = import('valibot').InferOutput<typeof schema>;

async function onSubmit(_event: FormSubmitEvent<Schema>) {
	const result = safeParse(schema, state.value);
	hasDataError.value = false;
	hasDataErrorMessage.value = '';

	if (result.success) {
		const data: Pick<BoxParticipant, 'name' | 'q1' | 'q3'>[] = [];
		for (const item of state.value.challenge_participants) {
			const q1 = parseFloat(item.q1.replace(',', '.'));
			const q3 = parseFloat(item.q3.replace(',', '.'));
			if (!item.q1 || !item.q3 || Number.isNaN(Number(item.q1)) || Number.isNaN(Number(item.q3))) {
				hasDataError.value = true;
				hasDataErrorMessage.value = 'Q1 and Q3 values are required';
				continue;
			} else if (Number(item.q1) > Number(item.q3)) {
				hasDataError.value = true;
				hasDataErrorMessage.value = 'Q1 value should be less than Q3 value';
				continue;
			}

			data.push({ name: item.name, q1, q3 });
		}

		if (hasDataError.value) {
			return;
		}
		recalculateMedians(data);
	}
}

onMounted(async () => {
	await import('@inb/oeb-widgets-graphs').then(() => {
		isLoadingGraphBar.value = false;
	});
});
</script>

<style lang="scss" scoped>
.input-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 20px;
	&-group {
		display: block;
		align-items: center;
		gap: 10px;
		&__title {
			font-weight: 500;
			font-size: 13px;
		}
	}
}
.form-group__block {
	font-size: 16px;
	border: 1px solid #e5e7eb;
	padding: 10px 14px 10px 10px;
	border-radius: 5px;
	margin-top: 2px !important;
	box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
	label {
		font-size: 16px;
	}
	&__title {
		font-weight: 700;
		font-size: 16px;
	}
}
.loader-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	.loader {
		max-height: 130px;
	}
}
</style>
