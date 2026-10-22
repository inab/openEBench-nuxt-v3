<template>
	<div>
		<UTabs :items="items" class="w-full" :default-index="defaultIndex">
			<template #default="{ item, index }">
				<div class="flex items-center gap-2 relative truncate w-full" @click="onTabClick(index)">
					<!-- Render the icon -->
					<i :class="item.icon" class="text-lg"></i>
					<!-- Render the label -->
					<span>{{ item.label }}</span>
				</div>
			</template>
		</UTabs>
	</div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, type PropType } from 'vue';
import type { TabsItem } from '@nuxt/ui';

defineProps({
	items: {
		type: Array as PropType<TabsItem[]>,
		required: true, // Array of tabs passed from the parent
	},
	defaultIndex: {
		type: Number,
		default: 0, // The initial active tab index
	},
});

const emit = defineEmits(['tab-selected']);

function onTabClick(index: number) {
	emit('tab-selected', index); // Notify the parent which tab was clicked
}
</script>
