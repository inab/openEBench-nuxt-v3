<template>
  <div class="row mx-1 mt-2 mb-4">
    <div class="col-10">
      <UInput
        v-model="title" 
        placeholder=""
        :ui="{ base: 'peer' }"
        class="border-1 rounded-md px-0 text-sm focus-within:ring-1 focus-within:ring-primaryOeb-500 focus-within:text-primaryOeb-500"
        @input="changeValue"
      >
        <!-- Floating Label -->
        <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-dimmed) text-xs px-1.5 transition-all peer-focus:-top-2.5 
          peer-focus:text-xs peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5"
        >
          <span class="inline-flex bg-white px-1">Title</span>
        </label>
      </UInput>
    </div>
    <div class="col-2 mt">
      <UInput
        v-model="year" 
        placeholder=""
        :ui="{ base: 'peer' }"
        class="border-1 rounded-md px-0 text-sm focus-within:ring-1 focus-within:ring-primaryOeb-500 focus-within:text-primaryOeb-500"
        @input="changeValue"
      >
        <!-- Floating Label -->
        <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-dimmed) text-xs px-1.5 transition-all peer-focus:-top-2.5 
          peer-focus:text-xs peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5"
        >
          <span class="inline-flex bg-white px-1">Year</span>
        </label>
      </UInput>
    </div>
  </div>

  <div class="row mx-1">
    <div class="col-6">
      <UInput
        v-model="doi" 
        placeholder=""
        :ui="{ base: 'peer' }"
        class="border-1 rounded-md px-0 text-sm focus-within:ring-1 focus-within:ring-primaryOeb-500 focus-within:text-primaryOeb-500"
        @input="changeValue"
      >
        <!-- Floating Label -->
        <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-dimmed) text-xs px-1.5 transition-all peer-focus:-top-2.5 
          peer-focus:text-xs peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5"
        >
          <span class="inline-flex bg-white px-1">DOI</span>
        </label>
      </UInput>
    </div>
    <div class="col-3">
      <UInput
        v-model="pmid" 
        placeholder=""
        :ui="{ base: 'peer' }"
        class="border-1 rounded-md px-0 text-sm focus-within:ring-1 focus-within:ring-primaryOeb-500 focus-within:text-primaryOeb-500"
        @input="changeValue"
      >
        <!-- Floating Label -->
        <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-dimmed) text-xs px-1.5 transition-all peer-focus:-top-2.5 
          peer-focus:text-xs peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5"
        >
          <span class="inline-flex bg-white px-1">PMID</span>
        </label>
      </UInput>
    </div>
    <div class="col-3">
      <UInput
        v-model="pmcid" 
        placeholder=""
        :ui="{ base: 'peer' }"
        class="border-1 rounded-md px-0 text-sm focus-within:ring-1 focus-within:ring-primaryOeb-500 focus-within:text-primaryOeb-500"
        @input="changeValue"
      >
        <!-- Floating Label -->
        <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-dimmed) text-xs px-1.5 transition-all peer-focus:-top-2.5 
          peer-focus:text-xs peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5"
        >
          <span class="inline-flex bg-white px-1">PMCID</span>
        </label>
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