<script setup>
import { computed } from 'vue'
import { CheckCircle2, Clock, Flame, Star } from 'lucide-vue-next'
import { useQuestStore } from '../../stores/questStore'
import { useCalendarStore } from '../../stores/calendarStore'
import { useProfileStore } from '../../stores/profileStore'
import { useStorage } from '../../composables/useStorage'

const questStore = useQuestStore()
const calendarStore = useCalendarStore()
const profileStore = useProfileStore()

const tomatoLog = useStorage('sq_tomatoes', {})
const todayKey = new Date().toISOString().slice(0, 10)

const focusMinutesToday = computed(() => {
  const count = tomatoLog.value[todayKey] ?? 0
  return count * 25
})

const kpis = computed(() => [
  {
    label: '今日完成任务',
    value: questStore.todayTasksDone,
    unit: '个',
    accent: 'var(--color-mint)',
    icon: CheckCircle2
  },
  {
    label: '今日专注时长',
    value: focusMinutesToday.value,
    unit: '分钟',
    accent: 'var(--color-orange)',
    icon: Clock
  },
  {
    label: '连续打卡',
    value: calendarStore.currentStreak,
    unit: '天',
    accent: 'var(--color-sky)',
    icon: Flame
  },
  {
    label: `总经验值 · Lv.${profileStore.level}`,
    value: profileStore.profile.totalXP,
    unit: 'XP',
    accent: 'var(--color-yellow)',
    icon: Star
  },
])
</script>

<template>
  <div class="kpi-bar">
    <div v-for="kpi in kpis" :key="kpi.label" class="kpi-tile">
      <span class="kpi-num" :style="{ background: kpi.accent }">{{ kpi.value }}</span>
      <div class="kpi-meta">
        <span class="kpi-unit">{{ kpi.unit }}</span>
        <span class="kpi-label">{{ kpi.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kpi-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 14px 24px;
  background: #fff;
  border-bottom: 3px solid #000;
  flex-shrink: 0;
}

.kpi-tile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border: 2px solid #000;
  border-radius: var(--radius);
  box-shadow: 2px 2px 0 #000;
  background: #fff;
}

.kpi-num {
  font-size: 1.5rem;
  font-weight: var(--fw-black);
  color: #000;
  padding: 4px 10px;
  border: 2px solid #000;
  border-radius: 8px;
  line-height: 1.2;
  white-space: nowrap;
  min-width: 2.8rem;
  text-align: center;
}

.kpi-meta {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.kpi-unit {
  font-size: 0.68rem;
  font-weight: var(--fw-bold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.kpi-label {
  font-size: 0.8rem;
  font-weight: var(--fw-bold);
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 900px) {
  .kpi-bar { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 500px) {
  .kpi-bar { padding: 12px 16px; gap: 8px; }
  .kpi-num { font-size: 1.2rem; }
}
</style>
