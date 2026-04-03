import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStorage } from '../composables/useStorage'
import { useProfileStore } from './profileStore'
import { useSkillStore } from './skillStore'

export const useQuestStore = defineStore('quest', () => {
  const quests        = useStorage('sq_tasks', [])
  const completionLog = useStorage('sq_completion_log', [])
  const currentFocusId = useStorage('sq_focus_id', null)

  const todayStr = new Date().toISOString().slice(0, 10)

  const todayTasksDone = computed(() =>
    completionLog.value.filter(e => e.date === todayStr).length
  )

  const last7DaysCompletions = computed(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d    = new Date()
      d.setDate(d.getDate() - (6 - i))
      const date  = d.toISOString().slice(0, 10)
      const label = d.toLocaleDateString('zh-CN', { weekday: 'short' })
      const count = completionLog.value.filter(e => e.date === date).length
      return { date, label, count }
    })
  )

  const currentFocusQuest = computed(() =>
    currentFocusId.value
      ? quests.value.find(q => q.id === currentFocusId.value) ?? null
      : null
  )

  // ── CRUD ──────────────────────────────────────────────────────────────────
  // status: 'pending' | 'active' | 'done'
  function addQuest(name, xp, skillId, opts = {}) {
    quests.value.push({
      id:                Date.now(),
      name,
      xp,
      skillId,
      count:             0,
      status:            opts.status ?? 'pending',
      estimatedPomodoros: opts.estimatedPomodoros ?? 1,
    })
  }

  function removeQuest(id) {
    if (currentFocusId.value === id) currentFocusId.value = null
    quests.value = quests.value.filter(q => q.id !== id)
  }

  function updateQuest(id, fields) {
    const quest = quests.value.find(q => q.id === id)
    if (quest) Object.assign(quest, fields)
  }

  function setFocus(id) {
    currentFocusId.value = currentFocusId.value === id ? null : id
  }

  function clearFocus() {
    currentFocusId.value = null
  }

  // 返回里程碑触发信息（如有），供 UI 展示奖励弹窗
  function completeQuest(id) {
    const quest = quests.value.find(q => q.id === id)
    if (!quest) return null
    quest.count++
    completionLog.value.push({ date: new Date().toISOString().slice(0, 10), xp: quest.xp })

    const profileStore = useProfileStore()
    profileStore.addXP(quest.xp)

    const skillStore = useSkillStore()
    const milestone  = skillStore.addXP(quest.skillId, quest.xp)
    return milestone
  }

  return {
    quests,
    completionLog,
    currentFocusId,
    currentFocusQuest,
    todayTasksDone,
    last7DaysCompletions,
    addQuest,
    removeQuest,
    updateQuest,
    setFocus,
    clearFocus,
    completeQuest,
  }
})
