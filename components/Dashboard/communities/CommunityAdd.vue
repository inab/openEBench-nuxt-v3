<template>
    <div class="dashboard-community-add">
        <div class="w-100 container">
            <div class="dashboard-community-add__title">
                <h2>Add Community</h2>
            </div>
            <div class="dashboard-community-add__content">
                {{ communityObj }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Community } from "@/types/communities";

const props = defineProps<{
    communityObj: Community;
}>();
</script>