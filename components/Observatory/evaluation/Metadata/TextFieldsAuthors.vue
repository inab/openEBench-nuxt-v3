<template>
  <div class="row mx-1 d-flex aling-center">
    <div class="col-3">
      <span>Type</span>
      <USelectMenu
        v-model="modelType"
        :options="types"
        label="Type"
        class="border-1 rounded-md px-0"
        @change="changeValue"
      />
    </div>
    <div class="col-8">
      <span>Name</span>
      <UInput
        v-model="modelName" 
        label="Name"
        class="border-1 rounded-md px-0 text-sm"
        @input="changeValue"
      />
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
          class="p-1.5 mx-3 absolute right-[-55px] top-0.5"
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
  <div class="row mx-1 d-flex aling-center">
    <div class="col-3"></div>
    <div class="col-5">
      <span>Email</span>
      <UInput
        v-model="modelEmail" 
        label="Email"
        :rules="[rules.email]"
        class="border-1 rounded-md px-0 text-sm"
        @input="changeValue"
      />
    </div>
    <div class="co-1"></div>
    <div class="co-2">
      <USelectMenu
        v-model="modelMaintainer"
        :options="types"
        label="Maintainer"
        class="border-1 rounded-md px-0"
        @change="changeValue"
      >
        <template #label>
					<span class="text-body-2 black--text">Maintainer</span>
				</template>
      </USelectMenu>
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
const rules = {
    required: (value) => !!value || 'Required.',
    email: (value) => {
      const pattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i;
      return pattern.test(value) || 'Invalid e-mail.';
    },
}

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

  metadataStore.changeEntry(payload);
};

// Method to emit the ‘remove’ event
const emitRemove = () => {
  emit('remove', props.index);
};

</script>