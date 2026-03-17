<script setup>
import { ref } from 'vue'
import { User, ClipboardList, Zap, CalendarDays, Timer } from 'lucide-vue-next'

const NAV_ITEMS = [
  { id: 'section-profile',  icon: User,          label: '我的主页',   short: '主页' },
  { id: 'section-quests',   icon: ClipboardList, label: '任务看板',   short: '任务' },
  { id: 'section-skills',   icon: Zap,           label: '技能熟练度', short: '技能' },
  { id: 'section-calendar', icon: CalendarDays,  label: '打卡日历',   short: '日历' },
  { id: 'section-timer',    icon: Timer,         label: '番茄钟',     short: '计时' },
]

const activeSection = ref('section-profile')

function scrollTo(id) {
  activeSection.value = id
  const el = document.getElementById(id)
  const scroller = document.getElementById('main-scroll')
  if (el && scroller) scroller.scrollTo({ top: el.offsetTop - 16, behavior: 'smooth' })
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
      <span class="version">v0.5.0</span>
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
  width: 240px;
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

.nav-list {
  list-style: none;
  padding: 10px 0;
  flex: 1;
}

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

.nav-icon { flex-shrink: 0; }
.nav-label { font-size: 0.875rem; }

.sidebar-footer {
  padding: 14px 20px;
  border-top: 2px solid #e8e8e8;
}
.version {
  font-size: 0.68rem;
  color: var(--color-text-muted);
  font-weight: 600;
}

/* ── 移动端 Tab Bar ── */
.bottom-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 62px;
  background: #fff;
  border-top: 3px solid #000;
  z-index: 500;
  justify-content: space-around;
  align-items: stretch;
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  background: none;
  border: none;
  color: var(--color-text-dim);
  cursor: pointer;
  padding: 8px 4px;
  font-family: var(--font-body);
  transition: background 0.1s, color 0.1s;
}
.tab-item.active {
  background: rgba(255, 224, 61, 0.25);
  color: #000;
}

.tab-label {
  font-size: 0.6rem;
  font-weight: var(--fw-bold);
  white-space: nowrap;
}

@media (max-width: 700px) {
  .sidebar    { display: none; }
  .bottom-bar { display: flex; }
}
</style>
