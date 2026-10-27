<template>
	<UModal
		v-model:open="dialogPRok"
		:close="false"
		:ui="{ content: 'w-96', overlay: 'bg-zinc-800/50' }"
	>
		<template #content>
			<div class="px-4 py-3">
				<div class="row flex justify-center">
					<div class="col-2">
						<UIcon name="i-heroicons-check-circle " class="w-8 h-8 bg-green-500 my-2" />
					</div>
				</div>
				<div class="row flex justify-center">
					<div class="col-12">
						<h6 class="text-center my-2">Pull Request Created</h6>
					</div>
					<div class="col-2 flex justify-center">
						<UButton
							color="neutral"
							variant="ghost"
							class="mt-3 px-3 text-black bg-gray-100"
							@click="openPRinGH()"
						>
							See in repository
						</UButton>
					</div>
				</div>

				<!-- Actions -->
				<div class="mt-2 flex justify-end">
					<UButton color="success" variant="soft" class="mt-2" @click="close"> Close </UButton>
				</div>
			</div>
		</template>
	</UModal>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useExport } from '~~/stores/observatory/evaluation/export';
const exportStore = useExport();

const dialogPRok = computed({
	get: () => exportStore.getDialogPRok,
	set: (value: boolean) => exportStore.updateDialogPRok(value),
});
const okURL = computed(() => exportStore.getOkURL);

// Methods
const close = () => {
	exportStore.updateDialogPRok(false);
};
const openPRinGH = () => {
	if (!okURL.value) {
		console.error('okURL no está definido o es nulo');
		return;
	}

	window.open(okURL.value, '_blank');
};
</script>
