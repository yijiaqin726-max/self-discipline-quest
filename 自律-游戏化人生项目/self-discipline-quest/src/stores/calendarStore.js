import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStorage } from '../composables/useStorage'

export const useCalendarStore = defineStore('calendar', () => {
  // 格式: { 'YYYY-MM': [1, 5, 12, ...] }
  const checkins = useStorage('sq_checkins', {})

  function getKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  }

  function getMonthCheckins(year, month) {
    const key = `${year}-${String(month).padStart(2, '0')}`
    return checkins.value[key] || []
  }

  function isCheckedIn(year, month, day) {
    return getMonthCheckins(year, month).includes(day)
  }

  function toggleCheckin(year, month, day) {
    const key = `${year}-${String(month).padStart(2, '0')}`
    if (!checkins.value[key]) checkins.value[key] = []
    const idx = checkins.value[key].indexOf(day)
    if (idx === -1) {
      checkins.value[key] = [...checkins.value[key], day]
    } else {
      checkins.value[key] = checkins.value[key].filter(d => d !== day)
    }
  }

  function clearMonth(year, month) {
    const key = `${year}-${String(month).padStart(2, '0')}`
    checkins.value[key] = []
  }

  const currentStreak = computed(() => {
    const today = new Date()
    let streak = 0
    let d = new Date(today)
    while (true) {
      const y = d.getFullYear()
      const m = d.getMonth() + 1
      const day = d.getDate()
      if (!isCheckedIn(y, m, day)) break
      streak++
      d.setDate(d.getDate() - 1)
    }
    return streak
  })

  return { checkins, getKey, getMonthCheckins, isCheckedIn, toggleCheckin, clearMonth, currentStreak }
})
