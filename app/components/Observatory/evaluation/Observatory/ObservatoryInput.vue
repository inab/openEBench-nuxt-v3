<template>
	<div class="container mx-auto p-4">
		<form @submit.prevent="submitObservatoryTool">
			<div class="row justify-center mb-3">
				<div class="col-10">
					<p class="text-sm">Select a tool from the Software's Observatory Database:</p>
				</div>
			</div>

			<div class="row justify-center mb-4 relative">
				<div class="col-10">
					<div v-if="observatoryStore.loadingAutocomplete" class="form-group w-full items-center">
						<USkeleton class="h-12 w-full rounded-md" />
					</div>

					<div v-else class="form-group relative">
						<label v-if="selectedTool" :class="labelClasses">Tool</label>
						<div class="flex items-center gap-2 mt-2">
							<UIcon name="mdi-database" class="text-gray-500 text-2xl" :class="iconClass" />

							<USelectMenu
								v-model="selectedToolName"
								v-model:search-term="searchQuery"
								:items="toolItemsWithTypes"
								placeholder="Select a tool"
								aria-label="Tool"
								reset-search-term-on-blur
								value-key="label"
								:content="{ alignOffset: 8 }"
								:ui="{
									base: 'peer w-full flex items-center h-12 max-h-12 rounded-md border text-sm px-2 focus-within:ring-primaryOeb-500 focus-within:border-primaryOeb-500 focus-within:text-primaryOeb-500',
									item: 'rounded-md bg-transparent data-highlighted:text-default data-highlighted:before:bg-gray-100',
									itemWrapper: 'w-full min-w-0',
									itemLabel: 'w-full',
								}"
								@focus="onFocus"
								@update:open="handleMenuOpen"
							>
								<template #default="{ modelValue }">
									<span
										v-if="modelValue && selectedTool"
										class="inline-flex max-w-full min-w-0 items-center gap-1.5 rounded-md bg-[#DBEAFE] px-2 py-1 text-sm font-medium text-black"
									>
										<span class="min-w-0 truncate">{{ selectedToolLabel }}</span>
										<span class="flex shrink-0 items-center gap-1">
											<span
												v-for="type in getToolTypes(selectedTool)"
												:key="type"
												class="inline-flex items-center rounded-sm bg-white px-2 py-0.5 text-xs font-semibold text-black"
											>
												{{ type.toUpperCase() }}
											</span>
										</span>
									</span>
									<span v-else data-slot="placeholder" class="truncate text-dimmed">
										Select a tool
									</span>
								</template>
								<template #trailing="{ modelValue, open }">
									<UButton
										v-if="modelValue"
										as="span"
										icon="i-heroicons-x-circle-16-solid"
										color="neutral"
										variant="link"
										tabindex="-1"
										aria-label="Clear selected tool"
										class="cursor-pointer"
										@click.stop="selectedToolName = undefined"
									/>
									<UIcon
										name="i-heroicons-chevron-down-20-solid"
										class="size-5 shrink-0 text-gray-400 transition-transform duration-150"
										:class="{ 'rotate-180 text-primaryOeb-500': open }"
									/>
								</template>
								<template #item-label="{ item }">
									<span
										class="inline-flex max-w-full min-w-0 items-center gap-1.5 rounded-md bg-[#DBEAFE] px-2 py-1 text-sm font-medium text-black"
									>
										<span class="min-w-0 truncate">
											{{ item.label }}
										</span>
										<span class="flex shrink-0 items-center gap-1">
											<span
												v-for="type in item.types"
												:key="type"
												class="inline-flex items-center rounded-sm bg-white px-2 py-0.5 text-xs font-semibold text-black"
											>
												{{ type.toUpperCase() }}
											</span>
										</span>
									</span>
								</template>
							</USelectMenu>
						</div>
					</div>
				</div>
			</div>

			<!-- Buttons next steps -->
			<div class="row justify-center">
				<div class="col-10 text-right">
					<UButton class="mr-2" color="neutral" variant="ghost" size="md" @click="goBack"
						>Back</UButton
					>
					<UButton
						class="mr-2 bg-primaryOeb-500"
						variant="solid"
						size="md"
						:disabled="!selectedTool || isSubmitting"
						@click="submitObservatoryTool"
					>
						{{ isSubmitting ? 'Loading metadata…' : 'Continue' }}
					</UButton>
				</div>
			</div>
			<div v-if="loadError" class="row justify-center mt-3">
				<div class="col-10">
					<UAlert color="error" variant="soft" :description="loadError" />
				</div>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useStepperStore } from '~~/stores/observatory/evaluation/index';
import { useObservatoryStore } from '~~/stores/observatory/evaluation/observatory';
import { useMetadataStore } from '~~/stores/observatory/evaluation/metadata';

const observatoryStore = useObservatoryStore();
const stepperStore = useStepperStore();
const metadataStore = useMetadataStore();
const isSubmitting = ref(false);
const loadError = ref('');
type ObservatoryToolOption = {
	label?: string;
	name?: string;
	type?: string;
	types?: string[];
};
const observatoryTools = computed<ObservatoryToolOption[]>(
	() => observatoryStore.ObservatoryToolsNameTypeSources || []
);
const getToolLabel = (tool: ObservatoryToolOption) => tool.label ?? tool.name ?? '';

const CHUNK = 20;
const COOLDOWN_MS = 250;

const selectedToolName = ref<string>();
const selectedTool = computed(
	() => observatoryTools.value.find((tool) => getToolLabel(tool) === selectedToolName.value) ?? null
);
const selectedToolLabel = computed(() => {
	return selectedTool.value?.name ?? (selectedTool.value ? getToolLabel(selectedTool.value) : '');
});
const selectedToolType = computed(() => {
	const types = selectedTool.value ? getToolTypes(selectedTool.value) : [];
	if (types.length) return types[0];
	return selectedTool.value?.type || '';
});

const searchQuery = ref('');
const maxVisible = ref(CHUNK);
const isFocused = ref(false);
let loadingMore = false;

const allFilteredBySearch = computed(() => {
	const all = observatoryTools.value ?? [];
	const q = (searchQuery.value || '').trim().toLowerCase();
	if (!q) return all;
	return all.filter((opt) => {
		const label = (opt.label ?? opt.name ?? '').toString().toLowerCase();
		const type = (opt.type ?? '').toString().toLowerCase();
		return label.includes(q) || type.includes(q);
	});
});

const filteredVisibleOptions = computed(() => {
	return allFilteredBySearch.value.slice(0, maxVisible.value);
});
const toolItemsWithTypes = computed(() =>
	filteredVisibleOptions.value.map((tool) => ({
		label: getToolLabel(tool),
		types: getToolTypes(tool),
	}))
);
const getToolTypes = (tool: ObservatoryToolOption) => {
	const types = tool.types?.length ? tool.types : tool.type ? [tool.type] : [];
	return types.filter((type) => type && type !== 'undefined');
};

// Carga inicial
onMounted(async () => {
	await observatoryStore.getObservatoryToolsNameTypeSources();
});

// Infinite scroll
let menuElement: HTMLElement | null = null;
let observer: MutationObserver | null = null;
let scrollHandler: ((e: Event) => void) | null = null;

const selectorsToTry = [
	'.u-input-menu-panel',
	'.u-input-menu__panel',
	'.u-input-menu-panel__wrapper',
	'.u-select__menu',
	'.u-menu-panel',
	'[role="listbox"]',
	'[role="menu"]',
];

const findExistingPanel = (): HTMLElement | null => {
	for (const sel of selectorsToTry) {
		const el = document.querySelector(sel) as HTMLElement | null;
		if (el) return el;
	}
	return document.querySelector('div[role="listbox"], div[role="menu"]') as HTMLElement | null;
};

const attachScrollToMenu = (el: HTMLElement) => {
	if (!el) return;
	detachScrollFromMenu();

	scrollHandler = () => {
		if (loadingMore) return;
		if (!el) return;
		const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 60;
		if (nearBottom) {
			const total = allFilteredBySearch.value.length;
			if (maxVisible.value >= total) return;
			loadingMore = true;
			maxVisible.value = Math.min(total, maxVisible.value + CHUNK);
			setTimeout(() => {
				loadingMore = false;
			}, COOLDOWN_MS);
		}
	};

	el.addEventListener('scroll', scrollHandler, { passive: true });
	menuElement = el;
};

const detachScrollFromMenu = () => {
	if (menuElement && scrollHandler) {
		menuElement.removeEventListener('scroll', scrollHandler);
	}
	menuElement = null;
	scrollHandler = null;
};

const startObservingForPanel = () => {
	if (observer) return;
	observer = new MutationObserver((mutations) => {
		for (const m of mutations) {
			for (const n of Array.from(m.addedNodes)) {
				if (!(n instanceof HTMLElement)) continue;
				if (n.matches && selectorsToTry.some((s) => n.matches?.(s))) {
					nextTick(() => attachScrollToMenu(n as HTMLElement));
					return;
				}
				if (
					n.querySelector &&
					n.querySelector(
						'[role="listbox"], [role="menu"], .u-input-menu__panel, .u-input-menu-panel'
					)
				) {
					const panel =
						(n.querySelector('[role="listbox"]') as HTMLElement) ||
						(n.querySelector('.u-input-menu__panel') as HTMLElement) ||
						(n as HTMLElement);
					if (panel) {
						nextTick(() => attachScrollToMenu(panel));
						return;
					}
				}
			}
		}
	});
	observer.observe(document.body, { childList: true, subtree: true });
};

// Focus & Blur
const onFocus = async () => {
	isFocused.value = true;
	await nextTick();
	const existing = findExistingPanel();
	if (existing) attachScrollToMenu(existing);
	startObservingForPanel();
	await nextTick();
};
const handleClose = () => {
	isFocused.value = false;
};

const handleMenuOpen = (open: boolean) => {
	if (!open) handleClose();
};

watch(searchQuery, () => {
	maxVisible.value = CHUNK;
});

// ------------------ Navegación / UI helpers ------------------
const goBack = () => stepperStore.goBack(1);
const submitObservatoryTool = async () => {
	if (!selectedTool.value || isSubmitting.value) return;
	isSubmitting.value = true;
	loadError.value = '';
	metadataStore.updateLoadedMetadata(false);

	const payload = {
		name: selectedToolLabel.value,
		// Siguiente cambio.
		// Despues tendre que eliminar esta linea porque el endpoint solo recibira el name.
		type: selectedToolType.value,
	};

	try {
		await observatoryStore.fetchToolMetadata(payload);
		if (metadataStore.getLoadedMetadata) {
			stepperStore.completeStep(1);
		} else {
			loadError.value =
				'Unable to load metadata for this software. Please try again or select another source.';
		}
	} finally {
		isSubmitting.value = false;
	}
};

// Dynamic classes
const labelClasses = computed(() => {
	const base = 'absolute left-9 transition-all bg-white dark:bg-gray-900 px-1 z-10';

	if (isFocused.value) {
		return [base, 'top-2 text-sm text-primaryOeb-600 transform scale-75 -translate-y-5'];
	} else if (selectedTool.value) {
		return [base, 'top-2 text-sm text-gray-500 transform scale-75 -translate-y-5'];
	} else {
		return [base, 'top-3 text-base text-gray-500 scale-100'];
	}
});

const iconClass = computed(() => [
	'text-gray-500 transition-colors',
	{ 'text-primaryOeb-500': isFocused.value },
]);
</script>

<style>
.clearButton {
	position: absolute;
	transform: translateX(-80px);
}

.u-input-menu input {
	caret-color: black; /* cursor visible */
}
</style>
