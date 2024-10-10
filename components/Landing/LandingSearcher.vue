<template>
  <div class="landing-searcher">
    <div class="container">
      <UInput
        v-model="searchValue"
        name="searchValue"
        placeholder="Search for individual tools."
        autocomplete="off"
        size="xl"
        :ui="{ icon: { trailing: { pointer: '' }, leading: { pointer: '' } } }"
        @keydown.enter="handleSubmit"
      >
        <!-- Prepend slot for the left icon (Magnifying glass) -->
        <template #leading>
          <UButton
            class="left-icon"
            color="gray"
            variant="link"
            icon="i-heroicons-magnifying-glass-20-solid"
            :padded="false"
            @click="handleSubmit"
          />
        </template>

        <!-- Trailing slot for the right icon (Clear button) -->
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
import { ref } from "vue";
import { useRouter } from "nuxt/app";

const searchValue = ref("");
const router = useRouter();

function handleSubmit() {
  if (searchValue.value.trim() !== "") {
    router.push({
      path: "/tool",
      query: { search: searchValue.value },
    });
  }
}
</script>

<style lang="scss" scoped>
.landing-searcher {
  background-color: #0b579f;
  padding: 30px 0px;
}

.left-icon {
  margin-right: 8px; /* Adjust spacing as needed */
  cursor: pointer; /* Ensure the icon shows as clickable */
}
</style>
