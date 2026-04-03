import { defineStore } from 'pinia'
import { useStorage } from '../composables/useStorage'

const MILESTONES = [100, 200, 500]

export const useSkillStore = defineStore('skill', () => {
  const skills = useStorage('sq_skills', [])
  const rewards = useStorage('sq_rewards', {}) // { 'skillId_milestone': '奖品文字' }

  function addSkill(name, icon = '⭐') {
    skills.value.push({
      id: Date.now(),
      name,
      icon,
      xp: 0,
      unlockedMilestones: []
    })
  }

  function removeSkill(id) {
    skills.value = skills.value.filter(s => s.id !== id)
  }

  function getSkill(id) {
    return skills.value.find(s => s.id === id)
  }

  // 返回 { milestone } 表示触发了新里程碑，否则返回 null
  function addXP(skillId, amount) {
    const skill = getSkill(skillId)
    if (!skill) return null
    const before = skill.xp
    skill.xp += amount
    const after = skill.xp

    for (const ms of MILESTONES) {
      if (before < ms && after >= ms && !skill.unlockedMilestones.includes(ms)) {
        skill.unlockedMilestones.push(ms)
        return { milestone: ms, skillId }
      }
    }
    return null
  }

  function setReward(skillId, milestone, text) {
    const key = `${skillId}_${milestone}`
    rewards.value[key] = text
  }

  function getReward(skillId, milestone) {
    return rewards.value[`${skillId}_${milestone}`] || ''
  }

  function getNextMilestone(xp) {
    return MILESTONES.find(m => m > xp) || null
  }

  return { skills, rewards, addSkill, removeSkill, getSkill, addXP, setReward, getReward, getNextMilestone, MILESTONES }
})
