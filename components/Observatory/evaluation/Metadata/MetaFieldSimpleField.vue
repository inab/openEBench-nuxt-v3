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
      <FormField
				:id="item.id"
				:item="item.term"
				:index="index"
				:field="field"
				:label="label"
				class="mt-2 ml-3"
				@remove="removeEntry(index)"
			/>
    </div>

  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import HeaderAvatar from "@/components/Observatory/evaluation/Metadata/HeaderAvatar.vue"
import FormField from './FormField.vue';
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';

const metadataStore = useMetadataStore();
// PROPS
const props = withDefaults(defineProps<{
  title: any;  // Cambié `Array` por `any` ya que `item` parece ser un objeto
  n_cols: string;
  field: string;
  valueType: string;
  label?: string;
  value: any;
  increasable?: boolean;
}>(), {
  increasable: true,
});

const model = ref('');


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