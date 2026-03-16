<script setup>
import { ref, computed } from 'vue'
import { useCalendarStore } from '../stores/calendarStore'

const store = useCalendarStore()

// ── 当前浏览月份 ──────────────────────────────────────────
const today = new Date()
const viewYear  = ref(today.getFullYear())
const viewMonth = ref(today.getMonth() + 1) // 1-12

const monthLabel = computed(() => {
  const d = new Date(viewYear.value, viewMonth.value - 1)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
})

function prevMonth() {
  if (viewMonth.value === 1) { viewMonth.value = 12; viewYear.value-- }
  else viewMonth.value--
}
function nextMonth() {
  if (viewMonth.value === 12) { viewMonth.value = 1; viewYear.value++ }
  else viewMonth.value++
}
function goToday() {
  viewYear.value  = today.getFullYear()
  viewMonth.value = today.getMonth() + 1
}

// ── 日历格子计算 ──────────────────────────────────────────
const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六']

const calendarCells = computed(() => {
  const year  = viewYear.value
  const month = viewMonth.value
  const daysInMonth = new Date(year, month, 0).getDate()
  const firstWeekday = new Date(year, month - 1, 1).getDay() // 0=Sun

  const cells = []
  // 前置空格
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  // 日期格子
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
})

const daysInMonth = computed(() => new Date(viewYear.value, viewMonth.value, 0).getDate())

// ── 打卡统计 ──────────────────────────────────────────────
const checkedDays = computed(() =>
  store.getMonthCheckins(viewYear.value, viewMonth.value).length
)

const isToday = (day) =>
  day === today.getDate() &&
  viewMonth.value === today.getMonth() + 1 &&
  viewYear.value  === today.getFullYear()

const isChecked = (day) =>
  store.isCheckedIn(viewYear.value, viewMonth.value, day)

// ── 打卡交互 ──────────────────────────────────────────────
// 确认弹窗
const confirmVisible = ref(false)
const confirmDay     = ref(null)
const confirmAction  = ref('') // 'checkin' | 'cancel'

function onDayClick(day) {
  if (!day) return
  confirmDay.value    = day
  confirmAction.value = isChecked(day) ? 'cancel' : 'checkin'
  confirmVisible.value = true
}

function confirmCheckin() {
  const day = confirmDay.value
  const wasChecked = isChecked(day)
  store.toggleCheckin(viewYear.value, viewMonth.value, day)
  confirmVisible.value = false
  if (!wasChecked) spawnParticles(day)
}

function cancelConfirm() {
  confirmVisible.value = false
}

// ── 清空弹窗 ──────────────────────────────────────────────
const clearVisible = ref(false)

function confirmClear() {
  store.clearMonth(viewYear.value, viewMonth.value)
  clearVisible.value = false
}

// ── 粒子特效 ──────────────────────────────────────────────
const particles = ref([])
let particleId = 0

function spawnParticles(day) {
  // 找到对应 DOM 格子的位置
  const el = document.querySelector(`[data-day="${day}"]`)
  if (!el) return
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top  + rect.height / 2

  const EMOJIS = ['✨', '⭐', '🌟', '💫', '🎉']
  for (let i = 0; i < 8; i++) {
    const id = ++particleId
    const angle = (Math.PI * 2 * i) / 8
    const dist  = 40 + Math.random() * 30
    particles.value.push({
      id,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      x: cx,
      y: cy,
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist
    })
    setTimeout(() => {
      particles.value = particles.value.filter(p => p.id !== id)
    }, 900)
  }
}
</script>

<template>
  <div class="calendar-page">

    <!-- ── 顶部标题栏 ── -->
    <div class="page-header">
      <h1 class="page-title">📅 打卡日历</h1>
      <button class="btn btn-danger btn-sm" @click="clearVisible = true">🗑 清空本月</button>
    </div>

    <!-- ── 统计栏 ── -->
    <div class="stats-bar card">
      <div class="stat-item">
        <span class="stat-num">{{ checkedDays }}</span>
        <span class="stat-label">已打卡天数</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-num">{{ daysInMonth }}</span>
        <span class="stat-label">当月总天数</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-num streak">{{ store.currentStreak }}</span>
        <span class="stat-label">🔥 连续打卡</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-num">{{ daysInMonth > 0 ? Math.round(checkedDays / daysInMonth * 100) : 0 }}%</span>
        <span class="stat-label">完成率</span>
      </div>
    </div>

    <!-- ── 日历主体 ── -->
    <div class="calendar-card card">
      <!-- 月份导航 -->
      <div class="month-nav">
        <button class="nav-btn" @click="prevMonth">‹</button>
        <div class="month-center">
          <span class="month-label">{{ monthLabel }}</span>
          <button
            v-if="viewYear !== today.getFullYear() || viewMonth !== today.getMonth()+1"
            class="today-btn"
            @click="goToday"
          >回到今天</button>
        </div>
        <button class="nav-btn" @click="nextMonth">›</button>
      </div>

      <!-- 星期表头 -->
      <div class="week-header">
        <div
          v-for="w in WEEK_DAYS"
          :key="w"
          class="week-day"
          :class="{ weekend: w === '日' || w === '六' }"
        >{{ w }}</div>
      </div>

      <!-- 日期格子 -->
      <div class="days-grid">
        <div
          v-for="(day, idx) in calendarCells"
          :key="idx"
          class="day-cell"
          :class="{
            empty: !day,
            checked: day && isChecked(day),
            today: day && isToday(day),
            future: day && !isToday(day) && new Date(viewYear, viewMonth-1, day) > today
          }"
          :data-day="day"
          @click="onDayClick(day)"
        >
          <template v-if="day">
            <span class="day-num">{{ day }}</span>
            <span v-if="isChecked(day)" class="check-mark">✓</span>
          </template>
        </div>
      </div>
    </div>

    <!-- ── 打卡确认弹窗 ── -->
    <Transition name="modal">
      <div v-if="confirmVisible" class="modal-overlay" @click.self="cancelConfirm">
        <div class="modal-box">
          <div class="modal-icon">{{ confirmAction === 'checkin' ? '✅' : '↩️' }}</div>
          <h3 class="modal-title">
            {{ confirmAction === 'checkin' ? `${viewMonth}月${confirmDay}日 打卡成功？` : `取消 ${viewMonth}月${confirmDay}日 的打卡？` }}
          </h3>
          <p class="modal-desc">
            {{ confirmAction === 'checkin' ? '今日又迈出了一步，坚持就是胜利！' : '确认取消这天的打卡记录' }}
          </p>
          <div class="modal-actions">
            <button class="btn btn-ghost" @click="cancelConfirm">取消</button>
            <button class="btn btn-primary" @click="confirmCheckin">确认</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── 清空确认弹窗 ── -->
    <Transition name="modal">
      <div v-if="clearVisible" class="modal-overlay" @click.self="clearVisible = false">
        <div class="modal-box">
          <div class="modal-icon">⚠️</div>
          <h3 class="modal-title">清空 {{ monthLabel }} 的打卡记录？</h3>
          <p class="modal-desc">此操作不可恢复，本月 {{ checkedDays }} 条打卡记录将全部删除。</p>
          <div class="modal-actions">
            <button class="btn btn-ghost" @click="clearVisible = false">取消</button>
            <button class="btn btn-danger" @click="confirmClear">确认清空</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── 粒子层 ── -->
    <div class="particles-layer" aria-hidden="true">
      <span
        v-for="p in particles"
        :key="p.id"
        class="particle"
        :style="{
          left: p.x + 'px',
          top:  p.y + 'px',
          '--dx': p.dx + 'px',
          '--dy': p.dy + 'px'
        }"
      >{{ p.emoji }}</span>
    </div>

  </div>
</template>

<style scoped>
.calendar-page {
  padding: 32px;
  max-width: 820px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── 标题行 ── */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.page-title {
  font-family: var(--font-pixel);
  font-size: 0.72rem;
  color: var(--color-gold);
  letter-spacing: 0.1em;
}

/* ── 统计栏 ── */
.stats-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 16px 24px;
  gap: 0;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.stat-num {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-gold);
  line-height: 1;
}
.stat-num.streak {
  color: #ff7043;
}
.stat-label {
  font-size: 0.75rem;
  color: var(--color-text-dim);
}
.stat-divider {
  width: 1px;
  height: 36px;
  background: var(--color-border);
}

/* ── 日历卡片 ── */
.calendar-card {
  padding: 24px;
}

/* 月份导航 */
.month-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.month-center {
  display: flex;
  align-items: center;
  gap: 12px;
}
.month-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}
.nav-btn {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text-dim);
  font-size: 1.2rem;
  width: 34px;
  height: 34px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.nav-btn:hover {
  border-color: var(--color-gold-dim);
  color: var(--color-gold);
}
.today-btn {
  font-size: 0.75rem;
  padding: 3px 10px;
  border-radius: 20px;
  background: rgba(245,166,35,0.1);
  border: 1px solid var(--color-gold-dim);
  color: var(--color-gold);
  cursor: pointer;
  transition: background 0.2s;
}
.today-btn:hover {
  background: rgba(245,166,35,0.2);
}

/* 星期表头 */
.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
}
.week-day {
  text-align: center;
  font-size: 0.78rem;
  color: var(--color-text-dim);
  padding: 6px 0;
}
.week-day.weekend {
  color: var(--color-red);
}

/* 日期格子 */
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  background: var(--color-bg);
  gap: 2px;
}

.day-cell.empty {
  border-color: transparent;
  cursor: default;
  background: transparent;
}

.day-cell:not(.empty):hover {
  border-color: var(--color-gold-dim);
  background: rgba(245,166,35,0.06);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245,166,35,0.1);
}

.day-cell.today {
  border-color: var(--color-gold);
  box-shadow: 0 0 0 1px var(--color-gold-dim);
}

.day-cell.future {
  opacity: 0.4;
  cursor: default;
}
.day-cell.future:hover {
  transform: none;
  box-shadow: none;
  border-color: var(--color-border);
  background: var(--color-bg);
}

/* 已打卡格子 */
.day-cell.checked {
  background: rgba(57, 217, 138, 0.12);
  border-color: var(--color-green);
  box-shadow: 0 0 10px var(--color-green-glow);
  animation: checkedPulse 0.4s ease;
}

@keyframes checkedPulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.08); }
  100% { transform: scale(1); }
}

.day-cell.checked:hover {
  background: rgba(57, 217, 138, 0.2);
  box-shadow: 0 0 16px var(--color-green-glow);
  transform: translateY(-1px);
}

.day-num {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text);
  line-height: 1;
}
.day-cell.checked .day-num {
  color: var(--color-green);
}
.day-cell.today .day-num {
  color: var(--color-gold);
  font-weight: 700;
}

.check-mark {
  font-size: 0.7rem;
  color: var(--color-green);
  font-weight: 700;
  line-height: 1;
}

/* ── 弹窗 ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-box {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 32px;
  max-width: 360px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}

.modal-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.modal-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
}

.modal-desc {
  font-size: 0.85rem;
  color: var(--color-text-dim);
  margin-bottom: 24px;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* 弹窗过渡 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.92);
}

/* ── 粒子层 ── */
.particles-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
}

.particle {
  position: absolute;
  font-size: 1.1rem;
  transform: translate(-50%, -50%);
  animation: particleFly 0.9s ease-out forwards;
}

@keyframes particleFly {
  0%   { opacity: 1; transform: translate(-50%, -50%) translate(0, 0) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(0.4); }
}

/* ── 响应式 ── */
@media (max-width: 600px) {
  .calendar-page { padding: 16px; gap: 14px; }
  .stats-bar { padding: 12px; gap: 0; }
  .stat-num { font-size: 1.2rem; }
  .day-cell { border-radius: 4px; }
  .day-num { font-size: 0.75rem; }
  .check-mark { font-size: 0.6rem; }
  .days-grid { gap: 4px; }
}
</style>
