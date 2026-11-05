<template>
	<div class="download-wrapper">
		<div
			v-for="[source, items] in Object.entries(groupedDownloads)"
			:key="source"
			class="download-section"
		>
			<div class="section-header">{{ source }}</div>
			<div v-for="url in items" :key="url" class="download-row">
				<a class="download-link" :href="url" :title="url" target="_blank" rel="noopener noreferrer">
					{{ formatFileName(url) }}
				</a>
			</div>
		</div>

		<div v-if="!hasDownloads" class="empty">No downloadable sources available.</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface DownloadEntry {
	term?: string | { term?: string; url?: string };
	url?: string;
}

const props = withDefaults(
	defineProps<{
		packages?: Array<string | DownloadEntry>;
	}>(),
	{
		packages: () => [],
	}
);

function getUrl(value: string | DownloadEntry): string {
	const entry = typeof value === 'string' ? { term: value } : value;
	const term = typeof entry?.term === 'string' ? entry.term : entry?.term?.url || entry?.term?.term;
	const rawUrl = entry?.url || term;
	if (!rawUrl) return '';

	try {
		const parsed = new URL(rawUrl.trim());
		if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return '';
		return parsed.href;
	} catch {
		return '';
	}
}

const downloads = computed(() => props.packages.map(getUrl).filter(Boolean));
const hasDownloads = computed(() => downloads.value.length > 0);

const groupedDownloads = computed(() => {
	const matchesHost = (host: string, domain: string) =>
		host === domain || host.endsWith(`.${domain}`);

	return downloads.value.reduce<Record<string, string[]>>((groups, url) => {
		const host = new URL(url).hostname.toLowerCase();
		let group = host.replace(/^www\./, '') || 'Other';

		if (matchesHost(host, 'bioconductor.org')) group = 'Bioconductor';
		else if (matchesHost(host, 'github.com')) group = 'GitHub';
		else if (matchesHost(host, 'galaxyproject.org')) group = 'Galaxy Project';
		else if (matchesHost(host, 'drive5.com')) group = 'Drive5';

		(groups[group] ||= []).push(url);
		return groups;
	}, {});
});

function formatFileName(url: string) {
	const pathname = new URL(url).pathname;
	const fileName = pathname.split('/').filter(Boolean).at(-1);
	return fileName || url;
}
</script>

<style scoped>
.download-wrapper {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
	gap: 12px;
	width: 100%;
}

.download-section {
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
	width: 100%;
	break-inside: avoid;
}

.section-header {
	width: 100%;
	margin-top: 10px;
	margin-bottom: 4px;
	padding-bottom: 2px;
	border-bottom: 1px solid rgba(0, 0, 0, 8%);
	color: rgba(0, 0, 0, 55%);
	font-size: 0.85rem;
	font-weight: 600;
}

.download-row {
	display: grid;
	grid-template-columns: 1fr auto;
	align-items: center;
	width: 100%;
	padding: 2px 0;
}

.download-row:hover {
	background: rgba(0, 0, 0, 2%);
}

.download-link {
	overflow: hidden;
	color: #0b579f;
	font-size: 0.85rem;
	text-decoration: none;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.download-link:hover {
	text-decoration: underline;
}

.empty {
	padding: 8px;
	color: rgba(0, 0, 0, 45%);
	font-size: 0.9rem;
}
</style>
