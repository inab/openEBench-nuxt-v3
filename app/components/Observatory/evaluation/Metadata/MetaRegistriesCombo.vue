<template>
	<div>
		<div class="d-flex mb-2">
			<HeaderAvatar :field="field" :field_name="title" :disabled_tooltip="true" />
			<span class="text-body title" style="color: #0b579f !important">{{ title }}</span>
		</div>

		<div class="row mt-1 px-3">
			<!-- Registries / Package managers -->
			<div class="border-bottom px-">
				<USelectMenu
					v-model="selectedItem"
					:items="registries"
					multiple
					:ui="{ base: 'peer' }"
					class="border-0 px-0 mx-0 select-menu"
					@update:model-value="changeValue"
				>
					<template #default="{ modelValue }">
						<div class="d-flex flex-wrap gap-x-1 min-height">
							<UBadge
								v-for="(item, index) in modelValue"
								:key="index"
								size="xs"
								variant="solid"
								color="neutral"
								class="py-0.5 my-0.5 bg-gray-200 border-0 ring-transparent rounded-full"
							>
								{{ item }}
								<UButton
									icon="i-heroicons-x-mark"
									size="xxs"
									variant="subtle"
									class="p-0 ms-1 bg-gray-500 text-white rounded-full"
									color="neutral"
									@click.stop="removeItem(item)"
								/>
							</UBadge>
						</div>
					</template>

					<template #item-label="{ item }">
						<div class="flex items-center gap-2">
							<UCheckbox
								v-model="selectedStates[item]"
								:checked="selectedStates[item]"
								class="pointer-events-none me-2"
							/>
							<span>{{ item }}</span>
						</div>
					</template>
				</USelectMenu>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import HeaderAvatar from '@/components/Observatory/evaluation/Metadata/HeaderAvatar.vue';
import { useMetadataStore } from '~~/stores/observatory/evaluation/metadata';

const metadataStore = useMetadataStore();

// PROPS
const props = defineProps<{
	title: string;
	field: string;
	selected: any[];
	registries: any[];
}>();

const selectedItem = ref([...props.selected]);

// Crear un objeto para almacenar el estado de selección de cada opción
const selectedStates = ref<{ [key: string]: boolean }>({});

// Inicializar los estados de selección según las opciones seleccionadas
watch(selectedItem, (newValue) => {
	// Inicializamos los estados de las opciones seleccionadas
	selectedStates.value = newValue.reduce((acc, item) => {
		acc[item] = true; // Marcamos como true las opciones seleccionadas
		return acc;
	}, {});
	changeValue();
});

// Méthods
const changeValue = () => {
	const payload = {
		field: props.field,
		value: selectedItem.value,
	};
	metadataStore.updateSelectorEntry(payload);
};

// Eliminar la opción del estado
const removeItem = (item: string) => {
	selectedItem.value = selectedItem.value.filter((i) => i !== item);
	delete selectedStates.value[item];
	changeValue();
};
</script>

<style scoped>
.title {
	font-size: 1rem !important;
	color: #0b579f !important;
}

.select-menu {
	min-height: 40px;
	display: flex;
	align-items: center;
}

.border-bottom {
	border-bottom: 2px solid !important;
	border-color: #e2e1e1 !important;
}

.border-bottom:hover {
	border-bottom-color: #0b579f !important;
}

.min-height {
	min-height: 24px; /* Asegura que el contenedor tenga altura aunque no haya chips */
	display: flex;
	align-items: center;
}

/* Ocultar el icono de selección por defecto en USelectMenu */
:deep(li[data-headlessui-state='selected'] .iconify),
:deep(li[data-headlessui-state='active selected']:hover .iconify),
:deep(li[data-headlessui-state='selected']:hover .iconify) {
	display: none !important;
}
</style>
