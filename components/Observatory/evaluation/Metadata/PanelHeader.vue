<template>
    <UTooltip  text="title" class="text-right rtl:text-left" 
    :ui="{ background: 'bg-black bg-opacity-50', color: 'text-white',
      transition: {enterActiveClass: 'transition ease-out duration-300', leaveActiveClass: 'transition ease-in duration-150',}
    }"
    >
      <UIcon
        name="i-heroicons-check-circle-20-solid"
        class="w-5 h-5 ms-auto bg-gray-500"
        :class="[open && 'bg-green-500']"
      />
    </UTooltip>

    <UTooltip  text="title" class="text-right rtl:text-left" 
    :ui="{ background: 'bg-black bg-opacity-50', color: 'text-white',
      transition: {enterActiveClass: 'transition ease-out duration-300', leaveActiveClass: 'transition ease-in duration-150',}
    }"
    >
      <UIcon
        name="i-heroicons-check-circle-20-solid"
        class="w-5 h-5 ms-auto bg-gray-500"
        :class="[open && 'bg-green-500']"
      />
    </UTooltip>

    <UTooltip  text="title" class="text-right rtl:text-left" 
    :ui="{ background: 'bg-black bg-opacity-50', color: 'text-white',
      transition: {enterActiveClass: 'transition ease-out duration-300', leaveActiveClass: 'transition ease-in duration-150',}
    }"
    >
      <UIcon
        name="i-heroicons-check-circle-20-solid"
        class="w-5 h-5 ms-auto bg-gray-500"
        :class="[open && 'bg-green-500']"
      />
    </UTooltip>

    <UTooltip  text="title" class="text-right rtl:text-left" 
    :ui="{ background: 'bg-black bg-opacity-50', color: 'text-white',
      transition: {enterActiveClass: 'transition ease-out duration-300', leaveActiveClass: 'transition ease-in duration-150',}
    }"
    >
      <UIcon
        name="i-heroicons-check-circle-20-solid"
        class="w-5 h-5 ms-auto bg-gray-500"
        :class="[open && 'bg-green-500']"
      />
    </UTooltip>

</template>
<script setup lang="ts">

// PROPS
const props = defineProps<{
  title: String,
  fields: String,
  field_names: String,
  visible_ticks: boolean,
}>();
</script>
<style scoped>
</style>