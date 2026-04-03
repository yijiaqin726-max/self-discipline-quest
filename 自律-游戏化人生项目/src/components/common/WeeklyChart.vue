<script setup>
import { computed } from 'vue'
import { useQuestStore } from '../../stores/questStore'

const data = computed(() => useQuestStore().last7DaysCompletions)
const maxCount = computed(() => Math.max(...data.value.map(d => d.count), 1))

const BAR_W = 28
const GAP = 8
const CHART_H = 60
const TOP = 18
const BOT = 18
const SVG_W = 7 * (BAR_W + GAP) - GAP  // 252
const SVG_H = TOP + CHART_H + BOT       // 96

const bars = computed(() =>
  data.value.map((d, i) => {
    const barH = Math.max(4, Math.round(d.count / maxCount.value * CHART_H))
    const x = i * (BAR_W + GAP)
    const y = TOP + (CHART_H - barH)
    return { ...d, barH, x, y, cx: x + BAR_W / 2, isToday: i === 6 }
  })
)
</script>

<template>
  <div class="chart-wrap">
    <svg
      :viewBox="`0 0 ${SVG_W} ${SVG_H}`"
      :width="SVG_W"
      :height="SVG_H"
      class="bar-chart"
      aria-hidden="true"
    >
      <g v-for="bar in bars" :key="bar.date">
        <!-- bar rect -->
        <rect
          :x="bar.x" :y="bar.y"
          :width="BAR_W" :height="bar.barH"
          :fill="bar.isToday ? 'var(--color-orange)' : 'var(--color-yellow)'"
          stroke="#000" stroke-width="1.5"
          rx="4"
        />
        <!-- count label above bar -->
        <text
          v-if="bar.count > 0"
          :x="bar.cx" :y="bar.y - 4"
          text-anchor="middle"
          font-size="9" font-weight="700" fill="#000"
          font-family="Inter, sans-serif"
        >{{ bar.count }}</text>
        <!-- day label below chart -->
        <text
          :x="bar.cx" :y="TOP + CHART_H + 14"
          text-anchor="middle"
          font-size="9" font-weight="600"
          :fill="bar.isToday ? '#000' : '#888'"
          font-family="Inter, sans-serif"
        >{{ bar.label }}</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.chart-wrap {
  width: 100%;
  overflow-x: auto;
}
.bar-chart {
  display: block;
  max-width: 100%;
}
</style>
