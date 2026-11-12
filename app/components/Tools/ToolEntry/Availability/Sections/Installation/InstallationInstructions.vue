<template>
	<div v-if="tabs.length" class="installation-instructions">
		<h3 class="title-label">Installation</h3>

		<div
			v-if="tabs.length"
			class="installation-tabs mt-3"
			role="group"
			aria-label="Installation methods"
		>
			<UTabs
				v-model="activeTabId"
				:items="tabs"
				:ui="tabsUi"
				class="w-full"
				value-key="id"
				variant="link"
				:content="false"
			>
				<template #default="{ item }">
					<span class="installation-tab-label" @click="selectTab($event, item.id)">
						{{ item.label }}
					</span>
					<span
						v-if="ripple?.tabId === item.id"
						:key="ripple.key"
						class="installation-tab-ripple"
						aria-hidden="true"
						:style="{
							left: `${ripple.x}px`,
							top: `${ripple.y}px`,
							width: `${ripple.diameter}px`,
							height: `${ripple.diameter}px`,
						}"
						@animationend="clearRipple(ripple.key)"
					/>
				</template>
			</UTabs>

			<Transition name="installation-slide" mode="out-in">
				<div v-if="activeTabId" :key="activeTabId" class="installation-tab-panel my-3 mx-2">
					<BiocondaInstall v-if="activeTabId === 'bioconda'" :name="toolName" />
					<BioconductorInstall v-else-if="activeTabId === 'bioconductor'" :name="toolName" />
					<SourceCode
						v-else-if="activeTabId === 'source'"
						:repositories="tool.repository"
						:sources-labels="sourcesLabels"
					/>
					<DownloadBlock v-else-if="activeTabId === 'download'" :packages="tool.download" />
				</div>
			</Transition>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import BiocondaInstall from './BiocondaInstall.vue';
import BioconductorInstall from './BioconductorInstall.vue';
import DownloadBlock from './DownloadBlock.vue';
import SourceCode from './SourceCode.vue';
import { pickToolName } from '~/utils/toolDescription';
import { useToolEntryStore } from '~~/stores/tool_entry';

interface InstallationLink {
	term?: string | { term?: string; url?: string };
	url?: string;
}

interface InstallationTool {
	preferred_label?: string | string[];
	label?: string | string[];
	name?: string | string[];
	source?: string[];
	sourcesLabels?: Record<string, string>;
	sources_labels?: Record<string, string>;
	repository?: Array<string | InstallationLink>;
	download?: Array<string | InstallationLink>;
}

interface InstallationTab {
	id: 'bioconda' | 'bioconductor' | 'source' | 'download';
	label: string;
}

const toolEntryStore = useToolEntryStore();
const tool = computed(() => toolEntryStore.Tool as InstallationTool);
const toolName = computed(() => pickToolName(tool.value));
const sourcesLabels = computed(() => tool.value?.sourcesLabels || tool.value?.sources_labels || {});
const activeTabId = ref<InstallationTab['id'] | ''>('');
const tabsUi = {
	list: 'w-full flex-wrap gap-1 border-b border-[#dee2e6] p-0',
	trigger:
		'relative isolate flex-1 overflow-hidden rounded-none border-b-2 border-transparent p-0 text-[#495057] data-[state=active]:border-[#0b579f] data-[state=active]:font-semibold data-[state=active]:text-[#0b579f] hover:text-[#0b579f] focus-visible:outline-2 focus-visible:outline-[#0b579f] focus-visible:outline-offset-[-2px]',
	indicator: 'hidden',
	label: 'block w-full',
};
const ripple = ref<{
	tabId: InstallationTab['id'];
	x: number;
	y: number;
	diameter: number;
	key: number;
} | null>(null);
let rippleKey = 0;

function isValidUrl(value: string) {
	try {
		const url = new URL(value.trim());
		return url.protocol === 'https:' || url.protocol === 'http:';
	} catch {
		return false;
	}
}

function linkValue(value: string | InstallationLink): string {
	if (typeof value === 'string') return value;
	if (typeof value.term === 'string') return value.term;
	return value.url || value.term?.url || value.term?.term || '';
}

const hasSourceRepository = computed(
	() =>
		(tool.value?.repository || []).some((repository) => isValidUrl(linkValue(repository))) ||
		Object.entries(sourcesLabels.value).some(
			([key, value]) =>
				['github', 'gitlab', 'bitbucket', 'sourceforge', 'bioconductor'].includes(
					key.toLowerCase()
				) && isValidUrl(value)
		)
);

const hasBioconda = computed(
	() =>
		tool.value?.source?.includes('bioconda_recipes') ||
		Boolean(sourcesLabels.value.bioconda) ||
		Boolean(sourcesLabels.value.bioconda_recipes)
);
const hasBioconductor = computed(
	() => tool.value?.source?.includes('bioconductor') || Boolean(sourcesLabels.value.bioconductor)
);
const hasDownloads = computed(() =>
	(tool.value?.download || []).some((download) => isValidUrl(linkValue(download)))
);

const tabs = computed<InstallationTab[]>(() => {
	const availableTabs: InstallationTab[] = [];

	if (hasBioconda.value) availableTabs.push({ id: 'bioconda', label: 'Bioconda' });
	if (hasBioconductor.value) {
		availableTabs.push({ id: 'bioconductor', label: 'Bioconductor' });
	}
	if (hasSourceRepository.value) availableTabs.push({ id: 'source', label: 'Source code' });
	if (hasDownloads.value) availableTabs.push({ id: 'download', label: 'Downloads' });

	return availableTabs;
});

watch(
	tabs,
	(availableTabs) => {
		if (!availableTabs.some((tab) => tab.id === activeTabId.value)) {
			activeTabId.value = availableTabs[0]?.id || '';
		}
	},
	{ immediate: true }
);

function selectTab(event: MouseEvent, tabId: InstallationTab['id']) {
	const label = event.currentTarget;
	if (!(label instanceof HTMLElement)) return;
	const tab = label.closest('[role="tab"]');
	if (!tab) return;

	const bounds = tab.getBoundingClientRect();
	const x = event.detail === 0 ? bounds.width / 2 : event.clientX - bounds.left;
	const y = event.detail === 0 ? bounds.height / 2 : event.clientY - bounds.top;

	ripple.value = {
		tabId,
		x,
		y,
		diameter: Math.hypot(Math.max(x, bounds.width - x), Math.max(y, bounds.height - y)) * 2,
		key: ++rippleKey,
	};
}

function clearRipple(key: number) {
	if (ripple.value?.key === key) ripple.value = null;
}
</script>

<style scoped>
.installation-instructions {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.title-label {
	margin: 0;
	color: rgba(0, 0, 0, 50%);
	font-size: 1.2rem;
	font-weight: 500;
}

.installation-tab-label {
	display: block;
	position: relative;
	width: 100%;
	padding: 0.5rem 0.875rem;
	z-index: 1;
	text-align: center;
}

.installation-tab-ripple {
	position: absolute;
	z-index: 0;
	border-radius: 50%;
	background: rgb(11 87 159 / 28%);
	pointer-events: none;
	transform: translate(-50%, -50%) scale(0);
	animation: installation-tab-ripple 550ms ease-out forwards;
}

.installation-tab-panel {
	min-width: 0;
}

.installation-slide-enter-active,
.installation-slide-leave-active {
	transition:
		transform 220ms ease,
		opacity 220ms ease;
}

.installation-slide-enter-from {
	transform: translateX(1rem);
	opacity: 0;
}

.installation-slide-leave-to {
	transform: translateX(-1rem);
	opacity: 0;
}

@keyframes installation-tab-ripple {
	to {
		transform: translate(-50%, -50%) scale(1);
		opacity: 0;
	}
}

@media (prefers-reduced-motion: reduce) {
	.installation-tab-ripple {
		animation-duration: 1ms;
	}

	.installation-slide-enter-active,
	.installation-slide-leave-active {
		transition-duration: 1ms;
	}
}
</style>
