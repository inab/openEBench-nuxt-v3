<template>
	<span class="term-chip">
		<span class="term-chip__text">{{ text }}</span>
		<details v-if="vocabulary === 'EDAM'" ref="menu" class="term-chip__menu">
			<summary class="term-chip__menu-toggle" aria-label="EDAM term options">
				<UIcon name="i-mdi-dots-vertical" class="size-4" />
			</summary>
			<div class="term-chip__menu-items">
				<a v-if="edamBrowserUrl" :href="edamBrowserUrl" target="_blank" rel="noopener noreferrer">
					<UIcon name="i-mdi-file-tree" class="size-4" />
					Explore relationships
				</a>
				<a v-if="edamId" :href="edamId" target="_blank" rel="noopener noreferrer">
					<UIcon name="i-mdi-open-in-new" class="size-4" />
					See details in Bioportal
				</a>
			</div>
		</details>
	</span>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';

const props = withDefaults(
	defineProps<{
		text: string;
		edamId?: string;
		vocabulary: string;
	}>(),
	{
		edamId: '',
	}
);

const menu = ref<HTMLDetailsElement | null>(null);

onClickOutside(menu, () => {
	if (menu.value) menu.value.open = false;
});

const edamBrowserUrl = computed(() => {
	if (!props.edamId) return '';

	try {
		const uri = new URL(props.edamId);
		if (uri.protocol !== 'http:' && uri.protocol !== 'https:') return '';

		const id = uri.pathname.split('/').filter(Boolean).at(-1);
		return id ? `https://edamontology.github.io/edam-browser/#${encodeURIComponent(id)}` : '';
	} catch {
		return '';
	}
});
</script>

<style scoped>
.term-chip {
	position: relative;
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	padding: 0.375rem 0.375rem 0.375rem 0.75rem;
	border-radius: 999px;
	background-color: #e0eaf3;
	color: #0b579f;
	font-size: 0.875rem;
	font-weight: 500;
}

.term-chip__menu {
	position: relative;
}

.term-chip__menu-toggle {
	display: inline-flex;
	width: 1.5rem;
	height: 1.5rem;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	cursor: pointer;
	list-style: none;
}

.term-chip__menu-toggle::-webkit-details-marker {
	display: none;
}

.term-chip__menu-toggle:hover,
.term-chip__menu[open] .term-chip__menu-toggle {
	background-color: rgb(11 87 159 / 12%);
}

.term-chip__menu-items {
	position: absolute;
	top: calc(100% + 0.5rem);
	right: 0;
	z-index: 10;
	display: flex;
	min-width: max-content;
	flex-direction: column;
	padding: 0.375rem 0;
	border: 1px solid #dee2e6;
	border-radius: 0.375rem;
	background: #fff;
	box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 12%);
}

.term-chip__menu-items a {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 0.75rem;
	color: #212529;
	font-size: 0.875rem;
	text-decoration: none;
}

.term-chip__menu-items a:hover {
	background-color: #f1f3f5;
}
</style>
