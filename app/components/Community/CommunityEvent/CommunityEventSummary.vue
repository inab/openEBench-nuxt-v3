<template>
	<div v-if="markdownString" class="community-event-summary">
		<!-- eslint-disable-next-line vue/no-v-html -- content sanitized with DOMPurify -->
		<div class="community-event-summary__markup" v-html="markup"></div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { marked } from 'marked';

const props = defineProps<{
	markdown: {
		summary?: string;
	};
}>();

const markdownString: ComputedRef<string | null> = computed(() => props.markdown.summary ?? null);

function convertAnchors(markdown: string): string {
	return markdown.replace(/\(#([\w-]+)\)/g, (match, id: string, offset: number, source: string) =>
		source[offset - 1] === ']' ? match : `<a id="${id}"></a>`
	);
}

function indentBulletHeadingSections(markdown: string): string {
	let sectionHeadingLevel = 0;

	return markdown
		.split('\n')
		.map((line) => {
			const bulletHeading = line.match(/^\s*[*+-]\s+(#{1,6})\s+/);
			const bulletHeadingLevel = bulletHeading?.[1]?.length;
			if (bulletHeadingLevel) {
				sectionHeadingLevel = bulletHeadingLevel;
				return line;
			}

			const heading = line.match(/^(#{1,6})\s+/);
			const headingLevel = heading?.[1]?.length;
			if (headingLevel && headingLevel <= sectionHeadingLevel) {
				sectionHeadingLevel = 0;
				return line;
			}

			if (!sectionHeadingLevel || !line.trim()) {
				return line;
			}

			const indentation = line.match(/^\s*/)?.[0].length ?? 0;
			return indentation >= 4 ? line : `${' '.repeat(4 - indentation)}${line}`;
		})
		.join('\n');
}

const markup = computed(() => {
	const markdown = convertAnchors(markdownString.value ?? '');
	const tokens = marked.lexer(indentBulletHeadingSections(markdown));
	return sanitizeHtml(marked.parser(tokens));
});
</script>

<style lang="scss">
.community-event-summary {
	padding-top: 5px;
	&__markup {
		h1,
		h2,
		h3,
		h4,
		h5,
		h6 {
			margin: 1.5rem 0 0.75rem;
			color: #111827;
			font-weight: 600;
			line-height: 1.25;
		}
		h1 {
			margin-top: 0;
			color: var(--color-primaryOeb-500);
			font-size: 1.75rem;
		}
		h2 {
			font-size: 1.4rem;
		}
		h3 {
			font-size: 1.2rem;
		}
		h4,
		h5,
		h6 {
			font-size: 1rem;
		}
		a {
			color: #0b579f;
			text-decoration: none;
			&:hover {
				text-decoration: underline;
				color: #6a98c4;
			}
		}
		strong {
			font-weight: 600;
		}
		p,
		ul,
		ol {
			margin-bottom: 0.875rem;
			font-size: 0.875rem !important;
			font-weight: 400;
			line-height: 1.5rem;
			letter-spacing: 0.0178571429em !important;
		}
		ul,
		ol {
			padding-left: 1.5rem;
		}
		ul {
			list-style: disc;
		}
		ol {
			list-style: decimal;
		}
		li {
			padding-left: 0.25rem;
		}
		li > p {
			margin: 0.375rem 0;
		}
		li > p:first-child {
			margin-top: 0;
		}
		li > :last-child {
			margin-bottom: 0;
		}
		li > ul,
		li > ol {
			margin: 0.375rem 0;
			padding-left: 1.25rem;
		}
		li + li {
			margin-top: 0.25rem;
		}
		img {
			max-height: 80vh;
			max-width: 100%;
			display: block;
			margin-left: auto;
			margin-right: auto;
		}
		table {
			display: block;
			width: 100%;
			width: max-content;
			max-width: 100%;
			overflow: auto;
			margin-bottom: 30px;
			border: solid 1px #ddeeee;
			border-collapse: collapse;
			border-spacing: 0;
			font-size: 12px;
			tbody td {
				border: 1px solid var(--color-primary-100);
				padding: 10px;
			}
			thead th {
				background-color: var(--color-primary-100);
				border: 1px solid var(--color-primary-100);
				padding: 10px;
			}
		}
	}
}
</style>
