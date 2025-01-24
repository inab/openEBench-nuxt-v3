<template>
    <div>
        <UTabs :items="items" class="w-full" :ui="{ list: { tab: { active: 'text-primaryOeb-500' } } }"
            :defaultIndex="defaultIndex">
            <template #default="{ item, index, selected }">
                <div class="flex items-center gap-2 relative truncate w-full" @click="onTabClick(index)">
                    <!-- Render the icon -->
                    <i :class="item.icon" class="text-lg"></i>
                    <!-- Render the label -->
                    <span>{{ item.label }}</span>
                    <!-- Render the active indicator -->
                    <span v-if="selected"
                        class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
                </div>
            </template>
        </UTabs>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps({
    items: {
        type: Array,
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
