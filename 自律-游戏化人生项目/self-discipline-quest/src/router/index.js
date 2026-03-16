import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { title: '我的主页', icon: '⚔️' }
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('../views/CalendarView.vue'),
    meta: { title: '打卡日历', icon: '📅' }
  },
  {
    path: '/quests',
    name: 'Quests',
    component: () => import('../views/QuestsView.vue'),
    meta: { title: '任务看板', icon: '📋' }
  },
  {
    path: '/skills',
    name: 'Skills',
    component: () => import('../views/SkillsView.vue'),
    meta: { title: '技能熟练度', icon: '✨' }
  },
  {
    path: '/timer',
    name: 'Timer',
    component: () => import('../views/TimerView.vue'),
    meta: { title: '番茄钟', icon: '🍅' }
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
