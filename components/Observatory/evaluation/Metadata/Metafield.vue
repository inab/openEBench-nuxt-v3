<template>
  <div class="container ms-3 ">
    <div :col="n_cols">
      <div class="d-flex">
        <HeaderAvatar
          :field="field"
          :field_name="title"
          :disabled_tooltip="true"
        />

        <span id="title" class="text-body">
          {{ title }}
        </span>

        <button
          v-if="increasable"
          class="btn btn-icon btn-light ms-2"
          @click="addEntry(valueType)" 
        >
          <UIcon
            name="i-heroicons-x-circle-20-solid"
            class="mx-2 bg-gray-400"
          />
        </button>
      </div>

      <!-- Slot for inputField -->
      <slot name="inputField" @removeEntry="removeEntry(index, field)"></slot>
    </div>

  </div>
</template>
<script setup lang="ts">
import HeaderAvatar from "@/components/Observatory/evaluation/Metadata/HeaderAvatar.vue"
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';

const metadataStore = useMetadataStore();

// PROPS
const props = defineProps<{
  title: String,
  n_cols: String,
  field: String,
  valueType: String,
  increasable: boolean,
}>();

// Continuar con los metodos addEntry y removeEntry
const addEntry = (addedValue) => {
  // addedvalue is the value of the input field, which is always empty
	// sometimes it is an object, sometimes it is an array
  const payload = {
    field: props.field,
    value: addedValue,
  };
  metadataStore.addEntry(payload);
  this.$forceUpdate();
};

const removeEntry = (index) => {
  const payload = {
    field: props.field,
    index,
  };
  metadataStore.removeEntry(payload);
  this.$forceUpdate();

}

</script>
<style scoped>
#title {
	font-size: 1rem;
	color: #0b579f !important;
}

</style>