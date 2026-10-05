<template>
  <div class="landing-searcher">
    <div class="container">
      <UInput v-model="searchValue" name="searchValue" placeholder="Search for individual tools" autocomplete="off"
        size="xl" class="search-input" :ui="{
          base: 'bg-white text-gray-900 shadow-none ps-12',
          leading: 'ps-4',
          trailing: 'pe-3'
        }" @keydown.enter="handleSubmit">
        <template #leading>
          <UIcon name="i-heroicons-magnifying-glass-20-solid" class="size-6 text-gray-400" />
        </template>

        <template #trailing>
          <UButton v-show="searchValue !== ''" color="neutral" variant="link" icon="i-heroicons-x-mark-20-solid"
            :padded="false" aria-label="Clear search" class="text-gray-400!" @click="searchValue = ''" />
        </template>
      </UInput>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'nuxt/app'

const searchValue = ref('')
const router = useRouter()

function handleSubmit() {
  if (searchValue.value.trim() !== '') {
    router.push({
      path: '/tool',
      query: { search: searchValue.value },
    })
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

.left-icon {
  cursor: pointer;
  color: #6b7280;
}
</style>