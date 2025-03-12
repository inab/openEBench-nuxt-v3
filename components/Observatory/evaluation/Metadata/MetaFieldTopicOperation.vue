<template>
  <div class="container ms-3" :class="n_cols">
    <div class="d-flex mb-4">
      <HeaderAvatar
          :field="field"
          :field_name="title"
          :disabled_tooltip="true"
        />
        <span id="title" class="text-body">
          {{ title }}
        </span>

        <UButton
          color="gray"
          variant="solid"
          :ui="{ rounded: 'rounded-full' }"
          class="p-1.5 mx-2"
          v-if="increasable"
          @click="addEntry" 
        >
          <UIcon
            name="i-heroicons-plus-circle-20-solid"
            class="bg-gray-400"
          />
        </UButton>
    </div>

    <!--  -->
    <div v-for="(item, index) in value" :key="item.id">
   
      <CategoryAndTextFieldTopic
        :id="item.id"
				:item="item.term"
				:index="index"
				:field="field"
				vocabularyLabel="Vocabulary/Ontology"
				:typeLabel="typeLabel"
				textLabel="Term"
				:acceptedVocabularies="acceptedVocabularies"
				class="mt-2 ml-3"
				@remove="removeEntry(index)"
				@change="changeEntry"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import HeaderAvatar from "@/components/Observatory/evaluation/Metadata/HeaderAvatar.vue"
import CategoryAndTextFieldTopic from './CategoryAndTextFieldTopic.vue';

import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';

const metadataStore = useMetadataStore();

// PROPS
const props = withDefaults(defineProps<{
  title: string;
  field: string;
  value: any[]; 
  n_cols: string;
  increasable?: boolean;
  typeLabel?: string;
  acceptedVocabularies?: string[];
}>(), {
  increasable: true,
  typeLabel: 'topic',
  acceptedVocabularies: () => ['EDAM', 'NA']
});

// Methods
const addEntry = () => {
  const payload = {
    field: props.field,
    value: { term: '', uri: '', vocabulary: 'EDAM',}
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

const changeEntry = (initialPayload) => {
  const payload = {
    field: props.field,
    index: initialPayload.index,
    value: initialPayload.value,
  };
  console.log(payload);

  metadataStore.changeEntry(payload);
}

</script>
<style scoped>
#title {
	font-size: 1rem;
	color: #0b579f !important;
}
</style>