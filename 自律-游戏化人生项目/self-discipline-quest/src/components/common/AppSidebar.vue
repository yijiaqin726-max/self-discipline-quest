<template>
  <!-- 桌面端侧边栏 -->
  <nav class="sidebar">
    <div class="sidebar-logo">
      <span class="logo-icon">⚔️</span>
      <span class="logo-text">自律Quest</span>
    </div>
    <ul class="nav-list">
      <li v-for="route in navRoutes" :key="route.path">
        <RouterLink :to="route.path" class="nav-item" :class="{ active: currentPath === route.path }">
          <span class="nav-icon">{{ route.meta.icon }}</span>
          <span class="nav-label">{{ route.meta.title }}</span>
        </RouterLink>
      </li>
    </ul>
    <div class="sidebar-footer">
      <span class="version">v0.1.0</span>
    </div>
  </nav>

  <!-- 移动端底部 Tab Bar -->
  <nav class="bottom-bar">
    <RouterLink
      v-for="route in navRoutes"
      :key="route.path"
      :to="route.path"
      class="tab-item"
      :class="{ active: currentPath === route.path }"
    >
      <span class="tab-icon">{{ route.meta.icon }}</span>
      <span class="tab-label">{{ route.meta.shortTitle || route.meta.title }}</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const currentPath = computed(() => route.path)
const navRoutes = router.getRoutes().filter(r => r.meta?.title)
</script>

<style scoped>
/* ── 桌面端侧边栏 ── */
.sidebar {
  width: 220px;
  min-height: 100vh;
  background: var(--color-sidebar);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  padding: 0;
  flex-shrink: 0;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 24px 20px 20px;
  border-bottom: 1px solid var(--color-border);
}

.logo-icon { font-size: 1.4rem; }

.logo-text {
  font-family: var(--font-pixel);
  font-size: 0.6rem;
  color: var(--color-gold);
  line-height: 1.4;
  letter-spacing: 0.05em;
}

.nav-list {
  list-style: none;
  padding: 16px 0;
  margin: 0;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: var(--color-text-dim);
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  font-size: 0.85rem;
}

.nav-item:hover {
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.05);
}

.nav-item.active {
  color: var(--color-gold);
  background: rgba(245, 166, 35, 0.1);
  border-left-color: var(--color-gold);
}

.nav-icon { font-size: 1.1rem; width: 24px; text-align: center; }
.nav-label { font-size: 0.88rem; }

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--color-border);
}

.version {
  font-size: 0.7rem;
  color: var(--color-text-dim);
  font-family: var(--font-pixel);
}

/* ── 移动端底部 Tab Bar（默认隐藏，小屏显示）── */
.bottom-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--color-sidebar);
  border-top: 1px solid var(--color-border);
  z-index: 500;
  justify-content: space-around;
  align-items: stretch;
  /* 避免 iOS 安全区域被遮挡 */
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: var(--color-text-dim);
  text-decoration: none;
  transition: color 0.2s;
  padding: 8px 4px;
}

.tab-item.active {
  color: var(--color-gold);
}

.tab-icon { font-size: 1.2rem; line-height: 1; }

.tab-label {
  font-size: 0.6rem;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 52px;
  text-align: center;
}

/* 移动端断点 */
@media (max-width: 700px) {
  .sidebar { display: none; }
  .bottom-bar { display: flex; }
}
</style>

