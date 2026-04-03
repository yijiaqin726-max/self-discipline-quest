import { useStorage } from '../composables/useStorage';

const XP_PER_LEVEL = 200;

export function useSkillStore() {
  const skillsState = useStorage('sq_skills', [
    { id: 'math', name: 'Math', xp: 0, level: 1 },
    { id: 'science', name: 'Science', xp: 0, level: 1 },
    { id: 'writing', name: 'Writing', xp: 0, level: 1 },
  ]);

  function getSkills() {
    return skillsState.value;
  }

  function addSkill(name) {
    const trimmed = (name || '').trim();
    if (!trimmed) return null;
    const id = `${trimmed.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const next = { id, name: trimmed, xp: 0, level: 1 };
    skillsState.value = [...skillsState.value, next];
    return next;
  }

  function removeSkill(id) {
    skillsState.value = skillsState.value.filter((skill) => skill.id !== id);
  }

  function addXP(skillId, xpAmount) {
    let milestone = null;

    skillsState.value = skillsState.value.map((skill) => {
      if (skill.id !== skillId) return skill;
      const nextXP = Math.max(0, skill.xp + xpAmount);
      const nextLevel = Math.max(1, Math.floor(nextXP / XP_PER_LEVEL) + 1);

      if (nextLevel > skill.level) {
        milestone = {
          skillId,
          fromLevel: skill.level,
          toLevel: nextLevel,
          name: skill.name,
        };
      }

      return { ...skill, xp: nextXP, level: nextLevel };
    });

    return milestone;
  }

  return {
    XP_PER_LEVEL,
    getSkills,
    addSkill,
    removeSkill,
    addXP,
  };
}
