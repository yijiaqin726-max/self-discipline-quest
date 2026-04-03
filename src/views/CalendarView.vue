<script setup>
import { ref, computed } from 'vue'
import { useCalendarStore } from '../stores/calendarStore'

const store = useCalendarStore()

// ── 当前浏览月份 ──────────────────────────────────────────
const today      = new Date()
const viewYear   = ref(today.getFullYear())
const viewMonth  = ref(today.getMonth() + 1)

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

// ── 日历格 ────────────────────────────────────────────────
const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六']

const calendarCells = computed(() => {
  const year  = viewYear.value
  const month = viewMonth.value
  const daysInMonth  = new Date(year, month, 0).getDate()
  const firstWeekday = new Date(year, month - 1, 1).getDay()
  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
})

const daysInMonth = computed(() => new Date(viewYear.value, viewMonth.value, 0).getDate())

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
const confirmVisible = ref(false)
const confirmDay     = ref(null)
const confirmAction  = ref('')

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

// ── 清空 ─────────────────────────────────────────────────
const clearVisible = ref(false)

function confirmClear() {
  store.clearMonth(viewYear.value, viewMonth.value)
  clearVisible.value = false
}

// ── 多日历管理 ────────────────────────────────────────────
const addCalVisible  = ref(false)
const newCalName     = ref('')
const newCalColor    = ref('')
const deleteCalConfirm = ref(false)

function openAddCal() {
  newCalName.value  = ''
  newCalColor.value = ''
  addCalVisible.value = true
}

function confirmAddCal() {
  const name = newCalName.value.trim()
  if (!name) return
  store.addCalendar(name, newCalColor.value || undefined)
  addCalVisible.value = false
}

function confirmDeleteCal() {
  store.deleteCalendar(store.activeCalendarId)
  deleteCalConfirm.value = false
}

// ── 粒子特效 ──────────────────────────────────────────────
const particles = ref([])
let particleId = 0

function spawnParticles(day) {
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
      x: cx, y: cy,
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
  <div class="calendar-page card">
    <!-- ── 标题 ── -->
    <div class="card-header">
      <h3 class="card-title">打卡日历</h3>
      <div class="header-actions">
        <span class="inline-stat">{{ checkedDays }}/{{ daysInMonth }} 天 · {{ daysInMonth > 0 ? Math.round(checkedDays / daysInMonth * 100) : 0 }}%</span>
        <button class="btn btn-danger btn-sm" @click="clearVisible = true">清空</button>
      </div>
    </div>

    <div class="cal-inner">

      <!-- ── 日历 Tab 切换 ── -->
      <div class="cal-tabs">
        <button
          v-for="cal in store.calendars"
          :key="cal.id"
          class="cal-tab"
          :class="{ active: store.activeCalendarId === cal.id }"
          :style="{ '--tab-color': cal.color }"
          @click="store.setActiveCalendar(cal.id)"
        >{{ cal.name }}</button>
        <button class="cal-tab cal-tab-add" @click="openAddCal">＋ 新建</button>
        <button
          v-if="store.calendars.length > 1"
          class="cal-tab cal-tab-del"
          @click="deleteCalConfirm = true"
        >🗑</button>
      </div>

      <!-- ── 日历主体 ── -->
      <div class="calendar-card">
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
          <div v-for="w in WEEK_DAYS" :key="w" class="week-day" :class="{ weekend: w==='日'||w==='六' }">{{ w }}</div>
        </div>

        <!-- 日期格子 -->
        <div class="days-grid">
          <div
            v-for="(day, idx) in calendarCells"
            :key="idx"
            class="day-cell"
            :class="{
              empty:   !day,
              checked: day && isChecked(day),
              today:   day && isToday(day),
              future:  day && !isToday(day) && new Date(viewYear, viewMonth-1, day) > today
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
    </div>

    <!-- ── 打卡确认弹窗 ── -->
    <Transition name="modal">
      <div v-if="confirmVisible" class="modal-overlay" @click.self="confirmVisible = false">
        <div class="modal-box">
          <div class="modal-icon">{{ confirmAction === 'checkin' ? '✅' : '↩️' }}</div>
          <h3 class="modal-title">
            {{ confirmAction === 'checkin' ? `${viewMonth}月${confirmDay}日 打卡！` : `取消 ${viewMonth}月${confirmDay}日？` }}
          </h3>
          <p class="modal-desc">{{ confirmAction === 'checkin' ? '坚持就是胜利！' : '确认取消这天的打卡' }}</p>
          <div class="modal-actions">
            <button class="btn btn-ghost" @click="confirmVisible = false">取消</button>
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
          <h3 class="modal-title">清空 {{ monthLabel }}？</h3>
          <p class="modal-desc">{{ checkedDays }} 条打卡记录将全部删除，不可恢复。</p>
          <div class="modal-actions">
            <button class="btn btn-ghost" @click="clearVisible = false">取消</button>
            <button class="btn btn-danger" @click="confirmClear">确认清空</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── 新建日历弹窗 ── -->
    <Transition name="modal">
      <div v-if="addCalVisible" class="modal-overlay" @click.self="addCalVisible = false">
        <div class="modal-box">
          <h3 class="modal-title">新建日历</h3>
          <div class="form-group">
            <label class="form-label">日历名称</label>
            <input v-model="newCalName" class="form-input" placeholder="例如：健身打卡、学习计划..." maxlength="20" autofocus @keydown.enter="confirmAddCal" />
          </div>
          <div class="form-group">
            <label class="form-label">颜色</label>
            <div class="color-picker">
              <button
                v-for="c in store.PALETTE"
                :key="c"
                class="color-dot"
                :style="{ background: c }"
                :class="{ selected: newCalColor === c }"
                @click="newCalColor = c"
              ></button>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-ghost" @click="addCalVisible = false">取消</button>
            <button class="btn btn-primary" @click="confirmAddCal">创建</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── 删除日历确认 ── -->
    <Transition name="modal">
      <div v-if="deleteCalConfirm" class="modal-overlay" @click.self="deleteCalConfirm = false">
        <div class="modal-box">
          <div class="modal-icon">🗑️</div>
          <h3 class="modal-title">删除「{{ store.activeCalendar?.name }}」？</h3>
          <p class="modal-desc">该日历所有打卡记录将被永久删除。</p>
          <div class="modal-actions">
            <button class="btn btn-ghost" @click="deleteCalConfirm = false">取消</button>
            <button class="btn btn-danger" @click="confirmDeleteCal">确认删除</button>
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
        :style="{ left: p.x+'px', top: p.y+'px', '--dx': p.dx+'px', '--dy': p.dy+'px' }"
      >{{ p.emoji }}</span>
    </div>
  </div>
</template>

<style scoped>
.calendar-page { display: flex; flex-direction: column; gap: 12px; }

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
.card-title { font-size: 0.8rem; font-weight: var(--fw-black); color: var(--color-text-dim); text-transform: uppercase; letter-spacing: 0.06em; }
.header-actions { display: flex; align-items: center; gap: 10px; }
.inline-stat { font-size: 0.78rem; font-weight: var(--fw-bold); color: var(--color-text-dim); }

.cal-inner { display: flex; flex-direction: column; gap: 10px; }

/* ── 日历 Tabs ── */
.cal-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.cal-tab {
  padding: 8px 16px;
  border: 3px solid #000;
  border-radius: 10px;
  background: #fff;
  font-family: var(--font-body);
  font-weight: var(--fw-bold);
  font-size: 0.85rem;
  cursor: pointer;
  box-shadow: 3px 3px 0 #000;
  transition: box-shadow 0.07s, transform 0.07s;
}
.cal-tab:hover {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0 #000;
}
.cal-tab.active {
  background: var(--tab-color, #4DFFA0);
  box-shadow: 1px 1px 0 #000;
  transform: translate(2px, 2px);
}
.cal-tab-add {
  border-style: dashed;
  background: rgba(255,255,255,0.6);
  box-shadow: none;
}
.cal-tab-add:hover {
  background: #fff;
  box-shadow: 2px 2px 0 #000;
  transform: translate(1px, 1px);
}
.cal-tab-del {
  background: var(--color-pink);
  padding: 8px 12px;
}

/* ── 日历卡片 ── */
.calendar-card { padding: 16px; border: 2px solid #000; border-radius: var(--radius); background: #fff; }

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
  font-weight: var(--fw-black);
  color: #000;
}
.nav-btn {
  background: #fff;
  border: 3px solid #000;
  border-radius: 8px;
  font-size: 1.2rem;
  width: 36px; height: 36px;
  cursor: pointer;
  box-shadow: var(--shadow-btn);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.07s, transform 0.07s;
}
.nav-btn:hover { transform: translate(1px,1px); box-shadow: 2px 2px 0 #000; }
.nav-btn:active { transform: translate(3px,3px); box-shadow: none; }

.today-btn {
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 20px;
  background: #000;
  color: #fff;
  border: none;
  cursor: pointer;
  font-weight: var(--fw-bold);
  transition: opacity 0.15s;
}
.today-btn:hover { opacity: 0.8; }

/* 星期表头 */
.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
}
.week-day {
  text-align: center;
  font-size: 0.78rem;
  font-weight: var(--fw-bold);
  color: var(--color-text-dim);
  padding: 6px 0;
}
.week-day.weekend { color: var(--color-red); }

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
  border-radius: 10px;
  border: 2px solid #000;
  cursor: pointer;
  background: #fff;
  gap: 2px;
  transition: transform 0.07s, box-shadow 0.07s;
}
.day-cell.empty {
  border-color: transparent;
  background: transparent;
  cursor: default;
}
.day-cell:not(.empty):not(.future):hover {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0 #000;
}
.day-cell.future {
  opacity: 0.35;
  cursor: default;
}
.day-cell.today {
  background: var(--color-yellow);
  border: 3px solid #000;
  box-shadow: 2px 2px 0 #000;
}
.day-cell.checked {
  background: var(--color-mint);
  border: 3px solid #000;
  box-shadow: 2px 2px 0 #000;
  animation: cellPop 0.3s ease;
}
@keyframes cellPop {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.day-num {
  font-size: 0.85rem;
  font-weight: var(--fw-bold);
  color: #000;
  line-height: 1;
}
.check-mark {
  font-size: 0.65rem;
  font-weight: 900;
  color: #000;
  line-height: 1;
}

/* ── 表单 ── */
.form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
.form-label { font-size: 0.82rem; font-weight: var(--fw-bold); color: var(--color-text-dim); }
.form-input { width: 100%; }

.color-picker {
  display: flex;
  gap: 10px;
}
.color-dot {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: transform 0.1s, border-color 0.1s;
  box-shadow: 2px 2px 0 #000;
}
.color-dot:hover { transform: scale(1.15); }
.color-dot.selected { border-color: #000; transform: scale(1.15); }

/* ── 粒子层 ── */
.particles-layer { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
.particle {
  position: absolute;
  font-size: 1.1rem;
  transform: translate(-50%, -50%);
  animation: particleFly 0.9s ease-out forwards;
}
@keyframes particleFly {
  0%   { opacity: 1; transform: translate(-50%,-50%) translate(0,0) scale(1); }
  100% { opacity: 0; transform: translate(-50%,-50%) translate(var(--dx),var(--dy)) scale(0.4); }
}

/* ── 响应式 ── */
@media (max-width: 600px) {
  .stats-bar { grid-template-columns: repeat(2, 1fr); }
  .day-num { font-size: 0.75rem; }
  .check-mark { font-size: 0.55rem; }
  .days-grid { gap: 4px; }
}
</style>
