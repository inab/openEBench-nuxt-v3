<template>
	<UTooltip
		v-if="uri"
		:text="uri"
		:content="{ side: 'bottom', sideOffset: 4 }"
		:delay-duration="0"
		:portal="!attach"
	>
		<a
			:href="uri"
			target="_blank"
			rel="noopener noreferrer"
			class="topic-operation-chip"
			:class="{ 'topic-operation-chip--big': big }"
		>
			<UIcon :name="icon" aria-hidden="true" />
			{{ text }}
		</a>
	</UTooltip>
	<span v-else class="topic-operation-chip" :class="{ 'topic-operation-chip--big': big }">
		<UIcon :name="icon" aria-hidden="true" />
		{{ text }}
	</span>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		uri: string;
		text: string;
		icon?: string;
		big?: boolean;
		attach?: boolean;
	}>(),
	{
		icon: 'i-mdi-label-multiple',
		big: false,
		attach: true,
	}
);
</script>

<style scoped>
.topic-operation-chip {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	margin: 0.25rem 0.25rem 0 0;
	padding: 0.3rem 0.35rem;
	border-radius: 0.25rem;
	background-color: #f1f3f5;
	color: #343a40;
	font-size: 0.8rem;
	line-height: 1.25rem;
	text-decoration: none;
	white-space: nowrap;
}

a.topic-operation-chip:hover {
	background-color: #e2e6ea;
	color: #212529;
}

.topic-operation-chip--big {
	font-size: 0.875rem;
}
</style>
