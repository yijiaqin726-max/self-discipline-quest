import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStorage } from '../composables/useStorage'
import { useProfileStore } from './profileStore'
import { useSkillStore } from './skillStore'

export const useQuestStore = defineStore('quest', () => {
  const quests = useStorage('sq_tasks', [])
  const completionLog = useStorage('sq_completion_log', [])

  const todayStr = new Date().toISOString().slice(0, 10)

  const todayTasksDone = computed(() =>
    completionLog.value.filter(e => e.date === todayStr).length
  )

  const last7DaysCompletions = computed(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      const date = d.toISOString().slice(0, 10)
      const label = d.toLocaleDateString('zh-CN', { weekday: 'short' })
      const count = completionLog.value.filter(e => e.date === date).length
      return { date, label, count }
    })
  )

  function addQuest(name, xp, skillId) {
    quests.value.push({
      id: Date.now(),
      name,
      xp,
      skillId,
      count: 0
    })
  }

  function removeQuest(id) {
    quests.value = quests.value.filter(q => q.id !== id)
  }

  function updateQuest(id, fields) {
    const quest = quests.value.find(q => q.id === id)
    if (quest) Object.assign(quest, fields)
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
    const milestone = skillStore.addXP(quest.skillId, quest.xp)
    return milestone
  }

  return { quests, completionLog, todayTasksDone, last7DaysCompletions, addQuest, removeQuest, updateQuest, completeQuest }
})
