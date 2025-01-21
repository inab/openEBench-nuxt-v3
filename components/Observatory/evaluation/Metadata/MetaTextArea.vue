<template>
  <div class="container ms-3" :class="n_cols">
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
    <div class="mt-1 relative">
      <UTextarea
        v-for="(item, index) in description"
        :key="item.id"
        :value="item.term"
        class=" d-flex border-1 rounded-md p-1"
      >
        <!-- clear description -->
        <button
          v-if="value"
          class="absolute right-1"
          @click="clearLink"
        >
          <UIcon
            name="i-heroicons-x-circle-20-solid"
            class="text-2xl"
          />
        </button>

        <!-- Close Entry -->
        <UButton
          color="gray"
          variant="solid"
          :ui="{ rounded: 'rounded-full' }"
          class="p-1.5 mx-3 absolute right-[-55px] top-0.5"
          @click="closeEntry(index)" 
        >
          <UIcon
            name="i-heroicons-x-circle-20-solid"
            class="bg-gray-400"
          />
        </UButton>
      </UTextarea>

    </div>
  </div>

</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import HeaderAvatar from "@/components/Observatory/evaluation/Metadata/HeaderAvatar.vue"
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';

const metadataStore = useMetadataStore();

// PROPS
const props = defineProps<{
  title: String,
  field: String,
  value: Array,
  n_cols: String,
}>();

const description = ref(props.value);

// Methods
const clearLink = () => {
  description.value = [{}]
};

const closeEntry = (index) => {
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