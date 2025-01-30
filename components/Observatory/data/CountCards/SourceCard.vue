<template>
  <div class="source-card row rounded p-2">
    <div class="col col-4">
      <UAvatar
        :src="`/images/observatory/${label}-logo.svg`"
        alt="Avatar" size="lg"
        class="avatar"
      />
    </div>
    <div id="counts-text" class="col col-8">
      <h3> {{ title }}</h3>
      <h2> {{ formatNumber(Number(count)) }}</h2>
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

</script>

<style scoped>
#counts-text {
	text-align: right !important;
  padding: 0px 0px 0px 0px !important;
}

.avatar {
  background-color: #001752f8
}

.source-card {
  background-color: white;
}

.source-card h3 {
	font-family: 'Open Sans', sans-serif;
	font-size: 0.9rem;
	font-weight: 300;
	line-height: normal;
	margin: 0.2rem;
}

.source-card h2 {
	font-family: 'Open Sans', sans-serif;
	font-size: 1.5rem;
	font-weight: 500;
	line-height: normal;
	margin: 0.3rem;
}
</style>