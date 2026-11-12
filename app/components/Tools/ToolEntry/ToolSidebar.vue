<template>
	<div class="sidebar">
		<nav class="tool-sidebar" aria-label="Tool sections">
			<ul class="nav flex-column">
				<li v-for="item in items" :key="item.id" class="nav-item">
					<a
						class="nav-link"
						:class="{ 'nav-link--active': item.id === activeId }"
						:href="`#${item.id}`"
						@click.prevent="scrollToSection(item.id)"
					>
						{{ item.title }}
					</a>
				</li>
			</ul>
		</nav>
	</div>
</template>

<script setup lang="ts">
import type { ToolSection } from '@/utils/toolSections';

defineProps<{
	items: ToolSection[];
	activeId?: string | null;
}>();

function scrollToSection(id: string) {
	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	document.getElementById(id)?.scrollIntoView({
		behavior: reduceMotion ? 'auto' : 'smooth',
		block: 'start',
	});
}
</script>

<style scoped>
.sidebar {
	position: fixed;
	top: var(--tool-sticky-top, 120px);
	left: 12px;
	z-index: 20;
	width: calc(20.833333vw - 24px);
}

.tool-sidebar {
	display: flex;
	justify-content: flex-end; /* alinea el menú al borde derecho de su espacio */
}

.nav {
	width: fit-content; /* el <ul> solo mide lo que necesita su item más ancho */
}

.nav-link {
	display: block;
	width: 100%; /* dentro de ESE ancho, el link ocupa todo (para el fondo) */
	padding: 8px 16px;
	font-size: 1.05rem;
	font-weight: 500;
	text-align: left; /* el texto, a la izquierda dentro del item */
	color: #000000de;
	border-radius: 4px;
	transition:
		background-color 0.15s ease,
		color 0.15s ease;
}

.nav-link:hover,
.nav-link:focus-visible {
	background-color: rgba(11, 87, 159, 0.1);
	color: #000000de;
}

.nav-link--active {
	color: #0b579f;
	background-color: rgba(11, 87, 159, 0.1);
}
</style>
