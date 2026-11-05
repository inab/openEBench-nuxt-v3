<template>
	<div class="source-code-wrapper">
		<p class="source-code-description">
			Repositories where you can browse, clone, or contribute to this tool's source code.
		</p>

		<div
			v-if="mergedRepositories.length"
			class="repo-grid"
			:class="`repo-grid--count-${Math.min(mergedRepositories.length, 3)}`"
		>
			<div v-for="repo in mergedRepositories" :key="repo.url" class="repo-item">
				<span class="repo-badge" :style="badgeStyle(repo.url)">
					{{ repoMeta(repo.url).platform }}
				</span>
				<UTooltip
					:text="repo.url"
					:content="{ side: 'bottom', sideOffset: 6 }"
					:delay-duration="0"
					:ui="{
						content: 'bg-gradient-to-b from-black/50 to-black/70 text-white ring-black/20',
					}"
				>
					<a
						class="repo-link"
						:class="{ 'repo-link--truncated': isLong(repo.url) }"
						:href="repo.url"
						target="_blank"
						rel="noopener noreferrer"
					>
						{{ repo.url }}
						<UIcon name="i-mdi-open-in-new" class="ext-icon" aria-hidden="true" />
					</a>
				</UTooltip>
			</div>
		</div>

		<div v-else class="no-repo">No source code repositories available.</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Repository {
	term?: string | { term?: string; url?: string };
	url?: string;
}

interface RepositoryLink {
	url: string;
}

const SOURCE_CODE_LABEL_KEYS = ['github', 'gitlab', 'bitbucket', 'sourceforge', 'bioconductor'];

const REPO_META = [
	{ match: 'github.com', platform: 'GitHub', badgeBg: '#f0f0f0', badgeColor: '#24292e' },
	{ match: 'gitlab', platform: 'GitLab', badgeBg: '#fff1ea', badgeColor: '#e05a1a' },
	{ match: 'bitbucket.org', platform: 'Bitbucket', badgeBg: '#e6eeff', badgeColor: '#0052cc' },
	{ match: 'sourceforge.net', platform: 'SourceForge', badgeBg: '#fff0e6', badgeColor: '#cc5200' },
	{
		match: 'bioconductor.org',
		platform: 'Bioconductor',
		badgeBg: '#e6f2fb',
		badgeColor: '#1a81c2',
	},
];

const FALLBACK_META = {
	platform: 'Repository',
	badgeBg: '#f0f0f0',
	badgeColor: '#555555',
};
const URL_LONG_THRESHOLD = 45;

const props = withDefaults(
	defineProps<{
		repositories?: Array<string | Repository>;
		sourcesLabels?: Record<string, string>;
	}>(),
	{
		repositories: () => [],
		sourcesLabels: () => ({}),
	}
);

function getUrl(value: string | Repository): string {
	const entry = typeof value === 'string' ? { term: value } : value;
	const term = typeof entry?.term === 'string' ? entry.term : entry?.term?.url || entry?.term?.term;
	const rawUrl = entry?.url || term;
	if (!rawUrl) return '';

	try {
		const parsed = new URL(rawUrl.trim());
		if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return '';
		return parsed.href.replace(/\/$/, '');
	} catch {
		return '';
	}
}

const mergedRepositories = computed(() => {
	const seen = new Set<string>();
	const result: RepositoryLink[] = [];
	const add = (value: string | Repository) => {
		const url = getUrl(typeof value === 'string' ? { term: value } : value);
		if (!url || seen.has(url)) return;
		seen.add(url);
		result.push({ url });
	};

	for (const repo of props.repositories) add(repo);

	for (const key of SOURCE_CODE_LABEL_KEYS) {
		const sourceUrl = Object.entries(props.sourcesLabels).find(
			([label, url]) => label.toLowerCase() === key && typeof url === 'string'
		)?.[1];
		if (sourceUrl) add(sourceUrl);
	}

	return result;
});

function repoMeta(url: string) {
	return REPO_META.find((meta) => url.toLowerCase().includes(meta.match)) || FALLBACK_META;
}

function badgeStyle(url: string) {
	const meta = repoMeta(url);
	return { backgroundColor: meta.badgeBg, color: meta.badgeColor };
}

function isLong(url: string) {
	return url.length > URL_LONG_THRESHOLD;
}
</script>

<style scoped>
.source-code-wrapper {
	width: 100%;
}

.source-code-description {
	margin: 0 0 0.5rem;
}

.repo-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 8px;
	width: 100%;
}

.repo-grid--count-1 {
	grid-template-columns: 1fr;
}

.repo-grid--count-2 {
	grid-template-columns: repeat(2, minmax(0, 1fr));
}

.repo-item {
	display: flex;
	flex-direction: column;
	gap: 8px;
	min-width: 0;
	padding: 10px 12px;
	border-radius: 8px;
	background: #fafafa;
	transition: background-color 0.2s ease;
}

.repo-item:hover {
	background: #f5f5f5;
}

.repo-badge {
	width: fit-content;
	padding: 1px 7px;
	border-radius: 4px;
	font-size: 0.7rem;
	font-weight: 600;
	letter-spacing: 0.02em;
}

.repo-link {
	padding-top: 8px;
	border-top: 1px solid #ececec;
	color: #0b579f;
	font-family: monospace;
	font-size: 0.8rem;
	line-height: 1.4;
	text-decoration: none;
	word-break: break-all;
}

.repo-link--truncated {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	word-break: normal;
}

.repo-link:hover {
	text-decoration: underline;
}

.ext-icon {
	vertical-align: middle;
	color: #9e9e9e;
}

.no-repo {
	color: #9e9e9e;
	font-size: 0.875rem;
}

@media (max-width: 575.98px) {
	.repo-grid {
		grid-template-columns: 1fr;
	}
}
</style>
