<script setup>
import AppSidebar from './components/common/AppSidebar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-layout">
    <AppSidebar />
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style>
.app-layout {
  display: flex;
  height: 100%;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  min-width: 0;
}

/* 移动端底部 Tab Bar 高度补偿 */
@media (max-width: 700px) {
  .main-content {
    padding-bottom: calc(60px + env(safe-area-inset-bottom));
  }
}
</style>

