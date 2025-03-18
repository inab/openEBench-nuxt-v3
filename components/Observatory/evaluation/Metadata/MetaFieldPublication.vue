<template>
  <div class="container ms-3" :class="n_cols">
    <div class="d-flex mb-2">
      <HeaderAvatar
          :field="field"
          :field_name="title"
          :disabled_tooltip="true"
        />
        <span id="title" class="text-body">
          {{ title }}
        </span>

        <UButton
          v-if="increasable"
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

    <div class="row" v-for="(item, index) in value" :key="item.id">
      <div class="col-11">
        <PublicationField
        :id="item.id"
        :item="item.term"
        :index="index"
        :field="field"
        class="mt-2 ml-3"
        />
      </div>
      <div class="col-1">
        <UButton
        color="gray"
        variant="solid"
        :ui="{ rounded: 'rounded-full' }"
        class="p-1.5 top-0.5"
        @click="removeEntry(index)"
        >
          <UIcon
            name="i-heroicons-x-circle-20-solid"
            class="bg-gray-400"
          />
        </UButton>
      </div>
      
    </div>
  </div>

</template>
<script setup lang="ts">
import HeaderAvatar from "@/components/Observatory/evaluation/Metadata/HeaderAvatar.vue"
import PublicationField from './PublicationField.vue';

import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';
const metadataStore = useMetadataStore();

// PROPS
const props = withDefaults(defineProps<{
  title: string,
  field: string;
  n_cols: string;
  value: any;
  increasable?: boolean;
}>(), {
  increasable: true,
});

// Methods
const addEntry = () => {
  const payload = {
    field: props.field,
    value: ''
  }
  metadataStore.addEntry(payload);
}

const removeEntry = (index) => {
  const payload = {
    field: props.field,
    index,
  };
  metadataStore.removeEntry(payload);
}
</script>
<style scoped>
#title {
	font-size: 1rem;
	color: #0b579f;
}
</style>