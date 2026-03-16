<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const NAV_ITEMS = [
  { id: 'section-profile',  icon: '⚔️',  label: '我的主页',   short: '主页'   },
  { id: 'section-quests',   icon: '📋',  label: '任务看板',   short: '任务'   },
  { id: 'section-skills',   icon: '✨',  label: '技能熟练度', short: '技能'   },
  { id: 'section-calendar', icon: '📅',  label: '打卡日历',   short: '日历'   },
  { id: 'section-timer',    icon: '🍅',  label: '番茄钟',     short: '计时'   },
]

const activeSection = ref('section-profile')
let observer = null

function scrollTo(id) {
  const scroller = document.getElementById('main-scroll')
  const el = document.getElementById(id)
  if (el && scroller) {
    scroller.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
  }
}

onMounted(() => {
  const scroller = document.getElementById('main-scroll')
  if (!scroller) return

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      if (visible.length > 0) {
        activeSection.value = visible[0].target.id
      }
    },
    {
      root: scroller,
      rootMargin: '-15% 0px -55% 0px',
      threshold: [0, 0.1, 0.5]
    }
  )

  NAV_ITEMS.forEach(item => {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <!-- 桌面端侧边栏 -->
  <nav class="sidebar">
    <div class="sidebar-logo">
      <span class="logo-icon">⚔️</span>
      <span class="logo-text">自律Quest</span>
    </div>
    <ul class="nav-list">
      <li v-for="item in NAV_ITEMS" :key="item.id">
        <button
          class="nav-item"
          :class="{ active: activeSection === item.id }"
          @click="scrollTo(item.id)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </button>
      </li>
    </ul>
    <div class="sidebar-footer">
      <span class="version">v0.4.0</span>
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
      <span class="tab-icon">{{ item.icon }}</span>
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
  border-right: 4px solid #000;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 24px 20px 20px;
  border-bottom: 3px solid #000;
}

.logo-icon { font-size: 1.4rem; }
.logo-text {
  font-family: var(--font-pixel);
  font-size: 0.58rem;
  color: #000;
  line-height: 1.5;
  letter-spacing: 0.04em;
}

.nav-list {
  list-style: none;
  padding: 12px 0;
  flex: 1;
}

.nav-item {
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  border-left: 4px solid transparent;
  padding: 13px 20px;
  font-family: var(--font-body);
  font-weight: var(--fw-bold);
  font-size: 0.88rem;
  color: var(--color-text-dim);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background 0.1s, color 0.1s;
}
.nav-item:hover {
  background: rgba(0, 0, 0, 0.06);
  color: var(--color-text);
}
.nav-item.active {
  background: #000;
  color: #fff;
  border-left-color: var(--color-yellow);
}

.nav-icon { font-size: 1.1rem; width: 24px; text-align: center; }
.nav-label { font-size: 0.88rem; }

.sidebar-footer {
  padding: 14px 20px;
  border-top: 3px solid #000;
}
.version {
  font-size: 0.65rem;
  color: var(--color-text-muted);
  font-family: var(--font-pixel);
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
  transition: background 0.1s;
}
.tab-item.active {
  background: #000;
  color: #fff;
}

.tab-icon { font-size: 1.2rem; line-height: 1; }
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
