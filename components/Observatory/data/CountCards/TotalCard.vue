<template>
  <div class="flex justify-around main-row rounded shadow-md py-2">
    <div>
      <p class="text-center number-text mt-1"> Total </p>
      <p class="text-center number"> {{ formatNumber(Number(count)) }} </p>
    </div>
  </div>

</template>

<script setup lang="ts">

// PROPS
const props = defineProps<{
  count: number,
}>();

console.log(props.count);

function formatNumber(value:number) {
  console.log(value);

	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
</script>

<style scoped>
.main-row {
  max-width: 80%;
  width: 55%;
  background-color: #001752f8;
}

.number {
	font-size: 2.1rem;
	color: white !important;
  margin-bottom: 0px;
}

.number-text {
	color: white !important;
	font-family: Roboto, sans-serif;
	font-size: 1.3em;
	font-weight: 300;
	line-height: 1em;
	word-break: initial;
  margin-bottom: 0px;
}

.number-highlight {
	font-weight: 700;
}
</style>