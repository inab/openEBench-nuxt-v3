<template>
    <div class="landing-searcher">
        <div class="container">
            <UInput
                v-model="searchValue"
                name="searchValue"
                placeholder="Search for individual tools."
                icon="i-heroicons-magnifying-glass-20-solid"
                autocomplete="off"
                size="xl"
                :ui="{ icon: { trailing: { pointer: '' } } }"
            >
                <template #trailing>
                <UButton
                    v-show="searchValue !== ''"
                    color="gray"
                    variant="link"
                    icon="i-heroicons-x-mark-20-solid"
                    :padded="false"
                    @click="searchValue = ''"
                />
                </template>
            </UInput>
        </div>
    </div>

</template>
<script setup lang="ts">
import { ref } from 'vue'

let searchValue = ref('')

</script>

<style lang="scss" scoped>
    .landing-searcher {
        background-color: #0b579f;
        padding: 30px 0px;
    }
</style>