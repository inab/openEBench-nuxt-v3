<template>
	<div class="license-table">
		<div v-if="enrichedLicenses.length" role="table" aria-label="Tool licenses">
			<div class="license-table__header" role="row">
				<div role="columnheader"></div>
				<div role="columnheader">OSI approved</div>
				<div role="columnheader">See also</div>
			</div>

			<div
				v-for="(license, index) in enrichedLicenses"
				:key="rowKey(license, index)"
				class="license-table__row"
				role="row"
			>
				<div class="license-table__name" role="cell">
					<a
						v-if="license.reference"
						:href="license.reference"
						target="_blank"
						rel="noopener noreferrer"
						class="license-table__license"
						:class="{ 'license-table__license--grey': !license.isSpdx }"
					>
						{{ license.displayName }}
					</a>
					<span
						v-else
						class="license-table__license license-table__license--plain"
						:class="{ 'license-table__license--grey': !license.isSpdx }"
					>
						{{ license.displayName }}
					</span>
				</div>

				<div class="license-table__osi" role="cell">
					<span v-if="license.loading" class="license-table__muted" aria-live="polite">
						Checking…
					</span>
					<span v-else-if="license.isOsiApproved === true">Yes</span>
					<span v-else-if="license.isOsiApproved === false">No</span>
					<span v-else class="license-table__muted">—</span>
				</div>

				<div class="license-table__see-also" role="cell">
					<a
						v-for="url in license.seeAlso"
						:key="url"
						class="license-table__chip"
						:href="url"
						target="_blank"
						rel="noopener noreferrer"
					>
						{{ extractDomain(url) }}
					</a>
					<span v-if="!license.seeAlso.length" class="license-table__muted">—</span>
				</div>
			</div>
		</div>

		<p v-else class="license-table__muted mb-0">No licensing information available.</p>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useToolEntryStore } from '~~/stores/tool_entry';

interface LicenseEntry {
	id?: string | number;
	term?: {
		name?: string;
		url?: string;
	};
}

interface LicenseTool {
	license?: LicenseEntry[];
}

interface LicenseApiResponse {
	licenseId?: string;
	name?: string;
	reference?: string;
	isOsiApproved?: boolean;
	seeAlso?: string[];
}

interface LicenseData {
	loading: boolean;
	licenseId?: string;
	name?: string;
	reference?: string | null;
	isOsiApproved?: boolean | null;
	isSpdx?: boolean;
	seeAlso?: string[];
}

interface License extends LicenseEntry {
	name: string | null;
	url: string | null;
}

interface EnrichedLicense extends License {
	displayName: string;
	reference: string | null;
	loading: boolean;
	isOsiApproved: boolean | null | undefined;
	isSpdx: boolean;
	seeAlso: string[];
}

const toolEntryStore = useToolEntryStore();
const tool = computed(() => toolEntryStore.Tool as LicenseTool);
const licenseData = ref<Record<string, LicenseData>>({});

let requestController: AbortController | null = null;
let requestId = 0;
let isMounted = false;

const licenses = computed<License[]>(() => {
	const hiddenNames = ['undefined'];

	return (tool.value?.license || [])
		.map((item) => ({
			id: item.id,
			name: item.term?.name?.trim() || null,
			url: item.term?.url?.trim() || null,
		}))
		.filter((license) => license.name || license.url)
		.filter((license) => !license.name || !hiddenNames.includes(license.name.toLowerCase()));
});

const enrichedLicenses = computed<EnrichedLicense[]>(() =>
	licenses.value
		.map((license) => {
			const apiData: LicenseData = licenseData.value[licenseKey(license)] ?? {
				loading: false,
			};

			return {
				...license,
				loading: apiData.loading || false,
				displayName: apiData.name || license.name || 'Unknown license',
				reference: apiData.reference || license.url || null,
				isOsiApproved: apiData.isOsiApproved,
				isSpdx: apiData.isSpdx || false,
				seeAlso: apiData.seeAlso || getFallbackSeeAlso(license),
			};
		})
		.sort((first, second) => {
			const firstHasLink = Boolean(first.reference || first.url);
			const secondHasLink = Boolean(second.reference || second.url);
			return Number(secondHasLink) - Number(firstHasLink);
		})
);

function licenseKey(license: License) {
	return `${license.name || ''}-${license.url || ''}`;
}

function rowKey(license: License, index: number) {
	return license.id ?? `${licenseKey(license)}-${index}`;
}

async function fetchLicensesData() {
	requestController?.abort();
	const controller = new AbortController();
	requestController = controller;
	const currentRequestId = ++requestId;
	const uniqueLicenses = [
		...new Map(licenses.value.map((license) => [licenseKey(license), license])).values(),
	];

	licenseData.value = Object.fromEntries(
		uniqueLicenses.map((license) => [
			licenseKey(license),
			license.name ? { loading: true } : unknownLicenseData(license),
		])
	);

	await Promise.all(
		uniqueLicenses.map(async (license) => {
			const key = licenseKey(license);
			const name = license.name;
			if (!name) return;

			try {
				const response = await $fetch<LicenseApiResponse>(
					`https://observatory.openebench.bsc.es/licenses-mapping/licenses/${encodeURIComponent(name)}`,
					{ signal: controller.signal }
				);

				if (controller.signal.aborted || currentRequestId !== requestId) return;

				if (!response?.licenseId) {
					licenseData.value[key] = unknownLicenseData(license);
					return;
				}

				licenseData.value[key] = {
					loading: false,
					licenseId: response.licenseId,
					isSpdx: true,
					name: response.name || response.licenseId,
					reference: response.reference || license.url,
					isOsiApproved: response.isOsiApproved ?? null,
					seeAlso: Array.isArray(response.seeAlso) ? response.seeAlso : [],
				};
			} catch (error) {
				if (controller.signal.aborted || currentRequestId !== requestId) return;

				console.error(`Unable to retrieve license data for "${name}".`, error);
				licenseData.value[key] = unknownLicenseData(license);
			}
		})
	);
}

function unknownLicenseData(license: License): LicenseData {
	return {
		loading: false,
		isSpdx: false,
		name: license.name || 'Unknown license',
		reference: license.url,
		isOsiApproved: null,
		seeAlso: getFallbackSeeAlso(license),
	};
}

function getFallbackSeeAlso(license: License) {
	return license.url ? [license.url] : [];
}

function extractDomain(url: string) {
	try {
		return new URL(url).hostname.replace(/^www\./, '');
	} catch {
		return url;
	}
}

onMounted(() => {
	isMounted = true;
	void fetchLicensesData();
});

watch(licenses, () => {
	if (isMounted) void fetchLicensesData();
});

onBeforeUnmount(() => {
	isMounted = false;
	requestController?.abort();
});
</script>

<style scoped>
.license-table {
	max-width: 100%;
}

.license-table__header,
.license-table__row {
	display: grid;
	grid-template-columns: minmax(0, 1.5fr) minmax(5.5rem, 0.55fr) minmax(0, 1fr);
	align-items: center;
	column-gap: 1rem;
}

.license-table__header {
	padding: 0.5rem 0.75rem;
	border-bottom: 1px solid #dee2e6;
	color: rgba(0, 0, 0, 55%);
	font-size: 0.875rem;
}

.license-table__row {
	padding: 0.75rem;
	border-bottom: 1px solid #dee2e6;
}

.license-table__name,
.license-table__see-also {
	min-width: 0;
}

.license-table__license {
	display: inline-flex;
	align-items: center;
	max-width: 100%;
	min-height: 2rem;
	padding: 0.375rem 0.75rem;
	border-radius: 0.375rem;
	background-color: #e0eaf3;
	color: #0b579f;
	font-size: 0.875rem;
	font-weight: 600;
	line-height: 1.25;
	text-decoration: none;
	overflow-wrap: anywhere;
}

a.license-table__license:hover {
	background-color: #cbdcec;
	color: #0b579f;
}

.license-table__license--plain {
	background-color: transparent;
}

.license-table__license--grey {
	background-color: #f0f0f0;
	color: rgba(0, 0, 0, 70%);
}

a.license-table__license--grey:hover {
	background-color: #e6e6e6;
	color: rgba(0, 0, 0, 70%);
}

.license-table__osi {
	font-size: 0.875rem;
}

.license-table__see-also {
	display: flex;
	flex-wrap: wrap;
	gap: 0.375rem;
}

.license-table__chip {
	display: inline-flex;
	align-items: center;
	min-height: 1.5rem;
	padding: 0.2rem 0.625rem;
	border-radius: 999px;
	background-color: #f1f3f5;
	color: #343a40;
	font-size: 0.75rem;
	text-decoration: none;
}

.license-table__chip:hover {
	background-color: #e2e6ea;
	color: #212529;
}

.license-table__muted {
	color: rgba(0, 0, 0, 45%);
}

@media (max-width: 575.98px) {
	.license-table__header,
	.license-table__row {
		grid-template-columns: minmax(0, 1fr) minmax(4.5rem, 0.7fr);
		column-gap: 0.75rem;
	}

	.license-table__header {
		display: none;
	}

	.license-table__name {
		grid-column: 1 / -1;
	}

	.license-table__row {
		row-gap: 0.5rem;
	}

	.license-table__row > .license-table__osi::before {
		content: 'OSI approved: ';
		font-size: 0.75rem;
	}

	.license-table__row > .license-table__see-also {
		grid-column: 1 / -1;
	}

	.license-table__row > .license-table__see-also::before {
		content: 'See also: ';
		margin-right: 0.25rem;
		color: rgba(0, 0, 0, 55%);
		font-size: 0.75rem;
	}
}
</style>
