<template>
  <div class="row me-2 mt-3">
    <div class="col-6">
      <USelectMenu
        v-model="selectLicense"
        :options="SPDXLicenses"
        searchable
        placeholder="License"
        class="border-1 rounded-md px-0 peer focus-within:ring-primaryOeb-500 focus-within:border-primaryOeb-500 focus-within:text-primaryOeb-500"
        @update:model-value="changeValueName"
      >
        <template #selected="{ option }">
          {{ option }}
        </template>
        <template class="mt-2 border-none" #option="{ option }">
          <div class="text-caption ">
            {{ option }}
          </div>
        </template>
      </USelectMenu>
    </div>
    <div class="col-6">
      <UInput
        v-model="URL"
        placeholder="URL"
        :ui="{ base: 'peer' }"
        class="border-1 rounded-md px-0 text-sm focus-within:ring-primaryOeb-500 focus-within:border-primaryOeb-500 focus-within:text-primaryOeb-500"
        @input="changeValue"
      >
        <UButton
          color="gray"
          variant="solid"
          :ui="{ rounded: 'rounded-full' }"
          class="p-1.5 mx-4 absolute right-[-55px] top-0.5"
          @click="emitRemove" 
        >
          <UIcon
            name="i-heroicons-x-circle-20-solid"
            class="bg-gray-400"
          />
        </UButton>
      </UInput>
    </div>
    
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';

const metadataStore = useMetadataStore();
// Define los eventos que el componente puede emitir
const emit = defineEmits(['remove']);

// PROPS
const props = defineProps<{
  field: string,
  item: { name: string; url: string },
  index : number,
  id: string,
}>();

onMounted(()=>{
  findMatchingLicense(selectLicense.value)
})

// Reactive variables
const selectLicense = ref(props.item.name);
const URL = ref(props.item.url);

// Computed property para acceder a las licencias desde la store
const SPDXLicenses = computed(() => metadataStore.getSPDXLicenses);

// Methods
// Method for finding and assigning a matching licence
const findMatchingLicense = async (license: string) => {
  try {
    const response = await metadataStore.GET_URL('api/spdx/SPDXLicenses/match/' + license);
    if (response.match === '') {
      selectLicense.value = license;
    } else {
      selectLicense.value = response.match;
      changeValueName();
    }
  } catch (error) {
    console.error('Error fetching matching license:', error);
  }
};

// Method to change the value and look up the URL associated with the licence
const changeValueName = async () => {
  if (SPDXLicenses.value.includes(selectLicense.value)) {
    try {
      const response = await metadataStore.GET_URL('api/spdx/SPDXLicenses/url/' + selectLicense.value);
      URL.value = response.URL;
    } catch (error) {
      console.error('Error fetching license URL:', error);
    }
  } else {
    URL.value = '';
  }

  changeValue();
};

// Method for updating the value in the store
const changeValue = () => {
  const newValue = {
    id: props.id,
    term: {
      name: selectLicense.value,
      url: URL.value,
    },
  };
  const payload = {
    field: props.field,
    index: props.index,
    value: newValue,
  };
  metadataStore.changeEntry(payload);
};

// Watch to automatically update when props change
// watch(
//   () => props.item,
//   (newItem) => {
//     console.log('Item changed:', newItem);
//     selectLicense.value = newItem.name;
//     URL.value = newItem.url;
//     findMatchingLicense(newItem.name);
//   },
//   { immediate: true }
// );

// Method to emit the ‘remove’ event
const emitRemove = () => {
  emit('remove', props.index);
};
</script>