<template>
	<div class="landing-searcher">
		<div class="container">
			<UInput
				v-model="searchValue"
				name="searchValue"
				placeholder="Search for individual tools"
				autocomplete="off"
				size="xl"
				icon="i-heroicons-magnifying-glass-20-solid"
				class="search-input"
				:ui="{
					base: 'bg-white text-gray-900 shadow-none',
					leadingIcon: 'size-6 text-gray-400',
					trailing: 'pe-3',
				}"
				@keydown.enter="handleSubmit"
			>
				<template #trailing>
					<UButton
						v-show="searchValue !== ''"
						color="neutral"
						variant="link"
						icon="i-heroicons-x-mark-20-solid"
						aria-label="Clear search"
						class="text-gray-400!"
						@click="searchValue = ''"
					/>
				</template>
			</UInput>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const searchValue = ref('');
const router = useRouter();

function handleSubmit() {
	if (searchValue.value.trim() !== '') {
		router.push({
			path: '/tool',
			query: { search: searchValue.value },
		});
	}
}
</script>

<style lang="scss" scoped>
.landing-searcher {
	background-color: #0b579f;
	padding: 30px 0;
}

.search-input {
	width: 100%;
}

@layer bootstrap {
	.search-input :deep(input[data-slot='base']) {
		padding-inline-start: 3.5rem !important;
	}
}
</style>
