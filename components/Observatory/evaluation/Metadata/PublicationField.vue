<template>
  <div class="row mx-1">
    <div class="col-10">
      <UInput
        v-model="title" 
        label="Title"
        class="'border-1 rounded-md px-0 text-sm'"
        @input="changeValue">
      </UInput>
    </div>
    <div class="col-2">
      <UInput
        v-model="year" 
        label="Year"
        class="'border-1 rounded-md px-0 text-sm'"
        @input="changeValue">
      </UInput>
    </div>
  </div>

  <div class="row mx-1">
    <div class="col-4">
      <UInput
        v-model="doi" 
        label="DOI"
        class="'border-1 rounded-md px-0 text-sm'"
        @input="changeValue">
      </UInput>
    </div>
    <div class="col-2">
      <UInput
        v-model="pmid" 
        label="PMID"
        class="'border-1 rounded-md px-0 text-sm'"
        @input="changeValue">
      </UInput>
    </div>
    <div class="col-2">
      <UInput
        v-model="pmcid" 
        label="PMCID"
        class="'border-1 rounded-md px-0 text-sm'"
        @input="changeValue">
      </UInput>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';
const metadataStore = useMetadataStore();

// PROPS
const props = defineProps<{
  item: any,
  id: number,
  field: string;
  index: number
}>()

// State and logic
const title = ref('');
const year = ref(null);
const doi = ref('');
const pmid = ref('');
const pmcid = ref('');

// onMounted
onMounted(() => {
  year.value  = props.item.year;
  title.value = props.item.title;
  doi.value   = props.item.doi;
  pmid.value  = props.item.pmid;
  pmcid.value = props.item.pmcid;
});

// Methods
const checkIfRequired = (field) => {
  if (field === 'DOI') {
    if (doi.value === '' && pmid.value === '' && pmcid.value === '') {
      return 'At least one ID is required';
    } else {
      return true;
    }
  }
  if (field === 'PMID') {
    if (pmid.value === '' && doi.value === '' && pmcid.value === '') {
      return 'At least one ID is required';
    } else {
      return true;
    }
  }

  if (field === 'PMCID') {
    if (pmid.value === '' && doi.value === '' && pmid.value === '') {
      return 'At least one ID is required';
    } else {
      return true;
    }
  }
}

const changeValue = () => {
  const newItem = {
    id: props.id,
    term: {
      title: title.value,
      year: year.value,
      doi: doi.value,
      pmid: pmid.value,
      pmcid: pmcid.value,
    },
  };

  const payload = {
    field: props.field,
    index: props.index,
    value: newItem,
  };
  metadataStore.changeEntry(payload);

};
</script>