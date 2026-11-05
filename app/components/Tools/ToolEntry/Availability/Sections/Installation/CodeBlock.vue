<template>
	<div class="code-block">
		<pre class="code-block__code">{{ code }}</pre>
		<div
			class="code-block__copy-wrapper"
			@mouseenter="isHovered = true"
			@mouseleave="isHovered = false"
			@focusin="isFocused = true"
			@focusout="isFocused = false"
		>
			<UTooltip
				:text="tooltipMessage"
				:open="tooltipVisible"
				:content="{ side: 'top', sideOffset: 8 }"
				:delay-duration="0"
				:ui="{
					content: 'bg-gradient-to-b from-black/50 to-black/70 text-white ring-black/20',
				}"
			>
				<button
					type="button"
					class="code-block__copy"
					:aria-label="tooltipMessage"
					@click="copyToClipboard"
				>
					<UIcon name="i-oui-copy" aria-hidden="true" />
				</button>
			</UTooltip>
		</div>
		<span class="visually-hidden" aria-live="polite">{{ feedbackMessage }}</span>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';

const props = withDefaults(
	defineProps<{
		code?: string;
	}>(),
	{
		code: '',
	}
);

const isHovered = ref(false);
const isFocused = ref(false);
const feedbackMessage = ref('');
const feedbackVisible = ref(false);
let feedbackTimeout: ReturnType<typeof setTimeout> | undefined;

const tooltipVisible = computed(() => isHovered.value || isFocused.value || feedbackVisible.value);
const tooltipMessage = computed(() => feedbackMessage.value || 'Copy to clipboard');

async function copyToClipboard() {
	try {
		if (!navigator.clipboard) {
			showFeedback('Clipboard is unavailable');
			return;
		}

		await navigator.clipboard.writeText(props.code);
		showFeedback('Copied!');
	} catch {
		showFeedback('Unable to copy');
	}
}

function showFeedback(message: string) {
	if (feedbackTimeout) clearTimeout(feedbackTimeout);
	feedbackMessage.value = message;
	feedbackVisible.value = true;
	feedbackTimeout = setTimeout(() => {
		feedbackVisible.value = false;
		feedbackMessage.value = '';
	}, 2000);
}

onBeforeUnmount(() => {
	if (feedbackTimeout) clearTimeout(feedbackTimeout);
});
</script>

<style scoped>
.code-block {
	display: inline-flex;
	align-items: flex-end;
	justify-content: space-between;
	min-width: 300px;
	max-width: 100%;
	margin: 1rem 0 1rem 1rem;
	padding: 0.75rem;
	border-radius: 6px;
	background-color: #f5f5f5;
	color: #333;
	font-family: 'Courier New', Courier, monospace;
	font-size: 0.875rem;
}

.code-block__code {
	margin: 0;
	white-space: pre-wrap;
	word-break: break-all;
}

.code-block__copy-wrapper {
	position: relative;
	flex: 0 0 auto;
	margin-left: 0.75rem;
}

.code-block__copy {
	padding: 0.25rem;
	border: 0;
	background: transparent;
	color: #000;
	cursor: pointer;
}

.code-block__copy:hover {
	color: #555;
}

.visually-hidden {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}
</style>
