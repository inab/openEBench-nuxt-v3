<template>
  <div class="container px-5">
    <UAccordion :items="items" :ui="{ wrapper: 'flex flex-col w-full' }">
      <template #default="{ item, index, open }">
        <UButton
          color="gray"
          variant="ghost"
          class="border-b border-gray-200 dark:border-gray-700"
          :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }"
        >
          <template #leading>
            <div class="w-6 h-6 rounded-full bg-primary-500 dark:bg-primary-400 flex items-center justify-center -my-1">
              <UIcon :name="item.icon" class="w-4 h-4 text-white dark:text-gray-900" />
            </div>
          </template>

          <span class="truncate">{{ item.label }}</span>

          <template #trailing>
            <!-- Contenedor para los iconos alineados -->
            <div class="flex items-center ms-auto space-x-2">
              <!-- Iconos de PanelHeader -->
              <PanelHeader />
              <!-- Chevron Icon -->
              <UIcon
                name="i-heroicons-chevron-right-20-solid"
                class="w-5 h-5 transform transition-transform duration-200"
                :class="[open && 'rotate-90']"
              />
            </div>
          </template>
        </UButton>
      </template>
    </UAccordion>

    <h2>jdghfg</h2>
  </div>
</template>

<script setup lang="ts">
import PanelHeader from "./PanelHeader.vue";

const items = [
  { label: "0. Identity" },
  { label: "1. Accessibility / License" },
  { label: "2. Documentation" },
  { label: "3. Test data" },
  { label: "4. Interoperability" },
  { label: "5. Versioning" },
  { label: "6. Reproducibility" },
  { label: "7. Recognition" },
];
</script>
<style scoped></style>
