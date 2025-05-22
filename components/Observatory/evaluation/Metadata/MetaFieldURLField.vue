<template>
  <div class="container ms-3 mb-3" :class="n_cols">
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
    
    <!-- Iterate through the entries and pass them to URLForm component -->
    <URLForm
      v-for="(entry, index) in localValue"
      :key="entry.id"
      :value="entry.term"
      :index="index"
      :id="entry.id"
      :field="field"
      :label="label"
      @update="updateEntry"
      @remove="removeEntry"
    />

  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import HeaderAvatar from "@/components/Observatory/evaluation/Metadata/HeaderAvatar.vue"
import URLForm from './URLForm.vue';
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';

const metadataStore = useMetadataStore();

// PROPS
const props = defineProps<{
  title: string,
  field: string,
  valueType: Array,
  n_cols: string,
  increasable: Boolean,
  value: Array,
  label: string,
}>();

// Local copy of the value prop
const localValue = ref(JSON.parse(JSON.stringify(props.value)));

// Watch for changes in the `value` prop to keep `localValue` in sync
watch(
  () => props.value,
  (newValue) => {
    localValue.value = JSON.parse(JSON.stringify(newValue));
  },
  { deep: true } // Deep watch if necessary
);

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

const updateEntry = ({ index, value }) => {
  const payload = {
    field: props.field,
    index,
    value,
  };
  localValue.value[index].term = value // Update local value
  metadataStore.changeEntry(payload); // Update Vuex store
}
</script>
<style scoped>
.title {
	font-size: 1rem !important;
	color: #0b579f !important;
}
</style>