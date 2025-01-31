<template>
  <div class="container ms-3">
    <div class="d-flex">
      <HeaderAvatar
        :field="field"
        :field_name="title"
        :disabled_tooltip="true"
      />
      <span class="text-body title">{{ title }}</span>
      <UButton
        color="gray"
        variant="solid"
        :ui="{ rounded: 'rounded-full' }"
        class="p-1.5 mx-2"
        @click="addEntry" 
      >
        <UIcon
          name="i-heroicons-plus-circle-20-solid"
          class="bg-gray-400"
        />
      </UButton>
    </div>
    <!--  -->
    <CategoryAndTextFieldLicense
      v-for="(item, index) in value" :key="item.id"
      :id="item.id"
      :item="item.term"
      :index="index"
      :field="field"
      @remove="removeEntry(index)"
    />

  </div>
</template>
<script setup lang="ts">
import HeaderAvatar from "@/components/Observatory/evaluation/Metadata/HeaderAvatar.vue"
import CategoryAndTextFieldLicense from "./CategoryAndTextFieldLicense.vue"
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';

const metadataStore = useMetadataStore();

// PROPS
const props = defineProps<{
  title: String,
  field: String,
  value: Array,
  increasable: Boolean,
}>();

// Methods
const removeEntry = (index) => {
  const payload = {
    field: props.field,
    index,
  }
  metadataStore.removeEntry(payload);
}
const addEntry = () => {
  // do you want to add the empty value or do you want to add the new value?
  const payload = {
    field: props.field,
    value: '',
  }
  metadataStore.addEntry(payload);
}
</script>
<style scoped>
.title {
	font-size: 1rem !important;
	color: #0b579f !important;
}
</style>