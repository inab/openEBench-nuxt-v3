<template>
  <div class="container ms-3 col-12">
    <div class="d-flex">
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

    <div v-for="(item, index) in value" :key="item.id" class="mt-4">
      <TextFieldsAuthors
        :id="item.id"
				:item="item.term"
				:index="index"
				:field="field"
				class="mt-2 ml-3"
				@remove="removeEntry(index)"
      />
    </div>
  </div>

</template>
<script setup lang="ts">
import HeaderAvatar from "@/components/Observatory/evaluation/Metadata/HeaderAvatar.vue"
import TextFieldsAuthors from './TextFieldsAuthors.vue';
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';
const metadataStore = useMetadataStore();

// PROPS
const props = withDefaults(defineProps<{
  title: string,
  field: string;
  value: any;
  increasable?: boolean;
}>(), {
  increasable: true,
  value: () => []
});

// Methods
const addEntry = () => {
  const payload = {
    field: props.field,
    value: {
      name: '',
      email: '',
      type: 'person',
      mantaier: false,
    }
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
