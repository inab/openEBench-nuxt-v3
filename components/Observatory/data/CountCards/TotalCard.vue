<template>
  <div class="grid justify-items-center main-row rounded py-2 blue-shadow">
    <UIcon name="i-mdi-database" class="w-8 h-8 bg-white mb-1" />
    <p class="text-center number-text mt-1"> Total </p>
    <p class="text-center number"> {{ formatNumber(Number(count)) }} </p>
  </div>
</template>

<script setup lang="ts">
// PROPS
const props = defineProps<{
  count: number,
}>();

function formatNumber(value:number) {
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
</script>

<style scoped>
.main-row {
  max-width: 80%;
  width: 55%;
  background-color: #001752f8;
}

.blue-shadow {
  box-shadow: 0 0 10px 0 rgba(18, 121, 219, 60%);
  transition: box-shadow 0.3s ease-in-out;
}

.blue-shadow:hover {
  box-shadow: 0 0 20px 0 rgba(18, 121, 219, 80%);
}

.number {
	font-size: 2.1rem;
	color: white !important;
  margin-bottom: 0px;
}

.number-text {
	color: white !important;
	font-family: Roboto, sans-serif;
	font-size: 1.4em;
	font-weight: 600;
	line-height: 1.2em;
	word-break: initial;
  margin-bottom: 0px;
}

.number-highlight {
	font-weight: 700;
}
</style>