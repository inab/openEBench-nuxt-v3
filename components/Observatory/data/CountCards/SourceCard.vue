<template>
  <div class="card rounded pr-3 pt-2 pl-3 pb-1">
    <div class="items-center">
      <div class="grid-cols-4">
        <UAvatar
          :src="getImagePath(label)"
          alt="Avatar"
          class="avatar"
        />
      </div>
      <div id="counts-text" class="grid-cols-8">
        <span><h3> {{ title }}</h3></span>
        <span><h2> {{ formatNumber(Number(count)) }}</h2></span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

// PROPS
const props = defineProps<{
  title: string,
  count: number,
  label: string,
}>();

function formatNumber(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Función para obtener la imagen correcta desde el path
function getImagePath(label: string): string {
  return new URL(`/images/observatory/${label}-logo.svg`, import.meta.url).href
}
</script>

<style scoped>
#counts-text {
	text-align: right !important;
}

.avatar {
	width: 85%;
}

.card {
	min-height: 4.5rem;
	width: 100%;
	min-width: 8em;
	display: inline-block;
}

.card h3 {
	font-family: 'Open Sans', sans-serif;
	font-size: 0.9rem;
	font-weight: 300;
	line-height: normal;
	margin: 0.2rem;
}

.card h2 {
	font-family: 'Open Sans', sans-serif;
	font-size: 1rem;
	font-weight: 500;
	line-height: normal;
	margin: 0.3rem;
}
</style>