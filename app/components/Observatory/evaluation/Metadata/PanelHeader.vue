<template>
	<div v-if="visibleTicks" class="inline-flex shrink-0 items-center gap-1">
		<HeaderAvatar
			v-for="(item, index) in fields"
			:key="index"
			:field="item"
			:field-name="fieldNames[index] as string"
		/>
	</div>
</template>

<script setup lang="ts">
import HeaderAvatar from '@/components/Observatory/evaluation/Metadata/HeaderAvatar.vue';

// PROPS
defineProps<{
	fields: string[];
	fieldNames: string[];
	visibleTicks: boolean;
}>();
</script>
<style scoped></style>
