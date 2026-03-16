<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useQuestStore } from '../stores/questStore'
import { useSkillStore } from '../stores/skillStore'
import { useStorage } from '../composables/useStorage'

const questStore = useQuestStore()
const skillStore = useSkillStore()

// ── 今日番茄计数 ──────────────────────────────────────────
const todayKey = new Date().toISOString().slice(0, 10) // 'YYYY-MM-DD'
const tomatoLog = useStorage('sq_tomatoes', {}) // { 'YYYY-MM-DD': count }

const todayCount = computed(() => tomatoLog.value[todayKey] ?? 0)

function recordTomato() {
  if (!tomatoLog.value[todayKey]) tomatoLog.value[todayKey] = 0
  tomatoLog.value[todayKey]++
}

// ── 计时器设置 ────────────────────────────────────────────
const focusMinutes  = ref(25)
const breakMinutes  = ref(5)
const settingsOpen  = ref(false)
const tempFocus     = ref(25)
const tempBreak     = ref(5)

function openSettings() {
  tempFocus.value = focusMinutes.value
  tempBreak.value = breakMinutes.value
  settingsOpen.value = true
}

function saveSettings() {
  focusMinutes.value = Math.max(1, Math.min(60, tempFocus.value))
  breakMinutes.value = Math.max(1, Math.min(30, tempBreak.value))
  // 如果在空闲状态，重置总时间
  if (phase.value === 'idle') {
    totalSecs.value = focusMinutes.value * 60
    remaining.value = totalSecs.value
  }
  settingsOpen.value = false
}

// ── 计时器核心 ────────────────────────────────────────────
const phase      = ref('idle')    // 'idle' | 'focus' | 'break'
const running    = ref(false)
const remaining  = ref(25 * 60)
const totalSecs  = ref(25 * 60)
let   intervalId = null

const minutes = computed(() => Math.floor(remaining.value / 60).toString().padStart(2, '0'))
const seconds = computed(() => (remaining.value % 60).toString().padStart(2, '0'))
const progress = computed(() => {
  if (totalSecs.value === 0) return 0
  return 1 - remaining.value / totalSecs.value
})

// SVG 圆形进度
const RADIUS = 88
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const strokeDashoffset = computed(() => CIRCUMFERENCE * (1 - progress.value))

function start() {
  if (phase.value === 'idle') {
    phase.value = 'focus'
    remaining.value = focusMinutes.value * 60
    totalSecs.value  = focusMinutes.value * 60
  }
  running.value = true
  intervalId = setInterval(tick, 1000)
}

function pause() {
  running.value = false
  clearInterval(intervalId)
  intervalId = null
}

function reset() {
  pause()
  phase.value = 'idle'
  remaining.value = focusMinutes.value * 60
  totalSecs.value  = focusMinutes.value * 60
}

function tick() {
  if (remaining.value <= 0) {
    onPhaseEnd()
    return
  }
  remaining.value--
}

function onPhaseEnd() {
  pause()
  if (phase.value === 'focus') {
    recordTomato()
    requestNotification('🍅 专注结束！', `完成了一个番茄，休息 ${breakMinutes.value} 分钟吧`)
    showCompleteModal.value = true
  } else if (phase.value === 'break') {
    requestNotification('⏰ 休息结束', '准备好开始下一个番茄了吗？')
    phase.value = 'idle'
    remaining.value = focusMinutes.value * 60
    totalSecs.value  = focusMinutes.value * 60
  }
}

function startBreak() {
  showCompleteModal.value = false
  phase.value = 'break'
  remaining.value = breakMinutes.value * 60
  totalSecs.value  = breakMinutes.value * 60
  start()
}

function skipBreak() {
  showCompleteModal.value = false
  phase.value = 'idle'
  remaining.value = focusMinutes.value * 60
  totalSecs.value  = focusMinutes.value * 60
}

// ── 浏览器通知 ────────────────────────────────────────────
async function requestNotification(title, body) {
  if (!('Notification' in window)) return
  if (Notification.permission === 'default') {
    await Notification.requestPermission()
  }
  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: '🍅' })
  }
}

// ── 完成弹窗（关联任务）────────────────────────────────────
const showCompleteModal = ref(false)
const selectedQuestId   = ref(null)
const milestonePopup    = ref(null)
const rewardInput       = ref('')
const xpFloats          = ref([])
let   xpFloatId = 0

function linkAndClose() {
  if (selectedQuestId.value) {
    const quest = questStore.quests.find(q => q.id === selectedQuestId.value)
    if (quest) {
      const milestone = questStore.completeQuest(selectedQuestId.value)
      spawnXpFloat(quest.xp)
      if (milestone) {
        rewardInput.value = skillStore.getReward(milestone.skillId, milestone.milestone)
        milestonePopup.value = milestone
      }
    }
  }
  showCompleteModal.value = false
}

function spawnXpFloat(xp) {
  const id = ++xpFloatId
  xpFloats.value.push({
    id,
    text: `+${xp} XP ⚡`,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2 - 60
  })
  setTimeout(() => {
    xpFloats.value = xpFloats.value.filter(f => f.id !== id)
  }, 1200)
}

function saveMilestoneReward() {
  if (!milestonePopup.value) return
  const text = rewardInput.value.trim()
  if (text) skillStore.setReward(milestonePopup.value.skillId, milestonePopup.value.milestone, text)
  milestonePopup.value = null
}

// ── 清理 ─────────────────────────────────────────────────
onUnmounted(() => {
  clearInterval(intervalId)
})

// 颜色根据阶段变化
const phaseColor = computed(() => {
  if (phase.value === 'break') return '#39d98a'
  if (phase.value === 'focus') return '#e94560'
  return '#f5a623'
})

const phaseLabel = computed(() => {
  if (phase.value === 'focus') return '🍅 专注中'
  if (phase.value === 'break') return '☕ 休息中'
  return '准备开始'
})
</script>

<template>
  <div class="timer-page">

    <!-- ── 顶部 ── -->
    <div class="page-header">
      <h1 class="page-title">🍅 番茄钟</h1>
      <button class="btn btn-ghost btn-sm" @click="openSettings">⚙ 设置</button>
    </div>

    <!-- ── 主计时器 ── -->
    <div class="timer-card card">
      <div class="phase-label" :style="{ color: phaseColor }">{{ phaseLabel }}</div>

      <!-- 圆形进度条 -->
      <div class="circle-wrap">
        <svg class="circle-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <!-- 背景轨道 -->
          <circle
            cx="100" cy="100" :r="RADIUS"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            stroke-width="10"
          />
          <!-- 进度弧 -->
          <circle
            cx="100" cy="100" :r="RADIUS"
            fill="none"
            :stroke="phaseColor"
            stroke-width="10"
            stroke-linecap="round"
            :stroke-dasharray="CIRCUMFERENCE"
            :stroke-dashoffset="strokeDashoffset"
            transform="rotate(-90 100 100)"
            style="transition: stroke-dashoffset 0.8s ease, stroke 0.4s ease"
          />
        </svg>
        <div class="time-display">
          <span class="time-text">{{ minutes }}:{{ seconds }}</span>
          <span class="time-sub">
            {{ phase === 'focus' ? focusMinutes + ' 分钟专注' : phase === 'break' ? breakMinutes + ' 分钟休息' : '点击开始' }}
          </span>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="controls">
        <button v-if="!running" class="btn btn-start" @click="start">
          {{ phase === 'idle' ? '▶ 开始专注' : '▶ 继续' }}
        </button>
        <button v-else class="btn btn-pause" @click="pause">⏸ 暂停</button>
        <button class="btn btn-reset btn-sm" @click="reset" :disabled="phase === 'idle' && !running">
          ↺ 重置
        </button>
      </div>
    </div>

    <!-- ── 今日统计 ── -->
    <div class="stats-row">
      <div class="stat-card card">
        <span class="stat-big">{{ todayCount }}</span>
        <span class="stat-desc">今日番茄 🍅</span>
      </div>
      <div class="stat-card card">
        <span class="stat-big">{{ Math.round(todayCount * focusMinutes) }}</span>
        <span class="stat-desc">今日专注分钟</span>
      </div>
    </div>

    <!-- ── 设置弹窗 ── -->
    <Transition name="modal">
      <div v-if="settingsOpen" class="modal-overlay" @click.self="settingsOpen = false">
        <div class="modal-box">
          <h3 class="modal-title">⚙ 计时器设置</h3>
          <div class="form-row">
            <div class="form-group flex1">
              <label class="form-label">专注时长（分钟）</label>
              <input v-model.number="tempFocus" type="number" class="form-input" min="1" max="60" />
            </div>
            <div class="form-group flex1">
              <label class="form-label">休息时长（分钟）</label>
              <input v-model.number="tempBreak" type="number" class="form-input" min="1" max="30" />
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-ghost" @click="settingsOpen = false">取消</button>
            <button class="btn btn-primary" @click="saveSettings">保存</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── 番茄完成弹窗 ── -->
    <Transition name="modal">
      <div v-if="showCompleteModal" class="modal-overlay">
        <div class="modal-box complete-box">
          <div class="complete-icon">🍅</div>
          <h3 class="modal-title complete-title">番茄完成！</h3>
          <p class="modal-desc">太棒了！要关联一个任务记录进度吗？</p>

          <div class="form-group" v-if="questStore.quests.length > 0">
            <label class="form-label">关联任务（可选）</label>
            <select v-model="selectedQuestId" class="form-input">
              <option :value="null">不关联任务</option>
              <option v-for="q in questStore.quests" :key="q.id" :value="q.id">
                {{ q.name }} (+{{ q.xp }} XP)
              </option>
            </select>
          </div>
          <p v-else class="no-quest-hint">还没有任务，先去「任务看板」创建吧</p>

          <div class="complete-actions">
            <button class="btn btn-ghost" @click="skipBreak">跳过休息</button>
            <button class="btn btn-complete-link" @click="linkAndClose">
              {{ selectedQuestId ? '记录 +XP 并休息 ☕' : '开始休息 ☕' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── 里程碑奖励弹窗 ── -->
    <Transition name="modal">
      <div v-if="milestonePopup" class="modal-overlay">
        <div class="modal-box milestone-box">
          <div class="milestone-firework">🎉</div>
          <h3 class="modal-title milestone-title">里程碑解锁！</h3>
          <p class="milestone-sub">
            「{{ skillStore.getSkill(milestonePopup.skillId)?.name }}」达到
            <span class="ms-num-big">{{ milestonePopup.milestone }}</span> XP
          </p>
          <p class="modal-desc">设置一个奖励犒劳自己吧 🎁</p>
          <input
            v-model="rewardInput"
            class="form-input"
            placeholder="例如：游戏时间 +1 小时 🎮"
            maxlength="40"
            @keydown.enter="saveMilestoneReward"
            autofocus
          />
          <div class="modal-actions" style="margin-top:16px">
            <button class="btn btn-ghost" @click="milestonePopup = null">跳过</button>
            <button class="btn btn-primary" @click="saveMilestoneReward">保存奖励 🎁</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── XP 浮动层 ── -->
    <div class="float-layer" aria-hidden="true">
      <span
        v-for="f in xpFloats"
        :key="f.id"
        class="xp-float"
        :style="{ left: f.x + 'px', top: f.y + 'px' }"
      >{{ f.text }}</span>
    </div>

  </div>
</template>

<style scoped>
.timer-page {
  padding: 32px;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

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

/* ── 主卡片 ── */
.timer-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px 32px;
}

.phase-label {
  font-family: var(--font-pixel);
  font-size: 0.55rem;
  letter-spacing: 0.1em;
  transition: color 0.4s;
}

/* ── 圆形计时器 ── */
.circle-wrap {
  position: relative;
  width: 220px;
  height: 220px;
}

.circle-svg {
  width: 100%;
  height: 100%;
}

.time-display {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.time-text {
  font-family: var(--font-pixel);
  font-size: 1.6rem;
  color: var(--color-text);
  letter-spacing: 0.05em;
}

.time-sub {
  font-size: 0.75rem;
  color: var(--color-text-dim);
}

/* ── 控制按钮 ── */
.controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-start {
  background: var(--color-red);
  color: #fff;
  font-size: 0.95rem;
  padding: 10px 28px;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
}
.btn-start:hover {
  background: #ff6b7a;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(233,69,96,0.3);
}

.btn-pause {
  background: rgba(245,166,35,0.15);
  border: 1px solid rgba(245,166,35,0.4);
  color: var(--color-gold);
  font-size: 0.95rem;
  padding: 10px 28px;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
}
.btn-pause:hover { background: rgba(245,166,35,0.25); }

.btn-reset {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-dim);
  border-radius: var(--radius);
  cursor: pointer;
  padding: 8px 16px;
  font-size: 0.85rem;
  transition: all 0.2s;
}
.btn-reset:hover:not(:disabled) { color: var(--color-text); border-color: var(--color-text-dim); }
.btn-reset:disabled { opacity: 0.3; cursor: default; }

/* ── 统计 ── */
.stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px;
}

.stat-big {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-gold);
  line-height: 1;
}

.stat-desc {
  font-size: 0.8rem;
  color: var(--color-text-dim);
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
  max-width: 400px;
  width: 92%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}
.modal-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
  text-align: center;
}
.modal-desc {
  font-size: 0.85rem;
  color: var(--color-text-dim);
  margin-bottom: 16px;
  text-align: center;
  line-height: 1.6;
}
.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.93); }

/* 完成弹窗 */
.complete-box {
  text-align: center;
  border-color: rgba(233,69,96,0.3);
  box-shadow: 0 0 40px rgba(233,69,96,0.1), 0 20px 60px rgba(0,0,0,0.5);
}
.complete-icon { font-size: 3rem; margin-bottom: 12px; }
.complete-title { color: var(--color-red); }
.no-quest-hint { font-size: 0.8rem; color: var(--color-text-dim); margin-bottom: 16px; }
.complete-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
}
.btn-complete-link {
  background: var(--color-green);
  color: #0f0f1a;
  border: none;
  border-radius: var(--radius);
  padding: 8px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-complete-link:hover {
  background: #52e5a0;
  transform: translateY(-1px);
}

/* 里程碑弹窗 */
.milestone-box {
  text-align: center;
  border-color: rgba(245,166,35,0.3);
  box-shadow: 0 0 40px rgba(245,166,35,0.15), 0 20px 60px rgba(0,0,0,0.5);
}
.milestone-firework {
  font-size: 3rem;
  animation: bounce 0.6s ease infinite alternate;
}
@keyframes bounce {
  from { transform: translateY(0); }
  to   { transform: translateY(-8px); }
}
.milestone-title { color: var(--color-gold); font-family: var(--font-pixel); font-size: 0.7rem; }
.milestone-sub { font-size: 0.9rem; color: var(--color-text-dim); margin-bottom: 12px; }
.ms-num-big { font-size: 1.2rem; font-weight: 700; color: var(--color-gold); }

/* ── 表单 ── */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
  text-align: left;
}
.form-label { font-size: 0.82rem; color: var(--color-text-dim); font-weight: 500; }
.form-input { width: 100%; }
.form-row { display: flex; gap: 12px; }
.flex1 { flex: 1; }

/* XP 浮动 */
.float-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
}

/* 响应式 */
@media (max-width: 600px) {
  .timer-page { padding: 16px; }
  .timer-card { padding: 28px 16px; }
  .time-text { font-size: 1.2rem; }
  .circle-wrap { width: 180px; height: 180px; }
}
</style>
