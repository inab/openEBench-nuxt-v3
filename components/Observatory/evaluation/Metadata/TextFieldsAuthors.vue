<template>
  <div class="row my-3" >
    <div class="col-3 relative"
      @focusin="isFocusedSelect = true"
      @focusout="isFocusedSelect = false">
      <span class="floatingLabel absolute top-[-10px] bg-white text-xs ms-2 px-1 "
      :class="{ 'text-primaryOeb-500': isFocusedSelect }">
        Type
      </span>
      <USelectMenu
        v-model="modelType"
        :options="types"
        placeholder=""
        class="border rounded-md px-0 w-full peer"
        :class="{ 'border-primaryOeb-500 ring-1 ring-primaryOeb-500': isFocusedSelect }"
        @change="changeValue"
      />
    </div>
    <div class="col-8">
      <UInput
        v-model="modelName" 
        placeholder="" 
        :ui="{ base: 'peer' }"
        class="border-1 rounded-md px-0 text-sm focus-within:ring-1 focus-within:ring-primaryOeb-500 focus-within:text-primaryOeb-500"
        @input="changeValue"
      >
        <!-- Floating Label -->
        <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-dimmed) text-xs px-1.5 transition-all peer-focus:-top-2.5 
          peer-focus:text-xs peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5"
        >
          <span class="inline-flex bg-white px-1">Name</span>
        </label>
      </UInput>
    </div>
    <div class="col-1">
      <UTooltip text="Remove entry" :ui="{
        background: 'bg-black bg-opacity-50', color: 'text-white',
          transition: {
            enterActiveClass: 'transition ease-out duration-300',
            leaveActiveClass: 'transition ease-in duration-150',
          }
        }">
        <UButton
          color="gray"
          variant="solid"
          :ui="{ rounded: 'rounded-full' }"
          class="p-1.5 mx-3"
          @click="emitRemove" 
        >
          <UIcon
            name="i-heroicons-x-circle-20-solid"
            class="bg-gray-400"
          />
        </UButton>
      </UTooltip>
    </div>
  </div>
  <div class="row mb-5">
    <div class="col-3"></div>
    <div class="col-5 mt-2">
      <UInput
        v-model="modelEmail" 
        placeholder=""
        :ui="{ base: 'peer' }"
        class="border-1 rounded-md px-0 text-sm" 
        :class="{
          'border-red-500 ring-red-500': emailErrorMessage, // If error → Red
          ' focus-within:ring-primaryOeb-500 focus-within:border-primaryOeb-500 focus-within:text-primaryOeb-500': !emailErrorMessage // If NO error → Blue
        }"
        @update:modelValue="onEmailChange"
      >
        <!-- Floating Label -->
        <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-dimmed) text-xs px-1.5 transition-all peer-focus:-top-2.5 
          peer-focus:text-xs peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5"
        >
          <span class="inline-flex bg-white px-1" :class="{ 'text-red-500': emailErrorMessage }">Email</span>
        </label>
      </UInput>
    </div>
    <div class="col-2">
      <UCheckbox
        v-model="modelMaintainer"
        size="xl" 
        label="Maintainer"
        color="primary"
        class="mt-3 mx-4 animated-checkbox"
        @change="changeValue"
      />
    </div>
    
  </div>

</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';
const metadataStore = useMetadataStore();

// PROPS
const props = defineProps<{
  item: any,
  field: string,
  index: number,
  id: number,
}>();
// EVENTOS
const emit = defineEmits(['remove']);

// State and logic
const modelName = ref('');
const modelEmail = ref('');
const modelType = ref('');
const modelMaintainer = ref(false);
const types = ['person', 'organization'];
const isFocusedSelect = ref(false);
const emailErrorMessage = ref('');

const validateEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};
const onEmailChange = () => {
  if (!modelEmail.value) {
    emailErrorMessage.value = 'Invalid e-mail.';
  } else if (validateEmail(modelEmail.value)) {
    emailErrorMessage.value = '';
    changeValue();
  } else {
    emailErrorMessage.value = 'Invalid e-mail.';
  }
};


// onMounted
onMounted(() => {
  modelName.value     = props.item.name;
  modelEmail.value    = props.item.email;
  modelType.value     = props.item.type;
  modelMaintainer.value = props.item.maintainer;
});

// Methods
const changeValue = () => {
  const payload = {
    field: props.field,
    index: props.index,
    value: {
      term: {
        name: modelName.value,
        type: modelType.value, // 'person' or 'organization
        email: modelEmail.value,
        mantainer: modelMaintainer.value,
      },
      id: props.id,
    }
  };

  console.log(payload.value.term)

  metadataStore.changeEntry(payload);
};

// Method to emit the ‘remove’ event
const emitRemove = () => {
  emit('remove', props.index);
};

</script>
<style scoped>
.floatingLabel{
  z-index: 1;
  transition: all 0.2s ease-in-out;
}

</style>