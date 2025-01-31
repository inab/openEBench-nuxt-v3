<template>
  <div v-if="visible_ticks">
    <HeaderAvatar
      v-for="(item, index) in fields"
      :key="index"
      :field="item"
      :field_name="field_names[index]"
    />
  </div>
</template>

<script setup lang="ts">
import HeaderAvatar from "@/components/Observatory/evaluation/Metadata/HeaderAvatar.vue"

// PROPS
const props = defineProps<{
  fields: String,
  field_names: String,
  visible_ticks: boolean,
}>();

</script>
<style scoped>
</style>