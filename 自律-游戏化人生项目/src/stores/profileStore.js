import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStorage } from '../composables/useStorage'

const LEVEL_TITLES = [
  { min: 0, title: '新手冒险者' },
  { min: 100, title: '见习探索者' },
  { min: 300, title: '熟练旅者' },
  { min: 600, title: '精英战士' },
  { min: 1000, title: '传奇勇者' },
  { min: 2000, title: '神话英雄' }
]

export const useProfileStore = defineStore('profile', () => {
  const profile = useStorage('sq_profile', {
    nickname: '勇敢的冒险者',
    motto: '每天进步一点点',
    avatar: '',
    totalXP: 0,
    goals: []
  })

  const level = computed(() => {
    const xp = profile.value.totalXP
    for (let i = LEVEL_TITLES.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_TITLES[i].min) return i + 1
    }
    return 1
  })

  const levelTitle = computed(() => {
    const xp = profile.value.totalXP
    let title = LEVEL_TITLES[0].title
    for (const t of LEVEL_TITLES) {
      if (xp >= t.min) title = t.title
    }
    return title
  })

  const nextLevelXP = computed(() => {
    const xp = profile.value.totalXP
    for (let i = 0; i < LEVEL_TITLES.length; i++) {
      if (xp < LEVEL_TITLES[i].min) return LEVEL_TITLES[i].min
    }
    return null
  })

  function addXP(amount) {
    profile.value.totalXP += amount
  }

  function updateProfile(fields) {
    Object.assign(profile.value, fields)
  }

  function addGoal(text) {
    profile.value.goals.push({ id: Date.now(), text, done: false })
  }

  function toggleGoal(id) {
    const goal = profile.value.goals.find(g => g.id === id)
    if (goal) goal.done = !goal.done
  }

  function removeGoal(id) {
    profile.value.goals = profile.value.goals.filter(g => g.id !== id)
  }

  return { profile, level, levelTitle, nextLevelXP, addXP, updateProfile, addGoal, toggleGoal, removeGoal }
})
