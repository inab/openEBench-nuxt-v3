<template>
  <div class="flex flex-wrap items-center justify-center">
    <div
      v-for="(indicator, index) in indicators"
      :key="index"
      class="flex flex-col items-start mr-0"
    >
      <div
        class="font-semibold text-sm mb-0 ml-3 mb-1"
        :style="{ color: getColor(index).text }"
      >
        {{ indicator.label }}
      </div>

      <!-- Outer background -->
      <div
        class="w-28 h-6 rounded-full overflow-hidden"
        :style="{ backgroundColor: getColor(index).background }"
      >
        <!-- Inner fill -->
        <div
          class="h-full text-white text-xs font-medium flex items-center justify-sart px-2 rounded-full"
          :style="{
            width: (indicator.score * 100) + '%',
            backgroundColor: getColor(index).fill
          }"
        >
          <span class="ml-1">{{ indicator.score.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  indicators: {
    type: Array,
    required: true,
    validator: (arr) => arr.length >= 2 && arr.length <= 4
  }
})

// Index-based color map
const getColor = (index) => {
  const colorMap = [
    {
      text: '#5E9BE1',
      fill: '#5E9BE1',
      background: '#d0e3f7'
    },
    {
      text: '#f5b145',
      fill: '#f5b145',
      background: '#faecd7'
    },
    {
      text: '#289c84',
      fill: '#289c84',
      background: '#c8e6df'
    },
    {
      text: 'text-purple-600',
      bg: 'bg-purple-400',
      bgLight: 'bg-purple-100'
    }
  ]
  return colorMap[index] || {
    text: 'text-gray-600',
    bg: 'bg-gray-400',
    bgLight: 'bg-gray-100'
  }
}
</script>