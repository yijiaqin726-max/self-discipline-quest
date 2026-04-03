import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import {
  shouldSeed, markSeeded,
  DEMO_SKILLS, DEMO_QUESTS, DEMO_PROFILE,
  buildDemoCalendarState, buildDemoCompletionLog, buildDemoTomatoLog,
} from './data/seedData'

// ── Seed demo data on first visit ──────────────────────────────────────────
if (shouldSeed()) {
  localStorage.setItem('sq_skills',        JSON.stringify(DEMO_SKILLS))
  localStorage.setItem('sq_tasks',         JSON.stringify(DEMO_QUESTS))
  localStorage.setItem('sq_profile',       JSON.stringify(DEMO_PROFILE))
  localStorage.setItem('sq_calendars_v2',  JSON.stringify(buildDemoCalendarState()))
  localStorage.setItem('sq_completion_log',JSON.stringify(buildDemoCompletionLog()))
  localStorage.setItem('sq_tomatoes',      JSON.stringify(buildDemoTomatoLog()))
  markSeeded()
}

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
