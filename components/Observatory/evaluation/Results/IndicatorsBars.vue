<template>
  <!-- Full width, single row, no spacing -->
  <div class="w-full overflow-x-visible pl-4 pr-4">
    <div class="flex flex-nowrap items-stretch w-full">
      <div
        v-for="(indicator, index) in indicators"
        :key="index"
        class="shrink-0"
        :style="{ width: normalizedWidths[index] + '%' }"
      >
        <div class="flex flex-col h-full">
          <div
            class="font-semibold text-sm mb-1 ml-3"
            :style="{ color: getColor(index).text }"
          >
            {{ indicator.label }}
          </div>

          <!-- Bar -->
          <div class="relative group h-7 w-full">
          <!-- background bar (still rounded/hidden for the fill only) -->
          <div
            class="w-full h-full rounded-full overflow-hidden"
            :style="{ backgroundColor: getColor(index).background }"
          >
            <div
              class="h-full text-white text-[0.9rem] leading-none font-medium flex items-center px-2 rounded-full"
              :style="{
                width: clampPercent((indicator.score ?? 0) * 100),
                backgroundColor: getColor(index).fill
              }"
            >
              <span class="ml-1">{{ Number(indicator.score ?? 0).toFixed(2) }}</span>
            </div>
          </div>

          <!-- Tooltip OUTSIDE the clipped div -->
          <div
            class="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded px-2 py-1 max-w-sm z-50"
          >
            <div class="font-semibold text-xs">{{ indicator.title }}</div>
            <div class="text-gray-300 text-xs mt-1">{{ indicator.explanation }}</div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Indicator = {
  label: string
  score: number
  title?: string
  explanation?: string
  /** Relative width weight. If omitted, treated as 1. */
  width?: number
}

const props = defineProps<{
  indicators: Indicator[]
}>()

// Normalize widths to sum to 100%
const normalizedWidths = computed(() => {
  const weights = props.indicators.map(i => (i.width && i.width > 0 ? i.width : 1))
  const total = weights.reduce((a, b) => a + b, 0) || 1
  return weights.map(w => (w / total) * 100)
})

// Clamp width string for inner fill
const clampPercent = (pct: number) => {
  const v = Math.max(0, Math.min(100, pct))
  return `${v}%`
}

const getColor = (index: number) => {
  const colorMap = [
    { text: '#5E9BE1', fill: '#5E9BE1', background: '#d0e3f7' },
    { text: '#f5b145', fill: '#f5b145', background: '#faecd7' },
    { text: '#289c84', fill: '#289c84', background: '#c8e6df' },
    { text: '#A26BCF', fill: '#A26BCF', background: '#F0E0FD' }
  ]
  return colorMap[index] || { text: '#4b5563', fill: '#9ca3af', background: '#f3f4f6' }
}
</script>