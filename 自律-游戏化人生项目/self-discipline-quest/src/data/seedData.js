// ── Demo Seed Data ─────────────────────────────────────────────────────────
// Predefined IDs allow cross-referencing between tasks and skills

const SEED_MARK_KEY = 'sq_demo_seeded'
const SEED_VERSION  = 'v1'

export function shouldSeed() {
  return !localStorage.getItem(SEED_MARK_KEY)
}
export function markSeeded() {
  localStorage.setItem(SEED_MARK_KEY, SEED_VERSION)
}
export function clearSeedMark() {
  localStorage.removeItem(SEED_MARK_KEY)
}

// ── Skills ──────────────────────────────────────────────────────────────────
export const DEMO_SKILL_IDS = {
  programming: 1001,
  design:      1002,
  english:     1003,
  job:         1004,
}

export const DEMO_SKILLS = [
  { id: DEMO_SKILL_IDS.programming, name: '编程',   icon: '💻', xp: 68, unlockedMilestones: [] },
  { id: DEMO_SKILL_IDS.design,      name: '产品设计', icon: '🎨', xp: 42, unlockedMilestones: [] },
  { id: DEMO_SKILL_IDS.english,     name: '英语',   icon: '🗣️', xp: 35, unlockedMilestones: [] },
  { id: DEMO_SKILL_IDS.job,         name: '求职管理', icon: '📋', xp: 20, unlockedMilestones: [] },
]

// ── Quests ──────────────────────────────────────────────────────────────────
// status: 'pending' | 'active' | 'done'
export const DEMO_QUESTS = [
  {
    id: 2001,
    name: '学习 Vue 组件通信',
    xp: 15,
    skillId: DEMO_SKILL_IDS.programming,
    count: 0,
    status: 'active',
    estimatedPomodoros: 2,
  },
  {
    id: 2002,
    name: '修改 Dashboard 首页布局',
    xp: 20,
    skillId: DEMO_SKILL_IDS.design,
    count: 0,
    status: 'pending',
    estimatedPomodoros: 3,
  },
  {
    id: 2003,
    name: '完成一篇英文面试自我介绍',
    xp: 12,
    skillId: DEMO_SKILL_IDS.english,
    count: 0,
    status: 'pending',
    estimatedPomodoros: 1,
  },
  {
    id: 2004,
    name: '整理本周投递岗位表',
    xp: 10,
    skillId: DEMO_SKILL_IDS.job,
    count: 1,
    status: 'done',
    estimatedPomodoros: 1,
  },
]

// ── Profile ─────────────────────────────────────────────────────────────────
export const DEMO_PROFILE = {
  nickname: '勇敢的冒险者',
  motto:    '每天进步一点点，终有一天质变',
  avatar:   '🧙',
  totalXP:  245,
  goals: [
    { id: 3001, text: '本周完成 Vue 仪表盘改版', done: false },
    { id: 3002, text: '连续专注 5 天',           done: false },
    { id: 3003, text: '完成 3 次英语练习',       done: true  },
  ],
}

// ── Calendar: 6-day streak ──────────────────────────────────────────────────
export function buildDemoCalendarState() {
  const calId  = 'cal_demo_001'
  const calData = {}
  const today  = new Date()
  for (let i = 0; i < 6; i++) {
    const d   = new Date(today)
    d.setDate(d.getDate() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!calData[key]) calData[key] = []
    if (!calData[key].includes(d.getDate())) calData[key].push(d.getDate())
  }
  return {
    calendars:       [{ id: calId, name: '每日打卡', color: '#4DFFA0', createdAt: Date.now() }],
    activeCalendarId: calId,
    data:            { [calId]: calData },
  }
}

// ── Completion log: 7-day task completions for the weekly chart ─────────────
export function buildDemoCompletionLog() {
  const log     = []
  const today   = new Date()
  // counts for last 7 days (oldest → newest): Mon–Sun style demo
  const counts  = [1, 2, 1, 0, 2, 1, 2]
  for (let i = 6; i >= 0; i--) {
    const d     = new Date(today)
    d.setDate(d.getDate() - i)
    const date  = d.toISOString().slice(0, 10)
    const n     = counts[6 - i]
    for (let j = 0; j < n; j++) log.push({ date, xp: 10 })
  }
  return log
}

// ── Tomato log: today 3 pomodoros = 75 min focus ───────────────────────────
export function buildDemoTomatoLog() {
  const todayKey = new Date().toISOString().slice(0, 10)
  return { [todayKey]: 3 }
}
