import { defineStore } from 'pinia'
import { useStorage } from '../composables/useStorage'
import { useProfileStore } from './profileStore'
import { useSkillStore } from './skillStore'

export const useQuestStore = defineStore('quest', () => {
  const quests = useStorage('sq_tasks', [])

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

    const profileStore = useProfileStore()
    profileStore.addXP(quest.xp)

    const skillStore = useSkillStore()
    const milestone = skillStore.addXP(quest.skillId, quest.xp)
    return milestone
  }

  return { quests, addQuest, removeQuest, updateQuest, completeQuest }
})
