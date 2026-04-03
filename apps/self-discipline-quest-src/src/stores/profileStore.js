import { useStorage } from '../composables/useStorage';

const LEVEL_TITLES = [
  { min: 0, title: 'Novice Adventurer' },
  { min: 100, title: 'Apprentice Explorer' },
  { min: 300, title: 'Seasoned Traveler' },
  { min: 600, title: 'Elite Fighter' },
  { min: 1000, title: 'Legendary Hero' },
  { min: 2000, title: 'Mythic Champion' },
];

export function useProfileStore() {
  const profile = useStorage('sq_profile', {
    nickname: 'Brave Scholar',
    motto: 'Progress every day',
    avatar: '',
    totalXP: 0,
    goals: [],
  });

  function getProfile() {
    return profile.value;
  }

  function getLevel() {
    const xp = profile.value.totalXP;
    for (let i = LEVEL_TITLES.length - 1; i >= 0; i -= 1) {
      if (xp >= LEVEL_TITLES[i].min) return i + 1;
    }
    return 1;
  }

  function getLevelTitle() {
    const xp = profile.value.totalXP;
    let currentTitle = LEVEL_TITLES[0].title;
    for (const levelData of LEVEL_TITLES) {
      if (xp >= levelData.min) currentTitle = levelData.title;
    }
    return currentTitle;
  }

  function getNextLevelXP() {
    const xp = profile.value.totalXP;
    for (const levelData of LEVEL_TITLES) {
      if (xp < levelData.min) return levelData.min;
    }
    return null;
  }

  function updateProfile(nextFields) {
    profile.value = { ...profile.value, ...nextFields };
  }

  function addXP(amount) {
    profile.value = { ...profile.value, totalXP: Math.max(0, profile.value.totalXP + amount) };
  }

  function addGoal(text) {
    const trimmed = (text || '').trim();
    if (!trimmed) return;
    profile.value = {
      ...profile.value,
      goals: [...profile.value.goals, { id: Date.now(), text: trimmed, done: false }],
    };
  }

  function toggleGoal(id) {
    profile.value = {
      ...profile.value,
      goals: profile.value.goals.map((goal) => (goal.id === id ? { ...goal, done: !goal.done } : goal)),
    };
  }

  function removeGoal(id) {
    profile.value = {
      ...profile.value,
      goals: profile.value.goals.filter((goal) => goal.id !== id),
    };
  }

  return {
    LEVEL_TITLES,
    getProfile,
    getLevel,
    getLevelTitle,
    getNextLevelXP,
    updateProfile,
    addXP,
    addGoal,
    toggleGoal,
    removeGoal,
  };
}
