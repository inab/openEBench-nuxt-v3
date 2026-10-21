<template>
	<div>
		<UModal v-model:open="dialogParseMetadata" :close="false">
			<template #content>
				<div class="p-4">
					<div class="pt-3 pb-3 pl-2 pr-2">
						<h6 class="mt-0 pt-0 text-h6">Uploading metadata</h6>

						<!-- Progress -->
						<div class="mt-3">
							<UProgress
								animation="carousel"
								:ui="{ indicator: { color: 'text-primaryOeb-500' } }"
								size="sm"
							/>
							<div class="text-sm" style="color: #1565c0">
								{{ parseProgressText }}
							</div>
						</div>

						<div class="flex justify-end mt-4">
							<UButton
								label="Cancel"
								color="neutral"
								variant="ghost"
								size="md"
								@click="cancelParse"
							/>
						</div>
					</div>
				</div>
			</template>
		</UModal>
	</div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useFileStore } from '~~/stores/observatory/evaluation/file';
const fileStore = useFileStore();

// Obtain states in a reactive manner
const { dialogParseMetadata, parseProgressText } = storeToRefs(fileStore);

// Method to cancel parsing
const cancelParse = () => {
	fileStore.cancelParse();
};
</script>
