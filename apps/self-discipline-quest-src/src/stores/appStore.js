// 使用纯JavaScript进行全局状态管理，不依赖外部库
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'app_state';

const defaultState = {
  tasks: [
    {
      id: 1,
      title: '论文研究：神经可塑性',
      status: 'in-progress',
      xp: 250,
      priority: 'high',
      dueDate: '2024-10-15',
      category: '研究',
      focusTime: 0,
      createdAt: Date.now(),
    },
    {
      id: 2,
      title: '高等量子力学习题',
      status: 'todo',
      xp: 150,
      priority: 'medium',
      dueDate: '2024-10-14',
      category: '学习',
      focusTime: 0,
      createdAt: Date.now(),
    },
    {
      id: 3,
      title: '提交实验报告 #4',
      status: 'overdue',
      xp: 100,
      priority: 'high',
      dueDate: '2024-10-06',
      category: '提交',
      focusTime: 0,
      createdAt: Date.now(),
    },
    {
      id: 4,
      title: '复习分析化学笔记',
      status: 'done',
      xp: 50,
      priority: 'low',
      dueDate: '2024-10-10',
      category: '复习',
      focusTime: 0,
      createdAt: Date.now(),
    },
  ],
  dailyStats: {
    completedTasks: 1,
    focusHours: 12,
    focusTarget: 16,
    xpEarned: 720,
    streak: 24,
  },
  userProfile: {
    name: '秦艺家',
    level: 14,
    totalXp: 4250,
    status: '游戏化人生践行者',
  },
  settings: {
    focusDuration: 25,
    breakDuration: 5,
    dailyGoal: 4,
  },
};

// 从localStorage读取数据
export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultState;
  } catch (e) {
    console.error('Failed to load state:', e);
    return defaultState;
  }
}

// 保存到localStorage
export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

// 简单的状态管理（不依赖第三方库）
let appState = loadState();
const listeners = new Set();

export function useAppStore() {
  return {
    getState: () => appState,
    setState: (newState) => {
      appState = typeof newState === 'function' ? newState(appState) : { ...appState, ...newState };
      saveState(appState);
      listeners.forEach((listener) => listener(appState));
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

// 操作方法
export const AppActions = {
  // 任务操作
  addTask: (task) => {
    const store = useAppStore();
    const state = store.getState();
    const newTask = {
      id: Date.now(),
      status: 'todo',
      focusTime: 0,
      createdAt: Date.now(),
      ...task,
    };
    store.setState({
      tasks: [...state.tasks, newTask],
    });
    return newTask;
  },

  updateTask: (id, updates) => {
    const store = useAppStore();
    const state = store.getState();
    store.setState({
      tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
    });
  },

  deleteTask: (id) => {
    const store = useAppStore();
    const state = store.getState();
    store.setState({
      tasks: state.tasks.filter((task) => task.id !== id),
    });
  },

  toggleTaskDone: (id) => {
    const store = useAppStore();
    const state = store.getState();
    const task = state.tasks.find((t) => t.id === id);
    if (task) {
      const newStatus = task.status === 'done' ? 'todo' : 'done';
      AppActions.updateTask(id, { status: newStatus });
    }
  },

  // 统计操作
  updateDailyStats: (stats) => {
    const store = useAppStore();
    const state = store.getState();
    store.setState({
      dailyStats: { ...state.dailyStats, ...stats },
    });
  },

  addXp: (amount) => {
    const store = useAppStore();
    const state = store.getState();
    const newXp = state.userProfile.totalXp + amount;
    store.setState({
      userProfile: { ...state.userProfile, totalXp: newXp },
      dailyStats: { ...state.dailyStats, xpEarned: state.dailyStats.xpEarned + amount },
    });
  },

  // 设置操作
  updateSettings: (settings) => {
    const store = useAppStore();
    const state = store.getState();
    store.setState({
      settings: { ...state.settings, ...settings },
    });
  },

  // 重置到默认状态
  resetToDefault: () => {
    const store = useAppStore();
    store.setState(defaultState);
  },
};

// React hook：订阅全局状态变化，自动触发重新渲染
export function useStore(selector) {
  const store = useAppStore();
  const [state, setState] = useState(() => {
    const s = store.getState();
    return selector ? selector(s) : s;
  });

  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      const next = selector ? selector(newState) : newState;
      setState(next);
    });
    // 同步一次当前最新值
    const current = store.getState();
    setState(selector ? selector(current) : current);
    return unsubscribe;
  }, []);

  return state;
}

// 计算辅助函数
export function getTaskStats(tasks) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const overdue = tasks.filter((t) => t.status === 'overdue').length;
  const todo = tasks.filter((t) => t.status === 'todo').length;
  const totalXp = tasks.reduce((sum, t) => sum + (t.xp || 0), 0);
  const earnedXp = tasks.filter((t) => t.status === 'done').reduce((sum, t) => sum + (t.xp || 0), 0);
  const rate = total > 0 ? Math.round((done / total) * 100) : 0;
  return { total, done, inProgress, overdue, todo, totalXp, earnedXp, rate };
}
