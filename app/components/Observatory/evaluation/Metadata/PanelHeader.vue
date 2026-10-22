<template>
	<div v-if="visible_ticks" class="inline-flex shrink-0 items-center gap-1">
		<HeaderAvatar
			v-for="(item, index) in fields"
			:key="index"
			:field="item"
			:field_name="field_names[index] as string"
		/>
	</div>
</template>

<script setup lang="ts">
import HeaderAvatar from '@/components/Observatory/evaluation/Metadata/HeaderAvatar.vue';

// PROPS
defineProps<{
	fields: string[];
	field_names: string[];
	visible_ticks: boolean;
}>();
</script>
<style scoped></style>
