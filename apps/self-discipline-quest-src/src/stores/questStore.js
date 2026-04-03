import { useStorage } from '../composables/useStorage';
import { useProfileStore } from './profileStore';
import { useSkillStore } from './skillStore';

export function useQuestStore() {
  const quests = useStorage('sq_tasks', []);
  const completionLog = useStorage('sq_completion_log', []);
  const currentFocusId = useStorage('sq_focus_id', null);

  function getQuests() {
    return quests.value;
  }

  function getCompletionLog() {
    return completionLog.value;
  }

  function getCurrentFocusQuest() {
    return currentFocusId.value ? quests.value.find((q) => q.id === currentFocusId.value) || null : null;
  }

  function getTodayTasksDone() {
    const today = new Date().toISOString().slice(0, 10);
    return completionLog.value.filter((entry) => entry.date === today).length;
  }

  function getLast7DaysCompletions() {
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date();
      day.setDate(day.getDate() - (6 - i));
      const date = day.toISOString().slice(0, 10);
      const label = day.toLocaleDateString('zh-CN', { weekday: 'short' });
      const count = completionLog.value.filter((entry) => entry.date === date).length;
      return { date, label, count };
    });
  }

  function addQuest(name, xp, skillId, options = {}) {
    const trimmed = (name || '').trim();
    if (!trimmed) return null;

    const nextQuest = {
      id: Date.now(),
      name: trimmed,
      xp: Number(xp) || 0,
      skillId: skillId || null,
      count: 0,
      status: options.status || 'pending',
      estimatedPomodoros: options.estimatedPomodoros || 1,
    };

    quests.value = [...quests.value, nextQuest];
    return nextQuest;
  }

  function removeQuest(id) {
    if (currentFocusId.value === id) {
      currentFocusId.value = null;
    }
    quests.value = quests.value.filter((quest) => quest.id !== id);
  }

  function updateQuest(id, fields) {
    quests.value = quests.value.map((quest) => (quest.id === id ? { ...quest, ...fields } : quest));
  }

  function setFocus(id) {
    currentFocusId.value = currentFocusId.value === id ? null : id;
  }

  function clearFocus() {
    currentFocusId.value = null;
  }

  function completeQuest(id) {
    const target = quests.value.find((quest) => quest.id === id);
    if (!target) return null;

    const updatedQuest = { ...target, count: target.count + 1 };
    quests.value = quests.value.map((quest) => (quest.id === id ? updatedQuest : quest));

    const today = new Date().toISOString().slice(0, 10);
    completionLog.value = [...completionLog.value, { date: today, xp: target.xp }];

    const profileStore = useProfileStore();
    profileStore.addXP(target.xp);

    if (target.skillId) {
      const skillStore = useSkillStore();
      return skillStore.addXP(target.skillId, target.xp);
    }

    return null;
  }

  return {
    getQuests,
    getCompletionLog,
    getCurrentFocusQuest,
    getTodayTasksDone,
    getLast7DaysCompletions,
    addQuest,
    removeQuest,
    updateQuest,
    setFocus,
    clearFocus,
    completeQuest,
  };
}
