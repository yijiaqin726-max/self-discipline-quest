import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStorage } from '../composables/useStorage'

// ── 迁移旧数据 ─────────────────────────────────────────────
function migrateFromLegacy() {
  try {
    const raw = localStorage.getItem('sq_checkins')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || Object.keys(parsed).length === 0) return null
    return parsed
  } catch {
    return null
  }
}

export const useCalendarStore = defineStore('calendar', () => {
  // 初始化：检测旧数据并迁移
  const legacyData = migrateFromLegacy()
  const defaultId = 'cal_' + Date.now()

  const defaultState = {
    calendars: [{ id: defaultId, name: '默认打卡', color: '#4DFFA0', createdAt: Date.now() }],
    activeCalendarId: defaultId,
    data: { [defaultId]: legacyData || {} }
  }

  const store = useStorage('sq_calendars_v2', defaultState)

  // 清理旧 key（只执行一次）
  if (legacyData) {
    localStorage.removeItem('sq_checkins')
  }

  // ── Getters ──────────────────────────────────────────────
  const calendars       = computed(() => store.value.calendars)
  const activeCalendarId = computed(() => store.value.activeCalendarId)
  const activeCalendar  = computed(() =>
    store.value.calendars.find(c => c.id === store.value.activeCalendarId)
  )

  function getActiveData() {
    return store.value.data[store.value.activeCalendarId] || {}
  }

  // ── 日历 CRUD ──────────────────────────────────────────────
  const PALETTE = ['#4DFFA0', '#FFE03D', '#5BC8FF', '#FF6FB0', '#FF8C3D']

  function addCalendar(name, color) {
    const id = 'cal_' + Date.now()
    const usedColors = store.value.calendars.map(c => c.color)
    const autoColor = color || PALETTE.find(c => !usedColors.includes(c)) || PALETTE[store.value.calendars.length % PALETTE.length]
    store.value.calendars.push({ id, name: name.trim() || '新日历', color: autoColor, createdAt: Date.now() })
    store.value.data[id] = {}
    store.value.activeCalendarId = id
  }

  function deleteCalendar(id) {
    if (store.value.calendars.length <= 1) return
    store.value.calendars = store.value.calendars.filter(c => c.id !== id)
    delete store.value.data[id]
    if (store.value.activeCalendarId === id) {
      store.value.activeCalendarId = store.value.calendars[0].id
    }
  }

  function renameCalendar(id, newName) {
    const cal = store.value.calendars.find(c => c.id === id)
    if (cal && newName.trim()) cal.name = newName.trim()
  }

  function setActiveCalendar(id) {
    if (store.value.calendars.some(c => c.id === id)) {
      store.value.activeCalendarId = id
    }
  }

  // ── 打卡操作（全部基于当前 activeCalendarId）────────────────
  function getMonthCheckins(year, month) {
    const key = `${year}-${String(month).padStart(2, '0')}`
    return getActiveData()[key] || []
  }

  function isCheckedIn(year, month, day) {
    return getMonthCheckins(year, month).includes(day)
  }

  function toggleCheckin(year, month, day) {
    const id = store.value.activeCalendarId
    const key = `${year}-${String(month).padStart(2, '0')}`
    if (!store.value.data[id]) store.value.data[id] = {}
    if (!store.value.data[id][key]) store.value.data[id][key] = []
    const arr = store.value.data[id][key]
    const idx = arr.indexOf(day)
    store.value.data[id][key] = idx === -1 ? [...arr, day] : arr.filter(d => d !== day)
  }

  function clearMonth(year, month) {
    const id = store.value.activeCalendarId
    const key = `${year}-${String(month).padStart(2, '0')}`
    if (store.value.data[id]) store.value.data[id][key] = []
  }

  // ── 连续打卡 ──────────────────────────────────────────────
  const currentStreak = computed(() => {
    const today = new Date()
    let streak = 0
    let d = new Date(today)
    while (true) {
      const y = d.getFullYear(), m = d.getMonth() + 1, day = d.getDate()
      if (!isCheckedIn(y, m, day)) break
      streak++
      d.setDate(d.getDate() - 1)
    }
    return streak
  })

  return {
    calendars,
    activeCalendarId,
    activeCalendar,
    addCalendar,
    deleteCalendar,
    renameCalendar,
    setActiveCalendar,
    getMonthCheckins,
    isCheckedIn,
    toggleCheckin,
    clearMonth,
    currentStreak,
    PALETTE
  }
})
