<script setup>
import { ref } from 'vue'
import { User, ClipboardList, Zap, CalendarDays, Timer, RotateCcw } from 'lucide-vue-next'
import {
  clearSeedMark,
  DEMO_SKILLS, DEMO_QUESTS, DEMO_PROFILE,
  buildDemoCalendarState, buildDemoCompletionLog, buildDemoTomatoLog,
} from '../../data/seedData'

const NAV_ITEMS = [
  { id: 'section-quests',   icon: ClipboardList, label: '任务中心',   short: '任务' },
  { id: 'section-timer',    icon: Timer,         label: '番茄钟',     short: '计时' },
  { id: 'section-profile',  icon: User,          label: '我的主页',   short: '主页' },
  { id: 'section-calendar', icon: CalendarDays,  label: '打卡日历',   short: '日历' },
  { id: 'section-skills',   icon: Zap,           label: '技能熟练度', short: '技能' },
]

const activeSection  = ref('section-quests')
const confirmReset   = ref(false)

function scrollTo(id) {
  activeSection.value = id
  const el      = document.getElementById(id)
  const scroller = document.getElementById('main-scroll')
  if (el && scroller) scroller.scrollTo({ top: el.offsetTop - 16, behavior: 'smooth' })
}

function resetDemo() {
  localStorage.setItem('sq_skills',        JSON.stringify(DEMO_SKILLS))
  localStorage.setItem('sq_tasks',         JSON.stringify(DEMO_QUESTS))
  localStorage.setItem('sq_profile',       JSON.stringify(DEMO_PROFILE))
  localStorage.setItem('sq_calendars_v2',  JSON.stringify(buildDemoCalendarState()))
  localStorage.setItem('sq_completion_log',JSON.stringify(buildDemoCompletionLog()))
  localStorage.setItem('sq_tomatoes',      JSON.stringify(buildDemoTomatoLog()))
  localStorage.removeItem('sq_focus_id')
  clearSeedMark()
  // Hard reload to reinitialize all stores from fresh localStorage
  window.location.reload()
}
</script>

<template>
  <!-- 桌面端侧边栏 -->
  <nav class="sidebar">
    <div class="sidebar-logo">
      <span class="logo-text">自律Quest</span>
    </div>
    <ul class="nav-list">
      <li v-for="item in NAV_ITEMS" :key="item.id">
        <button
          class="nav-item"
          :class="{ active: activeSection === item.id }"
          @click="scrollTo(item.id)"
        >
          <component :is="item.icon" :size="17" class="nav-icon" />
          <span class="nav-label">{{ item.label }}</span>
        </button>
      </li>
    </ul>
    <div class="sidebar-footer">
      <div v-if="!confirmReset">
        <button class="reset-btn" @click="confirmReset = true">
          <RotateCcw :size="12" />
          重置演示数据
        </button>
      </div>
      <div v-else class="reset-confirm">
        <span class="reset-warn">确定重置？将覆盖当前数据</span>
        <div class="reset-actions">
          <button class="reset-btn-cancel" @click="confirmReset = false">取消</button>
          <button class="reset-btn-ok" @click="resetDemo">确定</button>
        </div>
      </div>
      <span class="version">v0.6.0</span>
    </div>
  </nav>

  <!-- 移动端底部 Tab Bar -->
  <nav class="bottom-bar">
    <button
      v-for="item in NAV_ITEMS"
      :key="item.id"
      class="tab-item"
      :class="{ active: activeSection === item.id }"
      @click="scrollTo(item.id)"
    >
      <component :is="item.icon" :size="20" />
      <span class="tab-label">{{ item.short }}</span>
    </button>
  </nav>
</template>

<style scoped>
/* ── 侧边栏 ── */
.sidebar {
  width: 220px;
  height: 100vh;
  position: sticky;
  top: 0;
  flex-shrink: 0;
  background: var(--color-sidebar);
  border-right: 3px solid #000;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 22px 20px 18px;
  border-bottom: 2px solid #e8e8e8;
}
.logo-text {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: var(--fw-black);
  color: #000;
  letter-spacing: -0.02em;
}

.nav-list { list-style: none; padding: 10px 0; flex: 1; }

.nav-item {
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  border-left: 3px solid transparent;
  padding: 12px 20px;
  font-family: var(--font-body);
  font-weight: var(--fw-bold);
  font-size: 0.875rem;
  color: var(--color-text-dim);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 11px;
  transition: background 0.1s, color 0.1s;
}
.nav-item:hover {
  background: rgba(0, 0, 0, 0.04);
  color: var(--color-text);
}
.nav-item.active {
  background: rgba(255, 224, 61, 0.18);
  color: #000;
  border-left-color: var(--color-yellow);
  font-weight: var(--fw-black);
}
.nav-icon  { flex-shrink: 0; }
.nav-label { font-size: 0.875rem; }

/* ── 页脚 ── */
.sidebar-footer {
  padding: 12px 16px;
  border-top: 2px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.version {
  font-size: 0.65rem;
  color: var(--color-text-muted);
  font-weight: 600;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 2px solid #d0d0d0;
  border-radius: 8px;
  padding: 6px 10px;
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: var(--fw-bold);
  color: var(--color-text-muted);
  cursor: pointer;
  width: 100%;
  transition: border-color 0.1s, color 0.1s;
}
.reset-btn:hover { border-color: #000; color: #000; }

.reset-confirm { display: flex; flex-direction: column; gap: 6px; }
.reset-warn    { font-size: 0.68rem; font-weight: var(--fw-bold); color: #c00; }
.reset-actions { display: flex; gap: 6px; }
.reset-btn-cancel {
  flex: 1; padding: 5px; background: #f0f0f0; border: 2px solid #000; border-radius: 6px;
  font-size: 0.72rem; font-weight: var(--fw-bold); cursor: pointer;
}
.reset-btn-ok {
  flex: 1; padding: 5px; background: var(--color-yellow); border: 2px solid #000; border-radius: 6px;
  font-size: 0.72rem; font-weight: var(--fw-black); cursor: pointer;
  box-shadow: 1px 1px 0 #000;
}

/* ── 移动端 Tab Bar ── */
.bottom-bar {
  display: none;
  position: fixed;
  bottom: 0; left: 0; right: 0;
  height: 62px;
  background: #fff;
  border-top: 3px solid #000;
  z-index: 500;
  justify-content: space-around;
  align-items: stretch;
  padding-bottom: env(safe-area-inset-bottom);
}
.tab-item {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 3px; background: none; border: none;
  color: var(--color-text-dim); cursor: pointer;
  padding: 8px 4px; font-family: var(--font-body);
  transition: background 0.1s, color 0.1s;
}
.tab-item.active { background: rgba(255, 224, 61, 0.25); color: #000; }
.tab-label { font-size: 0.6rem; font-weight: var(--fw-bold); white-space: nowrap; }

@media (max-width: 700px) {
  .sidebar    { display: none; }
  .bottom-bar { display: flex; }
}
</style>
