<script setup>
import AppSidebar   from './components/common/AppSidebar.vue'
import KpiBar       from './components/common/KpiBar.vue'
import ProfileView  from './views/ProfileView.vue'
import QuestsView   from './views/QuestsView.vue'
import SkillsView   from './views/SkillsView.vue'
import CalendarView from './views/CalendarView.vue'
import TimerView    from './views/TimerView.vue'
</script>

<template>
  <div class="app-layout">
    <AppSidebar />
    <div class="main-area">
      <KpiBar />
      <div class="dashboard-grid" id="main-scroll">
        <section id="section-quests"   class="ga-quests">
          <QuestsView />
        </section>
        <section id="section-timer"    class="ga-timer">
          <TimerView />
        </section>
        <section id="section-profile"  class="ga-profile">
          <ProfileView />
        </section>
        <section id="section-calendar" class="ga-calendar">
          <CalendarView />
        </section>
        <section id="section-skills"   class="ga-skills">
          <SkillsView />
        </section>
      </div>
    </div>
  </div>
</template>

<style>
.app-layout {
  display: flex;
  height: 100vh;
  background: var(--color-bg);
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

/* ── Dashboard grid: tasks dominates the left 2×2 ── */
.dashboard-grid {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px 48px;
  display: grid;
  grid-template-columns: 1.7fr 1fr 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "quests  quests  timer"
    "quests  quests  profile"
    "calendar calendar skills";
  gap: 20px;
  align-items: start;
}

.ga-quests   { grid-area: quests; }
.ga-timer    { grid-area: timer; }
.ga-profile  { grid-area: profile; }
.ga-calendar { grid-area: calendar; }
.ga-skills   { grid-area: skills; }

/* ── 1100px: 2-col, tasks top wide ── */
@media (max-width: 1100px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "quests  quests"
      "timer   profile"
      "calendar calendar"
      "skills  skills";
  }
}

/* ── 700px: single column ── */
@media (max-width: 700px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "quests"
      "timer"
      "profile"
      "calendar"
      "skills";
    padding: 12px 12px calc(68px + env(safe-area-inset-bottom) + 16px);
    gap: 12px;
  }
}
</style>
