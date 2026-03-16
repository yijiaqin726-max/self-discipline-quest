<script setup>
import AppSidebar   from './components/common/AppSidebar.vue'
import ProfileView  from './views/ProfileView.vue'
import QuestsView   from './views/QuestsView.vue'
import SkillsView   from './views/SkillsView.vue'
import CalendarView from './views/CalendarView.vue'
import TimerView    from './views/TimerView.vue'
</script>

<template>
  <div class="app-layout">
    <AppSidebar />
    <main class="main-content" id="main-scroll">
      <section id="section-profile"  class="page-section section-profile">
        <ProfileView />
      </section>
      <section id="section-quests"   class="page-section section-quests">
        <QuestsView />
      </section>
      <section id="section-skills"   class="page-section section-skills">
        <SkillsView />
      </section>
      <section id="section-calendar" class="page-section section-calendar">
        <CalendarView />
      </section>
      <section id="section-timer"    class="page-section section-timer">
        <TimerView />
      </section>
    </main>
  </div>
</template>

<style>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg);
}

.main-content {
  flex: 1;
  overflow-y: auto;
  min-width: 0;
  scroll-behavior: smooth;
  height: 100vh;
}

.page-section {
  padding: 48px 40px;
  border-bottom: 4px solid #000;
}

.section-profile  { background: var(--color-yellow); }
.section-quests   { background: var(--color-mint);   }
.section-skills   { background: var(--color-sky);    }
.section-calendar { background: var(--color-pink);   }
.section-timer    { background: var(--color-orange); }

@media (max-width: 700px) {
  .main-content {
    padding-bottom: calc(68px + env(safe-area-inset-bottom));
  }
  .page-section {
    padding: 28px 16px;
  }
}
</style>
