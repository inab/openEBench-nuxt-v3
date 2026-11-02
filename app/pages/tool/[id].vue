<template>
	<div class="tool-page">
		<BreadcrumbsBar :breadcrumbs-array="routeArray" />

		<ToolBrief
			v-if="hasTool"
			v-show="showToolBrief"
			:name="toolName"
			:type="toolTypes"
			:version="toolVersions"
			:webpage="tool.webpage || []"
			:sources-labels="tool.sourcesLabels || tool.sources_labels || {}"
		/>

		<div class="container-fluid">
			<div class="row">
				<!-- SideBar -->
				<div class="col-12 col-lg-3 d-none d-lg-block">
					<ToolSidebar v-if="hasTool" :items="visibleSections" :active-id="activeSectionId" />
				</div>

				<!-- Content -->
				<div class="col-12 col-lg-7">
					<div v-if="loading">
						<USkeleton class="h-96" />
					</div>

					<div v-else-if="hasTool">
						<div ref="entryIntroRef" class="mb-4">
							<EntryIntro
								:name="toolName"
								:description="toolDescription"
								:type="toolTypes"
								:version="toolVersions"
								:webpage="tool.webpage || []"
								:sources-labels="tool.sourcesLabels || tool.sources_labels || {}"
							/>
						</div>

						<section
							v-for="section in visibleSections"
							:id="section.id"
							:key="section.id"
							class="tool-section card card-body mb-4"
						>
							<h2 class="h4 fw-bold mb-3">
								{{ section.title }}
							</h2>
							<component :is="section.component" />
						</section>
					</div>
				</div>

				<!-- FAIR -->
				<div class="col-12 col-lg-2">
					<FAIRScores v-if="hasTool" :fairsoft="tool.fairsoft" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type Component } from 'vue';
import { navigateTo, createError, showError } from '#app';

import BreadcrumbsBar from '@/components/Common/BreadcrumbsBar.vue';
import EntryIntro from '@/components/Tools/ToolEntry/EntryIntro.vue';
import ToolBrief from '@/components/Tools/ToolEntry/ToolBrief.vue';
import FAIRScores from '@/components/Tools/ToolEntry/FAIR/FAIRScores.vue';
import ToolSidebar from '@/components/Tools/ToolEntry/ToolSidebar.vue';

import DocumentationContent from '@/components/Tools/ToolEntry/Documentation/DocumentationContent.vue';
import AvailabilityContent from '@/components/Tools/ToolEntry/Availability/AvailabilityContent.vue';
import CitationContent from '@/components/Tools/ToolEntry/Citation/CitationContent.vue';
import LicenseContent from '@/components/Tools/ToolEntry/License/LicenseContent.vue';
import SimilarSoftwareContent from '@/components/Tools/ToolEntry/SimilarSoftware/SimilarSoftwareContent.vue';

import { pickToolDescription, pickToolName, plainDescription } from '@/utils/toolDescription';
import type { FairSoft } from '@/utils/fairsoft';
import { buildDocumentationChips } from '@/static/dictionaries/documentationTypes';
import { TOOL_SECTIONS, type ToolSection } from '@/utils/toolSections';
import { useToolEntryStore } from '~~/stores/tool_entry';

interface ToolTerm {
	term?: string;
}

type ToolValue = string | ToolTerm;

interface ToolPageData {
	id?: string;
	_id?: string;
	preferred_label?: string | string[];
	label?: string | string[];
	name?: string | string[];
	preferred_description?: string | string[];
	description?: string | Array<{ term?: string }>;
	type?: ToolValue | ToolValue[];
	version?: ToolValue | ToolValue[];
	webpage?: Array<{ term?: string }>;
	sourcesLabels?: Record<string, string>;
	sources_labels?: Record<string, string>;
	fairsoft?: FairSoft | null;
	documentation?: Array<{
		term?: { type?: string; url?: string; content?: string };
	}>;
	topics?: Array<{ term?: { term?: string } }>;
	operations?: Array<{ term?: { term?: string } }>;
	source?: string[];
	repository?: unknown[];
	download?: unknown[];
	license?: Array<{ term?: { name?: string; url?: string } }>;
}

const route = useRoute();
const toolEntryStore = useToolEntryStore();

const sections = computed(() => TOOL_SECTIONS);
const sectionComponents: Record<ToolSection['id'], Component> = {
	documentation: DocumentationContent,
	availability: AvailabilityContent,
	citation: CitationContent,
	licensing: LicenseContent,
	'similar-software': SimilarSoftwareContent,
};

const activeSectionId = ref<string | null>(null);

const entryIntroRef = ref<HTMLElement | null>(null);
const showToolBrief = ref(false);
const toolContentTop = 140;

let entryIntroObserver: IntersectionObserver | null = null;

const tool = computed(() => toolEntryStore.Tool as ToolPageData);

const loading = computed(() => toolEntryStore.Loading);
const similarTools = computed(() => toolEntryStore.SimilarTools);
const loadingSimilar = computed(() => toolEntryStore.LoadingSimilar);

const toolName = computed(() => pickToolName(tool.value));
const hasTool = computed(() => Boolean(toolName.value));

function getToolTerm(value: ToolValue) {
	if (typeof value === 'string') return value;
	return value.term || '';
}

function getToolValues(value: ToolValue | ToolValue[] | undefined) {
	if (value == null) return [];
	const values = Array.isArray(value) ? value : [value];
	return values.map(getToolTerm).filter(Boolean);
}

const toolTypes = computed(() => getToolValues(tool.value?.type));
const toolVersions = computed(() => getToolValues(tool.value?.version));

const toolDescription = computed(() => {
	const description = pickToolDescription(tool.value);
	if (description) return description;

	const helpContent = tool.value?.documentation?.find((doc) => doc?.term?.type === 'help')?.term
		?.content;

	return plainDescription(helpContent);
});

const routeArray = computed(() => [
	{
		label: 'Tools',
		route: '/tool',
		isActualRoute: false,
	},
	{
		label: toolName.value,
		isActualRoute: true,
	},
]);

const hasAvailability = computed(() => {
	const availableTypes = ['web', 'rest', 'sparql', 'soap', 'workbench', 'suite'];
	const sources = Array.isArray(tool.value?.source) ? tool.value.source : [];

	return (
		toolTypes.value.some((type) => availableTypes.includes(type)) ||
		sources.includes('galaxy') ||
		sources.includes('bioconda_recipes') ||
		sources.includes('bioconductor') ||
		(tool.value?.repository?.length ?? 0) > 0 ||
		(tool.value?.download?.length ?? 0) > 0
	);
});

const hasLicenseInfo = computed(() =>
	(tool.value?.license || []).some((license) => license?.term?.name || license?.term?.url)
);

const hasSimilarSoftware = computed(() => loadingSimilar.value || similarTools.value.length > 0);

const hasDocumentation = computed(() => {
	const documents = buildDocumentationChips(tool.value?.documentation).length > 0;
	const topics = (tool.value?.topics || []).some((entry) => entry?.term?.term);
	const operations = (tool.value?.operations || []).some((entry) => entry?.term?.term);

	return documents || topics || operations;
});

const visibleSections = computed(() =>
	sections.value
		.filter((section) => {
			if (section.id === 'documentation') return hasDocumentation.value;
			if (section.id === 'availability') return hasAvailability.value;
			if (section.id === 'licensing') return hasLicenseInfo.value;
			if (section.id === 'similar-software') return hasSimilarSoftware.value;
			return true;
		})
		.map((section) => ({
			...section,
			component: sectionComponents[section.id],
		}))
);

const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

function getErrorStatus(error: unknown) {
	if (
		error &&
		typeof error === 'object' &&
		'response' in error &&
		error.response &&
		typeof error.response === 'object' &&
		'status' in error.response
	) {
		return Number(error.response.status) || 500;
	}

	return 500;
}

async function loadTool(toolParam: string) {
	if (OBJECT_ID_RE.test(toolParam)) {
		await retrieveToolById(toolParam);
		return;
	}

	const lastDash = toolParam.lastIndexOf('-');
	const tail = lastDash !== -1 ? toolParam.slice(lastDash + 1) : '';

	if (OBJECT_ID_RE.test(tail)) {
		await navigateTo(`/tool/${tail}`, { replace: true });
		return;
	}

	const id = await toolEntryStore.resolveToolId({
		name: toolParam,
		source: 'biotools',
	});

	if (id) {
		await navigateTo(`/tool/${id}`, { replace: true });
		return;
	}

	showError(
		createError({
			statusCode: 404,
			statusMessage: 'Tool not found',
		})
	);
}

async function retrieveToolById(id: string) {
	let found;

	try {
		found = await toolEntryStore.retrieveTool({
			id,
		});
	} catch (e: unknown) {
		showError(
			createError({
				statusCode: getErrorStatus(e),
				statusMessage: 'Unable to load this tool',
			})
		);

		return;
	}

	if (found === false) {
		showError(
			createError({
				statusCode: 404,
				statusMessage: 'Tool not found',
			})
		);
	}
}

watch(
	() => tool.value?.id || tool.value?._id,
	(toolId) => {
		if (toolId) {
			void toolEntryStore.retrieveSimilarTools(toolId);
		}
	},
	{ immediate: true }
);

function setupEntryIntroObserver() {
	if (!entryIntroRef.value) return;

	entryIntroObserver?.disconnect();

	entryIntroObserver = new IntersectionObserver(
		([entry]) => {
			if (!entry) return;
			showToolBrief.value = !entry.isIntersecting;
		},
		{
			root: null,
			rootMargin: `-${toolContentTop}px 0px 0px 0px`,
			threshold: 0,
		}
	);

	entryIntroObserver.observe(entryIntroRef.value);
}

function updateActiveSection() {
	// Tolerancia para el desplazamiento suave y el redondeo de píxeles del navegador.
	const triggerLine = toolContentTop + 8;
	let current: string | null = null;

	for (const section of visibleSections.value) {
		const el = document.getElementById(section.id);

		if (!el) continue;

		if (el.getBoundingClientRect().top <= triggerLine) {
			current = section.id;
		}
	}

	activeSectionId.value = current;
}

onMounted(async () => {
	await loadTool(decodeURIComponent(String(route.params.id)));

	await nextTick();

	setupEntryIntroObserver();
	updateActiveSection();

	window.addEventListener('scroll', updateActiveSection, { passive: true });
});

watch(
	() => route.params.id,
	async (newId) => {
		if (!newId) return;

		showToolBrief.value = false;

		await loadTool(decodeURIComponent(String(newId)));

		await nextTick();

		setupEntryIntroObserver();
		updateActiveSection();
	}
);

onBeforeUnmount(() => {
	window.removeEventListener('scroll', updateActiveSection);

	entryIntroObserver?.disconnect();
	entryIntroObserver = null;
});
</script>

<style scoped>
.tool-layout {
	display: grid;
	grid-template-columns: 1fr;
	gap: 24px;
}

.tool-sidebar {
	min-width: 0;
}

.tool-content {
	min-width: 0;
}

.tool-page {
	--tool-sticky-top: 140px;
}

.tool-section {
	min-height: 200px;
	scroll-margin-top: var(--tool-sticky-top);
}

@media (min-width: 960px) {
	.tool-layout {
		grid-template-columns: 220px minmax(0, 1fr);
		align-items: start;
	}
}
</style>
