<template>
    <div>
        <h1 class="text-h4 d-flex text--clickable" @click="expand = !expand">
			{{ community.acronym }}
		</h1>
        <h2 class="subtitle-1 mb-5 text--clickable" @click="expand = !expand">
			{{ community.name }}
		</h2>
    </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    community: any;
    communityReferences: any[];
}>();

const expand = ref(false);
</script>