<template>
  <div>
    <p>Plot</p>
    <div>
      <div id="plot"></div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Plotly from 'plotly.js-dist';

// prueba plotly
onMounted(() => {
  const data = [
    {
      x: ['giraffes', 'orangutans', 'monkeys'],
      y: [20, 14, 23],
      type: 'bar'
    }
  ];
  Plotly.newPlot('plot', data);
});


</script>